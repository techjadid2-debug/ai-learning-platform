import { CourseId, getLessonsByCourse } from './lessons';

export interface Course {
  id: CourseId;
  slug: string;
  title: string;
  subtitle: string;
  desc: string;
  color: string;
  bg: string;
  icon: string;
  estimate: string;
  level: string;
  coverImage: string;
}

export const courses: Course[] = [
  {
    id: 'ai-eng',
    slug: 'ai-engineering',
    title: 'AI Engineering',
    subtitle: 'Noldan LLM qurguncha',
    desc: "Python, Machine Learning, Transformer, Fine-tuning (LoRA), MLOps va AI Agent. Brauzerda Python kodi bilan interaktiv, 21 mavzu.",
    color: '#2f6bff',
    bg: 'rgba(47,107,255,0.08)',
    icon: '🛠️',
    estimate: '6 oy',
    level: "Boshlang'ich → Mutaxassis",
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=900&q=70',
  },
  {
    id: 'prompt-eng',
    slug: 'prompt-engineering',
    title: "Sun'iy Intellekt Asoslari",
    subtitle: 'AI qanday ishlaydi?',
    desc: "AI bilan rasm, ovoz, video va taqdimot yasashdan tortib, o'z saytingiz, Telegram botingiz va aqlli yordamchingizni qurishgacha. Har dars — video, sodda tushuntirish va test. Kod bilmaslik shart emas.",
    color: '#4f46e5',
    bg: 'rgba(79,70,229,0.08)',
    icon: '🧠',
    estimate: '16 dars · 2 modul',
    level: "Hammaga mos",
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=70',
  },
];

export function getCourse(slug: string): Course | undefined {
  return courses.find(c => c.slug === slug);
}

export function getCourseById(id: CourseId): Course | undefined {
  return courses.find(c => c.id === id);
}

export function getCourseLessonCount(id: CourseId): number {
  return getLessonsByCourse(id).length;
}
