import { supabase, isSupabaseConfigured } from './supabase';

// Supabase auth bo'lsa — autentifikatsiya qilingan user id. Aks holda qurilma-ID.
let authUserId: string | null = null;
export function setCloudUserId(id: string | null) {
  authUserId = id;
}

// Parolsiz login UX'ga mos qurilma identifikatori.
// Har bir brauzer uchun barqaror UUID — leaderboard'da yagona qator uchun.
export function getDeviceId(): string {
  if (authUserId) return authUserId;
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('ai_eng_device_id');
  if (!id) {
    id =
      (crypto?.randomUUID && crypto.randomUUID()) ||
      `dev_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('ai_eng_device_id', id);
  }
  return id;
}

// Autentifikatsiya qilingan foydalanuvchi profilini o'qish.
export async function fetchProfile(id: string): Promise<CloudProfile | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('name, avatar, xp, streak')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data as CloudProfile | null;
  } catch (e) {
    console.warn('Supabase fetchProfile xatosi:', e);
    return null;
  }
}

export interface CloudProfile {
  name: string;
  avatar: string;
  xp: number;
  streak: number;
}

// Profilni Supabase'ga yozadi (sozlanmagan bo'lsa jim qaytadi).
export async function syncProfile(p: CloudProfile): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('profiles').upsert(
      {
        id: getDeviceId(),
        name: p.name,
        avatar: p.avatar,
        xp: p.xp,
        streak: p.streak,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
  } catch (e) {
    console.warn('Supabase syncProfile xatosi:', e);
  }
}

// Tugatilgan darsni yozadi.
export async function saveProgressRow(lessonId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase
      .from('lesson_progress')
      .upsert(
        { device_id: getDeviceId(), lesson_id: lessonId },
        { onConflict: 'device_id,lesson_id' }
      );
  } catch (e) {
    console.warn('Supabase saveProgressRow xatosi:', e);
  }
}

export interface LeaderboardRow {
  name: string;
  avatar: string;
  xp: number;
  streak: number;
}

// Eng yuqori XP'li foydalanuvchilarni qaytaradi (davrlar bo'yicha).
export async function fetchLeaderboard(limit = 10, period: 'all' | 'weekly' | 'monthly' = 'all'): Promise<LeaderboardRow[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    if (period === 'all') {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, avatar, xp, streak')
        .order('xp', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    }

    // Haftalik yoki Oylik
    const days = period === 'weekly' ? 7 : 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // 1. Tanlangan davrdagi dars completions'larni yuklash
    const { data: progressData, error: progressErr } = await supabase
      .from('lesson_progress')
      .select('device_id, lesson_id')
      .gte('completed_at', cutoffDate.toISOString());

    if (progressErr) throw progressErr;

    // 2. Foydalanuvchilar profillarini yuklash
    const { data: profilesData, error: profilesErr } = await supabase
      .from('profiles')
      .select('id, name, avatar, streak');

    if (profilesErr) throw profilesErr;

    // 3. Darslar ro'yxatini va ularning XP qiymatlarini yuklash
    const { getDBLessons } = await import('./db');
    const allLessons = [
      ...await getDBLessons('ai-eng'),
      ...await getDBLessons('prompt-eng')
    ];

    const lessonXpMap: Record<string, number> = {};
    allLessons.forEach(l => {
      lessonXpMap[l.id] = l.xp;
    });

    // 4. Tanlangan davr uchun XP larni device_id bo'yicha guruhlab yig'ish
    const xpGroup: Record<string, number> = {};
    (progressData ?? []).forEach(row => {
      const xp = lessonXpMap[row.lesson_id] || 100;
      xpGroup[row.device_id] = (xpGroup[row.device_id] || 0) + xp;
    });

    // 5. Leaderboard qatorlarini tuzish va tartiblash
    const board: LeaderboardRow[] = (profilesData ?? []).map(p => {
      return {
        name: p.name,
        avatar: p.avatar,
        xp: xpGroup[p.id] || 0,
        streak: p.streak
      };
    })
    .filter(row => row.xp > 0)
    .sort((a, b) => b.xp - a.xp)
    .slice(0, limit);

    return board;
  } catch (e) {
    console.warn('Supabase fetchLeaderboard xatosi:', e);
    return [];
  }
}

// Tugatilgan darslarni Supabase'dan o'qish
export async function fetchCompletedLessons(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('device_id', userId);
    if (error) throw error;
    return (data ?? []).map((row: any) => row.lesson_id);
  } catch (e) {
    console.warn('Supabase fetchCompletedLessons xatosi:', e);
    return [];
  }
}
