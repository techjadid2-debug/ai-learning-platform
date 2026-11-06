"use client";
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { LayoutDashboard, BookOpen, FileText, ArrowLeft, LogOut, Loader2, Lock } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, signIn, logout, supabaseEnabled } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // 1. Agar Supabase o'rnatilmagan bo'lsa ogohlantirish
  if (!supabaseEnabled) {
    return (
      <div style={{
        display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center',
        background: '#090d16', color: '#fff', padding: '2rem', fontFamily: 'var(--sans)'
      }}>
        <div style={{
          maxWidth: '500px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px', padding: '2.5rem', textAlign: 'center', backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '1.8rem', fontWeight: 800 }}>
            Supabase Sozlanmagan
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Admin panel faqat Supabase backend ulanishi orqali ishlaydi. Iltimos, avval <code>.env.local</code> fayliga 
            Supabase url va anon kalitlarini qo'shing hamda DB migratsiyalarini yuklang.
          </p>
          <Link href="/dashboard" style={{
            display: 'inline-block', background: 'var(--accent)', color: '#fff', textDecoration: 'none',
            padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600
          }}>
            Dashboardga qaytish
          </Link>
        </div>
      </div>
    );
  }

  // 2. Yuklanish holati
  if (user === undefined) {
    return (
      <div style={{
        display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center',
        background: '#090d16', color: '#fff'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <Loader2 className="animate-spin" size={40} style={{ color: 'var(--accent)' }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: '#64748b' }}>Sessiya yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  // 3. Admin kirish shakli (Login form)
  if (!user) {
    const handleLoginSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || !password) return;
      setAuthError('');
      setAuthLoading(true);
      try {
        const res = await signIn(email.trim(), password);
        if (!res.ok) {
          setAuthError(res.error || 'Kirishda xatolik yuz berdi.');
        }
      } catch (err) {
        setAuthError('Noma\'lum xato yuz berdi.');
      } finally {
        setAuthLoading(false);
      }
    };

    return (
      <div style={{
        display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center',
        background: '#090d16', color: '#fff', padding: '1rem', fontFamily: 'var(--sans)'
      }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px', padding: '3rem 2.5rem', width: '100%', maxWidth: '420px',
          backdropFilter: 'blur(16px)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          animation: 'fadeUp 0.3s ease'
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(29, 95, 219, 0.1)',
            border: '1px solid rgba(29, 95, 219, 0.2)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', marginBottom: '1.5rem'
          }}>
            <Lock size={24} style={{ color: 'var(--accent)' }} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
            Admin Panel
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '2rem' }}>
            Loyiha administratorlari uchun boshqaruv tizimi.
          </p>

          {authError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '8px', padding: '10px 14px', color: '#fca5a5', fontSize: '13px',
              marginBottom: '1.5rem', lineHeight: '1.4'
            }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--mono)' }}>EMAIL</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                style={{
                  width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                  outline: 'none', fontSize: '14px', fontFamily: 'var(--mono)'
                }}
              />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--mono)' }}>PAROL</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                  outline: 'none', fontSize: '14px', fontFamily: 'var(--mono)'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              style={{
                width: '100%', padding: '14px', background: 'var(--accent)', color: '#fff',
                border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'opacity 0.2s', fontSize: '14px'
              }}
            >
              {authLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Kirilmoqda...
                </>
              ) : 'Kirish'}
            </button>
          </form>

          <Link href="/dashboard" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            color: '#64748b', fontSize: '13px', textDecoration: 'none', marginTop: '1.5rem',
            transition: 'color 0.2s'
          }}>
            <ArrowLeft size={14} /> Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    );
  }

  // 4. Foydalanuvchi tizimga kirgan, lekin admin huquqiga ega emas
  if (!user.isAdmin) {
    return (
      <div style={{
        display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center',
        background: '#090d16', color: '#fff', padding: '2rem', fontFamily: 'var(--sans)'
      }}>
        <div style={{
          maxWidth: '440px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px', padding: '2.5rem', textAlign: 'center', backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
          }}>
            <Lock size={20} style={{ color: '#ef4444' }} />
          </div>
          <h2 style={{ color: '#ef4444', marginBottom: '0.5rem', fontSize: '1.6rem', fontWeight: 800 }}>
            Ruxsat Etilmagan
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Sizning hisobingiz (<code>{user.email}</code>) admin huquqiga ega emas. 
            Iltimos, Supabase dashboard da emailingizni <code>admins</code> jadvaliga qo'shing.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={logout} style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#f8fafc', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer'
            }}>
              Chiqish
            </button>
            <Link href="/dashboard" style={{
              background: 'var(--accent)', color: '#fff', textDecoration: 'none',
              padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600
            }}>
              Dashboardga qaytish
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 5. Admin layout ko'rinishi
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#090d16', color: '#f8fafc', fontFamily: 'var(--sans)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px', background: '#0f172a', borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex', flexDirection: 'column', flexShrink: 0
      }}>
        {/* Sidebar Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px' }}>⚙️</span> AI Admin
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'var(--mono)', marginTop: '4px' }}>
            {user.email}
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav style={{
          position: 'static', height: 'auto', background: 'transparent', borderBottom: 'none',
          display: 'flex', flexDirection: 'column', gap: '6px', padding: '1.5rem 1rem', flex: 1,
          justifyContent: 'flex-start', backdropFilter: 'none'
        }}>
          <Link href="/admin" style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px',
            borderRadius: '8px', color: '#cbd5e1', fontSize: '14px', textDecoration: 'none',
            background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s'
          }}>
            <LayoutDashboard size={18} /> Boshqaruv paneli
          </Link>
          <Link href="/admin/courses" style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px',
            borderRadius: '8px', color: '#cbd5e1', fontSize: '14px', textDecoration: 'none',
            transition: 'all 0.2s'
          }}>
            <BookOpen size={18} /> Kurslar
          </Link>
          <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.05)', margin: '1rem 0' }} />
          <Link href="/dashboard" style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px',
            borderRadius: '8px', color: '#94a3b8', fontSize: '14px', textDecoration: 'none',
            transition: 'all 0.2s'
          }}>
            <ArrowLeft size={18} /> Platformaga qaytish
          </Link>
          <button onClick={logout} style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px',
            borderRadius: '8px', color: '#fca5a5', fontSize: '14px', background: 'transparent',
            border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer',
            transition: 'all 0.2s', marginTop: 'auto'
          }}>
            <LogOut size={18} /> Chiqish
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Navbar */}
        <header style={{
          height: '64px', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', zIndex: 10
        }}>
          <div style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8' }}>
            Tizim boshqaruvi
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>{user.avatar}</span>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>{user.name}</span>
            <span style={{
              background: 'rgba(29, 95, 219, 0.2)', color: '#60a5fa', border: '1px solid rgba(29, 95, 219, 0.3)',
              fontSize: '10px', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase',
              fontFamily: 'var(--mono)', fontWeight: 'bold'
            }}>Admin</span>
          </div>
        </header>

        {/* Dynamic children content */}
        <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
