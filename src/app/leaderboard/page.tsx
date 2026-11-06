"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/AppContext';
import { lessons } from '../../lessons';
import { fetchLeaderboard, LeaderboardRow } from '../../lib/cloud';
import { getLevel } from '../../lib/progress';

export default function LeaderboardPage() {
  const { user, completedLessons, progressPercent } = useAuth();
  const { t } = useAppContext();
  const [cloudBoard, setCloudBoard] = useState<LeaderboardRow[] | null>(null);
  const [period, setPeriod] = useState<'all' | 'weekly' | 'monthly'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLeaderboard(10, period).then((rows) => {
      setCloudBoard(rows);
    });
  }, [period]);

  const fakeBoard = [
    { name: 'Azizbek', avatar: '🧑‍💻', xp: 4500, streak: 12 },
    { name: 'Malika', avatar: '👩‍💻', xp: 3200, streak: 8 },
    { name: 'Sherzod', avatar: '🎓', xp: 2800, streak: 5 },
    { name: 'AI_Student', avatar: '🤖', xp: 2100, streak: 4 },
    { name: 'Jasur', avatar: '🔬', xp: 1800, streak: 2 },
    { name: 'Kamola', avatar: '⚡', xp: 1400, streak: 3 },
    { name: 'Bobur', avatar: '🦾', xp: 900, streak: 1 },
  ];

  const baseBoard = cloudBoard ?? (period === 'all' ? fakeBoard : []);
  
  // Find current user's period XP
  const myPeriodRecord = user ? baseBoard.find(p => p.name === user.name) : null;
  const myPeriodXp = myPeriodRecord ? myPeriodRecord.xp : 0;

  const allBoard = user
    ? [
        ...baseBoard.filter((p) => p.name !== user.name),
        { 
          name: user.name + ' (Siz)', 
          avatar: user.avatar || '🧑‍💻', 
          xp: period === 'all' ? user.xp : myPeriodXp, 
          streak: user.streak 
        },
      ]
    : baseBoard;

  const sorted = [...allBoard].sort((a, b) => b.xp - a.xp).slice(0, 10);
  const filteredSorted = sorted.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const myRank = user ? sorted.findIndex((p) => p.name.includes('(Siz)')) + 1 : null;
  const userLevel = user ? getLevel(user.xp) : null;

  const rankColors = ['#ffc85e', '#9ca3af', '#cd7f32'];
  const rankIcons = ['🥇', '🥈', '🥉'];
  const rankBg = [
    'linear-gradient(135deg, #ffc85e18, #ffb30018)',
    'linear-gradient(135deg, #9ca3af12, #6b728018)',
    'linear-gradient(135deg, #cd7f3218, #a0522d18)',
  ];

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', padding: '6rem 1.5rem 4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--accent)',
            letterSpacing: '0.15em', marginBottom: '0.75rem', textTransform: 'uppercase',
          }}>
            🏆 Reyting
          </div>
          <h1 style={{
            fontFamily: 'var(--sans)', fontWeight: 800, fontSize: '2.2rem',
            letterSpacing: '-0.025em', color: 'var(--ink)', marginBottom: '0.5rem',
          }}>
            {t('lb.title')}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{t('lb.subtitle')}</p>
        </div>

        {/* Namuna ogohlantirishi */}
        {!cloudBoard && (
          <div style={{
            marginBottom: '1.75rem', padding: '10px 16px',
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: '10px', textAlign: 'center', fontSize: '13px', color: 'var(--muted)',
          }}>
            ℹ️ {t('lb.sample')}
          </div>
        )}

        {/* ── Shaxsiy Statistika (Kirgan bo'lsa) ── */}
        {user && userLevel && (
          <div style={{
            marginBottom: '2rem',
            background: 'var(--surface)',
            border: '1px solid var(--accent)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 0 24px rgba(29,95,219,0.08)',
          }}>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--accent)',
              letterSpacing: '0.15em', marginBottom: '1rem', textTransform: 'uppercase',
            }}>
              📊 Sizning statistikangiz
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

              {/* Avatar + ism */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '160px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  background: 'var(--surface2)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '26px',
                  border: '2px solid var(--accent)',
                  boxShadow: '0 0 12px rgba(29,95,219,0.15)',
                }}>
                  {user.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink)' }}>{user.name}</div>
                  <div style={{
                    fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--accent)',
                    marginTop: '2px',
                  }}>
                    #{myRank} o'rin · {userLevel.title}
                  </div>
                </div>
              </div>

              {/* Statistika kartachalar */}
              <div style={{ display: 'flex', gap: '10px', flex: 1, flexWrap: 'wrap' }}>
                {[
                  { label: 'XP', value: user.xp.toLocaleString(), color: 'var(--accent2)', icon: '⭐' },
                  { label: 'Streak', value: `🔥 ${user.streak} kun`, color: 'var(--amber)', icon: '' },
                  { label: 'Daraja', value: `${userLevel.level} - ${userLevel.title}`, color: 'var(--accent)', icon: '🏅' },
                  { label: "Darslar", value: `${completedLessons.length}/${lessons.length}`, color: 'var(--text)', icon: '📚' },
                ].map((stat) => (
                  <div key={stat.label} style={{
                    flex: '1 1 100px', background: 'var(--surface2)',
                    border: '1px solid var(--border)', borderRadius: '10px',
                    padding: '10px 14px', textAlign: 'center',
                  }}>
                    <div style={{
                      fontFamily: 'var(--mono)', fontSize: '13px',
                      fontWeight: 700, color: stat.color,
                    }}>{stat.value}</div>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '3px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress bar — keyingi darajaga */}
            <div style={{ marginTop: '1.25rem' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '6px',
              }}>
                <span>Keyingi darajaga: {userLevel.xpToNext} XP</span>
                <span>{userLevel.pct}%</span>
              </div>
              <div style={{
                height: '6px', background: 'var(--surface2)',
                borderRadius: '3px', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', width: `${userLevel.pct}%`,
                  background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                  borderRadius: '3px', transition: 'width 0.6s ease',
                }} />
              </div>
            </div>

            {/* Kurs progressi */}
            <div style={{ marginTop: '1rem' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)', marginBottom: '6px',
              }}>
                <span>Kurs progressi</span>
                <span>{progressPercent}%</span>
              </div>
              <div style={{ height: '6px', background: 'var(--surface2)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #34d399, #15803d)',
                  borderRadius: '3px', transition: 'width 0.6s ease',
                }} />
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
              <Link href="/#bosqichlar" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                color: '#fff', textDecoration: 'none', padding: '8px 18px',
                borderRadius: '8px', fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 700,
              }}>
                {t('lb.boost')} →
              </Link>
            </div>
          </div>
        )}

        {/* Qidiruv va Filtrlar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
          {/* Period Tabs */}
          <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: '8px', padding: '4px', border: '1px solid var(--border)' }}>
            {(['all', 'weekly', 'monthly'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  padding: '6px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  background: period === p ? 'var(--surface)' : 'transparent',
                  color: period === p ? 'var(--accent)' : 'var(--muted)',
                  fontWeight: period === p ? 'bold' : 'normal',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'var(--sans)',
                  transition: 'all 0.15s ease'
                }}
              >
                {p === 'all' ? 'Barchasi' : p === 'weekly' ? 'Haftalik' : 'Oylik'}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="O'quvchini izlash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '8px 14px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text)',
              fontSize: '13px',
              outline: 'none',
              width: '100%',
              maxWidth: '240px',
              fontFamily: 'var(--sans)',
              transition: 'border-color 0.2s'
            }}
          />
        </div>

        {/* Top 3 podium */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px', marginBottom: '1.5rem',
        }}>
          {sorted.slice(0, 3).map((p, i) => (
            <div key={i} style={{
              background: rankBg[i],
              border: `1px solid ${rankColors[i]}`,
              borderRadius: '14px', padding: '1.5rem 1rem',
              textAlign: 'center',
              boxShadow: `0 0 20px ${rankColors[i]}20`,
              transform: i === 0 ? 'scale(1.04)' : 'none',
              transition: 'transform 0.2s',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '6px' }}>{rankIcons[i]}</div>
              <div style={{ fontSize: '2.2rem', marginBottom: '6px' }}>{p.avatar}</div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)', marginBottom: '4px' }}>{p.name}</div>
              <div style={{ fontFamily: 'var(--mono)', color: 'var(--accent2)', fontSize: '1.1rem', fontWeight: 700 }}>
                {p.xp.toLocaleString()} XP
              </div>
              <div style={{ color: 'var(--amber)', fontSize: '12px', marginTop: '4px' }}>🔥 {p.streak} kun</div>
            </div>
          ))}
        </div>

        {/* To'liq ro'yxat */}
        <div style={{
          background: 'var(--surface)', borderRadius: '14px',
          border: '1px solid var(--border)', overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '48px 1fr 100px 80px',
            padding: '10px 20px', background: 'var(--surface2)',
            borderBottom: '1px solid var(--border)',
            fontFamily: 'var(--mono)', fontSize: '10px',
            color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            <div>#</div><div>{t('lb.user')}</div>
            <div style={{ textAlign: 'right' }}>XP</div>
            <div style={{ textAlign: 'right' }}>{t('dash.streak')}</div>
          </div>

          {filteredSorted.length === 0 ? (
            <div style={{ padding: '2rem', color: 'var(--muted)', fontSize: '14px', textAlign: 'center' }}>
              O'quvchi topilmadi.
            </div>
          ) : (
            filteredSorted.map((p, i) => {
              const isMe = p.name.includes('(Siz)');
              const originalIndex = sorted.findIndex(item => item.name === p.name);
              return (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '48px 1fr 100px 80px',
                  padding: '13px 20px',
                  borderBottom: i < filteredSorted.length - 1 ? '1px solid var(--border)' : 'none',
                  background: isMe ? 'rgba(29,95,219,0.05)' : 'transparent',
                  alignItems: 'center',
                  transition: 'background 0.15s',
                }}>
                  <div style={{
                    fontFamily: 'var(--mono)', fontWeight: 700,
                    color: originalIndex < 3 ? rankColors[originalIndex] : 'var(--muted)', fontSize: '15px',
                  }}>
                    {originalIndex < 3 ? rankIcons[originalIndex] : originalIndex + 1}
                  </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: 'var(--surface2)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '17px',
                    border: isMe ? '2px solid var(--accent)' : '1px solid var(--border)',
                    flexShrink: 0,
                  }}>
                    {p.avatar}
                  </div>
                  <span style={{
                    fontWeight: isMe ? 700 : 500,
                    color: isMe ? 'var(--accent)' : 'var(--text)',
                    fontSize: '14px',
                  }}>
                    {p.name}
                  </span>
                </div>
                <div style={{
                  textAlign: 'right', fontFamily: 'var(--mono)',
                  color: 'var(--accent2)', fontWeight: 700, fontSize: '14px',
                }}>
                  {p.xp.toLocaleString()}
                </div>
                <div style={{
                  textAlign: 'right', fontFamily: 'var(--mono)',
                  color: 'var(--amber)', fontSize: '13px',
                }}>
                  🔥 {p.streak}
                </div>
              </div>
            );
          })
          )}
        </div>

        {/* Davom etish havolasi */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link href="/" style={{
            color: 'var(--accent)', textDecoration: 'none',
            fontFamily: 'var(--mono)', fontSize: '13px',
          }}>
            ← {t('lb.continueLearning')}
          </Link>
        </div>
      </div>
    </div>
  );
}
