import { supabase, isSupabaseConfigured } from './supabase';

export { isSupabaseConfigured };

export interface AuthResult {
  ok: boolean;
  error?: string;
  needsConfirm?: boolean;
}

function redirectTo(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.location.origin;
}

export async function signUpEmail(
  email: string,
  password: string,
  name?: string,
  avatar?: string
): Promise<AuthResult> {
  if (!supabase) return { ok: false, error: 'Auth sozlanmagan.' };
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: redirectTo(), data: { name, avatar } },
  });
  if (error) return { ok: false, error: error.message };
  // Email tasdiqlash yoqilgan bo'lsa, sessiya darhol kelmaydi
  return { ok: true, needsConfirm: !data.session };
}

export async function signInEmail(email: string, password: string): Promise<AuthResult> {
  if (!supabase) return { ok: false, error: 'Auth sozlanmagan.' };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function signInWithGoogle(): Promise<AuthResult> {
  if (!supabase) return { ok: false, error: 'Auth sozlanmagan.' };
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: redirectTo() },
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function resetPassword(email: string): Promise<AuthResult> {
  if (!supabase) return { ok: false, error: 'Auth sozlanmagan.' };
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectTo() });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function signOutSupabase(): Promise<void> {
  if (!supabase) return;
  try { await supabase.auth.signOut(); } catch { /* ignore */ }
}
