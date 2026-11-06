"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const SLIDER_STYLE = `
  .demo-slider {
    -webkit-appearance: none;
    width: 100%;
    height: 6px;
    border-radius: 3px;
    outline: none;
    cursor: pointer;
  }
  .demo-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px; height: 20px;
    border-radius: 50%;
    background: var(--accent);
    cursor: pointer;
    box-shadow: 0 0 8px rgba(124,111,255,0.5);
  }
  .demo-slider.w-slider::-webkit-slider-thumb { background: var(--accent2); box-shadow: 0 0 8px rgba(61,232,160,0.5); }
`;

export default function MLDemoPage() {
  const [w1, setW1] = useState(0.5);
  const [w2, setW2] = useState(-0.3);
  const [i1, setI1] = useState(1);
  const [i2, setI2] = useState(0);

  const sum = i1 * w1 + i2 * w2;
  const output = sum > 0 ? 1 : 0;

  const lineWidth = (weight: number) => Math.abs(weight) * 10 + 2;
  const lineColor = (weight: number) => weight >= 0 ? 'var(--accent2)' : 'var(--accent3)';

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', padding: '6rem 2rem 4rem' }}>
      <style>{SLIDER_STYLE}</style>
      <div style={{ maxWidth: '950px', margin: '0 auto' }}>

        <Link href="/" style={{ display: 'inline-block', color: 'var(--muted)', textDecoration: 'none', fontFamily: 'var(--mono)', fontSize: '12px', marginBottom: '1.5rem' }}>
          ← Asosiy sahifa
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>// INTERAKTIV DARS</div>
          <h1 style={{ fontFamily: 'var(--mono)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Neyrotarmoq Simulyatori 🧠</h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.05rem', maxWidth: '600px' }}>
            Slayderlarni surib ko'ring va bir neyron (Perceptron) qanday qilib ikkita kiruvchi signal asosida qaror qabul qilishini real vaqtda kuzating.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', alignItems: 'start' }}>

          {/* Controls Panel */}
          <div>
            <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: '1.2rem' }}>KIRUVCHI QIYMATLAR (INPUTS)</h3>
              {[{ label: 'Input 1', val: i1, set: setI1 }, { label: 'Input 2', val: i2, set: setI2 }].map((item, idx) => (
                <div key={idx} style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '13px', color: 'var(--muted)' }}>{item.label}</label>
                    <span style={{ fontFamily: 'var(--mono)', color: item.val ? 'var(--accent2)' : 'var(--muted)', background: 'var(--surface2)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{item.val}</span>
                  </div>
                  <input type="range" min="0" max="1" step="1" value={item.val} onChange={e => item.set(parseInt(e.target.value))} className="demo-slider" style={{ background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${item.val * 100}%, var(--border) ${item.val * 100}%, var(--border) 100%)` }} />
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--accent2)', letterSpacing: '0.1em', marginBottom: '1.2rem' }}>VAZNLAR (WEIGHTS)</h3>
              {[{ label: 'Weight 1 (w1)', val: w1, set: setW1 }, { label: 'Weight 2 (w2)', val: w2, set: setW2 }].map((item, idx) => (
                <div key={idx} style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '13px', color: 'var(--muted)' }}>{item.label}</label>
                    <span style={{ fontFamily: 'var(--mono)', color: item.val >= 0 ? 'var(--accent2)' : 'var(--accent3)', background: 'var(--surface2)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{item.val.toFixed(1)}</span>
                  </div>
                  <input type="range" min="-1" max="1" step="0.1" value={item.val} onChange={e => item.set(parseFloat(e.target.value))} className="demo-slider w-slider" style={{ background: `linear-gradient(to right, var(--surface2) 0%, var(--surface2) ${(item.val + 1) / 2 * 100}%, var(--border) ${(item.val + 1) / 2 * 100}%, var(--border) 100%)` }} />
                </div>
              ))}
            </div>
          </div>

          {/* Visualization */}
          <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <svg width="100%" viewBox="0 0 480 280" style={{ overflow: 'visible' }}>
              {/* Weight lines */}
              <line x1="100" y1="90" x2="290" y2="140" stroke={lineColor(w1)} strokeWidth={lineWidth(w1)} strokeLinecap="round" opacity="0.75" />
              <line x1="100" y1="190" x2="290" y2="140" stroke={lineColor(w2)} strokeWidth={lineWidth(w2)} strokeLinecap="round" opacity="0.75" />
              <line x1="330" y1="140" x2="420" y2="140" stroke="var(--muted)" strokeWidth="3" />

              {/* Weight labels on lines */}
              <text x="180" y="100" fill="var(--text)" fontSize="11" fontFamily="monospace" opacity="0.9">w1={w1.toFixed(1)}</text>
              <text x="180" y="198" fill="var(--text)" fontSize="11" fontFamily="monospace" opacity="0.9">w2={w2.toFixed(1)}</text>

              {/* Input Nodes */}
              <circle cx="100" cy="90" r="35" fill={i1 ? 'var(--accent)' : 'var(--surface2)'} stroke="var(--border)" strokeWidth="3" />
              <text x="100" y="84" textAnchor="middle" fill={i1 ? '#fff' : 'var(--text)'} fontSize="12" fontFamily="monospace">Input1</text>
              <text x="100" y="100" textAnchor="middle" fill={i1 ? '#fff' : 'var(--text)'} fontSize="14" fontFamily="monospace" fontWeight="bold">{i1}</text>

              <circle cx="100" cy="190" r="35" fill={i2 ? 'var(--accent)' : 'var(--surface2)'} stroke="var(--border)" strokeWidth="3" />
              <text x="100" y="184" textAnchor="middle" fill={i2 ? '#fff' : 'var(--text)'} fontSize="12" fontFamily="monospace">Input2</text>
              <text x="100" y="200" textAnchor="middle" fill={i2 ? '#fff' : 'var(--text)'} fontSize="14" fontFamily="monospace" fontWeight="bold">{i2}</text>

              {/* Neuron */}
              <circle cx="310" cy="140" r="45" fill="var(--bg)" stroke={sum > 0 ? 'var(--accent2)' : 'var(--accent3)'} strokeWidth="4" />
              <text x="310" y="130" textAnchor="middle" fill="var(--text)" fontSize="12" fontFamily="monospace">∑ = {sum.toFixed(2)}</text>
              <text x="310" y="152" textAnchor="middle" fill="var(--muted)" fontSize="11" fontFamily="monospace">Step fn</text>

              {/* Output node */}
              <circle cx="430" cy="140" r="35" fill={output ? 'var(--accent2)' : 'var(--accent3)'} stroke="var(--border)" strokeWidth="3" />
              <text x="430" y="132" textAnchor="middle" fill="white" fontSize="12" fontFamily="monospace">Out</text>
              <text x="430" y="152" textAnchor="middle" fill="white" fontSize="20" fontFamily="monospace" fontWeight="bold">{output}</text>
            </svg>

            {/* Result card */}
            <div style={{ background: output ? 'rgba(61,232,160,0.08)' : 'rgba(255,107,107,0.08)', border: `1px solid ${output ? 'var(--accent2)' : 'var(--accent3)'}`, borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '14px' }}>
                ∑ = ({i1} × {w1.toFixed(1)}) + ({i2} × {w2.toFixed(1)}) = <strong style={{ color: sum > 0 ? 'var(--accent2)' : 'var(--accent3)' }}>{sum.toFixed(2)}</strong>
              </div>
              <div style={{ marginTop: '8px', color: 'var(--muted)', fontSize: '13px' }}>
                {sum > 0 ? '✅ ∑ > 0 → Output = 1 (Aktivlandi)' : '❌ ∑ ≤ 0 → Output = 0 (Aktivlanmadi)'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none', fontFamily: 'var(--mono)', fontSize: '13px' }}>
            ← Asosiy sahifaga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
}
