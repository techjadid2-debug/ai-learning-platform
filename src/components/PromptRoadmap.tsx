"use client";
import React from 'react';
import Link from 'next/link';
import { PlayCircle, FileText, HelpCircle } from 'lucide-react';
import { getLessonsByCourse } from '../lessons';
import { getCourseById } from '../courses';
import { useAuth } from '../app/contexts/AuthContext';
import { useAppContext } from '../app/contexts/AppContext';
import ContinueLearning from './ContinueLearning';

export default function PromptRoadmap() {
  const { completedLessons } = useAuth();
  const { t } = useAppContext();
  const course = getCourseById('prompt-eng')!;
  const lessons = getLessonsByCourse('prompt-eng');
  const doneCount = lessons.filter(l => completedLessons.includes(l.id)).length;

  return (
    <main>
      <section className="hero" style={{ minHeight: 'auto', paddingTop: '120px', paddingBottom: '48px' }}>
        <div className="hero-content">
          <div style={{ marginBottom: '1.5rem' }}>
            <Link href="/" style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', textDecoration: 'none', letterSpacing: '0.04em' }}>
              ← {t('common.allCourses')}
            </Link>
          </div>
          <div className="hero-badge"><div className="badge-dot"></div> {t('rm.badge')}</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>
            Sun&apos;iy Intellekt<br /><span>Asoslari</span>
          </h1>
          <p className="hero-desc">{course.desc}</p>
          <div className="hero-stats">
            <div className="stat"><div className="stat-num">{lessons.length}</div><div className="stat-label">{t('rm.topic')}</div></div>
            <div className="stat"><div className="stat-num">{doneCount}</div><div className="stat-label">{t('rm.done')}</div></div>
            <div className="stat"><div className="stat-num">{course.estimate}</div><div className="stat-label">{t('rm.est')}</div></div>
          </div>
          <ContinueLearning fallbackHref="/code-lesson/aia-1" />
        </div>
      </section>

      {/* Flat darslar ro'yxati — modullar yo'q */}
      <section style={{ paddingTop: '1rem', paddingBottom: '5rem', background: 'var(--surface)' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {lessons.map((lesson, idx) => {
              const done = completedLessons.includes(lesson.id);
              const hasVideo = lesson.steps.some((s: any) => s.type === 'video');
              const hasPlayground = lesson.steps.some((s: any) => s.type === 'playground');
              const quizCount = lesson.steps.reduce((n: number, s: any) =>
                n + (s.type === 'finalquiz' ? (s.questions?.length || 0) : s.type === 'quiz' ? 1 : 0), 0);

              return (
                <Link key={lesson.id} href={`/code-lesson/${lesson.id}`} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 18px',
                  background: 'var(--bg)',
                  border: `1px solid ${done ? 'var(--accent2)' : 'var(--border)'}`,
                  borderRadius: '10px', textDecoration: 'none',
                  transition: 'border-color 0.15s, background 0.15s',
                }}>
                  {/* Number / check */}
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                    background: done ? 'var(--accent2)' : 'var(--surface2)',
                    color: done ? '#fff' : 'var(--muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 700,
                  }}>
                    {done ? '✓' : idx + 1}
                  </div>

                  {/* Title + meta */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: 'var(--ink)', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                      {lesson.title}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)' }}>
                      {hasVideo && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><PlayCircle size={10} /> Video</span>}
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><FileText size={10} /> Nazariya</span>
                      {hasPlayground && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>⚡ Playground</span>}
                      {quizCount > 0 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><HelpCircle size={10} /> {quizCount} savol</span>}
                      <span style={{ color: 'var(--accent2)' }}>+{lesson.xp} XP</span>
                    </div>
                  </div>

                  <span style={{ color: done ? 'var(--accent2)' : 'var(--muted)', fontSize: '16px', flexShrink: 0 }}>
                    {done ? '✓' : '›'}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
