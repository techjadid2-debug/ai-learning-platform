"use client";
import React, { useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppContext } from '../../contexts/AppContext';
import { getCourse } from '../../../courses';
import { getLessonsByCourse } from '../../../lessons';

export default function CertificatePage() {
  const { slug } = useParams() as { slug: string };
  const { user, completedLessons } = useAuth();
  const { t } = useAppContext();
  const certRef = useRef<HTMLDivElement>(null);

  const course = getCourse(slug);

  if (!course) {
    return <Centered emoji="🔍" title={t('cert.notFound')} />;
  }

  const lessons = getLessonsByCourse(course.id);
  const done = lessons.filter((l) => completedLessons.includes(l.id)).length;
  const complete = lessons.length > 0 && done >= lessons.length;

  if (!user) {
    return <Centered emoji="🔐" title={t('cert.loginNeeded')} sub={t('cert.loginDesc')} />;
  }
  if (!complete) {
    return <Centered emoji="📚" title={t('cert.notComplete')} sub={`${done}/${lessons.length} ${t('prof.lessons')} · ${Math.round((done/lessons.length)*100)}%`} link={`/course/${course.slug}`} linkText={t('cert.backToCourse')} />;
  }

  const download = async () => {
    if (!certRef.current) return;
    try {
      const dataUrl = await toPng(certRef.current, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement('a');
      a.download = `sertifikat-${course.slug}.png`;
      a.href = dataUrl;
      a.click();
    } catch { /* ignore */ }
  };

  const date = new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '5rem 1.5rem 4rem', color: 'var(--text)' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        {/* Sertifikat */}
        <div ref={certRef} style={{
          background: 'linear-gradient(135deg, #09090e 0%, #12121a 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '4rem 3rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: `0 30px 70px rgba(0, 0, 0, 0.5), 0 0 50px ${course.color}22, inset 0 0 30px rgba(255, 255, 255, 0.02)`,
        }}>
          {/* Vector wave structures & patterns */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.15, pointerEvents: 'none' }}>
            <svg width="100%" height="100%" viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: '100%', minHeight: '100%' }}>
              <path d="M-100 320 C 150 250, 200 480, 450 350 C 700 220, 650 400, 900 320" stroke={course.color} strokeWidth="3" fill="none" />
              <path d="M-100 280 C 200 200, 250 420, 500 280 C 750 140, 600 370, 900 260" stroke={course.color} strokeWidth="1.5" strokeDasharray="6 6" fill="none" />
              <path d="M-100 160 C 120 280, 320 100, 520 240 C 720 380, 680 120, 900 180" stroke="#7c6fff" strokeWidth="2" fill="none" opacity="0.6" />
              
              {/* Neural network nodes */}
              <circle cx="180" cy="220" r="4" fill={course.color} />
              <circle cx="280" cy="320" r="5" fill="#7c6fff" />
              <circle cx="480" cy="240" r="4" fill={course.color} />
              <circle cx="600" cy="180" r="6" fill="#7c6fff" />
              <line x1="180" y1="220" x2="280" y2="320" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <line x1="280" y1="320" x2="480" y2="240" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <line x1="480" y1="240" x2="600" y2="180" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            </svg>
          </div>

          <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '10rem', opacity: 0.06, zIndex: 1 }}>{course.icon}</div>
          
          {/* Logo & Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', position: 'relative', zIndex: 2 }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.03)',
              border: `1.5px solid ${course.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 25px ${course.color}35`,
              position: 'relative'
            }}>
              <span style={{ fontSize: '28px', filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.3))' }}>🎓</span>
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              fontFamily: 'var(--mono)',
              fontSize: '11px',
              letterSpacing: '0.25rem',
              color: course.color,
              marginBottom: '1.25rem',
              textTransform: 'uppercase',
              fontWeight: 700,
              textShadow: `0 0 8px ${course.color}44`
            }}>
              AI_ENG.UZ · {t('cert.label')}
            </div>
            
            <div style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '1.5rem', fontFamily: 'var(--sans)', letterSpacing: '0.03em' }}>
              {t('cert.confirms')}
            </div>
            
            {/* Glowing user name */}
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '0.75rem',
              letterSpacing: '-0.02em',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.15)',
              fontFamily: 'var(--sans)'
            }}>
              {user.name}
            </div>
            
            <div style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '1.5rem', fontFamily: 'var(--sans)' }}>
              {t('cert.completed')}
            </div>
            
            <div style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '3rem',
              background: `linear-gradient(90deg, #ffffff 0%, ${course.color} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              fontFamily: 'var(--sans)'
            }}>
              {course.title}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              paddingTop: '1.75rem'
            }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  {t('cert.date')}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 600 }}>{date}</div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['#3de8a0', '#7c6fff', '#ffc85e', '#ff6b6b'].map((c) => (
                    <div key={c} style={{ width: '24px', height: '4px', borderRadius: '2px', background: c, opacity: 0.8 }} />
                  ))}
                </div>
                <span style={{ fontSize: '9px', fontFamily: 'var(--mono)', color: 'var(--accent2)', fontWeight: 'bold', letterSpacing: '0.05em' }}>
                  ✓ TASDIQLANGAN
                </span>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  {t('cert.lessons')}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 600 }}>
                  {lessons.length} {t('cert.lessonsUnit')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '1.5rem' }}>
          <button onClick={download} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}>
            <Download size={16} /> {t('cert.download')}
          </button>
          <Link href="/dashboard" className="btn-secondary" style={{ textDecoration: 'none' }}>{t('cert.dashboard')}</Link>
        </div>
      </div>
    </div>
  );
}

function Centered({ emoji, title, sub, link, linkText }: { emoji: string; title: string; sub?: string; link?: string; linkText?: string }) {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text)', padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3.5rem' }}>{emoji}</div>
      <h2 style={{ fontFamily: 'var(--mono)' }}>{title}</h2>
      {sub && <p style={{ color: 'var(--muted)', maxWidth: '400px' }}>{sub}</p>}
      <Link href={link || '/'} className="btn-primary" style={{ textDecoration: 'none' }}>{linkText || 'Asosiy sahifa'}</Link>
    </div>
  );
}
