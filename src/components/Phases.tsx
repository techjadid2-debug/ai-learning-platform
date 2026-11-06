"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { phases } from '../data';
import { useAuth } from '../app/contexts/AuthContext';
import { getLessonsByTopic, getPrimaryLessonId } from '../lessons';

export default function Phases() {
  const { completedLessons } = useAuth();
  const [activePhase, setActivePhase] = useState<number | null>(0);
  const [activeTopic, setActiveTopic] = useState<{ pId: number, tId: number } | null>(null);

  const togglePhase = (index: number) => {
    setActivePhase(activePhase === index ? null : index);
  };

  const toggleTopic = (pId: number, tId: number) => {
    if (activeTopic?.pId === pId && activeTopic?.tId === tId) {
      setActiveTopic(null);
    } else {
      setActiveTopic({ pId, tId });
    }
  };

  const topicDone = (phaseIdx: number, topicIdx: number) => {
    const topicLessons = getLessonsByTopic(phaseIdx, topicIdx);
    return topicLessons.length > 0 && topicLessons.every(l => completedLessons.includes(l.id));
  };

  const topicProgress = (phaseIdx: number, topicIdx: number) => {
    const topicLessons = getLessonsByTopic(phaseIdx, topicIdx);
    if (topicLessons.length === 0) return null;
    const done = topicLessons.filter(l => completedLessons.includes(l.id)).length;
    return `${done}/${topicLessons.length}`;
  };

  return (
    <div className="phase-list">
      {phases.map((ph: (typeof phases)[number], pi: number) => (
        <div key={pi} className={`phase-item ${activePhase === pi ? 'active' : ''}`}>
          <div className="phase-head" onClick={() => togglePhase(pi)}>
            <div className="phase-num" style={{ background: ph.bg, color: ph.color }}>{ph.num}</div>
            <div className="phase-info">
              <div className="phase-name">{ph.title}</div>
              <div className="phase-meta">{ph.meta}</div>
            </div>
            <div className="phase-tag" style={{ background: ph.bg, color: ph.color }}>{ph.badge}</div>
            <div className="phase-arrow" style={{ color: ph.color }}>›</div>
          </div>
          <div className="phase-body">
            <div className="topics-grid">
              {ph.topics.map((t: (typeof phases)[number]['topics'][number], ti: number) => {
                const isOpen = activeTopic?.pId === pi && activeTopic?.tId === ti;
                const lessonId = getPrimaryLessonId(ph.num, ti);
                const done = topicDone(pi, ti);
                const progress = topicProgress(pi, ti);
                return (
                  <div
                    key={ti}
                    className={`topic-card ${isOpen ? 'open' : ''} ${done ? 'topic-done' : ''}`}
                    style={{ '--accent-color': ph.color } as React.CSSProperties}
                    onClick={() => toggleTopic(pi, ti)}
                  >
                    <style jsx>{`
                      .topic-card.open::before { background: ${ph.color}; }
                      .topic-card:hover::before { background: ${ph.color}; }
                    `}</style>
                    <div className="topic-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {done && <span title="Tugallangan">✓</span>}
                      {t.name}
                      {progress && !done && (
                        <span style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{progress}</span>
                      )}
                    </div>
                    <div className="topic-tags">
                      {t.tags.map((tag: string, tagIdx: number) => (
                        <span key={tagIdx} className="topic-tag">{tag}</span>
                      ))}
                    </div>
                    <div className="topic-desc" style={{ display: isOpen ? 'block' : 'none' }}>
                      {t.desc}
                      <div className="terms-row">
                        {t.terms.map((term: string, termIdx: number) => (
                          <span key={termIdx} className="term-pill">{term}</span>
                        ))}
                      </div>
                      <div style={{ marginTop: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {lessonId ? (
                          <Link href={`/code-lesson/${lessonId}`} onClick={e => e.stopPropagation()} style={{
                            display: 'inline-block',
                            background: ph.color,
                            color: '#000',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            fontFamily: 'var(--mono)'
                          }}>
                            {done ? '↻ Qayta o\'qish' : '▶ Darsni boshlash'}
                          </Link>
                        ) : (
                          <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>Dars tez orada</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="phase-resources">
              <span style={{ fontSize: '12px', color: 'var(--muted)', marginRight: '4px' }}>Resurslar:</span>
              {ph.resources.map((r: string, rIdx: number) => (
                <div key={rIdx} className="res-chip"><span>→</span>{r}</div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
