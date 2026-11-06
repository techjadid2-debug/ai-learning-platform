import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';

const MAX_PROMPT_CHARS = 4000;
const MAX_TOKENS = 1024;

// Rate limiting (in-memory, IP bo'yicha)
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > MAX_PER_WINDOW;
}

// ── GEMINI streaming ───────────────────────────────────────────────────
async function streamGemini(
  prompt: string,
  system: string,
  model: string,
  controller: ReadableStreamDefaultController<Uint8Array>,
  encoder: TextEncoder,
  customKey?: string
) {
  const apiKey = customKey || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY sozlanmagan.');

  const geminiModel = model === 'gemini-pro' ? 'gemini-1.5-pro' : 'gemini-2.0-flash';

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: MAX_TOKENS, temperature: 0.7 },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini xatosi: ${err.slice(0, 200)}`);
  }

  const reader = res.body?.getReader();
  const dec = new TextDecoder();
  if (!reader) throw new Error('Stream ochilmadi.');

  let buf = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop() || '';
    for (const line of lines) {
      if (!line.startsWith('data:')) continue;
      const jsonStr = line.slice(5).trim();
      if (jsonStr === '[DONE]') break;
      try {
        const parsed = JSON.parse(jsonStr);
        const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) controller.enqueue(encoder.encode(text));
      } catch {
        // parse xatosi — o'tkazib yuborish
      }
    }
  }
}

// ── OPENAI streaming ───────────────────────────────────────────────────
async function streamOpenAI(
  prompt: string,
  system: string,
  model: string,
  controller: ReadableStreamDefaultController<Uint8Array>,
  encoder: TextEncoder,
  customKey?: string
) {
  const apiKey = customKey || process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY sozlanmagan.');

  const openaiModel = model === 'gpt-4o' ? 'gpt-4o' : 'gpt-4o-mini';

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: openaiModel,
      stream: true,
      max_tokens: MAX_TOKENS,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI xatosi: ${err.slice(0, 200)}`);
  }

  const reader = res.body?.getReader();
  const dec = new TextDecoder();
  if (!reader) throw new Error('Stream ochilmadi.');

  let buf = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop() || '';
    for (const line of lines) {
      if (!line.startsWith('data:')) continue;
      const jsonStr = line.slice(5).trim();
      if (jsonStr === '[DONE]') break;
      try {
        const parsed = JSON.parse(jsonStr);
        const text = parsed?.choices?.[0]?.delta?.content;
        if (text) controller.enqueue(encoder.encode(text));
      } catch {
        // parse xatosi — o'tkazib yuborish
      }
    }
  }
}

// ── ANTHROPIC (Claude) streaming ──────────────────────────────────────
async function streamClaude(
  prompt: string,
  system: string,
  model: string,
  controller: ReadableStreamDefaultController<Uint8Array>,
  encoder: TextEncoder,
  customKey?: string
) {
  const apiKey = customKey || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY sozlanmagan.');

  const claudeModel =
    model === 'claude-opus' ? 'claude-opus-4-5' : 'claude-haiku-4-5';

  const client = new Anthropic({ apiKey });
  const stream = client.messages.stream({
    model: claudeModel,
    max_tokens: MAX_TOKENS,
    system,
    messages: [{ role: 'user', content: prompt }],
  });

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      controller.enqueue(encoder.encode(event.delta.text));
    }
  }
}

// ── Tizim prompt ────────────────────────────────────────────────────────
const DEFAULT_SYSTEM =
  "Sen AI_ENG.uz o'quv platformasidagi yordamchisan. Talaba AI/ML mavzularida prompt yozishni mashq qilmoqda. Aniq, qisqa va o'zbek tilida javob ber. Agar savol o'zbek tiliga aloqador bo'lmasa, shu tilda javob ber.";

// ── Asosiy handler ─────────────────────────────────────────────────────
export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'anon';

  if (rateLimited(ip)) {
    return Response.json(
      { error: "Juda ko'p so'rov. Bir daqiqadan keyin qayta urinib ko'ring." },
      { status: 429 }
    );
  }

  let body: { prompt?: string; system?: string; provider?: string; model?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Noto'g'ri so'rov." }, { status: 400 });
  }

  const prompt = (body.prompt || '').trim();
  if (!prompt) {
    return Response.json({ error: "Prompt bo'sh." }, { status: 400 });
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    return Response.json(
      { error: `Prompt juda uzun (maksimal ${MAX_PROMPT_CHARS} belgi).` },
      { status: 400 }
    );
  }

  const provider = body.provider || 'gemini'; // gemini | openai | claude
  const model = body.model || '';
  const system = body.system?.slice(0, 1000) || DEFAULT_SYSTEM;
  const customKey = req.headers.get('x-custom-key') || undefined;

  // Provider mavjudligini tekshirish (yoki shaxsiy kalit kiritilgan)
  const hasGemini = !!customKey || !!process.env.GEMINI_API_KEY;
  const hasOpenAI = !!customKey || !!process.env.OPENAI_API_KEY;
  const hasClaude = !!customKey || !!process.env.ANTHROPIC_API_KEY;

  if (provider === 'gemini' && !hasGemini) {
    return Response.json(
      { error: 'Gemini sozlanmagan. GEMINI_API_KEY ni .env.local ga qo\'shing yoki Profil sozlamalaridan shaxsiy kalitingizni kiriting.' },
      { status: 503 }
    );
  }
  if (provider === 'openai' && !hasOpenAI) {
    return Response.json(
      { error: 'OpenAI sozlanmagan. OPENAI_API_KEY ni .env.local ga qo\'shing yoki Profil sozlamalaridan shaxsiy kalitingizni kiriting.' },
      { status: 503 }
    );
  }
  if (provider === 'claude' && !hasClaude) {
    return Response.json(
      { error: 'Claude sozlanmagan. ANTHROPIC_API_KEY ni .env.local ga qo\'shing yoki Profil sozlamalaridan shaxsiy kalitingizni kiriting.' },
      { status: 503 }
    );
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (provider === 'gemini') {
          await streamGemini(prompt, system, model, controller, encoder, customKey);
        } else if (provider === 'openai') {
          await streamOpenAI(prompt, system, model, controller, encoder, customKey);
        } else {
          await streamClaude(prompt, system, model, controller, encoder, customKey);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Noma\'lum xatolik';
        controller.enqueue(encoder.encode(`\n\n⚠️ Xatolik: ${msg}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Provider': provider,
    },
  });
}
