"use client";
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getLessonById } from '../../../lessons';

export default function LessonLegacyRedirect() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  useEffect(() => {
    const lesson = getLessonById(id);
    router.replace(lesson ? `/code-lesson/${id}` : '/code-lesson/00-0');
  }, [id, router]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
      Darsga yo&apos;naltirilmoqda...
    </div>
  );
}
