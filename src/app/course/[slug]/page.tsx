"use client";
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getCourse } from '../../../courses';
import AiEngLanding from '../../../components/AiEngLanding';
import PromptRoadmap from '../../../components/PromptRoadmap';

export default function CoursePage() {
  const { slug } = useParams() as { slug: string };
  const course = getCourse(slug);

  if (!course) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text)' }}>
        <div style={{ fontSize: '3rem' }}>🔍</div>
        <h2 style={{ fontFamily: 'var(--mono)' }}>Kurs topilmadi</h2>
        <Link href="/" style={{ color: 'var(--accent)', fontFamily: 'var(--mono)' }}>← Barcha kurslar</Link>
      </div>
    );
  }

  if (course.id === 'ai-eng') return <AiEngLanding />;
  return <PromptRoadmap />;
}
