"use client";
import React from 'react';
import { useAuth } from '../app/contexts/AuthContext';
import { lessons } from '../lessons';

export default function ProgressTrack() {
  const { completedLessons, progressPercent } = useAuth();
  const done = completedLessons.length;
  const total = lessons.length;

  return (
    <div className="progress-track">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>
      <span>{done}/{total} dars · {progressPercent}%</span>
    </div>
  );
}
