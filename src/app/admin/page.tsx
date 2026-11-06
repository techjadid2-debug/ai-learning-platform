"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { LayoutDashboard, BookOpen, Users, Award, RefreshCw, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  coursesCount: number;
  lessonsCount: number;
  usersCount: number;
  totalXp: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ coursesCount: 0, lessonsCount: 0, usersCount: 0, totalXp: 0 });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  async function loadStats(showLoading = true) {
    try {
      if (showLoading) setLoading(true);
      // 1. Kurslar soni
      const { count: coursesCount } = await supabase!
        .from('courses')
        .select('*', { count: 'exact', head: true });

      // 2. Darslar soni
      const { count: lessonsCount } = await supabase!
        .from('lessons')
        .select('*', { count: 'exact', head: true });

      // 3. Foydalanuvchilar soni va jami XP
      const { data: profilesData } = await supabase!
        .from('profiles')
        .select('xp');

      const usersCount = profilesData?.length || 0;
      const totalXp = profilesData?.reduce((sum, p) => sum + (p.xp || 0), 0) || 0;

      setStats({
        coursesCount: coursesCount || 0,
        lessonsCount: lessonsCount || 0,
        usersCount,
        totalXp
      });

      // 4. So'nggi foydalanuvchilar
      const { data: recent } = await supabase!
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentUsers(recent || []);
    } catch (err) {
      console.error('Error loading admin stats:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  useEffect(() => {
    loadStats(true);
  }, []);

  const handleSync = async () => {
    if (!supabase) {
      setSyncError('Supabase sozlanmagan.');
      return;
    }
    if (!confirm('⚠️ DIQQAT: Sinxronizatsiya qilish static darslarni (kodda yozilgan) bazaga yuklaydi va u yerdagi bir xil ID li darslarni va qadamlarini yangilaydi (ustidan yozadi). Davom etishni xohlaysizmi?')) {
      return;
    }

    setSyncing(true);
    setSyncMessage(null);
    setSyncError(null);

    try {
      const { syncStaticDataToDB } = await import('../../lib/sync');
      const result = await syncStaticDataToDB(supabase);
      if (result.success) {
        setSyncMessage(result.message);
        await loadStats(false);
      } else {
        setSyncError(result.message + (result.details ? ` (${result.details})` : ''));
      }
    } catch (err: any) {
      setSyncError('Sinxronizatsiyada kutilmagan xatolik yuz berdi: ' + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const cardStyle = {
    background: '#0f172a',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem'
  };

  const iconContainerStyle = (color: string) => ({
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    background: `rgba(${color}, 0.1)`,
    border: `1px solid rgba(${color}, 0.2)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
          Dashboard
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          Tizimning umumiy holati va foydalanuvchilar statistikasi.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', padding: '4rem 0', justifyContent: 'center', color: '#94a3b8' }}>
          Statistika yuklanmoqda...
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem', marginBottom: '2.5rem'
          }}>
            <div style={cardStyle}>
              <div style={iconContainerStyle('59, 130, 246')}>
                <BookOpen size={22} style={{ color: '#3b82f6' }} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>KURSLAR</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>{stats.coursesCount}</div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={iconContainerStyle('168, 85, 247')}>
                <LayoutDashboard size={22} style={{ color: '#a855f7' }} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>DARSLAR</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>{stats.lessonsCount}</div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={iconContainerStyle('16, 185, 129')}>
                <Users size={22} style={{ color: '#10b981' }} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>O'QUVCHILAR</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>{stats.usersCount}</div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={iconContainerStyle('245, 158, 11')}>
                <Award size={22} style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>JAMI XP</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                  {stats.totalXp.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Users */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Quick Actions */}
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '1.25rem', color: '#fff' }}>Tezkor Amallar</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link href="/admin/courses" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px',
                  color: '#cbd5e1', textDecoration: 'none', transition: 'all 0.2s', fontSize: '14px'
                }}>
                  <span>Kurslar va darslar boshqaruvi</span>
                  <ChevronRight size={16} />
                </Link>

                <button
                  onClick={handleSync}
                  disabled={syncing}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '12px 16px', background: syncing ? 'rgba(255,255,255,0.01)' : 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '8px',
                    color: '#a7f3d0', cursor: syncing ? 'not-allowed' : 'pointer', transition: 'all 0.2s', fontSize: '14px',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RefreshCw size={16} className={syncing ? "animate-spin" : ""} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
                    <span>{syncing ? "Sinxronizatsiya qilinmoqda..." : "Static darslarni sinxronizatsiya qilish (Sync to DB)"}</span>
                  </span>
                  <ChevronRight size={16} />
                </button>

                {syncMessage && (
                  <div style={{ padding: '10px 12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '6px', fontSize: '12px', color: '#34d399', lineHeight: 1.4 }}>
                    ✅ {syncMessage}
                  </div>
                )}
                {syncError && (
                  <div style={{ padding: '10px 12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '6px', fontSize: '12px', color: '#fca5a5', lineHeight: 1.4 }}>
                    ❌ {syncError}
                  </div>
                )}

                <div style={{
                  padding: '16px', background: 'rgba(29, 95, 219, 0.05)',
                  border: '1px solid rgba(29, 95, 219, 0.1)', borderRadius: '8px',
                  fontSize: '13px', color: '#93c5fd', lineHeight: '1.5'
                }}>
                  <strong>Maslahat:</strong> Kurs yoki dars qo'shgandan so'ng uning <em>"E'lon qilingan" (is_published)</em> holatini yoqishni unutmang. Aks holda u o'quvchilarga ko'rinmaydi.
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '1.25rem', color: '#fff' }}>Yangi Ro'yxatdan O'tganlar</h3>
              {recentUsers.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '13px' }}>Foydalanuvchilar topilmadi.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recentUsers.map((u, i) => (
                    <div key={u.id || i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      paddingBottom: '12px', borderBottom: i < recentUsers.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                        <span style={{ fontSize: '20px' }}>{u.avatar || '🧑‍💻'}</span>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>{u.name || 'Foydalanuvchi'}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {u.created_at ? new Date(u.created_at).toLocaleDateString() : ''}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                        <span>⚡</span>
                        <span>{u.xp || 0} XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
