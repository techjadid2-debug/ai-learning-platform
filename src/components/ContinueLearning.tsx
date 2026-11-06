"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getLastLessonId } from '../lib/progress';
import { getLessonById } from '../lessons';

interface Props {
  fallbackHref?: string;
}

export default function ContinueLearning({ fallbackHref }: Props) {
  const [lessonId, setLessonId] = useState<string | null>(null);

  useEffect(() => {
    setLessonId(getLastLessonId());
  }, []);

  const lesson = lessonId ? getLessonById(lessonId) : null;

  if (!lesson) {
    if (!fallbackHref) return null;
    return (
      <div className="continue-banner">
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.1em' }}>// BOSHLASH</div>
          <p style={{ margin: '4px 0 0', fontWeight: 600 }}>Birinchi darsdan boshlang</p>
        </div>
        <Link href={fallbackHref} className="btn-primary" style={{ textDecoration: 'none', fontSize: '13px', padding: '8px 16px' }}>
          Boshlash →
        </Link>
      </div>
    );
  }

  return (
    <div className="continue-banner">
      <div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.1em' }}>// DAVOM ETISH</div>
        <p style={{ margin: '4px 0 0', fontWeight: 600 }}>{lesson.title}</p>
      </div>
      <Link href={`/code-lesson/${lesson.id}`} className="btn-primary" style={{ textDecoration: 'none', fontSize: '13px', padding: '8px 16px' }}>
        Davom etish →
      </Link>
    </div>
  );
}
