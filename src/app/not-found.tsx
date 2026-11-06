import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '2rem', textAlign: 'center', background: 'var(--bg)', color: 'var(--text)' }}>
      <div style={{ fontSize: '4rem' }}>🧭</div>
      <h1 style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: '2rem', color: 'var(--ink)' }}>404 — Sahifa topilmadi</h1>
      <p style={{ color: 'var(--muted)', maxWidth: '400px' }}>Kechirasiz, bu sahifa mavjud emas yoki ko&apos;chirilgan.</p>
      <Link href="/" className="btn-primary" style={{ textDecoration: 'none' }}>Bosh sahifaga →</Link>
    </div>
  );
}
