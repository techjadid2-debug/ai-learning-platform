"use client";
import React, { useState } from 'react';
import { glossary } from '../data';

export default function Glossary() {
  const [search, setSearch] = useState('');

  const filtered = glossary.filter((g: { t: string; d: string }) =>
    g.t.toLowerCase().includes(search.toLowerCase()) ||
    g.d.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <input 
        className="glossary-search" 
        type="text" 
        placeholder="Atama qidiring... (masalan: attention)" 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="gloss-grid">
        {filtered.map((g: { t: string; d: string }, i: number) => (
          <div key={i} className="gloss-card">
            <div className="gloss-term">{g.t}</div>
            <div className="gloss-def">{g.d}</div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ color: 'var(--muted)', fontSize: '13px' }}>Hech narsa topilmadi...</div>
        )}
      </div>
    </>
  );
}
