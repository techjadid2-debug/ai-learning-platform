"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Editor from '@monaco-editor/react';
import Script from 'next/script';
import { useParams, useRouter } from 'next/navigation';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { saveLastLesson, toggleBookmark, isBookmarked } from '../../../lib/progress';
import { Bookmark, X, ChevronLeft, ChevronRight, Zap, Menu } from 'lucide-react';
import { getCourseById } from '../../../courses';
import Playground from '../../../components/Playground';
import FinalQuiz from '../../../components/FinalQuiz';
import CourseSidebar from '../../../components/CourseSidebar';

interface PyodideRunner {
  loadPackagesFromImports: (code: string) => Promise<void>;
  runPythonAsync: (code: string) => Promise<unknown>;
  globals: {
    set: (name: string, value: any) => void;
    get: (name: string) => any;
    delete: (name: string) => void;
  };
}

// YouTube havolasini embed formatiga aylantirish
function toEmbedUrl(url: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  if (/^[\w-]{11}$/.test(url)) return `https://www.youtube.com/embed/${url}`;
  return url; // allaqachon embed yoki boshqa havola
}

// Matn ichidagi **bold** va `code` ni render qilish
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((p, j) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={j}>{p.slice(2, -2)}</strong>;
    if (p.startsWith('`') && p.endsWith('`')) return <code key={j} className="lesson-inline-code">{p.slice(1, -1)}</code>;
    return <span key={j}>{p}</span>;
  });
}

// Markdown-uslubidagi nazariya matnini chiroyli bloklarga aylantirish
function renderRich(text: string): React.ReactNode {
  const lines = text.split('\n');
  const out: React.ReactNode[] = [];
  let i = 0, key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith('```')) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) { code.push(lines[i]); i++; }
      i++;
      out.push(<pre key={key++} className="lesson-code">{code.join('\n')}</pre>);
      continue;
    }
    if (line.trim() === '') { i++; continue; }
    if (line.trimStart().startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trimStart().startsWith('- ')) { items.push(lines[i].trimStart().slice(2)); i++; }
      out.push(<ul key={key++} className="lesson-ul">{items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}</ul>);
      continue;
    }
    if (/^\d+\.\s/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^\d+\.\s/, '')); i++; }
      out.push(<ol key={key++} className="lesson-ol">{items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}</ol>);
      continue;
    }
    const t = line.trim();
    if (t.startsWith('**') && t.endsWith('**') && t.length > 4) {
      out.push(<h3 key={key++} className="lesson-h3">{t.slice(2, -2)}</h3>);
      i++; continue;
    }
    out.push(<p key={key++} className="lesson-p">{renderInline(line)}</p>);
    i++;
  }
  return out;
}

export default function CodeLessonPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { t } = useAppContext();
  const { user, addXp, markLessonComplete, completedLessons } = useAuth();

  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nextId, setNextId] = useState<string | null>(null);
  const [prevId, setPrevId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [pyodide, setPyodide] = useState<PyodideRunner | null>(null);
  const [output, setOutput] = useState('');
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [stepPassed, setStepPassed] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<boolean | null>(null);
  const [xpEarned, setXpEarned] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'theory' | 'code' | 'output'>('theory');
  const [allCourseLessons, setAllCourseLessons] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const { getDBLessonById, getDBLessons } = await import('../../../lib/db');
        const currentLesson = await getDBLessonById(id);
        if (currentLesson) {
          setLesson(currentLesson);
          const courseLessons = await getDBLessons(currentLesson.course);
          setAllCourseLessons(courseLessons);
          const idx = courseLessons.findIndex(l => l.id === id);
          if (idx >= 0) {
            setNextId(idx < courseLessons.length - 1 ? courseLessons[idx + 1].id : null);
            setPrevId(idx > 0 ? courseLessons[idx - 1].id : null);
          }
        }
      } catch (err) {
        console.error('Error loading dynamic lesson:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  useEffect(() => {
    if (lesson) setBookmarked(isBookmarked(lesson.id));
  }, [lesson?.id]);

  useEffect(() => {
    if (lesson) saveLastLesson(lesson.id);
  }, [lesson?.id]);

  useEffect(() => {
    if (lesson && completedLessons.includes(lesson.id)) setXpEarned(true);
  }, [lesson?.id, completedLessons]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setActiveTab('theory');
  }, [step]);

  const currentStep = lesson?.steps[step];
  const hasCodeStep = lesson?.steps.some((s: any) => s.type === 'code') ?? false;
  const isLastStep = lesson ? step === lesson.steps.length - 1 : false;
  const isCodeDesktop = currentStep?.type === 'code' && !isMobile;

  // Load code for current step
  useEffect(() => {
    if (currentStep?.type === 'code' && currentStep.code) {
      setCode(currentStep.code);
    }
    setStepPassed(false);
    setQuizAnswer(null);
    setOutput('');
  }, [step, id, lesson]);

  // After run, re-check output from pyodide captured text (only for non-JSON constraints)
  useEffect(() => {
    if (currentStep?.type === 'code' && currentStep.successCheck) {
      let isJsonTest = false;
      try {
        const trimmed = currentStep.successCheck.trim();
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
          const testConfig = JSON.parse(trimmed);
          isJsonTest = !!(testConfig.tests || testConfig.cases);
        }
      } catch (e) {}
      
      if (!isJsonTest) {
        if (output.includes(currentStep.successCheck)) {
          setStepPassed(true);
        }
      }
    }
  }, [output, currentStep]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text)', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner" aria-label="Yuklanmoqda" />
        <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--muted)' }}>Dars yuklanmoqda...</span>
      </div>
    );
  }

  const handlePyodideLoad = async () => {
    try {
      const loader = (window as unknown as { loadPyodide: (opts: unknown) => Promise<PyodideRunner> }).loadPyodide;
      const py = await loader({
        stdout: (msg: string) => setOutput(prev => prev + msg + '\n'),
        stderr: (msg: string) => setOutput(prev => prev + '❌ ' + msg + '\n'),
      });
      setPyodide(py);
      setOutput('✅ Python muhiti tayyor!\n');
    } catch (e: unknown) {
      setOutput('❌ Yuklanmadi: ' + (e instanceof Error ? e.message : String(e)));
    }
  };

  const runCode = async () => {
    if (!pyodide) return;
    setIsRunning(true);
    setOutput('');
    if (isMobile) {
      setActiveTab('output');
    }
    try {
      await pyodide.loadPackagesFromImports(code);

      let isJsonTest = false;
      let testConfig: any = null;
      if (currentStep?.successCheck) {
        try {
          const trimmed = currentStep.successCheck.trim();
          if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
            testConfig = JSON.parse(trimmed);
            isJsonTest = !!(testConfig.tests || testConfig.cases);
          }
        } catch (e) {}
      }

      if (isJsonTest && testConfig) {
        setOutput('🧪 Test keyslarni ishga tushirish...\n');
        
        pyodide.globals.set('__user_code__', code);
        let pyScript = '';
        
        if (testConfig.type === 'function') {
          const funcName = testConfig.name || testConfig.functionName;
          const cases = testConfig.tests || testConfig.cases;
          pyodide.globals.set('__func_name__', funcName);
          pyodide.globals.set('__cases__', JSON.stringify(cases));
          
          pyScript = `
import json
import sys
import io

cases = json.loads(__cases__)
glb = {}
exec(__user_code__, glb)

results = []
for idx, case in enumerate(cases):
    args = case.get('args', [])
    expected = case.get('expected')
    
    success = True
    error_msg = ""
    res_val = None
    try:
        func = glb[__func_name__]
        res_val = func(*args)
    except Exception as e:
        success = False
        error_msg = str(e)
        
    results.append({
        "success": success,
        "result": res_val,
        "expected": expected,
        "args": args,
        "error": error_msg
    })
results_json = json.dumps(results)
`;
        } else {
          const cases = testConfig.tests || testConfig.cases;
          pyodide.globals.set('__cases__', JSON.stringify(cases));
          
          pyScript = `
import json
import sys
import io
import builtins

cases = json.loads(__cases__)
results = []

for idx, case in enumerate(cases):
    input_str = case.get('input', '')
    expected_output = case.get('output', '')
    
    orig_stdout = sys.stdout
    orig_input = builtins.input
    
    input_lines = input_str.split('\\n')
    input_idx = 0
    def mock_input(prompt=""):
        nonlocal input_idx
        if input_idx < len(input_lines):
            val = input_lines[input_idx]
            input_idx += 1
            return val
        raise EOFError("No more inputs")
        
    builtins.input = mock_input
    captured = io.StringIO()
    sys.stdout = captured
    
    success = True
    error_msg = ""
    try:
        exec(__user_code__, {})
    except Exception as e:
        success = False
        error_msg = str(e)
    
    sys.stdout = orig_stdout
    builtins.input = orig_input
    
    results.append({
        "success": success,
        "output": captured.getvalue(),
        "expected": expected_output,
        "input": input_str,
        "error": error_msg
    })
results_json = json.dumps(results)
`;
        }

        await pyodide.runPythonAsync(pyScript);
        const resultsJson = pyodide.globals.get('results_json');
        const results = JSON.parse(resultsJson);

        pyodide.globals.delete('__user_code__');
        pyodide.globals.delete('__cases__');
        if (testConfig.type === 'function') {
          pyodide.globals.delete('__func_name__');
        }
        pyodide.globals.delete('results_json');

        let allPassed = true;
        let consoleOutput = '🧪 Test natijalari:\n\n';

        results.forEach((test: any, idx: number) => {
          const caseNum = idx + 1;
          if (testConfig.type === 'function') {
            const argsStr = JSON.stringify(test.args);
            if (test.success) {
              const actualStr = JSON.stringify(test.result);
              const expectedStr = JSON.stringify(test.expected);
              if (actualStr === expectedStr) {
                consoleOutput += `✅ Test Case ${caseNum}: ${testConfig.name || 'function'}(${argsStr.slice(1, -1)}) -> ${actualStr} (Muvaffaqiyatli)\n`;
              } else {
                allPassed = false;
                consoleOutput += `❌ Test Case ${caseNum}: ${testConfig.name || 'function'}(${argsStr.slice(1, -1)})\n   Kutildi: ${expectedStr}\n   Olingan: ${actualStr}\n`;
              }
            } else {
              allPassed = false;
              consoleOutput += `❌ Test Case ${caseNum}: ${testConfig.name || 'function'}(${argsStr.slice(1, -1)}) -> Xatolik: ${test.error}\n`;
            }
          } else {
            const expected = (test.expected || '').trim();
            const got = (test.output || '').trim();
            if (test.success) {
              if (got.includes(expected)) {
                consoleOutput += `✅ Test Case ${caseNum}: Kirish: "${test.input.replace(/\n/g, ' ')}" -> Chiqish mos keldi (Muvaffaqiyatli)\n`;
              } else {
                allPassed = false;
                consoleOutput += `❌ Test Case ${caseNum}: Kirish: "${test.input.replace(/\n/g, ' ')}"\n   Kutilgan: "${expected}"\n   Olingan: "${got}"\n`;
              }
            } else {
              allPassed = false;
              consoleOutput += `❌ Test Case ${caseNum}: Kirish: "${test.input.replace(/\n/g, ' ')}" -> Xatolik: ${test.error}\n`;
            }
          }
        });

        if (allPassed) {
          consoleOutput += '\n🎉 Tabriklaymiz! Barcha testlar muvaffaqiyatli yakunlandi.';
          setStepPassed(true);
        } else {
          consoleOutput += '\n⚠️ Ayrim testlar muvaffaqiyatsiz yakunlandi. Kodni tekshiring.';
          setStepPassed(false);
        }
        setOutput(consoleOutput);

      } else {
        await pyodide.runPythonAsync(code);
        if (!currentStep?.successCheck && !stepPassed) {
          setStepPassed(true);
        }
      }
    } catch (e: unknown) {
      setOutput(prev => prev + '❌ XATOLIK:\n' + (e instanceof Error ? e.message : String(e)));
    }
    setIsRunning(false);
  };

  const completeLesson = () => {
    if (!lesson || xpEarned) return;
    addXp(lesson.xp);
    markLessonComplete(lesson.id);
    setXpEarned(true);
  };

  const handleNext = () => {
    if (isLastStep) {
      completeLesson();
    } else {
      setStep(s => s + 1);
    }
  };

  const goNextLesson = () => {
    if (!xpEarned) completeLesson();
    if (nextId) router.push(`/code-lesson/${nextId}`);
    else if (lesson) router.push(`/course/${getCourseById(lesson.course)?.slug || ''}`);
    else router.push('/');
  };

  const canProceed = () => {
    if (!currentStep) return false;
    if (currentStep.type === 'info') return true;
    if (currentStep.type === 'video') return true;
    if (currentStep.type === 'code') return stepPassed;
    if (currentStep.type === 'playground') return stepPassed;
    if (currentStep.type === 'finalquiz') return stepPassed;
    if (currentStep.type === 'quiz') return quizAnswer === true;
    return false;
  };

  if (!lesson) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text)', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ fontSize: '3rem' }}>🔍</div>
        <h2 style={{ fontFamily: 'var(--sans)', fontWeight: 700 }}>{t('lr.notFound')}: {id}</h2>
        <Link href="/" style={{ color: 'var(--accent)' }}>← {t('common.home')}</Link>
      </div>
    );
  }

  const course = getCourseById(lesson.course);
  const exitHref = `/course/${course?.slug || ''}`;
  const stepTypeLabel: Record<string, string> = { video: 'Video', info: 'Nazariya', quiz: 'Test', finalquiz: 'Imtihon', playground: 'Amaliyot', code: 'Kod' };
  const typeLabel = stepTypeLabel[currentStep?.type] || 'Qadam';
  const proceed = canProceed();
  const totalDone = allCourseLessons.filter(l => completedLessons.includes(l.id)).length;

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px', background: 'var(--bg)', color: 'var(--text)' }}>
      {hasCodeStep && <Script src="https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js" onLoad={handlePyodideLoad} />}

      <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>

        {/* Chap sidebar — faqat desktop */}
        {!isMobile && allCourseLessons.length > 0 && (
          <CourseSidebar
            courseId={lesson.course}
            courseSlug={course?.slug || ''}
            courseName={course?.title || ''}
            courseColor={course?.color || 'var(--accent)'}
            currentLessonId={lesson.id}
            lessons={allCourseLessons}
            completedLessons={completedLessons}
            totalDone={totalDone}
          />
        )}

        {/* O'ng tomon: top bar + content + bottom bar */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

          {/* Top bar */}
          <div style={{ flexShrink: 0, height: '56px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 1.25rem', background: 'var(--surface)' }}>
            {/* Mobile: sidebar ochish tugmasi */}
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)} aria-label="Darslar ro'yxati"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', padding: 0 }}>
                <Menu size={20} />
              </button>
            )}

            <Link href={exitHref} aria-label="Yopish" style={{ color: 'var(--muted)', display: 'flex' }}><X size={22} /></Link>

            <button className="lesson-nav-arrow" onClick={() => step > 0 && setStep(s => s - 1)} aria-label="Oldingi qadam" disabled={step === 0}
              style={{ background: 'transparent', border: 'none', cursor: step === 0 ? 'default' : 'pointer', color: step === 0 ? 'var(--border-hover)' : 'var(--muted)' }}>
              <ChevronLeft size={20} />
            </button>

            <div style={{ flex: 1, display: 'flex', gap: '6px', maxWidth: '600px', margin: '0 auto' }}>
              {lesson.steps.map((_: any, i: number) => (
                <div key={i} style={{ flex: 1, height: '7px', borderRadius: '100px', background: i <= step ? 'var(--accent)' : 'var(--surface2)', transition: 'background 0.3s' }} />
              ))}
            </div>

            <button className="lesson-nav-arrow" onClick={() => proceed && !isLastStep && setStep(s => s + 1)} aria-label="Keyingi qadam" disabled={!proceed || isLastStep}
              style={{ background: 'transparent', border: 'none', cursor: (!proceed || isLastStep) ? 'default' : 'pointer', color: (!proceed || isLastStep) ? 'var(--border-hover)' : 'var(--muted)' }}>
              <ChevronRight size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--amber)', fontWeight: 700 }}>
                {user ? user.xp : 0} <Zap size={14} fill="var(--amber)" />
              </span>
              <button onClick={() => setBookmarked(toggleBookmark(lesson.id).includes(lesson.id))} aria-label="Saqlash"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: bookmarked ? 'var(--amber)' : 'var(--muted)', display: 'flex' }}>
                <Bookmark size={18} fill={bookmarked ? 'var(--amber)' : 'none'} />
              </button>
            </div>
          </div>

          {/* Content wrapper */}
          {isCodeDesktop ? (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div style={{ width: '42%', padding: '2.5rem 2rem 5rem', overflowY: 'auto', borderRight: '1px solid var(--border)', background: 'var(--bg)' }}>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: 'var(--muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ background: 'var(--surface2)', padding: '2px 8px', borderRadius: '100px', fontSize: '11px' }}>{typeLabel}</span>
              <span>{step + 1}/{lesson.steps.length}</span>
            </div>
            <h1 style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '1.25rem', lineHeight: 1.2 }}>
              {currentStep?.title}
            </h1>
            <div className="lesson-body">{renderRich(currentStep.content)}</div>
            {xpEarned && (
              <div style={{ padding: '14px 18px', background: 'rgba(199,127,10,0.08)', border: '1px solid var(--amber)', borderRadius: '12px', color: 'var(--amber)', fontSize: '14px', marginTop: '1.5rem', textAlign: 'center', fontWeight: 600 }}>
                🎉 +{lesson.xp} {t('lr.xpAdded')}
              </div>
            )}
          </div>
          <div style={{ width: '58%', display: 'flex', flexDirection: 'column', background: '#1e1e1e', borderLeft: '1px solid #2a2a2a', height: '100%' }}>
            <div style={{ background: '#1e1e1e', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #2d2d2d' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: '#858585' }}>main.py</span>
              <button onClick={runCode} disabled={!pyodide || isRunning} style={{ background: (!pyodide || isRunning) ? '#333' : 'var(--accent)', color: (!pyodide || isRunning) ? '#666' : '#fff', border: 'none', padding: '7px 16px', borderRadius: '6px', cursor: (!pyodide || isRunning) ? 'not-allowed' : 'pointer', fontFamily: 'var(--mono)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                {isRunning ? '⏳ Ishlamoqda...' : '▶ Ishga tushirish'}
              </button>
            </div>
            <div style={{ flex: 1, position: 'relative', minHeight: '200px' }}>
              <Editor height="100%" theme="vs-dark" language="python" value={code} onChange={v => setCode(v || '')} options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: "'Space Mono', monospace", padding: { top: 12 } }} />
            </div>
            <div style={{ height: '220px', background: '#0a0a0f', display: 'flex', flexDirection: 'column', borderTop: '1px solid #2d2d2d' }}>
              <div style={{ padding: '6px 20px', background: '#111117', fontFamily: 'var(--mono)', fontSize: '10px', color: '#666', letterSpacing: '0.1em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>TERMINAL</span>
                {stepPassed && <span style={{ color: 'var(--accent2)', fontWeight: 'bold' }}>{t('lr.codeOk')}</span>}
              </div>
              <div style={{ flex: 1, padding: '12px 20px', fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#d4d4d4', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                {output || 'Kodni ishga tushiring...\n'}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2.5rem 1.5rem 7rem' }}>
            <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: 'var(--muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ background: 'var(--surface2)', padding: '2px 8px', borderRadius: '100px', fontSize: '11px' }}>{typeLabel}</span>
              <span>{step + 1}/{lesson.steps.length}</span>
            </div>
            <h1 style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2rem)', letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '1.25rem', lineHeight: 1.2 }}>
              {currentStep?.title}
            </h1>
            {currentStep?.type === 'video' && (
              <>
                {currentStep.content && <p className="lesson-p" style={{ marginBottom: '1.5rem' }}>{renderInline(currentStep.content)}</p>}
                {(() => {
                  const embed = toEmbedUrl(currentStep.video?.url || '');
                  return embed ? (
                    <div style={{ width: '100%', aspectRatio: '16 / 9', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                      <iframe src={embed} title={currentStep.title} width="100%" height="100%" style={{ border: 'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    </div>
                  ) : (
                    <div style={{ width: '100%', aspectRatio: '16 / 9', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--surface2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--muted)' }}>
                      <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>🎬</div>
                      <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>{t('lr.videoLesson')}</div>
                      <div style={{ fontSize: '13px' }}>{currentStep.video?.note || t('lr.videoSoon')}</div>
                    </div>
                  );
                })()}
              </>
            )}
            {currentStep?.type === 'info' && <div className="lesson-body">{renderRich(currentStep.content)}</div>}
            {currentStep?.type === 'quiz' && currentStep.quiz && (
              <div>
                {currentStep.content && <div className="lesson-body" style={{ marginBottom: '1rem' }}>{renderRich(currentStep.content)}</div>}
                <p style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--ink)', fontSize: '1.05rem' }}>{currentStep.quiz.question}</p>
                {currentStep.quiz.options.map((opt: any, i: number) => (
                  <button key={i} disabled={quizAnswer !== null} onClick={() => setQuizAnswer(opt.correct)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '13px 16px', marginBottom: '10px', borderRadius: '10px', border: '1px solid', cursor: quizAnswer !== null ? 'default' : 'pointer', fontFamily: 'var(--sans)', fontSize: '14px', background: quizAnswer !== null && opt.correct ? 'rgba(22,163,74,0.08)' : quizAnswer !== null && !opt.correct ? 'rgba(224,70,62,0.06)' : 'var(--surface)', borderColor: quizAnswer !== null && opt.correct ? 'var(--accent2)' : quizAnswer !== null && !opt.correct ? 'var(--accent3)' : 'var(--border)', color: 'var(--text)', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}>
                    {opt.text}
                  </button>
                ))}
                {quizAnswer === true && <p style={{ color: 'var(--accent2)', fontSize: '14px', marginTop: '8px', fontWeight: 600 }}>{t('quiz.correct')}</p>}
                {quizAnswer === false && <p style={{ color: 'var(--accent3)', fontSize: '14px', marginTop: '8px', fontWeight: 600 }}>{t('quiz.wrong')}</p>}
              </div>
            )}
            {currentStep?.type === 'finalquiz' && currentStep.questions && (
              <div>
                {currentStep.content && <div className="lesson-body" style={{ marginBottom: '1.5rem' }}>{renderRich(currentStep.content)}</div>}
                <FinalQuiz questions={currentStep.questions} onSuccess={() => setStepPassed(true)} />
              </div>
            )}
            {currentStep?.type === 'playground' && currentStep.playground && (
              <div>
                {currentStep.content && <div className="lesson-body" style={{ marginBottom: '1.25rem' }}>{renderRich(currentStep.content)}</div>}
                <div style={{ height: '520px' }}>
                  <Playground task={currentStep.playground.task} starterPrompt={currentStep.playground.starterPrompt} systemHint={currentStep.playground.systemHint} onSuccess={() => setStepPassed(true)} />
                </div>
              </div>
            )}
            {currentStep?.type === 'code' && (
              <div>
                {isMobile ? (
                  <div>
                    <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface2)', marginBottom: '1.25rem', borderRadius: '8px', overflow: 'hidden', padding: '4px' }}>
                      <button onClick={() => setActiveTab('theory')} style={{ flex: 1, padding: '8px 12px', border: 'none', borderRadius: '6px', background: activeTab === 'theory' ? 'var(--surface)' : 'transparent', color: activeTab === 'theory' ? 'var(--accent)' : 'var(--muted)', fontWeight: activeTab === 'theory' ? 'bold' : 'normal', fontSize: '13px', cursor: 'pointer' }}>{t('lr.theory')}</button>
                      <button onClick={() => setActiveTab('code')} style={{ flex: 1, padding: '8px 12px', border: 'none', borderRadius: '6px', background: activeTab === 'code' ? 'var(--surface)' : 'transparent', color: activeTab === 'code' ? 'var(--accent)' : 'var(--muted)', fontWeight: activeTab === 'code' ? 'bold' : 'normal', fontSize: '13px', cursor: 'pointer' }}>{t('lr.practice')}</button>
                      <button onClick={() => setActiveTab('output')} style={{ flex: 1, padding: '8px 12px', border: 'none', borderRadius: '6px', background: activeTab === 'output' ? 'var(--surface)' : 'transparent', color: activeTab === 'output' ? 'var(--accent)' : 'var(--muted)', fontWeight: activeTab === 'output' ? 'bold' : 'normal', fontSize: '13px', cursor: 'pointer' }}>{t('lesson.terminal')}</button>
                    </div>
                    {activeTab === 'theory' && currentStep.content && <div className="lesson-body">{renderRich(currentStep.content)}</div>}
                    {activeTab === 'code' && (
                      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #2a2a2a' }}>
                        <div style={{ background: '#1e1e1e', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: '#858585' }}>main.py</span>
                          <button onClick={runCode} disabled={!pyodide || isRunning} style={{ background: (!pyodide || isRunning) ? '#333' : 'var(--accent)', color: (!pyodide || isRunning) ? '#666' : '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: (!pyodide || isRunning) ? 'not-allowed' : 'pointer', fontFamily: 'var(--mono)', fontSize: '12px' }}>{isRunning ? '⏳ Ishlamoqda...' : '▶ Ishga tushirish'}</button>
                        </div>
                        <Editor height="320px" theme="vs-dark" language="python" value={code} onChange={v => setCode(v || '')} options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: "'Space Mono', monospace", padding: { top: 12 } }} />
                      </div>
                    )}
                    {activeTab === 'output' && (
                      <div>
                        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #2a2a2a', background: '#0a0a0f', minHeight: '220px', padding: '12px 16px', fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#d4d4d4', whiteSpace: 'pre-wrap' }}>{output || 'Natija ko\'rish uchun kodni ishga tushiring.'}</div>
                        {stepPassed && <div style={{ padding: '12px 16px', background: 'rgba(22,163,74,0.08)', border: '1px solid var(--accent2)', borderRadius: '10px', color: 'var(--accent2)', fontSize: '14px', marginTop: '1rem', fontWeight: 600 }}>{t('lr.codeOk')}</div>}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}
            {xpEarned && (
              <div style={{ padding: '14px 18px', background: 'rgba(199,127,10,0.08)', border: '1px solid var(--amber)', borderRadius: '12px', color: 'var(--amber)', fontSize: '14px', marginTop: '1.5rem', textAlign: 'center', fontWeight: 600 }}>
                🎉 +{lesson.xp} {t('lr.xpAdded')}
              </div>
            )}
          </div>
        </div>
      )}

          {/* Bottom bar */}
          <div style={{ flexShrink: 0, borderTop: '1px solid var(--border)', background: 'var(--surface)', padding: '0.85rem 1.5rem' }}>
            <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
              <button onClick={() => step > 0 ? setStep(s => s - 1) : (prevId && router.push(`/code-lesson/${prevId}`))} className="btn-secondary" style={{ padding: '11px 20px' }}>{t('lr.prev')}</button>
              {isLastStep ? (
                <button onClick={goNextLesson} disabled={!proceed && !xpEarned} className="btn-primary" style={{ padding: '11px 22px', background: (proceed || xpEarned) ? 'var(--accent)' : 'var(--surface2)', color: (proceed || xpEarned) ? '#fff' : 'var(--muted)', cursor: (proceed || xpEarned) ? 'pointer' : 'not-allowed', boxShadow: 'none' }}>
                  {nextId ? t('lr.next') : t('lr.finish')}
                </button>
              ) : (
                <button onClick={handleNext} disabled={!proceed} className="btn-primary" style={{ padding: '11px 22px', background: proceed ? 'var(--accent)' : 'var(--surface2)', color: proceed ? '#fff' : 'var(--muted)', cursor: proceed ? 'pointer' : 'not-allowed', boxShadow: 'none' }}>
                  {t('lr.continueBtn')}
                </button>
              )}
            </div>
          </div>

        </div>{/* /content column */}
      </div>{/* /flex row */}

      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <>
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, top: '64px' }}
          />
          <div style={{ position: 'fixed', top: '64px', left: 0, bottom: 0, width: '280px', zIndex: 201, overflowY: 'auto', borderRight: '1px solid var(--border)', background: 'var(--surface)' }}>
            <CourseSidebar
              courseId={lesson.course}
              courseSlug={course?.slug || ''}
              courseName={course?.title || ''}
              courseColor={course?.color || 'var(--accent)'}
              currentLessonId={lesson.id}
              lessons={allCourseLessons}
              completedLessons={completedLessons}
              totalDone={totalDone}
            />
          </div>
        </>
      )}
    </div>
  );
}
