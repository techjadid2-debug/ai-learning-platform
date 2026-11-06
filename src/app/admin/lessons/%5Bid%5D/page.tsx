"use client";
import React, { useEffect, useState, use } from 'react';
import { supabase } from '../../../../lib/supabase';
import { ArrowLeft, Plus, Trash2, ChevronUp, ChevronDown, Check, Loader2, Save, Video, Code, Brain, Play, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface DBLesson {
  id: string;
  course_id: string;
  title: string;
  phase: number;
  topic: number;
  xp: number;
}

interface DBStep {
  id?: string;
  lesson_id: string;
  type: 'info' | 'quiz' | 'code' | 'playground' | 'video' | 'finalquiz';
  title: string;
  content: string;
  code?: string;
  success_check?: string;
  quiz_data?: any;
  questions_data?: any[];
  playground_data?: any;
  video_data?: any;
  sort_order: number;
}

export default function AdminLessonSteps({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const lessonId = params.id;
  const [lesson, setLesson] = useState<DBLesson | null>(null);
  const [steps, setSteps] = useState<DBStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load lesson
      const { data: lessonData, error: lessonErr } = await supabase!
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();
      if (lessonErr) throw lessonErr;
      setLesson(lessonData);

      // Load steps
      const { data: stepsData, error: stepsErr } = await supabase!
        .from('lesson_steps')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('sort_order', { ascending: true });
      if (stepsErr) throw stepsErr;
      setSteps(stepsData || []);
      if (stepsData && stepsData.length > 0) {
        setActiveStepIndex(0);
      }
    } catch (err: any) {
      console.error('Error loading lesson steps:', err);
      setError(err.message || 'Ma\'lumot yuklashda xatolik.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [lessonId]);

  const addStep = (type: DBStep['type']) => {
    let title = 'Yangi Qadam';
    let content = 'Qadam tavsifi bu yerda...';
    let additionalProps: Partial<DBStep> = {};

    switch (type) {
      case 'info':
        title = 'Nazariy qism';
        break;
      case 'quiz':
        title = 'Mavzudan test';
        content = 'Savol matni bu yerda...';
        additionalProps.quiz_data = {
          question: 'Savol matni?',
          options: [
            { text: 'Javob A', correct: true },
            { text: 'Javob B', correct: false },
            { text: 'Javob C', correct: false },
            { text: 'Javob D', correct: false }
          ]
        };
        break;
      case 'code':
        title = 'Amaliy kod topshirig\'i';
        content = 'Topsiriq sharti va ko\'rsatmalar...';
        additionalProps.code = '# Kodni shu yerda yozing\n';
        additionalProps.success_check = 'print';
        break;
      case 'playground':
        title = 'Playground amaliyoti';
        content = 'Prompting topshirig\'i...';
        additionalProps.playground_data = {
          task: 'Claude API bilan amaliyot topshirig\'i...',
          starterPrompt: 'Prompt yozing...',
          systemHint: 'Tizim yordamchi ko\'rsatmasi...'
        };
        break;
      case 'video':
        title = 'Mavzu bo\'yicha video dars';
        content = 'Video haqida qisqacha ma\'lumot yoki ko\'rsatma...';
        additionalProps.video_data = {
          url: '',
          note: ''
        };
        break;
      case 'finalquiz':
        title = 'Yakuniy imtihon';
        content = 'Kurs yoki bo\'lim bo\'yicha test imtihoni...';
        additionalProps.questions_data = [
          {
            question: '1-savol matni?',
            options: [
              { text: 'To\'g\'ri javob', correct: true },
              { text: 'Noto\'g\'ri javob', correct: false }
            ]
          }
        ];
        break;
    }

    const newStep: DBStep = {
      lesson_id: lessonId,
      type,
      title,
      content,
      sort_order: steps.length,
      ...additionalProps
    };

    const updated = [...steps, newStep];
    setSteps(updated);
    setActiveStepIndex(updated.length - 1);
  };

  const deleteStep = (index: number) => {
    if (!confirm('Ushbu qadamni o\'chirishni xohlaysizmi?')) return;
    const updated = steps.filter((_, i) => i !== index).map((step, i) => ({
      ...step,
      sort_order: i
    }));
    setSteps(updated);
    if (activeStepIndex === index) {
      setActiveStepIndex(updated.length > 0 ? 0 : null);
    } else if (activeStepIndex !== null && activeStepIndex > index) {
      setActiveStepIndex(activeStepIndex - 1);
    }
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === steps.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...steps];
    
    // Swap steps
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Recalculate sort order
    const finalSteps = updated.map((step, i) => ({ ...step, sort_order: i }));
    setSteps(finalSteps);
    setActiveStepIndex(targetIndex);
  };

  const updateActiveStep = (field: keyof DBStep, value: any) => {
    if (activeStepIndex === null) return;
    const updated = [...steps];
    updated[activeStepIndex] = {
      ...updated[activeStepIndex],
      [field]: value
    };
    setSteps(updated);
  };

  const updateActiveStepNested = (subField: string, value: any, key: 'quiz_data' | 'playground_data' | 'video_data') => {
    if (activeStepIndex === null) return;
    const updated = [...steps];
    const currentData = updated[activeStepIndex][key] || {};
    updated[activeStepIndex] = {
      ...updated[activeStepIndex],
      [key]: {
        ...currentData,
        [subField]: value
      }
    };
    setSteps(updated);
  };

  // Savollar uchun yordamchilar (finalquiz uchun)
  const updateFinalQuizQuestion = (qIndex: number, updatedQuestion: any) => {
    if (activeStepIndex === null) return;
    const updated = [...steps];
    const questions = [...(updated[activeStepIndex].questions_data || [])];
    questions[qIndex] = updatedQuestion;
    updated[activeStepIndex] = {
      ...updated[activeStepIndex],
      questions_data: questions
    };
    setSteps(updated);
  };

  const addFinalQuizQuestion = () => {
    if (activeStepIndex === null) return;
    const updated = [...steps];
    const questions = [...(updated[activeStepIndex].questions_data || [])];
    questions.push({
      question: 'Yangi savol?',
      options: [
        { text: 'Javob A', correct: true },
        { text: 'Javob B', correct: false }
      ]
    });
    updated[activeStepIndex] = {
      ...updated[activeStepIndex],
      questions_data: questions
    };
    setSteps(updated);
  };

  const deleteFinalQuizQuestion = (qIndex: number) => {
    if (activeStepIndex === null) return;
    const updated = [...steps];
    const questions = (updated[activeStepIndex].questions_data || []).filter((_, i) => i !== qIndex);
    updated[activeStepIndex] = {
      ...updated[activeStepIndex],
      questions_data: questions
    };
    setSteps(updated);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      // 1. Eski dars qadamlarini DB dan o'chirish (reinsert qilish uchun)
      const { error: deleteErr } = await supabase!
        .from('lesson_steps')
        .delete()
        .eq('lesson_id', lessonId);
      if (deleteErr) throw deleteErr;

      // 2. Yangi qadamlarni yozish (agar mavjud bo'lsa)
      if (steps.length > 0) {
        // payload dan id fieldlarini olib tashlash (Supabase o'zi generatsiya qilishi yoki yangi serial berishi uchun)
        const insertPayload = steps.map(({ id, ...rest }) => rest);
        const { error: insertErr } = await supabase!
          .from('lesson_steps')
          .insert(insertPayload);
        if (insertErr) throw insertErr;
      }

      alert('Dars qadamlari muvaffaqiyatli saqlandi!');
      loadData();
    } catch (err: any) {
      console.error('Error saving lesson steps:', err);
      setError(err.message || 'Saqlashda xatolik yuz berdi.');
    } finally {
      setSaving(false);
    }
  };

  const getStepIcon = (type: DBStep['type']) => {
    switch (type) {
      case 'info': return <Brain size={16} style={{ color: '#60a5fa' }} />;
      case 'code': return <Code size={16} style={{ color: '#10b981' }} />;
      case 'quiz': return <HelpCircle size={16} style={{ color: '#a855f7' }} />;
      case 'playground': return <Play size={16} style={{ color: '#f59e0b' }} />;
      case 'video': return <Video size={16} style={{ color: '#ec4899' }} />;
      case 'finalquiz': return <HelpCircle size={16} style={{ color: '#f43f5e' }} />;
    }
  };

  return (
    <div>
      {lesson && (
        <Link href={`/admin/courses/${lesson.course_id}`} style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: '#cbd5e1', textDecoration: 'none', fontSize: '13px', marginBottom: '1.5rem',
          transition: 'color 0.2s'
        }} className="hover:text-white">
          <ArrowLeft size={14} /> Darslar ro'yxatiga qaytish
        </Link>
      )}

      {loading ? (
        <div style={{ display: 'flex', padding: '4rem 0', justifyContent: 'center', color: '#94a3b8' }}>
          Dars qadamlari yuklanmoqda...
        </div>
      ) : !lesson ? (
        <div style={{ color: '#ef4444' }}>Dars topilmadi.</div>
      ) : (
        <>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
                {lesson.title} qadamlari
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                ID: <code style={{ color: '#60a5fa', fontFamily: 'var(--mono)' }}>{lesson.id}</code> · Kurs: <code style={{ color: '#c084fc', fontFamily: 'var(--mono)' }}>{lesson.course_id}</code> · XP: {lesson.xp} ball
              </p>
            </div>
            
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px',
                padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px', transition: 'opacity 0.2s'
              }}
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Saqlash
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

          {/* Steps Workspace Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', alignItems: 'start' }}>
            {/* Sidebar: Step List */}
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8', marginBottom: '1rem', fontFamily: 'var(--mono)' }}>QADAMLAR RO'YXATI</div>
              
              {steps.length === 0 ? (
                <div style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>Qadamlar mavjud emas.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      onClick={() => setActiveStepIndex(index)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px',
                        borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                        background: activeStepIndex === index ? 'rgba(29, 95, 219, 0.15)' : 'rgba(255,255,255,0.01)',
                        border: activeStepIndex === index ? '1px solid rgba(29, 95, 219, 0.3)' : '1px solid rgba(255,255,255,0.03)'
                      }}
                    >
                      <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'var(--mono)', width: '20px' }}>
                        {index + 1}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0 }}>
                        {getStepIcon(step.type)}
                        <span style={{
                          fontSize: '13px', fontWeight: 500, color: activeStepIndex === index ? '#fff' : '#cbd5e1',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>
                          {step.title || 'Sarlavhasiz'}
                        </span>
                      </div>
                      
                      {/* Sort / delete mini-controls */}
                      <div style={{ display: 'flex', gap: '2px' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => moveStep(index, 'up')} disabled={index === 0} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}>
                          <ChevronUp size={14} />
                        </button>
                        <button onClick={() => moveStep(index, 'down')} disabled={index === steps.length - 1} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}>
                          <ChevronDown size={14} />
                        </button>
                        <button onClick={() => deleteStep(index)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px', marginLeft: '4px' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Step Buttons Grid */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.25rem' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>Yangi qadam qo'shish:</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {(['info', 'quiz', 'code', 'playground', 'video', 'finalquiz'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => addStep(type)}
                      style={{
                        padding: '6px 8px', background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px',
                        color: '#cbd5e1', fontSize: '11px', cursor: 'pointer', textAlign: 'left',
                        display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'capitalize'
                      }}
                    >
                      {getStepIcon(type)}
                      {type === 'finalquiz' ? 'exam' : type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Editor Workspace */}
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '2rem', minHeight: '400px' }}>
              {activeStepIndex === null || steps[activeStepIndex] === undefined ? (
                <div style={{ display: 'flex', height: '350px', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexDirection: 'column', gap: '10px' }}>
                  <Brain size={40} style={{ strokeWidth: 1 }} />
                  <div>Chap tomondagi ro'yxatdan qadamni tanlang yoki yangi qadam qo'shing.</div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <span style={{
                        background: 'rgba(255,255,255,0.05)', color: '#94a3b8',
                        padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold',
                        textTransform: 'uppercase', fontFamily: 'var(--mono)', marginRight: '8px'
                      }}>
                        {steps[activeStepIndex].type} QADAMI
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Sarlavha (Title) */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--mono)' }}>SARLAVHA (TITLE)</label>
                      <input
                        type="text"
                        value={steps[activeStepIndex].title}
                        onChange={e => updateActiveStep('title', e.target.value)}
                        style={{
                          width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                          outline: 'none', fontSize: '14px'
                        }}
                      />
                    </div>

                    {/* Matn/Mazmun (Content) */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--mono)' }}>TAVSIF / MATN (CONTENT - MARKDOWN QO'LLAYDI)</label>
                      <textarea
                        value={steps[activeStepIndex].content}
                        onChange={e => updateActiveStep('content', e.target.value)}
                        rows={6}
                        style={{
                          width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                          outline: 'none', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit'
                        }}
                      />
                    </div>

                    {/* 1. CODE TYPE FIELDS */}
                    {steps[activeStepIndex].type === 'code' && (
                      <>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--mono)' }}>START KOD (STARTER CODE - PYTHON)</label>
                          <textarea
                            value={steps[activeStepIndex].code || ''}
                            onChange={e => updateActiveStep('code', e.target.value)}
                            rows={8}
                            style={{
                              width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#67e8f9',
                              outline: 'none', fontSize: '13px', fontFamily: 'var(--mono)', resize: 'vertical'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--mono)' }}>KOD TEKSHIRISH SO'ZI (SUCCESS CHECK IN STDOUT)</label>
                          <input
                            type="text"
                            value={steps[activeStepIndex].success_check || ''}
                            onChange={e => updateActiveStep('success_check', e.target.value)}
                            placeholder="Chiqishda mavjud bo'lishi shart bo'lgan satr"
                            style={{
                              width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                              outline: 'none', fontSize: '14px', fontFamily: 'var(--mono)'
                            }}
                          />
                        </div>
                      </>
                    )}

                    {/* 2. PLAYGROUND TYPE FIELDS */}
                    {steps[activeStepIndex].type === 'playground' && (
                      <>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--mono)' }}>PLAYGROUND VAZIFASI (TASK DESCRIPTION)</label>
                          <textarea
                            value={steps[activeStepIndex].playground_data?.task || ''}
                            onChange={e => updateActiveStepNested('task', e.target.value, 'playground_data')}
                            rows={3}
                            style={{
                              width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                              outline: 'none', fontSize: '14px', resize: 'vertical'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--mono)' }}>BOSHLANG'ICH PROMPT (STARTER PROMPT)</label>
                          <textarea
                            value={steps[activeStepIndex].playground_data?.starterPrompt || ''}
                            onChange={e => updateActiveStepNested('starterPrompt', e.target.value, 'playground_data')}
                            rows={3}
                            style={{
                              width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                              outline: 'none', fontSize: '14px', resize: 'vertical'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--mono)' }}>SYSTEM HINT / YORDAMCHI TIZIM PROMPTI</label>
                          <input
                            type="text"
                            value={steps[activeStepIndex].playground_data?.systemHint || ''}
                            onChange={e => updateActiveStepNested('systemHint', e.target.value, 'playground_data')}
                            style={{
                              width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                              outline: 'none', fontSize: '14px'
                            }}
                          />
                        </div>
                      </>
                    )}

                    {/* 3. VIDEO TYPE FIELDS */}
                    {steps[activeStepIndex].type === 'video' && (
                      <>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--mono)' }}>YOUTUBE URL</label>
                          <input
                            type="text"
                            value={steps[activeStepIndex].video_data?.url || ''}
                            onChange={e => updateActiveStepNested('url', e.target.value, 'video_data')}
                            placeholder="https://www.youtube.com/watch?v=..."
                            style={{
                              width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                              outline: 'none', fontSize: '14px'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontFamily: 'var(--mono)' }}>KICHIK ESLATMA / NOTE</label>
                          <input
                            type="text"
                            value={steps[activeStepIndex].video_data?.note || ''}
                            onChange={e => updateActiveStepNested('note', e.target.value, 'video_data')}
                            placeholder="Video bo'yicha qo'shimcha eslatma..."
                            style={{
                              width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                              outline: 'none', fontSize: '14px'
                            }}
                          />
                        </div>
                      </>
                    )}

                    {/* 4. QUIZ TYPE FIELDS */}
                    {steps[activeStepIndex].type === 'quiz' && (
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '1.25rem' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Test Variantlari (Quiz Options)</div>
                        
                        {/* Savol matni */}
                        <div style={{ marginBottom: '1rem' }}>
                          <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontFamily: 'var(--mono)' }}>SAVOL MATNI</label>
                          <input
                            type="text"
                            value={steps[activeStepIndex].quiz_data?.question || ''}
                            onChange={e => {
                              const currentData = steps[activeStepIndex].quiz_data || {};
                              updateActiveStep('quiz_data', { ...currentData, question: e.target.value });
                            }}
                            style={{
                              width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff',
                              outline: 'none', fontSize: '14px'
                            }}
                          />
                        </div>

                        {/* Options */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {(steps[activeStepIndex].quiz_data?.options || []).map((opt: any, optIdx: number) => (
                            <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  const currentData = steps[activeStepIndex].quiz_data || {};
                                  const newOptions = (currentData.options || []).map((o: any, idx: number) => ({
                                    ...o,
                                    correct: idx === optIdx
                                  }));
                                  updateActiveStep('quiz_data', { ...currentData, options: newOptions });
                                }}
                                style={{
                                  width: '24px', height: '24px', borderRadius: '50%',
                                  border: opt.correct ? 'none' : '2px solid rgba(255,255,255,0.2)',
                                  background: opt.correct ? '#10b981' : 'transparent',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                }}
                              >
                                {opt.correct && <Check size={14} style={{ color: '#fff' }} />}
                              </button>
                              
                              <input
                                type="text"
                                value={opt.text}
                                onChange={e => {
                                  const currentData = steps[activeStepIndex].quiz_data || {};
                                  const newOptions = [...(currentData.options || [])];
                                  newOptions[optIdx] = { ...newOptions[optIdx], text: e.target.value };
                                  updateActiveStep('quiz_data', { ...currentData, options: newOptions });
                                }}
                                style={{
                                  flex: 1, padding: '8px 10px', background: 'rgba(255,255,255,0.02)',
                                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff',
                                  outline: 'none', fontSize: '13px'
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 5. FINALQUIZ TYPE FIELDS */}
                    {steps[activeStepIndex].type === 'finalquiz' && (
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Imtihon Savollari Ro'yxati ({steps[activeStepIndex].questions_data?.length || 0})</div>
                          <button
                            type="button"
                            onClick={addFinalQuizQuestion}
                            style={{
                              background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '4px',
                              padding: '4px 10px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                            }}
                          >
                            <Plus size={12} /> Savol Qo'shish
                          </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                          {(steps[activeStepIndex].questions_data || []).map((q: any, qIdx: number) => (
                            <div key={qIdx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '1rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>SAVOL #{qIdx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => deleteFinalQuizQuestion(qIdx)}
                                  style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11px' }}
                                >
                                  <Trash2 size={12} /> O'chirish
                                </button>
                              </div>

                              <input
                                type="text"
                                value={q.question}
                                onChange={e => updateFinalQuizQuestion(qIdx, { ...q, question: e.target.value })}
                                placeholder="Savol matni..."
                                style={{
                                  width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.02)',
                                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff',
                                  outline: 'none', fontSize: '13px', marginBottom: '8px'
                                }}
                              />

                              {/* Savol variantlari */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {(q.options || []).map((opt: any, optIdx: number) => (
                                  <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newOpts = q.options.map((o: any, oIdx: number) => ({
                                          ...o,
                                          correct: oIdx === optIdx
                                        }));
                                        updateFinalQuizQuestion(qIdx, { ...q, options: newOpts });
                                      }}
                                      style={{
                                        width: '18px', height: '18px', borderRadius: '50%',
                                        border: opt.correct ? 'none' : '2px solid rgba(255,255,255,0.2)',
                                        background: opt.correct ? '#10b981' : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                      }}
                                    >
                                      {opt.correct && <Check size={10} style={{ color: '#fff' }} />}
                                    </button>
                                    <input
                                      type="text"
                                      value={opt.text}
                                      onChange={e => {
                                        const newOpts = [...q.options];
                                        newOpts[optIdx] = { ...newOpts[optIdx], text: e.target.value };
                                        updateFinalQuizQuestion(qIdx, { ...q, options: newOpts });
                                      }}
                                      style={{
                                        flex: 1, padding: '6px 8px', background: 'rgba(255,255,255,0.01)',
                                        border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', color: '#fff',
                                        outline: 'none', fontSize: '12px'
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
