"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCompletedLessons,
  markLessonComplete as markComplete,
  computeStreak,
  touchStreak,
  recordActiveDay,
} from '../../lib/progress';
import { syncProfile, saveProgressRow, fetchProfile, setCloudUserId, fetchCompletedLessons } from '../../lib/cloud';
import {
  isSupabaseConfigured,
  signUpEmail,
  signInEmail,
  signInWithGoogle as oauthGoogle,
  resetPassword as resetPw,
  signOutSupabase,
  AuthResult,
} from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { lessons } from '../../lessons';

interface User {
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  joinedAt: string;
  email?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  completedLessons: string[];
  supabaseEnabled: boolean;
  login: (name: string, avatar: string) => void;
  signUp: (email: string, password: string, name: string, avatar: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  logout: () => void;
  addXp: (amount: number) => void;
  markLessonComplete: (lessonId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  progressPercent: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Supabase foydalanuvchisini profilga bog'lab yuklash
  const loadAuthUser = async (authUser: SupabaseUser) => {
    setCloudUserId(authUser.id);
    let profile = await fetchProfile(authUser.id);
    if (!profile) {
      profile = {
        name: (authUser.user_metadata?.name as string) || authUser.email?.split('@')[0] || 'Foydalanuvchi',
        avatar: (authUser.user_metadata?.avatar as string) || '🧑‍💻',
        xp: parseInt(localStorage.getItem('ai_eng_xp') || '0'),
        streak: 1,
      };
      await syncProfile(profile);
    } else {
      localStorage.setItem('ai_eng_user', JSON.stringify({
        name: profile.name,
        avatar: profile.avatar,
        xp: profile.xp,
        streak: profile.streak,
        joinedAt: authUser.created_at || new Date().toISOString()
      }));
      localStorage.setItem('ai_eng_xp', profile.xp.toString());
    }

    // Tugatilgan darslarni Supabase-dan yuklab birlashtiramiz
    const dbCompleted = await fetchCompletedLessons(authUser.id);
    const localCompleted = getCompletedLessons();
    const merged = Array.from(new Set([...localCompleted, ...dbCompleted]));
    setCompletedLessons(merged);
    localStorage.setItem('ai_eng_completed', JSON.stringify(merged));

    // Yangi local progressni DB ga yozamiz
    for (const lid of localCompleted) {
      if (!dbCompleted.includes(lid)) {
        await saveProgressRow(lid);
      }
    }

    const { checkIsAdmin } = await import('../../lib/db');
    const isAdmin = await checkIsAdmin(authUser.email);
    setUser({
      ...profile,
      email: authUser.email,
      isAdmin,
      joinedAt: authUser.created_at || new Date().toISOString()
    });
  };

  // Boshlang'ich yuklash + Supabase sessiyasi (sozlangan bo'lsa)
  useEffect(() => {
    setCompletedLessons(getCompletedLessons());

    if (isSupabaseConfigured && supabase) {
      // Supabase auth rejimi
      supabase.auth.getSession().then(({ data }) => {
        if (data.session?.user) void loadAuthUser(data.session.user);
      });
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          void loadAuthUser(session.user);
        } else {
          setCloudUserId(null);
          setUser(null);
        }
      });
      setMounted(true);
      return () => sub.subscription.unsubscribe();
    }

    // Lokal rejim (parolsiz, localStorage)
    const savedUser = localStorage.getItem('ai_eng_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    setMounted(true);
  }, []);

  // ── Lokal login (parolsiz) ─────────────────────────────────────────
  const login = (name: string, avatar: string = '🧑‍💻') => {
    const existingXp = parseInt(localStorage.getItem('ai_eng_xp') || '0');
    const newUser: User = { name, avatar, xp: existingXp, streak: 1, joinedAt: new Date().toISOString() };
    setUser(newUser);
    localStorage.setItem('ai_eng_user', JSON.stringify(newUser));
    void syncProfile(newUser);
  };

  // ── Supabase auth ──────────────────────────────────────────────────
  const signUp = (email: string, password: string, name: string, avatar: string) =>
    signUpEmail(email, password, name, avatar);
  const signIn = (email: string, password: string) => signInEmail(email, password);
  const signInWithGoogle = () => oauthGoogle();
  const resetPassword = (email: string) => resetPw(email);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ai_eng_user');
    if (isSupabaseConfigured) {
      setCloudUserId(null);
      void signOutSupabase();
    }
  };

  const addXp = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, xp: user.xp + amount };
      setUser(updatedUser);
      localStorage.setItem('ai_eng_user', JSON.stringify(updatedUser));
      localStorage.setItem('ai_eng_xp', updatedUser.xp.toString());
      void syncProfile(updatedUser);
    } else {
      const existingXp = parseInt(localStorage.getItem('ai_eng_xp') || '0');
      localStorage.setItem('ai_eng_xp', (existingXp + amount).toString());
    }
  };

  const markLessonComplete = (lessonId: string) => {
    const updated = markComplete(lessonId);
    setCompletedLessons(updated);
    void saveProgressRow(lessonId);
    recordActiveDay();

    const { today, lastActive } = touchStreak();

    if (user) {
      const newStreak = computeStreak(user.streak, lastActive, today);
      const updatedUser = { ...user, streak: newStreak };
      setUser(updatedUser);
      localStorage.setItem('ai_eng_user', JSON.stringify(updatedUser));
      void syncProfile(updatedUser);
    }
  };

  const isLessonCompleted = (lessonId: string) => completedLessons.includes(lessonId);

  if (!mounted) return null;

  const pct = lessons.length
    ? Math.round((completedLessons.length / lessons.length) * 100)
    : 0;

  return (
    <AuthContext.Provider
      value={{
        user,
        completedLessons,
        supabaseEnabled: isSupabaseConfigured,
        login,
        signUp,
        signIn,
        signInWithGoogle,
        resetPassword,
        logout,
        addXp,
        markLessonComplete,
        isLessonCompleted,
        progressPercent: pct,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
