"use client";
import React from 'react';
import Link from 'next/link';
import Phases from './Phases';
import Glossary from './Glossary';
import ProgressTrack from './ProgressTrack';
import ContinueLearning from './ContinueLearning';
import { tools, phases, glossary } from '../data';
import { useAppContext } from '../app/contexts/AppContext';

export default function AiEngLanding() {
  const { t } = useAppContext();

  const phaseCount = phases.length;
  const topicCount = phases.reduce((sum, p) => sum + p.topics.length, 0);
  // Noyob atamalar: lug'at + har mavzudagi terms pillalari
  const allTerms = new Set<string>();
  glossary.forEach((g: { t: string }) => allTerms.add(g.t.toLowerCase()));
  phases.forEach((p) => p.topics.forEach((tp) => tp.terms.forEach((term: string) => allTerms.add(term.toLowerCase()))));
  const termCount = allTerms.size;

  return (
    <main>
      <section className="hero" style={{ minHeight: 'auto', paddingTop: '120px', paddingBottom: '64px' }}>
        <div className="hero-content">
          <div style={{ marginBottom: '1.5rem' }}>
            <Link href="/" style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', textDecoration: 'none', letterSpacing: '0.04em' }}>← {t('common.allCourses')}</Link>
          </div>
          <div className="hero-badge"><div className="badge-dot"></div> {t('hero.badge')}</div>
          <h1>AI Engineering<br/><span>kursi</span></h1>
          <p className="hero-desc">{t('hero.desc')}</p>
          <div className="hero-stats">
            <div className="stat"><div className="stat-num">{phaseCount}</div><div className="stat-label">{t('hero.stats.phases')}</div></div>
            <div className="stat"><div className="stat-num">{topicCount}</div><div className="stat-label">{t('hero.stats.topics')}</div></div>
            <div className="stat"><div className="stat-num">{termCount}+</div><div className="stat-label">{t('hero.stats.terms')}</div></div>
            <div className="stat"><div className="stat-num">6 oy</div><div className="stat-label">{t('hero.stats.time')}</div></div>
          </div>
          <div className="hero-btns">
            <Link href="#bosqichlar" className="btn-primary">{t('hero.btn.start')}</Link>
            <Link href="#atamalar" className="btn-secondary">{t('hero.btn.glossary')}</Link>
          </div>
          <ContinueLearning fallbackHref="/code-lesson/00-0" />
        </div>
      </section>

      <div className="stack-bar">
        <div className="stack-item"><div className="stack-dot" style={{background:'#3de8a0'}}></div>PYTHON</div>
        <div className="stack-item"><div className="stack-dot" style={{background:'#7c6fff'}}></div>PYTORCH</div>
        <div className="stack-item"><div className="stack-dot" style={{background:'#ffc85e'}}></div>HUGGING FACE</div>
        <div className="stack-item"><div className="stack-dot" style={{background:'#ff6b6b'}}></div>TRANSFORMER</div>
        <div className="stack-item"><div className="stack-dot" style={{background:'#3de8a0'}}></div>LORA / QLORA</div>
        <div className="stack-item"><div className="stack-dot" style={{background:'#7c6fff'}}></div>RLHF / DPO</div>
        <div className="stack-item"><div className="stack-dot" style={{background:'#ffc85e'}}></div>VLLM</div>
        <div className="stack-item"><div className="stack-dot" style={{background:'#ff6b6b'}}></div>LANGCHAIN</div>
      </div>

      <section id="bosqichlar">
        <div className="container">
          <div className="phases-header">
            <div className="section-label">// CURRICULUM</div>
            <h2 className="section-title">Bosqichma-bosqich o'rganish</h2>
            <p className="section-desc">Har bir bosqich oldingisinig ustiga quriladi. Asosdan boshlab, real loyiha bilan tugaydi.</p>
          </div>
          <Phases />
        </div>
      </section>

      <section id="rejalan">
        <div className="container" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'start'}}>
          <div>
            <div className="section-label">// VAQT REJASI</div>
            <h2 className="section-title">6 oylik yo'l</h2>
            <p className="section-desc" style={{marginBottom:'2rem'}}>Kuniga 2 soat ajrating. Haftada 5 kun. 6 oyda AI engineer bo'lasiz.</p>
            <div className="timeline">
              <div className="tl-item">
                <div className="tl-dot" style={{color:'var(--accent2)'}}></div>
                <div className="tl-month">1-2-OY</div>
                <div className="tl-task">Asoslar va ML</div>
                <div className="tl-sub">Python · NumPy · Pandas · Sklearn · Neural Networks</div>
              </div>
              <div className="tl-item">
                <div className="tl-dot" style={{color:'var(--accent)'}}></div>
                <div className="tl-month">3-OY</div>
                <div className="tl-task">PyTorch chuqur + Transformer</div>
                <div className="tl-sub">Autograd · Hugging Face · Mini-GPT quriladi</div>
              </div>
              <div className="tl-item">
                <div className="tl-dot" style={{color:'var(--amber)'}}></div>
                <div className="tl-month">4-OY</div>
                <div className="tl-task">LLM Engineering</div>
                <div className="tl-sub">Fine-tuning · LoRA · RLHF · Prompt Engineering</div>
              </div>
              <div className="tl-item">
                <div className="tl-dot" style={{color:'var(--accent3)'}}></div>
                <div className="tl-month">5-OY</div>
                <div className="tl-task">MLOps va Deploy</div>
                <div className="tl-sub">Quantization · vLLM · FastAPI · Cloud GPU</div>
              </div>
              <div className="tl-item">
                <div className="tl-dot" style={{color:'var(--accent2)'}}></div>
                <div className="tl-month">6-OY</div>
                <div className="tl-task">Agent + O'zbek LLM</div>
                <div className="tl-sub">RAG · LangChain · O'zbek modeli deploy</div>
              </div>
            </div>
          </div>
          <div>
            <div className="section-label">// RESURSLAR</div>
            <h2 className="section-title">Bepul manbalar</h2>
            <p className="section-desc" style={{marginBottom:'2rem'}}>Pullik kurs shart emas. Bu manbalar yetarli.</p>
            <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
              <div className="tool-card">
                <div className="tool-name">fast.ai</div>
                <div className="tool-cat">KURS</div>
                <div className="tool-desc">Amaliy ML, top-down yondashuv. Eng yaxshi bepul kurs.</div>
              </div>
              <div className="tool-card">
                <div className="tool-name">Andrej Karpathy</div>
                <div className="tool-cat">YOUTUBE</div>
                <div className="tool-desc">nanoGPT, makemore — LLMni noldan. Siz uslubida.</div>
              </div>
              <div className="tool-card">
                <div className="tool-name">Hugging Face kurslari</div>
                <div className="tool-cat">KURS</div>
                <div className="tool-desc">Transformers, Fine-tuning, Diffusion — barchasi bepul.</div>
              </div>
              <div className="tool-card">
                <div className="tool-name">Papers with Code</div>
                <div className="tool-cat">TADQIQOT</div>
                <div className="tool-desc">Eng yangi AI tadqiqotlari + kod. Har hafta yangilanadi.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="asboblar">
        <div className="container">
          <div className="section-label">// TECH STACK</div>
          <h2 className="section-title" style={{marginBottom:'0.5rem'}}>Asosiy asboblar</h2>
          <p className="section-desc" style={{marginBottom:'2rem'}}>AI engineer ishlatadigan texnologiyalar va kutubxonalar.</p>
          <div className="tools-grid">
            {tools.map((tool: { name: string; cat: string; desc: string }, i: number) => (
              <div key={i} className="tool-card">
                <div className="tool-name">{tool.name}</div>
                <div className="tool-cat">{tool.cat}</div>
                <div className="tool-desc">{tool.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="atamalar">
        <div className="container">
          <div className="section-label">// GLOSSARY</div>
          <h2 className="section-title" style={{marginBottom:'0.5rem'}}>Atamalar lug'ati</h2>
          <p className="section-desc" style={{marginBottom:'1.5rem'}}>80+ AI engineering atamasi — o'zbek tilida tushuntirish.</p>
          <Glossary />
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-inner">
          <h2>O'zbek AI <span style={{color:'var(--accent2)'}}>kelajagi</span><br/>sizdan boshlanadi</h2>
          <p>Bu kursni tugatgan har bir kishi o'zbek AI ekotizimiga hissa qo'shadi. Keling, birgalikda quraylik.</p>
          <div className="hero-btns">
            <Link href="#bosqichlar" className="btn-primary">Hoziroq boshlash →</Link>
          </div>
        </div>
      </section>

      <ProgressTrack />
    </main>
  );
}
