-- AI_ENG.uz — boshlang'ich sxema
-- profiles: leaderboard uchun foydalanuvchi profillari (qurilma-ID modeli)
-- lesson_progress: tugatilgan darslar

create table if not exists public.profiles (
  id          text primary key,            -- qurilma identifikatori (getDeviceId)
  name        text not null,
  avatar      text not null default '🧑‍💻',
  xp          integer not null default 0,
  streak      integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  device_id    text not null,
  lesson_id    text not null,
  completed_at timestamptz not null default now(),
  primary key (device_id, lesson_id)
);

create index if not exists profiles_xp_idx on public.profiles (xp desc);

-- RLS yoqamiz.
alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;

-- DIQQAT: parolsiz (anon) MVP modeli — har kim yozishi/o'qishi mumkin.
-- Production'da haqiqiy auth (auth.uid()) bilan cheklash tavsiya etiladi.
drop policy if exists "profiles_read" on public.profiles;
create policy "profiles_read" on public.profiles
  for select using (true);

drop policy if exists "profiles_write" on public.profiles;
create policy "profiles_write" on public.profiles
  for insert with check (true);

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles
  for update using (true) with check (true);

drop policy if exists "progress_read" on public.lesson_progress;
create policy "progress_read" on public.lesson_progress
  for select using (true);

drop policy if exists "progress_write" on public.lesson_progress;
create policy "progress_write" on public.lesson_progress
  for insert with check (true);
