"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Star, Trophy, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/AppContext';
import { courses as staticCourses, Course } from '../../courses';
import { getLevel, getActiveDays, getBookmarks } from '../../lib/progress';
import { ACHIEVEMENTS } from '../../lib/achievements';
import LoginModal from '../../components/LoginModal';

export default function DashboardPage() {
  const { user, completedLessons } = useAuth();
  const { t } = useAppContext();

  const [coursesList, setCoursesList] = useState<Course[]>(staticCourses);
  const [lessonsList, setLessonsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        setLoading(true);
        const { getDBCourses, getDBLessons } = await import('../../lib/db');
        const dbCourses = await getDBCourses();
        setCoursesList(dbCourses);

        const allLessons: any[] = [];
        for (const c of dbCourses) {
          const l = await getDBLessons(c.id);
          allLessons.push(...l);
        }
        setLessonsList(allLessons);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (!user) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text)', padding: '2rem', textAlign: 'center' }}>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        <div style={{ fontSize: '3.5rem' }}>📊</div>
        <h2 style={{ fontFamily: 'var(--sans)', fontWeight: 700 }}>{t('dash.loginTitle')}</h2>
        <p style={{ color: 'var(--muted)', maxWidth: '380px' }}>{t('dash.loginDesc')}</p>
        <button onClick={() => setShowLogin(true)} className="btn-primary" style={{ cursor: 'pointer' }}>
          {t('nav.login')} →
        </button>
      </div>
    );
  }

  const lvl = getLevel(user.xp);
  const stats = { completed: completedLessons, xp: user.xp, streak: user.streak };
  const activeDays = getActiveDays();

  // Oxirgi 30 kun kalendar
  const calendar = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().slice(0, 10);
    return { key, active: activeDays.includes(key), day: d.getDate() };
  });

  const continueLesson = (courseId: string) => {
    const courseLessons = lessonsList.filter((l) => l.course === courseId);
    return courseLessons.find((l) => !completedLessons.includes(l.id));
  };

  const bookmarked = getBookmarks()
    .map((id) => lessonsList.find((l) => l.id === id))
    .filter(Boolean);

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', padding: '5rem 1.5rem 4rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '0.25rem' }}>{t('dash.hello')}, {user.name} {user.avatar}</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>{t('dash.subtitle')}</p>

        {/* Yuqori statlar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          {/* Daraja */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Trophy size={18} color="var(--accent)" />
              <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)' }}>{t('dash.level')} {lvl.level}</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>{lvl.title}</div>
            <div style={{ background: 'var(--surface2)', borderRadius: '100px', height: '6px', overflow: 'hidden' }}>
              <div style={{ width: `${lvl.pct}%`, height: '100%', background: 'var(--accent)' }} />
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', marginTop: '5px' }}>{t('dash.toNext')} {lvl.xpToNext} XP</div>
          </div>
          {/* XP */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)' }}>{t('dash.totalXp')}</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent2)' }}>{user.xp}</div>
            </div>
            <Star size={36} color="var(--amber)" />
          </div>
          {/* Streak */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)' }}>{t('dash.streak')}</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--amber)' }}>{user.streak} {t('dash.days')}</div>
            </div>
            <Flame size={36} color="var(--accent3)" />
          </div>
        </div>

        {/* Streak kalendar */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', marginBottom: '10px' }}>{t('dash.last30')}</div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {calendar.map((c) => (
              <div key={c.key} title={c.key} style={{
                width: '28px', height: '28px', borderRadius: '6px',
                background: c.active ? 'var(--accent2)' : 'var(--surface2)',
                color: c.active ? '#000' : 'var(--muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: c.active ? 700 : 400,
              }}>{c.day}</div>
            ))}
          </div>
        </div>

        {/* Davom etish — kurslar */}
        <h2 style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: '1.3rem', color: 'var(--ink)', marginBottom: '1rem' }}>{t('dash.yourCourses')}</h2>
        {loading ? (
          <div style={{ padding: '2rem 0', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>Yuklanmoqda...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {coursesList.map((c) => {
              const courseLessons = lessonsList.filter((l) => l.course === c.id);
              const total = courseLessons.length;
              const done = courseLessons.filter((l) => completedLessons.includes(l.id)).length;
              const pct = total ? Math.round((done / total) * 100) : 0;
              const next = continueLesson(c.id);
              return (
                <div key={c.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem', borderTop: `3px solid ${c.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>
                    <span style={{ fontWeight: 600 }}>{c.title}</span>
                  </div>
                  <div style={{ background: 'var(--surface2)', borderRadius: '100px', height: '6px', overflow: 'hidden', marginBottom: '6px' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: c.color }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>{done}/{total} · {pct}%</span>
                    {pct === 100 ? (
                      <Link href={`/certificate/${c.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--amber)', fontFamily: 'var(--mono)', fontSize: '12px', textDecoration: 'none', fontWeight: 'bold' }}>
                        🏆 {t('dash.certificate')}
                      </Link>
                    ) : next ? (
                      <Link href={`/code-lesson/${next.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: c.color, fontFamily: 'var(--mono)', fontSize: '12px', textDecoration: 'none', fontWeight: 'bold' }}>
                        {t('dash.continue')} <ArrowRight size={13} />
                      </Link>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Saqlangan darslar */}
        {bookmarked.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: '1.3rem', color: 'var(--ink)', marginBottom: '1rem' }}>🔖 {t('dash.saved')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {bookmarked.map((l) => l && (
                <Link key={l.id} href={`/code-lesson/${l.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', textDecoration: 'none', color: 'var(--text)' }}>
                  <span style={{ fontSize: '14px' }}>{l.title}</span>
                  <ArrowRight size={14} color="var(--muted)" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Yutuqlar */}
        <h2 style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: '1.3rem', color: 'var(--ink)', marginBottom: '1rem' }}>{t('dash.achievements')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          {ACHIEVEMENTS.map((a) => {
            const got = a.unlocked(stats);
            return (
              <div key={a.id} style={{
                background: 'var(--surface)', border: `1px solid ${got ? 'var(--accent2)' : 'var(--border)'}`,
                borderRadius: '12px', padding: '1rem', textAlign: 'center', opacity: got ? 1 : 0.55,
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '6px', position: 'relative' }}>
                  {got ? a.icon : <Lock size={26} color="var(--muted)" style={{ marginTop: '4px' }} />}
                </div>
                <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '2px' }}>{a.title}</div>
                <div style={{ color: 'var(--muted)', fontSize: '11px', lineHeight: 1.4 }}>{a.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
