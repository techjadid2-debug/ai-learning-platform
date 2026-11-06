"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '../app/contexts/AppContext';
import { useAuth } from '../app/contexts/AuthContext';
import { Menu, Search, Moon, Sun } from 'lucide-react';
import LoginModal from './LoginModal';
import MobileMenu from './MobileMenu';
import SearchModal from './SearchModal';

const LANGS = ['UZ', 'EN', 'RU'] as const;

const navBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  borderRadius: '6px',
  padding: '6px 8px',
  cursor: 'pointer',
  color: 'var(--muted)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.12s, color 0.12s',
  fontSize: '13px',
  fontFamily: 'var(--mono)',
  gap: '3px',
};

export default function Navbar() {
  const { theme, toggleTheme, lang, setLang, t } = useAppContext();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(v => !v);
      }
      if (e.key === 'Escape') { setSearchOpen(false); setShowLangMenu(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      <nav>
        {/* Logo */}
        <Link href="/" className="nav-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="20" cy="22" r="5" fill="#4285F4" />
            <circle cx="44" cy="18" r="5" fill="#34A853" />
            <circle cx="32" cy="40" r="6" fill="#FBBC05" />
            <g stroke="var(--muted)" strokeOpacity="0.4" strokeWidth="2">
              <line x1="20" y1="22" x2="32" y2="40" />
              <line x1="44" y1="18" x2="32" y2="40" />
              <line x1="20" y1="22" x2="44" y2="18" />
            </g>
          </svg>
          Sun&apos;iy Intelekt
        </Link>

        {/* Desktop nav links */}
        <div className="nav-links">
          <Link href="/">{t('nav.courses')}</Link>
          <Link href="/course/prompt-engineering">AI Asoslari</Link>
          {user && <Link href="/dashboard">{t('nav.dashboard')}</Link>}
          <Link href="/leaderboard">{t('nav.rating')}</Link>
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>

          {/* Mobile hamburger */}
          <button className="nav-mobile-toggle nav-btn" onClick={() => setMobileOpen(true)} aria-label="Menyu">
            <Menu size={18} />
          </button>

          {/* Search */}
          <button className="nav-btn" onClick={() => setSearchOpen(true)} aria-label="Qidiruv" title="⌘K">
            <Search size={16} />
          </button>

          {/* Language */}
          <div style={{ position: 'relative' }}>
            <button className="nav-btn" onClick={() => setShowLangMenu(!showLangMenu)} style={navBtnStyle}>
              {lang.toUpperCase()} ▾
            </button>
            {showLangMenu && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 200,
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: '8px', overflow: 'hidden', minWidth: '80px',
                boxShadow: 'var(--shadow)',
              }}>
                {LANGS.map(l => (
                  <button key={l} onClick={() => { setLang(l.toLowerCase() as 'uz'|'en'|'ru'); setShowLangMenu(false); }}
                    style={{
                      display: 'block', width: '100%', padding: '9px 14px',
                      background: l.toLowerCase() === lang ? 'var(--surface2)' : 'transparent',
                      border: 'none', color: l.toLowerCase() === lang ? 'var(--accent)' : 'var(--text)',
                      cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '12px',
                      textAlign: 'left', fontWeight: l.toLowerCase() === lang ? 700 : 400,
                    }}>
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button className="nav-btn" onClick={toggleTheme} title="Tungi/Kunduzgi rejim">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Auth */}
          {user ? (
            <Link href="/profile" style={{
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px',
              padding: '5px 10px', borderRadius: '6px',
              transition: 'background 0.12s',
            }}
              className="nav-btn"
            >
              <span style={{ fontSize: '15px' }}>{user.avatar}</span>
              <span style={{ fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--text)', fontWeight: 500 }}>{user.name}</span>
              <span style={{ color: 'var(--amber)', fontSize: '11px', fontFamily: 'var(--mono)' }}>🔥{user.streak}</span>
            </Link>
          ) : (
            <button onClick={() => setShowModal(true)} className="btn-primary" style={{ padding: '7px 16px', fontSize: '13px' }}>
              {t('nav.login')}
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
