"use client";
import Link from 'next/link';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '2rem', textAlign: 'center', background: 'var(--bg)', color: 'var(--text)' }}>
      <div style={{ fontSize: '4rem' }}>⚠️</div>
      <h1 style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: '2rem', color: 'var(--ink)' }}>Xatolik yuz berdi</h1>
      <p style={{ color: 'var(--muted)', maxWidth: '400px' }}>Kutilmagan xatolik. Qayta urinib ko&apos;ring yoki bosh sahifaga qayting.</p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={reset} className="btn-primary" style={{ border: 'none', cursor: 'pointer' }}>↻ Qayta urinish</button>
        <Link href="/" className="btn-secondary" style={{ textDecoration: 'none' }}>Bosh sahifa</Link>
      </div>
    </div>
  );
}
