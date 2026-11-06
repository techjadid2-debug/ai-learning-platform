import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase faqat env o'zgaruvchilari mavjud bo'lganda yoqiladi.
// Sozlanmagan bo'lsa, ilova localStorage rejimida to'liq ishlayveradi.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!)
  : null;
