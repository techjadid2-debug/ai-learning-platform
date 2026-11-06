"use client";
import React, { useState, useEffect } from 'react';

// ── Provayderlar va modellar ──────────────────────────────────────────
const PROVIDERS = [
  {
    id: 'gemini',
    name: 'Gemini',
    emoji: '✦',
    color: '#4285F4',
    gradient: 'linear-gradient(135deg, #4285F4, #34A853)',
    models: [
      { id: 'gemini-flash', label: 'Gemini 2.0 Flash', desc: 'Tez va bepul' },
      { id: 'gemini-pro', label: 'Gemini 1.5 Pro', desc: 'Kuchli va aniq' },
    ],
  },
  {
    id: 'openai',
    name: 'ChatGPT',
    emoji: '◆',
    color: '#10a37f',
    gradient: 'linear-gradient(135deg, #10a37f, #1a7f64)',
    models: [
      { id: 'gpt-4o-mini', label: 'GPT-4o mini', desc: 'Tez, arzon' },
      { id: 'gpt-4o', label: 'GPT-4o', desc: 'Eng kuchli' },
    ],
  },
  {
    id: 'claude',
    name: 'Claude',
    emoji: '◉',
    color: '#d97706',
    gradient: 'linear-gradient(135deg, #d97706, #b45309)',
    models: [
      { id: 'claude-haiku', label: 'Claude Haiku', desc: 'Tez va arzon' },
      { id: 'claude-opus', label: 'Claude Opus', desc: 'Kuchli va chuqur' },
    ],
  },
] as const;

type ProviderId = 'gemini' | 'openai' | 'claude';

interface PlaygroundProps {
  task: string;
  starterPrompt?: string;
  systemHint?: string;
  onSuccess?: () => void;
}

export default function Playground({ task, starterPrompt, systemHint, onSuccess }: PlaygroundProps) {
  const [prompt, setPrompt] = useState(starterPrompt || '');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [provider, setProvider] = useState<ProviderId>('gemini');
  const [model, setModel] = useState('gemini-flash');
  const [charCount, setCharCount] = useState(0);

  // Provider o'zgarganda default modelni o'rnatish
  useEffect(() => {
    const p = PROVIDERS.find(p => p.id === provider);
    if (p) setModel(p.models[0].id);
  }, [provider]);

  useEffect(() => {
    setCharCount(prompt.length);
  }, [prompt]);

  const currentProvider = PROVIDERS.find(p => p.id === provider)!;

  const send = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError('');
    setOutput('');

    const customKey = typeof window !== 'undefined' ? localStorage.getItem('ai_eng_gemini_api_key') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (customKey) {
      headers['x-custom-key'] = customKey;
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt,
          system: systemHint,
          provider,
          model,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Xatolik yuz berdi.');
        setLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      if (reader) {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setOutput(acc);
        }
      }
      if (acc.trim()) onSuccess?.();
    } catch {
      setError("Tarmoq xatosi. Qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      send();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px' }}>

      {/* Vazifa kartasi */}
      <div style={{
        padding: '12px 16px',
        background: 'rgba(124,111,255,0.07)',
        border: '1px solid rgba(124,111,255,0.2)',
        borderRadius: '10px',
        borderLeft: '3px solid #7c6fff',
      }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '9px', color: '#7c6fff',
          letterSpacing: '0.12em', marginBottom: '5px', textTransform: 'uppercase',
        }}>
          🎯 Vazifa
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.65 }}>{task}</div>
      </div>

      {/* Provider tanlash */}
      <div>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)',
          marginBottom: '8px', letterSpacing: '0.08em',
        }}>
          AI modeli tanlang:
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {PROVIDERS.map((p) => {
            const isActive = provider === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setProvider(p.id as ProviderId)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: '20px', cursor: 'pointer',
                  fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 700,
                  transition: 'all 0.18s ease',
                  background: isActive ? p.gradient : 'var(--surface2)',
                  color: isActive ? '#fff' : 'var(--muted)',
                  border: isActive ? 'none' : '1px solid var(--border)',
                  boxShadow: isActive ? `0 2px 12px ${p.color}40` : 'none',
                  transform: isActive ? 'translateY(-1px)' : 'none',
                }}
              >
                <span style={{ fontSize: '11px' }}>{p.emoji}</span>
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Model tanlash (dropdown-style) */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {currentProvider.models.map((m) => {
          const isActive = model === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setModel(m.id)}
              style={{
                flex: 1, padding: '7px 10px', borderRadius: '8px', cursor: 'pointer',
                textAlign: 'left', transition: 'all 0.15s',
                background: isActive ? 'var(--bg)' : 'var(--surface2)',
                border: `1px solid ${isActive ? currentProvider.color : 'var(--border)'}`,
              }}
            >
              <div style={{
                fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: 700,
                color: isActive ? currentProvider.color : 'var(--text)',
              }}>
                {m.label}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{m.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Prompt input */}
      <div style={{ position: 'relative' }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)',
          marginBottom: '6px', display: 'flex', justifyContent: 'space-between',
        }}>
          <span>Sizning promptingiz:</span>
          <span style={{ color: charCount > 3500 ? 'var(--accent3)' : 'var(--muted)' }}>
            {charCount}/4000
          </span>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Prompt yozing... (${navigator?.platform?.includes('Mac') ? '⌘' : 'Ctrl'}+Enter yuborish)`}
          rows={5}
          style={{
            width: '100%', padding: '12px 14px',
            background: 'var(--bg)',
            border: `1px solid ${prompt.trim() ? currentProvider.color + '40' : 'var(--border)'}`,
            borderRadius: '10px', color: 'var(--text)',
            fontFamily: 'var(--mono)', fontSize: '13px',
            resize: 'vertical', outline: 'none', lineHeight: 1.65,
            transition: 'border-color 0.2s',
          }}
        />
      </div>

      {/* Yuborish tugmasi */}
      <button
        onClick={send}
        disabled={loading || !prompt.trim()}
        style={{
          alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px',
          background: (loading || !prompt.trim()) ? 'var(--surface2)' : currentProvider.gradient,
          color: (loading || !prompt.trim()) ? 'var(--muted)' : '#fff',
          border: 'none', padding: '10px 20px', borderRadius: '10px',
          cursor: (loading || !prompt.trim()) ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 'bold',
          transition: 'all 0.18s', boxShadow: (!loading && prompt.trim())
            ? `0 3px 14px ${currentProvider.color}35` : 'none',
        }}
      >
        {loading ? (
          <>
            <span style={{
              display: 'inline-block', width: '12px', height: '12px',
              border: '2px solid #fff4', borderTopColor: '#fff',
              borderRadius: '50%', animation: 'spin 0.7s linear infinite',
            }} />
            {currentProvider.name} yozmoqda...
          </>
        ) : (
          <>▶ {currentProvider.name}&apos;ga yuborish</>
        )}
      </button>

      {/* Javob paneli */}
      <div style={{
        flex: 1, minHeight: '140px',
        background: 'var(--surface2)',
        border: '1px solid var(--border)',
        borderRadius: '10px', padding: '14px 16px', overflowY: 'auto',
      }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '9px',
          color: currentProvider.color,
          letterSpacing: '0.12em', marginBottom: '10px',
          textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span>{currentProvider.emoji}</span>
          {currentProvider.name} javobi
          {loading && (
            <span style={{
              display: 'inline-block', width: '8px', height: '8px',
              borderRadius: '50%', background: currentProvider.color,
              animation: 'blink 1s ease-in-out infinite',
            }} />
          )}
        </div>

        {error ? (
          <div style={{
            color: 'var(--accent3)', fontSize: '13px', lineHeight: 1.6,
            padding: '10px 12px', background: 'rgba(227,72,62,0.06)',
            borderRadius: '8px', border: '1px solid rgba(227,72,62,0.15)',
          }}>
            ⚠️ {error}
          </div>
        ) : output ? (
          <div style={{
            fontSize: '14px', color: 'var(--text)',
            lineHeight: 1.75, whiteSpace: 'pre-wrap',
          }}>
            {output}
            {loading && (
              <span style={{
                display: 'inline-block', width: '2px', height: '16px',
                background: currentProvider.color, marginLeft: '2px',
                animation: 'blink 1s step-end infinite', verticalAlign: 'middle',
              }} />
            )}
          </div>
        ) : (
          <div style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: 1.6 }}>
            Prompt yozib, &quot;AI&apos;ga yuborish&quot; tugmasini bosing yoki{' '}
            <kbd style={{
              fontFamily: 'var(--mono)', fontSize: '11px', padding: '2px 6px',
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: '4px',
            }}>
              Ctrl+Enter
            </kbd>{' '}
            bosing.
          </div>
        )}
      </div>

      {/* Token tejash eslatmasi */}
      <div style={{
        fontSize: '11px', color: 'var(--muted)',
        fontFamily: 'var(--mono)', opacity: 0.7,
      }}>
        💡 API kalitlari faqat server-tomonida saqlanadi — xavfsiz.
      </div>
    </div>
  );
}
