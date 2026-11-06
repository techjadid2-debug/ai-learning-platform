"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { courses, getCourseById } from '../courses';
import { lessons } from '../lessons';
import { glossary } from '../data';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

interface Item { type: string; label: string; sub: string; href: string; color: string; }

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const [q, setQ] = useState('');

  const index = useMemo<Item[]>(() => {
    const items: Item[] = [];
    courses.forEach((c) => items.push({ type: 'Kurs', label: c.title, sub: c.subtitle, href: `/course/${c.slug}`, color: c.color }));
    lessons.forEach((l) => items.push({ type: 'Dars', label: l.title, sub: getCourseById(l.course)?.title || '', href: `/code-lesson/${l.id}`, color: '#7c6fff' }));
    glossary.forEach((g: { t: string; d: string }) => items.push({ type: 'Atama', label: g.t, sub: g.d, href: '/course/ai-engineering#atamalar', color: '#3de8a0' }));
    return items;
  }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return index.filter((i) => i.label.toLowerCase().includes(term) || i.sub.toLowerCase().includes(term)).slice(0, 12);
  }, [q, index]);

  useEffect(() => {
    if (open) setQ('');
  }, [open]);

  if (!open) return null;

  const go = (href: string) => { onClose(); router.push(href); };

  return (
    <div
      role="dialog" aria-modal="true" aria-label="Qidiruv"
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '12vh' }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(92vw, 560px)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
          <Search size={18} color="var(--muted)" />
          <input
            autoFocus value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Kurs, dars yoki atama qidiring..."
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: '15px', fontFamily: 'var(--sans)' }}
          />
          <kbd style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 6px' }}>ESC</kbd>
        </div>
        <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
          {q.trim() && results.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontSize: '14px' }}>Hech narsa topilmadi</div>
          )}
          {results.map((r, i) => (
            <button key={i} onClick={() => go(r.href)} style={{
              display: 'flex', alignItems: 'center', gap: '12px', width: '100%', textAlign: 'left',
              padding: '12px 16px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)',
              cursor: 'pointer', color: 'var(--text)',
            }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.1em', color: r.color, border: `1px solid ${r.color}`, borderRadius: '4px', padding: '2px 6px', flexShrink: 0 }}>{r.type}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: '14px', fontWeight: 500 }}>{r.label}</span>
                <span style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.sub}</span>
              </span>
            </button>
          ))}
          {!q.trim() && (
            <div style={{ padding: '1.25rem 16px', color: 'var(--muted)', fontSize: '13px' }}>Yozishni boshlang — kurslar, darslar va atamalar bo&apos;yicha qidiriladi.</div>
          )}
        </div>
      </div>
    </div>
  );
}
