"use client";
import React, { useEffect, useState, use } from 'react';
import { supabase } from '../../../../lib/supabase';
import { BookOpen, Plus, Trash2, Edit2, CheckCircle2, XCircle, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface DBCourse {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
}

interface DBLesson {
  id: string;
  course_id: string;
  title: string;
  phase: number;
  topic: number;
  xp: number;
  is_published: boolean;
  sort_order: number;
}

export default function AdminCourseLessons({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const courseId = params.id;
  const [course, setCourse] = useState<DBCourse | null>(null);
  const [lessons, setLessons] = useState<DBLesson[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  // Lesson form values
  const [lessonId, setLessonId] = useState('');
  const [title, setTitle] = useState('');
  const [phase, setPhase] = useState(0);
  const [topic, setTopic] = useState(0);
  const [xp, setXp] = useState(100);
  const [isPublished, setIsPublished] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load course details
      const { data: courseData, error: courseErr } = await supabase!
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
      if (courseErr) throw courseErr;
      setCourse(courseData);

      // Load course lessons
      const { data: lessonsData, error: lessonsErr } = await supabase!
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('phase', { ascending: true })
        .order('topic', { ascending: true })
        .order('sort_order', { ascending: true });
      if (lessonsErr) throw lessonsErr;
      setLessons(lessonsData || []);
    } catch (err: any) {
      console.error('Error loading course lessons data:', err);
      setError(err.message || 'Ma\'lumotlarni yuklashda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [courseId]);

  const openCreateModal = () => {
    setLessonId('');
    setTitle('');
    setPhase(lessons.length > 0 ? lessons[lessons.length - 1].phase : 0);
    setTopic(lessons.length > 0 ? lessons[lessons.length - 1].topic + 1 : 0);
    setXp(100);
    setIsPublished(false);
    setSortOrder(lessons.length);
    setModalMode('create');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (l: DBLesson) => {
    setLessonId(l.id);
    setTitle(l.title);
    setPhase(l.phase);
    setTopic(l.topic);
    setXp(l.xp);
    setIsPublished(l.is_published);
    setSortOrder(l.sort_order);
    setModalMode('edit');
    setError('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ushbu darsni o\'chirishni xohlaysizmi? Darsdagi barcha qadamlar ham o\'chib ketadi!')) return;
    try {
      const { error } = await supabase!
        .from('lessons')
        .delete()
        .eq('id', id);
      if (error) throw error;
      loadData();
    } catch (err: any) {
      alert('O\'chirishda xatolik: ' + err.message);
    }
  };

  const handleTogglePublished = async (l: DBLesson) => {
    try {
      const { error } = await supabase!
        .from('lessons')
        .update({ is_published: !l.is_published })
        .eq('id', l.id);
      if (error) throw error;
      loadData();
    } catch (err: any) {
      alert('Holatni yangilashda xatolik: ' + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonId || !title) {
      setError('ID va sarlavha kiritilishi shart.');
      return;
    }
    setSaving(true);
    setError('');
    
    const lessonPayload = {
      id: lessonId,
      course_id: courseId,
      title,
      phase,
      topic,
      xp,
      is_published: isPublished,
      sort_order: sortOrder
    };

    try {
      if (modalMode === 'create') {
        const { error } = await supabase!
          .from('lessons')
          .insert(lessonPayload);
        if (error) throw error;
      } else {
        const { error } = await supabase!
          .from('lessons')
          .update(lessonPayload)
          .eq('id', lessonId);
        if (error) throw error;
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Darsni saqlashda xatolik yuz berdi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Back button */}
      <Link href="/admin/courses" style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        color: '#cbd5e1', textDecoration: 'none', fontSize: '13px', marginBottom: '1.5rem',
        transition: 'color 0.2s'
      }} className="hover:text-white">
        <ArrowLeft size={14} /> Kurslar ro'yxatiga qaytish
      </Link>

      {loading ? (
        <div style={{ display: 'flex', padding: '4rem 0', justifyContent: 'center', color: '#94a3b8' }}>
          Kurs darslari yuklanmoqda...
        </div>
      ) : !course ? (
        <div style={{ color: '#ef4444' }}>Kurs topilmadi.</div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
                {course.title} darslari
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                ID: <code style={{ color: '#60a5fa', fontFamily: 'var(--mono)' }}>{course.id}</code> · Slug: <code style={{ color: '#c084fc', fontFamily: 'var(--mono)' }}>{course.slug}</code>
              </p>
            </div>
            <button onClick={openCreateModal} style={{
              background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px',
              padding: '10px 18px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px', transition: 'opacity 0.2s'
            }}>
              <Plus size={16} /> Yangi Dars Qo'shish
            </button>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px', padding: '12px', color: '#fca5a5', fontSize: '13px', marginBottom: '1.5rem'
            }}>
              {error}
            </div>
          )}

          {lessons.length === 0 ? (
            <div style={{
              background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px', padding: '4rem 2rem', textAlign: 'center', color: '#64748b'
            }}>
              <BookOpen size={40} style={{ margin: '0 auto 1rem', strokeWidth: 1.5 }} />
              <div>Ushbu kursda hozircha darslar mavjud emas. Yangi dars qo'shing!</div>
            </div>
          ) : (
            <div style={{ background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#64748b', fontFamily: 'var(--mono)', fontSize: '12px' }}>
                    <th style={{ padding: '16px 20px' }}>T/R / ID</th>
                    <th style={{ padding: '16px 20px' }}>DARS NOMI</th>
                    <th style={{ padding: '16px 20px' }}>BOSQICH (PHASE)</th>
                    <th style={{ padding: '16px 20px' }}>MAVZU (TOPIC)</th>
                    <th style={{ padding: '16px 20px' }}>XP MIKDORI</th>
                    <th style={{ padding: '16px 20px' }}>HOLATI</th>
                    <th style={{ padding: '16px 20px', textAlign: 'right' }}>AMALLAR</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((l, index) => (
                    <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '16px 20px', fontFamily: 'var(--mono)', color: '#94a3b8' }}>
                        <div>#{index + 1}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{l.id}</div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div>
                          <Link href={`/admin/lessons/${l.id}`} style={{ fontWeight: 600, color: '#f8fafc', textDecoration: 'none' }} className="hover:underline">
                            {l.title}
                          </Link>
                          <div style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '4px' }}>
                            <Link href={`/admin/lessons/${l.id}`} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              Dars qadamlarini tahrirlash <ArrowRight size={12} />
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#cbd5e1', fontFamily: 'var(--mono)' }}>
                        {l.phase}
                      </td>
                      <td style={{ padding: '16px 20px', color: '#cbd5e1', fontFamily: 'var(--mono)' }}>
                        {l.topic}
                      </td>
                      <td style={{ padding: '16px 20px', color: '#fbbf24', fontWeight: 600, fontFamily: 'var(--mono)' }}>
                        {l.xp} XP
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <button
                          onClick={() => handleTogglePublished(l)}
                          style={{
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            color: l.is_published ? '#10b981' : '#f43f5e', fontSize: '13px'
                          }}
                        >
                          {l.is_published ? (
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
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                          <button
                            onClick={() => openEditModal(l)}
                            style={{
                              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                              borderRadius: '6px', padding: '6px 12px', color: '#cbd5e1', cursor: 'pointer',
                              display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px'
                            }}
                          >
                            <Edit2 size={13} /> Tahrirlash
                          </button>
                          <button
                            onClick={() => handleDelete(l.id)}
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
        </>
      )}

      {/* Lesson Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '1.5rem'
        }}>
          <div style={{
            background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '500px',
            animation: 'fadeUp 0.2s ease', color: '#fff'
          }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              {modalMode === 'create' ? 'Yangi Dars Yaratish' : 'Dars Sozlamalari'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontFamily: 'var(--mono)' }}>DARS ID (Noyob kalit)</label>
                <input
                  type="text"
                  required
                  disabled={modalMode === 'edit'}
                  value={lessonId}
                  onChange={e => setLessonId(e.target.value)}
                  placeholder="00-0"
                  style={{
                    width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                    outline: 'none', fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontFamily: 'var(--mono)' }}>DARS NOMI</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Python: print() va o'zgaruvchilar"
                  style={{
                    width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                    outline: 'none', fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontFamily: 'var(--mono)' }}>BOSQICH (PHASE INDEX)</label>
                  <input
                    type="number"
                    required
                    value={phase}
                    onChange={e => setPhase(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                      outline: 'none', fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontFamily: 'var(--mono)' }}>MAVZU (TOPIC INDEX)</label>
                  <input
                    type="number"
                    required
                    value={topic}
                    onChange={e => setTopic(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                      outline: 'none', fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px', fontFamily: 'var(--mono)' }}>XP BALLI</label>
                  <input
                    type="number"
                    required
                    value={xp}
                    onChange={e => setXp(parseInt(e.target.value) || 0)}
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
                    required
                    value={sortOrder}
                    onChange={e => setSortOrder(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                      outline: 'none', fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                <input
                  type="checkbox"
                  id="lesson_published"
                  checked={isPublished}
                  onChange={e => setIsPublished(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="lesson_published" style={{ fontSize: '14px', color: '#cbd5e1', cursor: 'pointer' }}>
                  Darsni platformada e'lon qilish
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
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
