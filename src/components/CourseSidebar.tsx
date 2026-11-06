"use client";
import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';

interface SidebarLesson {
  id: string;
  title: string;
  phase: number;
  xp?: number;
}

interface Props {
  courseId: string;
  courseSlug: string;
  courseName: string;
  courseColor: string;
  currentLessonId: string;
  lessons: SidebarLesson[];
  completedLessons: string[];
  totalDone: number;
}

const MODULE_LABELS: Record<string, Record<number, { title: string }>> = {
  'prompt-eng': {
    0: { title: '1-Modul: Abrakadabra' },
    1: { title: '2-Modul: Vibe Coding' },
  },
  'ai-eng': {
    0: { title: 'Bosqich 1: Asoslar' },
    1: { title: 'Bosqich 2: Machine Learning' },
    2: { title: 'Bosqich 3: Transformer' },
    3: { title: 'Bosqich 4: LLM Engineering' },
    4: { title: 'Bosqich 5: MLOps & Deploy' },
  },
};

export default function CourseSidebar({
  courseId, courseSlug, courseName, courseColor,
  currentLessonId, lessons, completedLessons, totalDone,
}: Props) {
  const phases = [...new Set(lessons.map(l => l.phase))].sort((a, b) => a - b);
  const pct = lessons.length ? Math.round((totalDone / lessons.length) * 100) : 0;
  const moduleMap = MODULE_LABELS[courseId] || {};

  // Global raqamlash — barcha darslar 1 dan n gacha
  let globalIdx = 0;

  return (
    <div className="course-sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <Link
          href={`/course/${courseSlug}`}
          style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: 'var(--muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}
        >
          ← Kursga qaytish
        </Link>
        <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ink)', marginBottom: '8px', lineHeight: 1.3 }}>{courseName}</div>
        {/* Progress bar */}
        <div style={{ background: 'var(--surface2)', borderRadius: '100px', height: '4px', overflow: 'hidden', marginBottom: '4px' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: courseColor, transition: 'width 0.3s', borderRadius: '100px' }} />
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)' }}>
          {totalDone}/{lessons.length} · {pct}%
        </div>
      </div>

      {/* Lesson list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {phases.map(phase => {
          const phaseLessons = lessons.filter(l => l.phase === phase);
          if (phaseLessons.length === 0) return null;
          const mod = moduleMap[phase];
          return (
            <div key={phase}>
              {mod && (
                <div className="sidebar-module-header">
                  {mod.title}
                </div>
              )}
              {phaseLessons.map(lesson => {
                globalIdx++;
                const num = globalIdx;
                const done = completedLessons.includes(lesson.id);
                const isActive = lesson.id === currentLessonId;
                return (
                  <Link
                    key={lesson.id}
                    href={`/code-lesson/${lesson.id}`}
                    className={`sidebar-lesson-item${isActive ? ' active' : done ? ' done' : ''}`}
                  >
                    <span style={{ flexShrink: 0, color: done ? courseColor : isActive ? 'var(--accent)' : 'var(--border-hover)' }}>
                      {done
                        ? <CheckCircle2 size={15} />
                        : isActive
                          ? <ChevronRight size={15} />
                          : <Circle size={15} />
                      }
                    </span>
                    <span style={{ flex: 1, lineHeight: 1.35 }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', marginRight: '4px' }}>
                        {num}.
                      </span>
                      {lesson.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
