import { lessons } from '../lessons';

const COMPLETED_KEY = 'ai_eng_completed';
const LAST_LESSON_KEY = 'ai_eng_last_lesson';
const LAST_ACTIVE_KEY = 'ai_eng_last_active';

export function getCompletedLessons(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(COMPLETED_KEY) || '[]');
  } catch {
    return [];
  }
}

export function isLessonCompleted(id: string): boolean {
  return getCompletedLessons().includes(id);
}

export function getProgressPercent(): number {
  const total = lessons.length;
  if (total === 0) return 0;
  return Math.round((getCompletedLessons().length / total) * 100);
}

export function getLastLessonId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LAST_LESSON_KEY);
}

export function saveLastLesson(id: string): void {
  localStorage.setItem(LAST_LESSON_KEY, id);
}

export function markLessonComplete(lessonId: string): string[] {
  const completed = getCompletedLessons();
  if (!completed.includes(lessonId)) {
    completed.push(lessonId);
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed));
  }
  saveLastLesson(lessonId);
  return completed;
}

export function daysBetween(a: string, b: string): number {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return Math.floor((d2.getTime() - d1.getTime()) / 86400000);
}

export function computeStreak(currentStreak: number, lastActive: string | null, today: string): number {
  if (!lastActive) return 1;
  if (lastActive === today) return currentStreak;
  const diff = daysBetween(lastActive, today);
  if (diff === 1) return currentStreak + 1;
  return 1;
}

export function touchStreak(): { today: string; lastActive: string | null } {
  const today = new Date().toISOString().slice(0, 10);
  const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
  localStorage.setItem(LAST_ACTIVE_KEY, today);
  return { today, lastActive };
}

// Faol kunlar tarixini saqlash (streak kalendar uchun)
const ACTIVE_DAYS_KEY = 'ai_eng_active_days';
export function recordActiveDay(): void {
  if (typeof window === 'undefined') return;
  const today = new Date().toISOString().slice(0, 10);
  const days = getActiveDays();
  if (!days.includes(today)) {
    days.push(today);
    localStorage.setItem(ACTIVE_DAYS_KEY, JSON.stringify(days.slice(-120)));
  }
}
export function getActiveDays(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(ACTIVE_DAYS_KEY) || '[]'); }
  catch { return []; }
}

// ── Bookmark (saqlangan darslar) ──────────────────────────────────────
const BOOKMARKS_KEY = 'ai_eng_bookmarks';
export function getBookmarks(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]'); }
  catch { return []; }
}
export function isBookmarked(id: string): boolean {
  return getBookmarks().includes(id);
}
export function toggleBookmark(id: string): string[] {
  const list = getBookmarks();
  const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
  return next;
}

// ── XP darajalari (gamification) ──────────────────────────────────────
const LEVEL_TITLES = ['Yangi boshlovchi', 'O\'rganuvchi', 'Amaliyotchi', 'Bilimdon', 'Mutaxassis', 'Usta', 'Guru'];

export interface LevelInfo {
  level: number;
  title: string;
  intoLevel: number;   // shu darajada to'plangan XP
  span: number;        // shu darajaning to'liq XP oralig'i
  pct: number;         // keyingi darajagacha foiz
  xpToNext: number;
}

// Har daraja oralig'i o'sib boradi: 0,300,700,1200,1800,2500...
export function getLevel(xp: number): LevelInfo {
  let level = 1;
  let threshold = 0;
  let step = 300;
  while (xp >= threshold + step) {
    threshold += step;
    level += 1;
    step += 100;
  }
  const intoLevel = xp - threshold;
  const pct = Math.min(100, Math.round((intoLevel / step) * 100));
  return {
    level,
    title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)],
    intoLevel,
    span: step,
    pct,
    xpToNext: step - intoLevel,
  };
}
