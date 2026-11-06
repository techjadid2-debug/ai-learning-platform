import { getLessonsByCourse } from '../lessons';

export interface AchievementStats {
  completed: string[]; // tugatilgan dars id'lari
  xp: number;
  streak: number;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: (s: AchievementStats) => boolean;
}

const aiEngTotal = () => getLessonsByCourse('ai-eng').length;
const promptTotal = () => getLessonsByCourse('prompt-eng').length;
const aiEngDone = (s: AchievementStats) =>
  getLessonsByCourse('ai-eng').filter((l) => s.completed.includes(l.id)).length;
const promptDone = (s: AchievementStats) =>
  getLessonsByCourse('prompt-eng').filter((l) => s.completed.includes(l.id)).length;

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-lesson', title: 'Birinchi qadam', desc: 'Birinchi darsni tugating', icon: '🎯',
    unlocked: (s) => s.completed.length >= 1 },
  { id: 'five-lessons', title: 'Sur\'at', desc: '5 ta dars tugating', icon: '🚀',
    unlocked: (s) => s.completed.length >= 5 },
  { id: 'streak-3', title: 'Izchillik', desc: '3 kunlik streak', icon: '🔥',
    unlocked: (s) => s.streak >= 3 },
  { id: 'streak-7', title: 'Bir hafta!', desc: '7 kunlik streak', icon: '⚡',
    unlocked: (s) => s.streak >= 7 },
  { id: 'xp-1000', title: 'Ming XP', desc: '1000 XP to\'plang', icon: '⭐',
    unlocked: (s) => s.xp >= 1000 },
  { id: 'xp-3000', title: 'Bilim quvvati', desc: '3000 XP to\'plang', icon: '💎',
    unlocked: (s) => s.xp >= 3000 },
  { id: 'prompt-master', title: 'Prompt ustasi', desc: 'Prompt Engineering kursini tugating', icon: '💬',
    unlocked: (s) => promptTotal() > 0 && promptDone(s) >= promptTotal() },
  { id: 'ai-engineer', title: 'AI Muhandis', desc: 'AI Engineering kursini tugating', icon: '🛠️',
    unlocked: (s) => aiEngTotal() > 0 && aiEngDone(s) >= aiEngTotal() },
];

export function getUnlocked(s: AchievementStats): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.unlocked(s));
}
