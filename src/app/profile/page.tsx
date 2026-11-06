"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/AppContext';
import Link from 'next/link';
import { lessons, getLessonById, getLessonsByCourse } from '../../lessons';
import { courses } from '../../courses';
import { getLevel } from '../../lib/progress';
import { ACHIEVEMENTS } from '../../lib/achievements';

export default function ProfilePage() {
  const { user, logout, completedLessons, progressPercent, supabaseEnabled } = useAuth();
  const { t } = useAppContext();
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setApiKey(localStorage.getItem('ai_eng_gemini_api_key') || '');
    }
  }, []);

  const saveApiKey = (val: string) => {
    setApiKey(val);
    if (typeof window !== 'undefined') {
      if (val.trim()) {
        localStorage.setItem('ai_eng_gemini_api_key', val.trim());
      } else {
        localStorage.removeItem('ai_eng_gemini_api_key');
      }
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '6rem 2rem', textAlign: 'center', background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔐</div>
        <h2 style={{ fontFamily: 'var(--sans)', fontWeight: 700, marginBottom: '0.75rem' }}>{t('prof.notLoggedIn')}</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
          {t('prof.loginDesc')}
        </p>
        <Link href="/" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
          {t('prof.toHome')}
        </Link>
      </div>
    );
  }

  const completedDetails = completedLessons
    .map(id => getLessonById(id))
    .filter(Boolean);

  const lvl = getLevel(user.xp);
  const stats = { completed: completedLessons, xp: user.xp, streak: user.streak };
  const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked(stats)).length;

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', padding: '6rem 2rem 4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: '2.4rem', letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '2rem' }}>{t('prof.title')}</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{user.avatar}</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--accent2)' }}>{user.name}</h2>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '100px', padding: '3px 10px', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--accent)' }}>⭐ Daraja {lvl.level}</span>
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>· {lvl.title}</span>
            </div>
            <p style={{ color: 'var(--muted)', marginBottom: '0.5rem', fontSize: '14px' }}>
              {t('prof.member')}: {new Date(user.joinedAt).toLocaleDateString('uz-UZ')}
            </p>
            {user.email ? (
              <p style={{ color: 'var(--muted)', marginBottom: '0.5rem', fontSize: '14px' }}>
                Email: <span style={{ fontFamily: 'var(--mono)', color: 'var(--text)' }}>{user.email}</span>
              </p>
            ) : null}
            <div style={{ margin: '1rem 0' }}>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: '11px',
                padding: '4px 10px', borderRadius: '100px',
                border: '1px solid',
                background: user.email ? 'rgba(22,163,74,0.08)' : 'rgba(161,98,7,0.08)',
                borderColor: user.email ? 'var(--accent2)' : 'var(--amber)',
                color: user.email ? 'var(--accent2)' : 'var(--amber)',
                display: 'inline-block'
              }}>
                {user.email ? '☁️ Cloud Account (Sinxronlangan)' : '📱 Local Account (Lokal Saqlash)'}
              </span>
              {!user.email && supabaseEnabled && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>
                  Bulutda saqlash va Liderlar doskasida qatnashish uchun yuqoridagi <strong>Kirish</strong> orqali ro'yxatdan o'ting.
                </div>
              )}
            </div>
            <div style={{ marginTop: '1rem', background: 'var(--surface2)', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--accent2)', transition: 'width 0.3s' }} />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px', fontFamily: 'var(--mono)' }}>
              {t('prof.overall')}: {completedLessons.length}/{lessons.length} {t('prof.lessons')} · {progressPercent}%
            </p>

            {/* Gemini API Key configuration */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                🔑 Gemini API Key (Playground uchun)
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => saveApiKey(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    color: 'var(--text)',
                    fontFamily: 'var(--mono)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  style={{
                    background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    padding: '0 10px',
                    cursor: 'pointer',
                    color: 'var(--muted)',
                    fontSize: '12px',
                    fontFamily: 'var(--mono)'
                  }}
                >
                  {showApiKey ? 'Yashirish' : 'Ko\'rsat'}
                </button>
              </div>
              <p style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '4px', lineHeight: 1.4 }}>
                Kalit faqat sizning qurilmangizda (`localStorage`) saqlanadi va bevosita API so'rovlari uchun ishlatiladi.
              </p>
            </div>

            <button onClick={logout} style={{ background: 'var(--accent3)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginTop: '1.5rem', fontFamily: 'var(--mono)' }}>
              {t('prof.logout')}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: 'var(--muted)', fontSize: '12px', fontFamily: 'var(--mono)', letterSpacing: '0.1em' }}>{t('prof.xpEarned')}</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text)' }}>{user.xp} XP</div>
              </div>
              <div style={{ fontSize: '3rem' }}>⭐</div>
            </div>

            <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: 'var(--muted)', fontSize: '12px', fontFamily: 'var(--mono)', letterSpacing: '0.1em' }}>{t('prof.streakLabel')}</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text)' }}>{user.streak} kun</div>
              </div>
              <div style={{ fontSize: '3rem' }}>🔥</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--ink)', marginBottom: '1rem' }}>{t('prof.byCourse')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {courses.map((c) => {
              const total = getLessonsByCourse(c.id).length;
              const done = getLessonsByCourse(c.id).filter(l => completedLessons.includes(l.id)).length;
              const pct = total ? Math.round((done / total) * 100) : 0;
              return (
                <Link key={c.id} href={`/course/${c.slug}`} style={{ textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', borderTop: `3px solid ${c.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>
                    <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: '14px' }}>{c.title}</span>
                  </div>
                  <div style={{ background: 'var(--surface2)', borderRadius: '100px', height: '6px', overflow: 'hidden', marginBottom: '6px' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: c.color }} />
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>{done}/{total} dars · {pct}%</div>
                </Link>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ fontFamily: 'var(--mono)', fontSize: '1.5rem', marginBottom: '1rem' }}>
            {t('dash.achievements')} <span style={{ fontSize: '14px', color: 'var(--muted)' }}>({unlockedCount}/{ACHIEVEMENTS.length})</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            {ACHIEVEMENTS.map((a) => {
              const got = a.unlocked(stats);
              return (
                <div key={a.id} style={{ background: 'var(--surface)', border: `1px solid ${got ? 'var(--accent2)' : 'var(--border)'}`, borderRadius: '12px', padding: '1rem', textAlign: 'center', opacity: got ? 1 : 0.5 }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>{got ? a.icon : '🔒'}</div>
                  <div style={{ fontWeight: 600, fontSize: '12px' }}>{a.title}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '10px', lineHeight: 1.4, marginTop: '2px' }}>{a.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--ink)', marginBottom: '1rem' }}>{t('prof.completed')}</h2>
          <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
            {completedDetails.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>
                {t('prof.noCompleted')}{' '}
                <Link href="/" style={{ color: 'var(--accent2)' }}>{t('prof.startLessons')}</Link>
              </p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {completedDetails.map(lesson => lesson && (
                  <li key={lesson.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <span>✓ {lesson.title}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--amber)' }}>+{lesson.xp} XP</span>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/leaderboard" style={{ display: 'inline-block', marginTop: '1.5rem', color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: '13px' }}>
              {t('prof.viewRating')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
