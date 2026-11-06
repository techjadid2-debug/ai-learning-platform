"use client";
import React, { useState } from 'react';
import type { QuizQuestion } from '../lessons';

interface FinalQuizProps {
  questions: QuizQuestion[];
  onSuccess: () => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

function scoreQuestion(q: QuizQuestion, answer: number | null, textAnswer: string): number {
  if (q.type === 'text') {
    if (!textAnswer.trim() || !q.keywords?.length) return 0;
    const lower = textAnswer.toLowerCase();
    return q.keywords.some(kw => lower.includes(kw.toLowerCase())) ? 2 : 0;
  }
  if (answer === null || !q.options) return 0;
  return q.options[answer]?.correct ? 1 : 0;
}

export default function FinalQuiz({ questions, onSuccess }: FinalQuizProps) {
  const [choiceAnswers, setChoiceAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [textAnswers, setTextAnswers] = useState<string[]>(() => questions.map(() => ''));
  const [submitted, setSubmitted] = useState(false);

  const choiceQ = questions.filter(q => !q.type || q.type === 'choice');
  const textQ = questions.filter(q => q.type === 'text');
  const maxPoints = choiceQ.length * 1 + textQ.length * 2;
  const passMark = Math.ceil(maxPoints * 0.7);

  const score = questions.reduce((acc, q, i) => {
    return acc + scoreQuestion(q, choiceAnswers[i], textAnswers[i]);
  }, 0);
  const passed = submitted && score >= passMark;

  const choiceAnsweredCount = questions.filter((q, i) => (!q.type || q.type === 'choice') && choiceAnswers[i] !== null).length;
  const textAnsweredCount = questions.filter((q, i) => q.type === 'text' && textAnswers[i].trim().length > 0).length;
  const allAnswered = choiceAnsweredCount === choiceQ.length && textAnsweredCount === textQ.length;

  const chooseOption = (qi: number, oi: number) => {
    if (submitted) return;
    setChoiceAnswers(prev => prev.map((a, i) => i === qi ? oi : a));
  };

  const check = () => {
    setSubmitted(true);
    const s = questions.reduce((acc, q, i) => acc + scoreQuestion(q, choiceAnswers[i], textAnswers[i]), 0);
    if (s >= passMark) onSuccess();
  };

  const retry = () => {
    setSubmitted(false);
    setChoiceAnswers(questions.map(() => null));
    setTextAnswers(questions.map(() => ''));
  };

  let choiceIdx = 0;
  let textIdx = 0;

  return (
    <div style={{ padding: '0.5rem 0' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Ball tizimi sarlavhasi */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '1.75rem', padding: '14px 18px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent)' }}>{choiceQ.length}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Belgilash<br/>(1 ball)</div>
          </div>
          <div style={{ width: '1px', background: 'var(--border)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#34A853' }}>{textQ.length}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Yozish<br/>(2 ball)</div>
          </div>
          <div style={{ width: '1px', background: 'var(--border)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)' }}>{maxPoints}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Jami<br/>ball</div>
          </div>
          <div style={{ width: '1px', background: 'var(--border)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)' }}>{choiceAnsweredCount + textAnsweredCount}<span style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 500 }}>/{questions.length}</span></div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Javob<br/>berildi</div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }}>O'tish uchun</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--amber)' }}>{passMark} ball</div>
          </div>
        </div>

        {/* Natija banneri */}
        {submitted && (
          <div style={{ marginBottom: '1.75rem', padding: '20px', borderRadius: '14px', textAlign: 'center', background: passed ? 'rgba(52,168,83,0.07)' : 'rgba(234,67,53,0.06)', border: `1.5px solid ${passed ? '#34A853' : '#EA4335'}` }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{passed ? '🎉' : '💪'}</div>
            <div style={{ fontWeight: 800, fontSize: '18px', color: passed ? '#34A853' : '#EA4335', marginBottom: '6px' }}>
              {passed ? 'Tabriklaymiz! Siz o\'tdingiz!' : 'Deyarli yetdingiz!'}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)', marginBottom: '4px' }}>
              {score} / {maxPoints} ball
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
              {passed ? 'Davom etishingiz mumkin!' : `O'tish uchun ${passMark} ball kerak. Qayta urinib ko'ring.`}
            </div>
          </div>
        )}

        {/* Zaif mavzular xulosasi (muvaffaqiyatsiz bo'lganda) */}
        {submitted && !passed && (() => {
          const weakMap: Record<string, number> = {};
          questions.forEach((q, i) => {
            const earned = scoreQuestion(q, choiceAnswers[i], textAnswers[i]);
            const max = q.type === 'text' ? 2 : 1;
            if (earned < max && q.lesson) {
              weakMap[q.lesson] = (weakMap[q.lesson] || 0) + 1;
            }
          });
          const weakLessons = Object.entries(weakMap).sort((a, b) => b[1] - a[1]);
          if (weakLessons.length === 0) return null;
          return (
            <div style={{ marginBottom: '1.75rem', padding: '14px 18px', background: 'rgba(234,67,53,0.04)', border: '1px solid rgba(234,67,53,0.18)', borderRadius: '12px' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#EA4335', marginBottom: '10px' }}>❗ Qaytib o&apos;qish tavsiya etiladi:</div>
              {weakLessons.map(([lesson, count]) => (
                <div key={lesson} style={{ fontSize: '13px', color: 'var(--text)', padding: '3px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>• <strong>{lesson}</strong></span>
                  <span style={{ color: 'var(--muted)' }}>{count} ta savol xato</span>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Savollar */}
        {questions.map((q, qi) => {
          const isText = q.type === 'text';
          const qNum = isText ? (++textIdx) : (++choiceIdx);
          const label = isText ? `Yozma savol ${qNum}` : `${qNum}-savol`;
          const earned = submitted ? scoreQuestion(q, choiceAnswers[qi], textAnswers[qi]) : null;
          const maxEarnable = isText ? 2 : 1;

          return (
            <div key={qi} style={{ marginBottom: '2rem', padding: '18px 20px', background: 'var(--bg)', border: `1.5px solid ${submitted && earned !== null ? (earned === maxEarnable ? '#34A853' : earned > 0 ? '#FBBC05' : '#EA4335') : 'var(--border)'}`, borderRadius: '14px' }}>

              {/* Savol sarlavhasi */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
                  <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: isText ? 'rgba(52,168,83,0.12)' : 'rgba(66,133,244,0.1)', color: isText ? '#34A853' : 'var(--accent)', fontSize: '12px', fontWeight: 700 }}>
                    {isText ? '✍' : qNum}
                  </span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', color: isText ? '#34A853' : 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {label} · {isText ? '2 ball' : '1 ball'}
                      </span>
                      {q.lesson && (
                        <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '99px', background: 'rgba(66,133,244,0.08)', color: 'var(--accent)', fontWeight: 600, border: '1px solid rgba(66,133,244,0.2)' }}>
                          {q.lesson}
                        </span>
                      )}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--ink)', lineHeight: 1.5 }}>{q.question}</div>
                  </div>
                </div>
                {submitted && earned !== null && (
                  <div style={{ flexShrink: 0, fontWeight: 800, fontSize: '16px', color: earned === maxEarnable ? '#34A853' : earned > 0 ? '#FBBC05' : '#EA4335', marginLeft: '10px' }}>
                    +{earned}
                  </div>
                )}
              </div>

              {/* Belgilash (a,b,c,d) */}
              {!isText && q.options && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '38px' }}>
                  {q.options.map((opt, oi) => {
                    const chosen = choiceAnswers[qi] === oi;
                    let borderColor = 'var(--border)';
                    let bgColor = 'var(--surface)';
                    let textColor = 'var(--text)';
                    if (submitted) {
                      if (opt.correct) { borderColor = '#34A853'; bgColor = 'rgba(52,168,83,0.07)'; textColor = '#34A853'; }
                      else if (chosen) { borderColor = '#EA4335'; bgColor = 'rgba(234,67,53,0.06)'; textColor = '#EA4335'; }
                    } else if (chosen) {
                      borderColor = 'var(--accent)'; bgColor = 'rgba(66,133,244,0.07)'; textColor = 'var(--accent)';
                    }
                    return (
                      <button key={oi} onClick={() => chooseOption(qi, oi)} disabled={submitted} style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', padding: '12px 16px', borderRadius: '10px', border: `1.5px solid ${borderColor}`, background: bgColor, color: textColor, cursor: submitted ? 'default' : 'pointer', fontSize: '14px', fontFamily: 'var(--sans)', transition: 'all 0.12s' }}>
                        <span style={{ flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${borderColor}`, background: chosen && !submitted ? 'var(--accent)' : submitted && opt.correct ? '#34A853' : submitted && chosen && !opt.correct ? '#EA4335' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: (chosen || (submitted && opt.correct)) ? '#fff' : borderColor }}>
                          {OPTION_LABELS[oi]}
                        </span>
                        {opt.text}
                        {submitted && opt.correct && <span style={{ marginLeft: 'auto', fontSize: '16px' }}>✓</span>}
                        {submitted && chosen && !opt.correct && <span style={{ marginLeft: 'auto', fontSize: '16px' }}>✕</span>}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Yozma savol */}
              {isText && (
                <div style={{ paddingLeft: '38px' }}>
                  <textarea
                    value={textAnswers[qi]}
                    onChange={e => {
                      if (submitted) return;
                      setTextAnswers(prev => prev.map((a, i) => i === qi ? e.target.value : a));
                    }}
                    disabled={submitted}
                    placeholder="Javobingizni yozing..."
                    rows={3}
                    style={{ width: '100%', padding: '12px 14px', background: submitted ? 'var(--surface)' : 'var(--bg)', border: `1.5px solid ${submitted ? (earned! > 0 ? '#34A853' : '#EA4335') : 'var(--border)'}`, borderRadius: '10px', color: 'var(--text)', fontFamily: 'var(--sans)', fontSize: '14px', outline: 'none', resize: 'vertical', lineHeight: 1.5, transition: 'border-color 0.15s', boxSizing: 'border-box' }}
                    onFocus={e => { if (!submitted) e.target.style.borderColor = '#34A853'; }}
                    onBlur={e => { if (!submitted) e.target.style.borderColor = 'var(--border)'; }}
                  />
                  {submitted && q.modelAnswer && (
                    <div style={{ marginTop: '10px', padding: '12px 14px', background: 'rgba(52,168,83,0.07)', border: '1px solid rgba(52,168,83,0.3)', borderRadius: '8px', fontSize: '13px', color: 'var(--text)', lineHeight: 1.6 }}>
                      <span style={{ fontWeight: 700, color: '#34A853' }}>✓ To'g'ri javob: </span>
                      {q.modelAnswer}
                    </div>
                  )}
                  {submitted && earned === 0 && (
                    <div style={{ marginTop: '8px', padding: '10px 12px', background: 'rgba(234,67,53,0.05)', border: '1px solid rgba(234,67,53,0.2)', borderRadius: '8px', fontSize: '12px', lineHeight: 1.6 }}>
                      <span style={{ color: '#EA4335', fontWeight: 600 }}>Javobingizda kalit so&apos;zlar topilmadi.</span>
                      {q.keywords && q.keywords.length > 0 && (
                        <div style={{ marginTop: '4px', color: 'var(--muted)' }}>
                          Kutilgan kalit so&apos;zlar: <span style={{ color: 'var(--text)', fontWeight: 500 }}>{q.keywords.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Tugmalar */}
        <div style={{ paddingTop: '8px' }}>
          {!submitted ? (
            <button onClick={check} disabled={!allAnswered} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: allAnswered ? 'var(--accent)' : 'var(--surface2)', color: allAnswered ? '#fff' : 'var(--muted)', cursor: allAnswered ? 'pointer' : 'not-allowed', fontFamily: 'var(--sans)', fontSize: '16px', fontWeight: 700, transition: 'all 0.15s' }}>
              {allAnswered ? `✓ Tekshirish (${questions.length} savol)` : `${choiceAnsweredCount + textAnsweredCount}/${questions.length} javob berildi`}
            </button>
          ) : !passed ? (
            <button onClick={retry} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1.5px solid var(--accent)', background: 'transparent', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: '16px', fontWeight: 700 }}>
              ↻ Qayta urinish
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
