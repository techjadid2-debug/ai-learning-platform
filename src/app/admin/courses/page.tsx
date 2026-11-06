"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { BookOpen, Plus, Trash2, Edit2, CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface DBCourse {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  bg_color: string;
  cover_image: string;
  estimate: string;
  level: string;
  is_published: boolean;
  sort_order: number;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<DBCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  // Form values
  const [id, setId] = useState('');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📚');
  const [color, setColor] = useState('#2f6bff');
  const [bgColor, setBgColor] = useState('rgba(47,107,255,0.08)');
  const [coverImage, setCoverImage] = useState('');
  const [estimate, setEstimate] = useState('');
  const [level, setLevel] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase!
        .from('courses')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      setCourses(data || []);
    } catch (err: any) {
      console.error('Error loading courses:', err);
      setError(err.message || 'Kurslarni yuklashda xatolik.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const openCreateModal = () => {
    setId('');
    setSlug('');
    setTitle('');
    setSubtitle('');
    setDescription('');
    setIcon('📚');
    setColor('#2f6bff');
    setBgColor('rgba(47,107,255,0.08)');
    setCoverImage('');
    setEstimate('');
    setLevel('');
    setIsPublished(false);
    setSortOrder(courses.length);
    setModalMode('create');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (c: DBCourse) => {
    setId(c.id);
    setSlug(c.slug);
    setTitle(c.title);
    setSubtitle(c.subtitle || '');
    setDescription(c.description || '');
    setIcon(c.icon || '📚');
    setColor(c.color || '#2f6bff');
    setBgColor(c.bg_color || 'rgba(47,107,255,0.08)');
    setCoverImage(c.cover_image || '');
    setEstimate(c.estimate || '');
    setLevel(c.level || '');
    setIsPublished(c.is_published);
    setSortOrder(c.sort_order || 0);
    setModalMode('edit');
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Ushbu kursni o\'chirishni xohlaysizmi? Bu kursdagi barcha darslar va qadamlar ham o\'chib ketadi!')) return;
    try {
      const { error } = await supabase!
        .from('courses')
        .delete()
        .eq('id', courseId);
      if (error) throw error;
      loadCourses();
    } catch (err: any) {
      alert('O\'chirishda xatolik: ' + err.message);
    }
  };

  const handleTogglePublished = async (c: DBCourse) => {
    try {
      const { error } = await supabase!
        .from('courses')
        .update({ is_published: !c.is_published })
        .eq('id', c.id);
      if (error) throw error;
      loadCourses();
    } catch (err: any) {
      alert('Holatni yangilashda xatolik: ' + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !slug || !title) {
      setError('ID, slug va sarlavha kiritilishi shart.');
      return;
    }
    setSaving(true);
    setError('');
    const coursePayload = {
      id,
      slug,
      title,
      subtitle,
      description,
      icon,
      color,
      bg_color: bgColor,
      cover_image: coverImage,
      estimate,
      level,
      is_published: isPublished,
      sort_order: sortOrder
    };

    try {
      if (modalMode === 'create') {
        const { error } = await supabase!
          .from('courses')
          .insert(coursePayload);
        if (error) throw error;
      } else {
        const { error } = await supabase!
          .from('courses')
          .update(coursePayload)
          .eq('id', id);
        if (error) throw error;
      }
      setIsModalOpen(false);
      loadCourses();
    } catch (err: any) {
      setError(err.message || 'Kursni saqlashda xatolik yuz berdi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
            Kurslar
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Platformadagi kurslar ro'yxati va ularni boshqarish.
          </p>
        </div>
        <button onClick={openCreateModal} style={{
          background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px',
          padding: '10px 18px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px', transition: 'opacity 0.2s'
        }}>
          <Plus size={16} /> Yangi Kurs
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', padding: '4rem 0', justifyContent: 'center', color: '#94a3b8' }}>
          Kurslar yuklanmoqda...
        </div>
      ) : courses.length === 0 ? (
        <div style={{
          background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '12px', padding: '4rem 2rem', textAlign: 'center', color: '#64748b'
        }}>
          <BookOpen size={40} style={{ margin: '0 auto 1rem', strokeWidth: 1.5 }} />
          <div>Hech qanday kurs topilmadi. Yangi kurs yarating!</div>
        </div>
      ) : (
        <div style={{ background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#64748b', fontFamily: 'var(--mono)', fontSize: '12px' }}>
                <th style={{ padding: '16px 20px' }}>KURS</th>
                <th style={{ padding: '16px 20px' }}>SLUG</th>
                <th style={{ padding: '16px 20px' }}>DARSLIK</th>
                <th style={{ padding: '16px 20px' }}>HOLAT</th>
                <th style={{ padding: '16px 20px' }}>TARTIB</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>AMALLAR</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }} className="hover:bg-slate-900/50">
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '24px' }}>{c.icon || '📚'}</span>
                      <div>
                        <div style={{ fontWeight: 600, color: '#f8fafc' }}>{c.title}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{c.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', fontFamily: 'var(--mono)', color: '#94a3b8' }}>
                    {c.slug}
                  </td>
                  <td style={{ padding: '16px 20px', color: '#cbd5e1' }}>
                    <Link href={`/admin/courses/${c.id}`} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      color: 'var(--accent)', textDecoration: 'none', fontWeight: 500
                    }}>
                      Boshqarish <ArrowRight size={14} />
                    </Link>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <button
                      onClick={() => handleTogglePublished(c)}
                      style={{
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        color: c.is_published ? '#10b981' : '#f43f5e', fontSize: '13px'
                      }}
                    >
                      {c.is_published ? (
                        <>
                          <CheckCircle2 size={16} />
                          <span>E'lon qilingan</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={16} />
                          <span>E'lon qilinmagan</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td style={{ padding: '16px 20px', fontFamily: 'var(--mono)', color: '#cbd5e1' }}>
                    {c.sort_order}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button
                        onClick={() => openEditModal(c)}
                        style={{
                          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '6px', padding: '6px 12px', color: '#cbd5e1', cursor: 'pointer',
                          display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px'
                        }}
                      >
                        <Edit2 size={13} /> Tahrirlash
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                          borderRadius: '6px', padding: '6px 12px', color: '#fca5a5', cursor: 'pointer',
                          display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px'
                        }}
                      >
                        <Trash2 size={13} /> O'chirish
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Course Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '1.5rem', overflowY: 'auto'
        }}>
          <div style={{
            background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '650px',
            maxHeight: '90vh', overflowY: 'auto', animation: 'fadeUp 0.2s ease', color: '#fff'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              {modalMode === 'create' ? 'Yangi Kurs Yaratish' : 'Kursni Tahrirlash'}
            </h2>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '8px', padding: '12px', color: '#fca5a5', fontSize: '13px', marginBottom: '1.5rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontFamily: 'var(--mono)' }}>ID (Noyob kalit)</label>
                <input
                  type="text"
                  required
                  disabled={modalMode === 'edit'}
                  value={id}
                  onChange={e => {
                    setId(e.target.value);
                    if (modalMode === 'create') setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  placeholder="ai-eng"
                  style={{
                    width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                    outline: 'none', fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontFamily: 'var(--mono)' }}>SLUG (URL havolasi)</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  placeholder="ai-engineering"
                  style={{
                    width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                    outline: 'none', fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontFamily: 'var(--mono)' }}>KURS SARLAVHASI</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="AI Engineering"
                  style={{
                    width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                    outline: 'none', fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontFamily: 'var(--mono)' }}>KICHIK SARLAVHA (SUBTITLE)</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={e => setSubtitle(e.target.value)}
                  placeholder="Noldan LLM qurguncha"
                  style={{
                    width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                    outline: 'none', fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontFamily: 'var(--mono)' }}>TAVSIF (DESCRIPTION)</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Kurs haqida qisqacha ma'lumot..."
                  rows={3}
                  style={{
                    width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                    outline: 'none', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontFamily: 'var(--mono)' }}>ICON (EMOJI)</label>
                <input
                  type="text"
                  value={icon}
                  onChange={e => setIcon(e.target.value)}
                  placeholder="🛠️"
                  style={{
                    width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                    outline: 'none', fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontFamily: 'var(--mono)' }}>MUDDAT (ESTIMATE)</label>
                <input
                  type="text"
                  value={estimate}
                  onChange={e => setEstimate(e.target.value)}
                  placeholder="6 oy"
                  style={{
                    width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                    outline: 'none', fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontFamily: 'var(--mono)' }}>DARAJA (LEVEL)</label>
                <input
                  type="text"
                  value={level}
                  onChange={e => setLevel(e.target.value)}
                  placeholder="Boshlang'ich"
                  style={{
                    width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                    outline: 'none', fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontFamily: 'var(--mono)' }}>TARTIB (SORT ORDER)</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={e => setSortOrder(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  style={{
                    width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                    outline: 'none', fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontFamily: 'var(--mono)' }}>MUQOVA RASMI URL (COVER IMAGE)</label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={e => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  style={{
                    width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                    outline: 'none', fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontFamily: 'var(--mono)' }}>KURS RANGI (HEX COLOR)</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={color}
                    onChange={e => {
                      setColor(e.target.value);
                      setBgColor(`rgba(${parseInt(e.target.value.slice(1,3),16)}, ${parseInt(e.target.value.slice(3,5),16)}, ${parseInt(e.target.value.slice(5,7),16)}, 0.08)`);
                    }}
                    style={{ background: 'transparent', border: 'none', width: '38px', height: '38px', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    style={{
                      flex: 1, padding: '10px 12px', background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                      outline: 'none', fontSize: '14px', fontFamily: 'var(--mono)'
                    }}
                  />
                </div>
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="published"
                  checked={isPublished}
                  onChange={e => setIsPublished(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="published" style={{ fontSize: '14px', color: '#cbd5e1', cursor: 'pointer' }}>
                  Kursni platformada e'lon qilish (is_published)
                </label>
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px', padding: '10px 18px', color: '#cbd5e1', cursor: 'pointer', fontSize: '14px'
                  }}
                >
                  Bekor Qilish
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px',
                    padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: '14px',
                    display: 'flex', alignItems: 'center', gap: '8px'
                  }}
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={16} /> Saqlanmoqda...
                    </>
                  ) : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
