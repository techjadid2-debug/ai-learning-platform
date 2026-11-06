-- AI_ENG.uz — Admin panel va Kurslar/Darslar uchun sxema
-- public.courses, public.lessons, public.lesson_steps va public.admins jadvallari

-- Kurslar jadvali
create table if not exists public.courses (
  id           text primary key, -- 'ai-eng', 'prompt-eng' va h.k.
  slug         text unique not null,
  title        text not null,
  subtitle     text,
  description  text,
  icon         text default '📚',
  color        text default '#2f6bff',
  bg_color     text default 'rgba(47,107,255,0.08)',
  cover_image  text,
  estimate     text,
  level        text,
  is_published boolean default false,
  sort_order   integer default 0,
  created_at   timestamptz default now()
);

-- Darslar jadvali
create table if not exists public.lessons (
  id           text primary key,
  course_id    text not null references public.courses(id) on delete cascade,
  title        text not null,
  phase        integer default 0,
  topic        integer default 0,
  xp           integer default 100,
  sort_order   integer default 0,
  is_published boolean default false,
  created_at   timestamptz default now()
);

-- Dars qadamlari (steps) jadvali
create table if not exists public.lesson_steps (
  id              uuid primary key default gen_random_uuid(),
  lesson_id       text not null references public.lessons(id) on delete cascade,
  type            text not null, -- 'info', 'quiz', 'code', 'playground', 'video', 'finalquiz'
  title           text not null,
  content         text not null,
  code            text,
  success_check   text,
  quiz_data       jsonb, -- Savol va javoblar single quiz {question, options: [{text, correct}]}
  questions_data  jsonb, -- finalquiz uchun [{question, options: [{text, correct}]}]
  playground_data jsonb, -- playground uchun {task, starterPrompt, systemHint}
  video_data      jsonb, -- video uchun {url, note}
  sort_order      integer not null default 0
);

-- Admin emaillar ro'yxati
create table if not exists public.admins (
  email      text primary key,
  created_at timestamptz default now()
);

-- Row Level Security (RLS) faollashtirish
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_steps enable row level security;
alter table public.admins enable row level security;

-- Ommaviy o'qish qoidalari (policilar)
drop policy if exists "courses_public_read" on public.courses;
create policy "courses_public_read" on public.courses
  for select using (is_published = true);

drop policy if exists "lessons_public_read" on public.lessons;
create policy "lessons_public_read" on public.lessons
  for select using (is_published = true);

drop policy if exists "steps_public_read" on public.lesson_steps;
create policy "steps_public_read" on public.lesson_steps
  for select using (true);

drop policy if exists "admins_public_read" on public.admins;
create policy "admins_public_read" on public.admins
  for select using (true);

-- Admin amallari: agar foydalanuvchining email manzili admins jadvalida bo'lsa, to'liq huquq beriladi
drop policy if exists "courses_admin_all" on public.courses;
create policy "courses_admin_all" on public.courses
  for all using (
    auth.role() = 'authenticated' and 
    exists (select 1 from public.admins where email = auth.jwt() ->> 'email')
  );

drop policy if exists "lessons_admin_all" on public.lessons;
create policy "lessons_admin_all" on public.lessons
  for all using (
    auth.role() = 'authenticated' and 
    exists (select 1 from public.admins where email = auth.jwt() ->> 'email')
  );

drop policy if exists "steps_admin_all" on public.lesson_steps;
create policy "steps_admin_all" on public.lesson_steps
  for all using (
    auth.role() = 'authenticated' and 
    exists (select 1 from public.admins where email = auth.jwt() ->> 'email')
  );

drop policy if exists "admins_admin_all" on public.admins;
create policy "admins_admin_all" on public.admins
  for all using (
    auth.role() = 'authenticated' and 
    exists (select 1 from public.admins where email = auth.jwt() ->> 'email')
  );
