import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = "AI_ENG.uz — O'zbek tilidagi AI o'rganish platformasi";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0a0a0f 0%, #13131a 100%)',
          color: '#f0f0f5',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', width: '20px', height: '20px', borderRadius: '50%', background: '#7c6fff' }} />
          <div style={{ fontSize: '26px', color: '#7c6fff', letterSpacing: '2px' }}>AI_ENG.UZ</div>
        </div>
        <div style={{ fontSize: '72px', fontWeight: 700, lineHeight: 1.1, maxWidth: '900px' }}>
          O&apos;zbek tilidagi AI o&apos;rganish platformasi
        </div>
        <div style={{ fontSize: '32px', color: '#7a7a9a', marginTop: '28px', maxWidth: '850px' }}>
          AI Engineering · Prompt Engineering · Jonli AI playground · Bepul
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
          {['#3de8a0', '#7c6fff', '#ffc85e', '#ff6b6b'].map((c) => (
            <div key={c} style={{ display: 'flex', width: '60px', height: '8px', borderRadius: '4px', background: c }} />
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
