export default function Loading() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', background: 'var(--bg)' }}>
      <div className="spinner" aria-label="Yuklanmoqda" />
      <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', letterSpacing: '0.1em' }}>YUKLANMOQDA...</div>
    </div>
  );
}
