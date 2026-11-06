# AI_ENG.uz — O'zbek tilidagi AI o'rganish platformasi

Next.js 16 + React 19 da yozilgan interaktiv AI Engineering o'quv platformasi. Brauzerda Python (Pyodide), XP/streak, reyting va 21 mavzu bo'yicha darslar.

## Supabase (ixtiyoriy backend)

Ilova **Supabase sozlanmasa ham** to'liq ishlaydi — bu holda progress va reyting `localStorage`'da saqlanadi. Umumiy (haqiqiy) reyting va bulutli zaxira uchun:

1. [supabase.com](https://supabase.com) da loyiha yarating.
2. **SQL Editor** da `supabase/migrations/0002_auth.sql` ni ishga tushiring (haqiqiy auth jadvallar + RLS). *(Parolsiz demo uchun `0001_init.sql` — lekin haqiqiy auth uchun 0002 ishlating.)*
3. `.env.example` ni `.env.local` ga nusxalab, **Project Settings → API** dagi qiymatlarni qo'ying:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
4. **Google bilan kirish** uchun: Supabase **Authentication → Providers → Google** ni yoqing; Google Cloud Console'da OAuth client yarating va `https://<loyiha>.supabase.co/auth/v1/callback` ni redirect URL qiling. **Authentication → URL Configuration** da Site URL'ni sayt manzilingizga qo'ying.
5. `npm run dev` — endi email/parol va Google bilan kirish, parol tiklash, qurilmalararo progress ishlaydi.

> Kalitlar bo'lmasa, sayt avtomatik **localStorage rejimida** (parolsiz, ism+avatar) ishlayveradi — hech narsa buzilmaydi.

## Uxlovchi (dormant) funksiyalar

Quyidagilar kodda tayyor, lekin hozir o'chiq/ishlatilmaydi — kelajakda yoqish mumkin:

- **Jonli AI playground** (`src/components/Playground.tsx` + `src/app/api/chat/route.ts`): Anthropic API bilan ishlaydigan prompt amaliyoti. Hozir hech qaysi darsda `playground` qadami yo'q. Yoqish: (1) `ANTHROPIC_API_KEY` env qo'shing; (2) `src/lessons.ts` da biror darsga `{ type: 'playground', playground: { task, starterPrompt } }` qadamini qo'shing.
- **Supabase auth** (`src/lib/auth.ts`, `src/lib/cloud.ts`, `supabase/migrations/0002_auth.sql`): email/parol + Google. Yuqoridagi Supabase yo'riqnomasi bo'yicha kalitlar qo'shilsa faollashadi.
- **Leaderboard** Supabase ulanmaguncha **namuna** ma'lumot ko'rsatadi (sahifada shu haqda ogohlantirish bor).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
