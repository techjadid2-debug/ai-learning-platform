-- AI_ENG.uz — haqiqiy auth sxemasi (0001 ustiga)
-- Bu migratsiya Supabase Auth (auth.users) bilan ishlash uchun jadvallarni
-- qayta yaratadi. Parolsiz qurilma-ID modelidan auth.uid() modeliga o'tadi.

drop table if exists public.lesson_progress;
drop table if exists public.profiles;

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null default 'Foydalanuvchi',
  avatar      text not null default '🧑‍💻',
  xp          integer not null default 0,
  streak      integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Izoh: ustun nomi `device_id` mijoz kodiga (lib/cloud.ts) mos saqlangan,
-- lekin endi u auth.users(id) ga ishora qiladi.
create table public.lesson_progress (
  device_id    uuid not null references auth.users(id) on delete cascade,
  lesson_id    text not null,
  completed_at timestamptz not null default now(),
  primary key (device_id, lesson_id)
);

create index profiles_xp_idx on public.profiles (xp desc);

alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;

-- Leaderboard ommaviy o'qiladi; yozish faqat o'z qatoriga.
create policy "profiles_read"   on public.profiles for select using (true);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "progress_read"   on public.lesson_progress for select using (auth.uid() = device_id);
create policy "progress_insert" on public.lesson_progress for insert with check (auth.uid() = device_id);
