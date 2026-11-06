"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAppContext } from '../app/contexts/AppContext';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { t } = useAppContext();
  const LINKS = [
    { href: '/', label: t('nav.courses') },
    { href: '/course/ai-engineering', label: 'AI Engineering' },
    { href: '/course/prompt-engineering', label: "Sun'iy Intellekt Asoslari" },
    { href: '/dashboard', label: `${t('nav.dashboard')} 📊` },
    { href: '/leaderboard', label: `${t('nav.rating')} 🏆` },
    { href: '/ml-demo', label: 'ML Demo 🧠' },
    { href: '/profile', label: `${t('prof.title')} 👤` },
  ];

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigatsiya menyusi"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', justifyContent: 'flex-end',
      }}
    >
      <nav
        onClick={(e) => e.stopPropagation()}
        className="glass-panel"
        style={{
          width: 'min(80vw, 300px)', height: '100%',
          borderLeft: '1px solid var(--border)',
          padding: '1.75rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '6px',
          animation: 'slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--accent)' }}>AI_ENG.uz</span>
          <button onClick={onClose} aria-label="Yopish" style={{ background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '22px', cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={onClose}
            style={{
              padding: '12px 14px', borderRadius: '8px', textDecoration: 'none',
              color: 'var(--text)', fontSize: '15px', fontFamily: 'var(--sans)',
              transition: 'background 0.2s, color 0.2s',
            }}
            className="hover:bg-slate-500/10 hover:text-blue-500"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
