"use client";
import React, { useState, useEffect, useId } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, Lock } from 'lucide-react';
import { courses as staticCourses, Course } from '../courses';
import { useAuth } from '../app/contexts/AuthContext';
import { useAppContext } from '../app/contexts/AppContext';

const LOCKED_COURSES = new Set(['ai-eng']);

/* Google Material You squircle ikon */
function MaterialIcon({ color, size = 68, children }: { color: string; size?: number; children: React.ReactNode }) {
  const r = Math.round(size * 0.28);
  return (
    <div style={{
      width: size, height: size,
      borderRadius: r,
      background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      boxShadow: `0 4px 12px ${color}40, 0 2px 6px ${color}25`,
    }}>
      {children}
    </div>
  );
}

function AiEngIcon() {
  return (
    <MaterialIcon color="#4285F4" size={68}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="6" r="3" fill="white" fillOpacity="0.95" />
        <circle cx="6" cy="24" r="3" fill="white" fillOpacity="0.95" />
        <circle cx="26" cy="24" r="3" fill="white" fillOpacity="0.95" />
        <line x1="16" y1="9" x2="6" y2="21" stroke="white" strokeWidth="1.8" strokeOpacity="0.65" />
        <line x1="16" y1="9" x2="26" y2="21" stroke="white" strokeWidth="1.8" strokeOpacity="0.65" />
        <line x1="9" y1="24" x2="23" y2="24" stroke="white" strokeWidth="1.8" strokeOpacity="0.65" />
        <circle cx="16" cy="16" r="2.5" fill="white" fillOpacity="0.45" />
      </svg>
    </MaterialIcon>
  );
}

function AiBasicsIcon() {
  return (
    <MaterialIcon color="#34A853" size={68}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4 L19 12 L28 12 L21 17.5 L23.5 26 L16 21 L8.5 26 L11 17.5 L4 12 L13 12 Z"
          fill="white" fillOpacity="0.92" />
      </svg>
    </MaterialIcon>
  );
}

function CourseIcon({ id }: { id: string }) {
  if (id === 'ai-eng') return <AiEngIcon />;
  if (id === 'prompt-eng') return <AiBasicsIcon />;
  return (
    <MaterialIcon color="#FBBC05" size={68}>
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <rect x="5" y="5" width="20" height="20" rx="4" fill="white" fillOpacity="0.9" />
      </svg>
    </MaterialIcon>
  );
}

export default function CourseHub() {
  const { completedLessons } = useAuth();
  const { t } = useAppContext();

  const [coursesList, setCoursesList] = useState<Course[]>(staticCourses);
  const [lessonsList, setLessonsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const { getDBCourses, getDBLessons } = await import('../lib/db');
        const dbCourses = await getDBCourses();
        setCoursesList(dbCourses);
        const allLessons: any[] = [];
        for (const c of dbCourses) {
          const l = await getDBLessons(c.id);
          allLessons.push(...l);
        }
        setLessonsList(allLessons);
      } catch (err) {
        console.error('Error loading courses/lessons in hub:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const progressFor = (courseId: string) => {
    const courseLessons = lessonsList.filter(l => l.course === courseId);
    const total = courseLessons.length;
    const done = courseLessons.filter(l => completedLessons.includes(l.id)).length;
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  };

  return (
    <main>
      {/* Hero */}
      <section className="hero" style={{ minHeight: 'auto', paddingTop: '120px', paddingBottom: '80px' }}>
        <div className="hero-content">
          <div className="hero-badge">
            <div className="badge-dot" />
            {t('hub.badge')}
          </div>
          <h1>
            {t('hub.title1')}<br />
            <span>{t('hub.title2')}</span>
          </h1>
          <p className="hero-desc">{t('hub.desc')}</p>
          <div className="hero-btns">
            <Link href="/course/prompt-engineering" className="btn-primary">
              AI Asoslari →
            </Link>
            <Link href="/leaderboard" className="btn-secondary">
              Reyting
            </Link>
          </div>
        </div>
      </section>

      {/* Kurslar */}
      <section style={{ paddingTop: '0', paddingBottom: '5rem', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ paddingTop: '3rem', marginBottom: '1.5rem' }}>
            <div className="section-label">{`// ${t('hub.courses')}`}</div>
          </div>
          {loading ? (
            <div style={{ padding: '3rem 0', color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: '13px' }}>
              {t('hub.loading')}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {coursesList.map((c) => {
                const p = progressFor(c.id);
                const isLocked = LOCKED_COURSES.has(c.id);

                if (isLocked) {
                  return (
                    <div key={c.id} style={{
                      position: 'relative',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '1.75rem',
                      background: 'var(--bg)',
                      opacity: 0.55,
                      cursor: 'not-allowed',
                      userSelect: 'none',
                    }}>
                      <div style={{ position: 'absolute', top: 14, right: 14 }}>
                        <Lock size={15} color="var(--muted)" />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                        <CourseIcon id={c.id} />
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '3px' }}>{c.title}</h3>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>{c.subtitle}</div>
                        </div>
                      </div>
                      <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: 1.6, marginBottom: '1rem' }}>{c.desc}</p>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Lock size={11} /> Tez orada
                      </div>
                    </div>
                  );
                }

                return (
                  <Link key={c.id} href={`/course/${c.slug}`} className="course-card" style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '1.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div className="animate-float-3d">
                          <CourseIcon id={c.id} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '3px', lineHeight: 1.3 }}>
                            {c.title}
                          </h3>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.04em' }}>
                            {c.subtitle}
                          </div>
                        </div>
                      </div>

                      <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                        {c.desc}
                      </p>

                      <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1rem', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <BookOpen size={12} /> {p.total} {t('course.lessons')}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {c.estimate}
                        </span>
                      </div>

                      <div style={{ background: 'var(--surface2)', borderRadius: '100px', height: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                        <div style={{ width: `${p.pct}%`, height: '100%', background: 'var(--accent2)', transition: 'width 0.3s', borderRadius: '100px' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>
                          {p.done > 0 ? `${p.done}/${p.total} · ${p.pct}%` : `${p.total} ${t('course.lessons')}`}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>
                          {p.done > 0 ? t('course.continue') : t('course.start')} <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
