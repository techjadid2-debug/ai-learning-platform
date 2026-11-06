"use client";
import React, { useState } from 'react';
import { useAuth } from '../app/contexts/AuthContext';
import { useAppContext } from '../app/contexts/AppContext';

const AVATARS = ['🧑‍💻', '👩‍💻', '🤖', '🧠', '🦾', '🎓', '🔬', '⚡'];

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const { supabaseEnabled, login, signUp, signIn, signInWithGoogle, resetPassword } = useAuth();
  const { t } = useAppContext();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🧑‍💻');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '13px 16px',
    background: 'var(--surface)', border: '1.5px solid var(--border)',
    borderRadius: '10px', color: 'var(--text)',
    fontFamily: 'var(--sans)', fontSize: '15px', outline: 'none',
    marginBottom: '10px', transition: 'border-color 0.15s',
  };

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) { login(name.trim(), avatar); onClose(); }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setInfo(''); setLoading(true);
    try {
      if (mode === 'signup') {
        if (!name.trim()) { setError("Ismingizni kiriting."); setLoading(false); return; }
        const r = await signUp(email.trim(), password, name.trim(), avatar);
        if (!r.ok) setError(r.error || 'Xatolik yuz berdi.');
        else if (r.needsConfirm) setInfo("Email manzilingizga tasdiqlash xati yuborildi.");
        else onClose();
      } else {
        const r = await signIn(email.trim(), password);
        if (!r.ok) setError(r.error || "Email yoki parol noto'g'ri.");
        else onClose();
      }
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setError(''); setLoading(true);
    const r = await signInWithGoogle();
    if (!r.ok) { setError(r.error || 'Google bilan kirishda xatolik.'); setLoading(false); }
  };

  const handleForgot = async () => {
    if (!email.trim()) { setError('Avval emailingizni kiriting.'); return; }
    setError(''); setLoading(true);
    const r = await resetPassword(email.trim());
    setLoading(false);
    if (r.ok) setInfo("Parolni tiklash havolasi emailingizga yuborildi.");
    else setError(r.error || 'Xatolik yuz berdi.');
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={onClose}
    >
      <div
        style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '400px', position: 'relative', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Yopish */}
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>✕</button>

        {/* ── LOKAL REJIM ── */}
        {!supabaseEnabled ? (
          <form onSubmit={handleLocalSubmit}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{avatar}</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '4px' }}>
                Xush kelibsiz! 👋
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
                Ismingizni kiriting va o&apos;rganishni boshlang
              </p>
            </div>

            {/* Avatar tanlash */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '10px', fontWeight: 500 }}>
                Avatar tanlang:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {AVATARS.map(av => (
                  <button
                    key={av} type="button" onClick={() => setAvatar(av)}
                    style={{
                      fontSize: '1.5rem', width: '46px', height: '46px', cursor: 'pointer',
                      background: av === avatar ? 'rgba(66,133,244,0.1)' : 'var(--surface)',
                      border: `2px solid ${av === avatar ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: '10px', transition: 'all 0.15s',
                    }}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Ism */}
            <input
              type="text" placeholder="Ismingiz (masalan: Alisher)" value={name}
              onChange={e => setName(e.target.value)} autoFocus
              style={{ ...inputStyle, borderColor: name.trim() ? 'var(--accent)' : 'var(--border)' }}
              aria-label="Ism"
            />

            <button
              type="submit" disabled={!name.trim()}
              style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: name.trim() ? 'var(--accent)' : 'var(--surface2)',
                color: name.trim() ? '#fff' : 'var(--muted)',
                fontFamily: 'var(--sans)', fontSize: '16px', fontWeight: 700,
                cursor: name.trim() ? 'pointer' : 'not-allowed', marginTop: '4px',
              }}
            >
              Kirish →
            </button>
          </form>

        ) : (
          /* ── SUPABASE REJIM ── */
          <form onSubmit={handleAuthSubmit}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '4px' }}>
              {mode === 'signup' ? "Ro'yxatdan o'tish" : "Hisobga kirish"}
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '1.25rem' }}>
              Progressingizni saqlash va reytingda qatnashish uchun
            </p>

            {/* Avatar (signup) */}
            {mode === 'signup' && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Avatar:</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {AVATARS.map(av => (
                    <button key={av} type="button" onClick={() => setAvatar(av)}
                      style={{ fontSize: '1.3rem', width: '40px', height: '40px', cursor: 'pointer', background: av === avatar ? 'rgba(66,133,244,0.1)' : 'var(--surface)', border: `2px solid ${av === avatar ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '8px' }}>
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <input type="text" placeholder="Ismingiz" value={name} onChange={e => setName(e.target.value)}
                style={inputStyle} aria-label="Ism"
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            )}
            <input type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            <input type="password" required placeholder="Parol (kamida 6 ta belgi)" minLength={6} value={password} onChange={e => setPassword(e.target.value)}
              style={{ ...inputStyle, marginBottom: '4px' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'} />

            {error && <p style={{ color: 'var(--accent3)', fontSize: '13px', margin: '8px 0', fontWeight: 500 }}>⚠️ {error}</p>}
            {info && <p style={{ color: 'var(--accent2)', fontSize: '13px', margin: '8px 0', fontWeight: 500 }}>✅ {info}</p>}

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', background: loading ? 'var(--surface2)' : 'var(--accent)', color: loading ? 'var(--muted)' : '#fff', border: 'none', borderRadius: '10px', fontFamily: 'var(--sans)', fontSize: '15px', fontWeight: 700, cursor: loading ? 'wait' : 'pointer', marginTop: '8px' }}>
              {loading ? 'Kutilmoqda...' : mode === 'signup' ? "Ro'yxatdan o'tish →" : 'Kirish →'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>yoki</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            <button type="button" onClick={handleGoogle} disabled={loading}
              style={{ width: '100%', padding: '12px', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '10px', fontFamily: 'var(--sans)', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, color: '#4285F4' }}>G</span> Google bilan kirish
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', fontSize: '12px' }}>
              <button type="button" onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(''); setInfo(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'var(--sans)', fontWeight: 600 }}>
                {mode === 'signup' ? 'Hisobingiz bormi? Kirish' : "Hisob yo'qmi? Ro'yxat"}
              </button>
              {mode === 'signin' && (
                <button type="button" onClick={handleForgot}
                  style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--sans)' }}>
                  Parol unutdim
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
