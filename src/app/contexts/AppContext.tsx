"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';
type Lang = 'uz' | 'en' | 'ru';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const translations = {
  uz: {
    'nav.phases': 'Bosqichlar',
    'nav.plan': 'Reja',
    'nav.tools': 'Asboblar',
    'nav.glossary': 'Atamalar',
    'nav.start': 'Boshlash →',
    'hero.badge': 'O\'ZBEK TILIDA · BEPUL · 2025',
    'hero.title.super': 'super',
    'hero.title.kurs': 'kurs',
    'hero.desc': 'Noldan LLM qurguncha. Tokenizatsiyadan Transformer gacha, Fine-tuningdan deploy gacha — hammasini o\'zbek tilida.',
    'hero.stats.phases': 'Bosqich',
    'hero.stats.topics': 'Mavzu',
    'hero.stats.terms': 'Atama',
    'hero.stats.time': 'Taxminiy',
    'hero.btn.start': 'Kursni boshlash',
    'hero.btn.glossary': 'Atamalar lug\'ati',
    'lesson.back': '← Orqaga',
    'lesson.run': '▶ Kodni ishga tushirish',
    'lesson.running': 'Ishlamoqda...',
    'lesson.next': 'Keyingi dars →',
    'lesson.prev': '← Oldingi dars',
    'lesson.terminal': 'Terminal / Natija',
    'lesson.task': 'Topshiriq:',
    'lesson.congrats': 'Tabriklaymiz! 🎉',
    'nav.courses': 'Kurslar',
    'nav.dashboard': 'Dashboard',
    'nav.rating': 'Reyting',
    'nav.login': 'Kirish',
    'hub.badge': "O'ZBEK TILIDA · BEPUL",
    'hub.title1': "AI o'rganish",
    'hub.title2': 'platformasi',
    'hub.desc': "Sun'iy intellektni noldan o'rganing. O'zingizga mos kursni tanlang — interaktiv darslar, jonli AI playground va amaliyot bilan.",
    'hub.courses': 'KURSLAR',
    'hub.loading': 'Kurslar yuklanmoqda...',
    'course.lessons': 'dars',
    'course.start': 'Boshlash',
    'course.continue': 'Davom etish',
    'common.allCourses': 'Barcha kurslar',
    'common.home': 'Asosiy sahifa',
    'lr.step': 'QADAM', 'lr.video': 'VIDEO', 'lr.theory': 'NAZARIYA', 'lr.test': 'TEST', 'lr.finalTest': 'YAKUNIY TEST', 'lr.playground': 'PLAYGROUND', 'lr.practice': 'AMALIYOT',
    'lr.videoLesson': 'Video dars', 'lr.videoSoon': "Video tez orada qo'shiladi.", 'lr.readBelow': "Hozircha nazariyani o'qib davom eting →",
    'lr.next': 'Keyingi dars →', 'lr.continueBtn': 'Davom etish →', 'lr.prev': '← Oldingi', 'lr.finish': 'Tugatish 🏁',
    'lr.codeOk': '✅ Kod muvaffaqiyatli ishladi!', 'lr.xpAdded': 'XP qo\'shildi! Dars tugatildi!', 'lr.notFound': 'Dars topilmadi',
    'quiz.correct': "✅ To'g'ri! Ajoyib!", 'quiz.wrong': "❌ Qayta urinib ko'ring...",
    'fq.check': '✓ Tekshirish', 'fq.answerAll': 'Barcha savollarga javob bering', 'fq.retry': '↻ Qayta urinish',
    'fq.great': 'Ajoyib!', 'fq.correct': "to'g'ri", 'fq.canProceed': 'Davom etishingiz mumkin.', 'fq.needMin': "O'tish uchun kamida", 'fq.needSuffix': 'ta kerak — qayta urinib ko\'ring.',
    'rm.badge': 'VIDEO · NAZARIYA · TEST', 'rm.topic': 'Mavzu', 'rm.done': 'Tugatilgan', 'rm.est': 'Taxminiy', 'rm.video': 'Video', 'rm.theory': 'Nazariya', 'rm.test': 'test',
    'dash.hello': 'Salom', 'dash.subtitle': "Bugun ham o'rganishni davom ettiramizmi?", 'dash.level': 'DARAJA', 'dash.toNext': 'Keyingi darajagacha', 'dash.totalXp': 'JAMI XP', 'dash.streak': 'STREAK', 'dash.days': 'kun', 'dash.last14': 'OXIRGI 14 KUN', 'dash.last30': 'OXIRGI 30 KUN', 'dash.yourCourses': 'Kurslaringiz', 'dash.certificate': 'Sertifikat', 'dash.saved': 'Saqlangan darslar', 'dash.achievements': 'Yutuqlar', 'dash.loginTitle': 'Dashboard uchun kiring', 'dash.loginDesc': "Progress, daraja va yutuqlaringizni ko'rish uchun hisobingizga kiring.",
    'prof.title': 'Shaxsiy Kabinet', 'prof.member': "A'zo", 'prof.overall': 'Umumiy', 'prof.lessons': 'dars', 'prof.logout': 'Tizimdan chiqish', 'prof.byCourse': "Kurslar bo'yicha", 'prof.completed': 'Tugallangan darslar', 'prof.noCompleted': "Hozircha tugallangan dars yo'q.", 'prof.startLessons': 'Darslarni boshlang →', 'prof.viewRating': "Reytingni ko'rish 🏆", 'prof.notLoggedIn': 'Tizimga kirmagansiz', 'prof.loginDesc': 'Progress va XP saqlash uchun asosiy sahifadan kiring.', 'prof.toHome': 'Asosiy sahifaga →', 'prof.xpEarned': "YIG'ILGAN TAJRIBA", 'prof.streakLabel': 'KUNDALIK DAVOMIYLIK', 'prof.days': 'kun',
    'lb.title': 'Liderlar Doskasi', 'lb.subtitle': "Har kuni o'qib, XP yig'ib, reytingda yuqoriga chiq! 🚀", 'lb.sample': "Bu — namuna reyting. Haqiqiy reyting hisob (Supabase) ulangach faollashadi.", 'lb.user': 'Foydalanuvchi', 'lb.you': 'Siz', 'lb.yourStats': 'Sizning statistikangiz', 'lb.rank': 'Reyting', 'lb.boost': 'Reytingni oshirish →', 'lb.continueLearning': 'Darslarni davom ettirish',
    'cert.label': 'SERTIFIKAT', 'cert.confirms': 'Ushbu sertifikat tasdiqlaydi:', 'cert.completed': 'quyidagi kursni muvaffaqiyatli tamomladi:', 'cert.date': 'SANA', 'cert.lessons': 'DARSLAR', 'cert.lessonsUnit': 'ta', 'cert.download': 'PNG yuklab olish', 'cert.dashboard': 'Dashboard', 'cert.notFound': 'Kurs topilmadi', 'cert.loginNeeded': 'Sertifikat uchun kiring', 'cert.loginDesc': 'Hisobingizga kirib, kursni tugating.', 'cert.notComplete': 'Kurs hali tugamagan', 'cert.backToCourse': 'Kursga qaytish',
    'login.welcome': '// XUSH KELIBSIZ', 'login.enterPlatform': 'Platformaga kiring', 'login.signupTitle': "Ro'yxatdan o'tish", 'login.signinTitle': 'Hisobga kirish', 'login.subtitle': 'Progressingizni saqlash va reytingda qatnashish uchun.', 'login.chooseAvatar': 'Avatar tanlang:', 'login.name': 'Ismingiz', 'login.email': 'Email', 'login.password': 'Parol (kamida 6 belgi)', 'login.or': 'yoki', 'login.google': 'Google bilan kirish', 'login.haveAccount': 'Hisobingiz bormi? Kirish', 'login.noAccount': "Hisob yo'qmi? Ro'yxatdan o'tish", 'login.forgot': 'Parolni unutdingizmi?', 'login.signup': "Ro'yxatdan o'tish", 'login.signin': 'Kirish', 'login.enterName': 'Ismingizni kiriting.', 'login.confirmSent': 'Email manzilingizga tasdiqlash xati yuborildi. Tasdiqlab, kiring.', 'login.resetSent': 'Parolni tiklash havolasi emailingizga yuborildi.',
  },
  en: {
    'nav.phases': 'Phases',
    'nav.plan': 'Plan',
    'nav.tools': 'Tools',
    'nav.glossary': 'Glossary',
    'nav.start': 'Start →',
    'hero.badge': 'IN ENGLISH · FREE · 2025',
    'hero.title.super': 'super',
    'hero.title.kurs': 'course',
    'hero.desc': 'From scratch to LLM. From tokenization to Transformers, fine-tuning to deploy — all in English.',
    'hero.stats.phases': 'Phases',
    'hero.stats.topics': 'Topics',
    'hero.stats.terms': 'Terms',
    'hero.stats.time': 'Est. time',
    'hero.btn.start': 'Start Course',
    'hero.btn.glossary': 'Glossary',
    'lesson.back': '← Back',
    'lesson.run': '▶ Run Code',
    'lesson.running': 'Running...',
    'lesson.next': 'Next Lesson →',
    'lesson.prev': '← Prev Lesson',
    'lesson.terminal': 'Terminal / Output',
    'lesson.task': 'Task:',
    'lesson.congrats': 'Congratulations! 🎉',
    'nav.courses': 'Courses',
    'nav.dashboard': 'Dashboard',
    'nav.rating': 'Leaderboard',
    'nav.login': 'Sign in',
    'hub.badge': 'IN ENGLISH · FREE',
    'hub.title1': 'AI learning',
    'hub.title2': 'platform',
    'hub.desc': 'Learn artificial intelligence from scratch. Pick a course that fits you — interactive lessons, a live AI playground, and hands-on practice.',
    'hub.courses': 'COURSES',
    'hub.loading': 'Loading courses...',
    'course.lessons': 'lessons',
    'course.start': 'Start',
    'course.continue': 'Continue',
    'common.allCourses': 'All courses',
    'common.home': 'Home',
    'lr.step': 'STEP', 'lr.video': 'VIDEO', 'lr.theory': 'THEORY', 'lr.test': 'TEST', 'lr.finalTest': 'FINAL TEST', 'lr.playground': 'PLAYGROUND', 'lr.practice': 'PRACTICE',
    'lr.videoLesson': 'Video lesson', 'lr.videoSoon': 'Video coming soon.', 'lr.readBelow': 'Read the theory below to continue →',
    'lr.next': 'Next lesson →', 'lr.continueBtn': 'Continue →', 'lr.prev': '← Previous', 'lr.finish': 'Finish 🏁',
    'lr.codeOk': '✅ Code ran successfully!', 'lr.xpAdded': 'XP added! Lesson completed!', 'lr.notFound': 'Lesson not found',
    'quiz.correct': '✅ Correct! Great!', 'quiz.wrong': '❌ Try again...',
    'fq.check': '✓ Check', 'fq.answerAll': 'Answer all questions', 'fq.retry': '↻ Retry',
    'fq.great': 'Great!', 'fq.correct': 'correct', 'fq.canProceed': 'You may continue.', 'fq.needMin': 'You need at least', 'fq.needSuffix': 'correct — try again.',
    'rm.badge': 'VIDEO · THEORY · TEST', 'rm.topic': 'Topics', 'rm.done': 'Completed', 'rm.est': 'Est.', 'rm.video': 'Video', 'rm.theory': 'Theory', 'rm.test': 'tests',
    'dash.hello': 'Hi', 'dash.subtitle': 'Shall we keep learning today?', 'dash.level': 'LEVEL', 'dash.toNext': 'To next level', 'dash.totalXp': 'TOTAL XP', 'dash.streak': 'STREAK', 'dash.days': 'days', 'dash.last14': 'LAST 14 DAYS', 'dash.last30': 'LAST 30 DAYS', 'dash.yourCourses': 'Your courses', 'dash.certificate': 'Certificate', 'dash.saved': 'Saved lessons', 'dash.achievements': 'Achievements', 'dash.loginTitle': 'Sign in for dashboard', 'dash.loginDesc': 'Sign in to see your progress, level and achievements.',
    'prof.title': 'Profile', 'prof.member': 'Member since', 'prof.overall': 'Overall', 'prof.lessons': 'lessons', 'prof.logout': 'Log out', 'prof.byCourse': 'By course', 'prof.completed': 'Completed lessons', 'prof.noCompleted': 'No completed lessons yet.', 'prof.startLessons': 'Start lessons →', 'prof.viewRating': 'View leaderboard 🏆', 'prof.notLoggedIn': 'Not signed in', 'prof.loginDesc': 'Sign in from the home page to save progress and XP.', 'prof.toHome': 'To home →', 'prof.xpEarned': 'XP EARNED', 'prof.streakLabel': 'DAILY STREAK', 'prof.days': 'days',
    'lb.title': 'Leaderboard', 'lb.subtitle': 'Learn daily, earn XP, climb the ranks! 🚀', 'lb.sample': 'This is a sample leaderboard. The real one activates once an account (Supabase) is connected.', 'lb.user': 'User', 'lb.you': 'You', 'lb.yourStats': 'Your stats', 'lb.rank': 'Rank', 'lb.boost': 'Boost rank →', 'lb.continueLearning': 'Continue learning',
    'cert.label': 'CERTIFICATE', 'cert.confirms': 'This certificate confirms that:', 'cert.completed': 'successfully completed the course:', 'cert.date': 'DATE', 'cert.lessons': 'LESSONS', 'cert.lessonsUnit': '', 'cert.download': 'Download PNG', 'cert.dashboard': 'Dashboard', 'cert.notFound': 'Course not found', 'cert.loginNeeded': 'Sign in for certificate', 'cert.loginDesc': 'Sign in and complete the course.', 'cert.notComplete': 'Course not finished yet', 'cert.backToCourse': 'Back to course',
    'login.welcome': '// WELCOME', 'login.enterPlatform': 'Sign in to the platform', 'login.signupTitle': 'Sign up', 'login.signinTitle': 'Sign in', 'login.subtitle': 'To save your progress and join the leaderboard.', 'login.chooseAvatar': 'Choose an avatar:', 'login.name': 'Your name', 'login.email': 'Email', 'login.password': 'Password (min 6 chars)', 'login.or': 'or', 'login.google': 'Sign in with Google', 'login.haveAccount': 'Have an account? Sign in', 'login.noAccount': 'No account? Sign up', 'login.forgot': 'Forgot password?', 'login.signup': 'Sign up', 'login.signin': 'Sign in', 'login.enterName': 'Enter your name.', 'login.confirmSent': 'A confirmation email was sent. Confirm and sign in.', 'login.resetSent': 'A password reset link was sent to your email.',
  },
  ru: {
    'nav.phases': 'Этапы',
    'nav.plan': 'План',
    'nav.tools': 'Инструменты',
    'nav.glossary': 'Глоссарий',
    'nav.start': 'Начать →',
    'hero.badge': 'НА РУССКОМ · БЕСПЛАТНО · 2025',
    'hero.title.super': 'супер',
    'hero.title.kurs': 'курс',
    'hero.desc': 'С нуля до LLM. От токенизации до Трансформеров, от fine-tuning до деплоя.',
    'hero.stats.phases': 'Этапов',
    'hero.stats.topics': 'Темы',
    'hero.stats.terms': 'Терминов',
    'hero.stats.time': 'Примерно',
    'hero.btn.start': 'Начать курс',
    'hero.btn.glossary': 'Словарь терминов',
    'lesson.back': '← Назад',
    'lesson.run': '▶ Запустить код',
    'lesson.running': 'Запуск...',
    'lesson.next': 'След. урок →',
    'lesson.prev': '← Пред. урок',
    'lesson.terminal': 'Терминал / Вывод',
    'lesson.task': 'Задание:',
    'lesson.congrats': 'Поздравляем! 🎉',
    'nav.courses': 'Курсы',
    'nav.dashboard': 'Панель',
    'nav.rating': 'Рейтинг',
    'nav.login': 'Войти',
    'hub.badge': 'НА РУССКОМ · БЕСПЛАТНО',
    'hub.title1': 'Платформа',
    'hub.title2': 'изучения ИИ',
    'hub.desc': 'Изучайте искусственный интеллект с нуля. Выберите подходящий курс — интерактивные уроки, живая AI-площадка и практика.',
    'hub.courses': 'КУРСЫ',
    'hub.loading': 'Загрузка курсов...',
    'course.lessons': 'уроков',
    'course.start': 'Начать',
    'course.continue': 'Продолжить',
    'common.allCourses': 'Все курсы',
    'common.home': 'Главная',
    'lr.step': 'ШАГ', 'lr.video': 'ВИДЕО', 'lr.theory': 'ТЕОРИЯ', 'lr.test': 'ТЕСТ', 'lr.finalTest': 'ИТОГОВЫЙ ТЕСТ', 'lr.playground': 'PLAYGROUND', 'lr.practice': 'ПРАКТИКА',
    'lr.videoLesson': 'Видео урок', 'lr.videoSoon': 'Видео скоро будет.', 'lr.readBelow': 'Пока читайте теорию ниже →',
    'lr.next': 'След. урок →', 'lr.continueBtn': 'Продолжить →', 'lr.prev': '← Назад', 'lr.finish': 'Завершить 🏁',
    'lr.codeOk': '✅ Код выполнен успешно!', 'lr.xpAdded': 'XP добавлено! Урок завершён!', 'lr.notFound': 'Урок не найден',
    'quiz.correct': '✅ Верно! Отлично!', 'quiz.wrong': '❌ Попробуйте снова...',
    'fq.check': '✓ Проверить', 'fq.answerAll': 'Ответьте на все вопросы', 'fq.retry': '↻ Повторить',
    'fq.great': 'Отлично!', 'fq.correct': 'верно', 'fq.canProceed': 'Можно продолжать.', 'fq.needMin': 'Нужно минимум', 'fq.needSuffix': 'верных — попробуйте снова.',
    'rm.badge': 'ВИДЕО · ТЕОРИЯ · ТЕСТ', 'rm.topic': 'Темы', 'rm.done': 'Завершено', 'rm.est': 'Примерно', 'rm.video': 'Видео', 'rm.theory': 'Теория', 'rm.test': 'тестов',
    'dash.hello': 'Привет', 'dash.subtitle': 'Продолжим учиться сегодня?', 'dash.level': 'УРОВЕНЬ', 'dash.toNext': 'До след. уровня', 'dash.totalXp': 'ВСЕГО XP', 'dash.streak': 'СТРИК', 'dash.days': 'дней', 'dash.last14': 'ПОСЛЕДНИЕ 14 ДНЕЙ', 'dash.last30': 'ПОСЛЕДНИЕ 30 ДНЕЙ', 'dash.yourCourses': 'Ваши курсы', 'dash.certificate': 'Сертификат', 'dash.saved': 'Сохранённые уроки', 'dash.achievements': 'Достижения', 'dash.loginTitle': 'Войдите для панели', 'dash.loginDesc': 'Войдите, чтобы видеть прогресс, уровень и достижения.',
    'prof.title': 'Личный кабинет', 'prof.member': 'Участник с', 'prof.overall': 'Всего', 'prof.lessons': 'уроков', 'prof.logout': 'Выйти', 'prof.byCourse': 'По курсам', 'prof.completed': 'Завершённые уроки', 'prof.noCompleted': 'Пока нет завершённых уроков.', 'prof.startLessons': 'Начать уроки →', 'prof.viewRating': 'Посмотреть рейтинг 🏆', 'prof.notLoggedIn': 'Вы не вошли', 'prof.loginDesc': 'Войдите с главной страницы, чтобы сохранять прогресс и XP.', 'prof.toHome': 'На главную →', 'prof.xpEarned': 'НАКОПЛЕНО XP', 'prof.streakLabel': 'ЕЖЕДНЕВНЫЙ СТРИК', 'prof.days': 'дней',
    'lb.title': 'Таблица лидеров', 'lb.subtitle': 'Учитесь каждый день, набирайте XP, поднимайтесь в рейтинге! 🚀', 'lb.sample': 'Это — образец рейтинга. Настоящий активируется после подключения аккаунта (Supabase).', 'lb.user': 'Пользователь', 'lb.you': 'Вы', 'lb.yourStats': 'Ваша статистика', 'lb.rank': 'Рейтинг', 'lb.boost': 'Поднять рейтинг →', 'lb.continueLearning': 'Продолжить обучение',
    'cert.label': 'СЕРТИФИКАТ', 'cert.confirms': 'Этот сертификат подтверждает, что:', 'cert.completed': 'успешно завершил курс:', 'cert.date': 'ДАТА', 'cert.lessons': 'УРОКОВ', 'cert.lessonsUnit': '', 'cert.download': 'Скачать PNG', 'cert.dashboard': 'Панель', 'cert.notFound': 'Курс не найден', 'cert.loginNeeded': 'Войдите за сертификатом', 'cert.loginDesc': 'Войдите и завершите курс.', 'cert.notComplete': 'Курс ещё не завершён', 'cert.backToCourse': 'Вернуться к курсу',
    'login.welcome': '// ДОБРО ПОЖАЛОВАТЬ', 'login.enterPlatform': 'Вход на платформу', 'login.signupTitle': 'Регистрация', 'login.signinTitle': 'Вход', 'login.subtitle': 'Чтобы сохранять прогресс и участвовать в рейтинге.', 'login.chooseAvatar': 'Выберите аватар:', 'login.name': 'Ваше имя', 'login.email': 'Email', 'login.password': 'Пароль (мин. 6 символов)', 'login.or': 'или', 'login.google': 'Войти через Google', 'login.haveAccount': 'Есть аккаунт? Войти', 'login.noAccount': 'Нет аккаунта? Регистрация', 'login.forgot': 'Забыли пароль?', 'login.signup': 'Регистрация', 'login.signin': 'Войти', 'login.enterName': 'Введите имя.', 'login.confirmSent': 'Письмо с подтверждением отправлено. Подтвердите и войдите.', 'login.resetSent': 'Ссылка для сброса пароля отправлена на email.',
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [lang, setLangState] = useState<Lang>('uz');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    let initialTheme: Theme;
    if (savedTheme === 'dark' || savedTheme === 'light') {
      initialTheme = savedTheme;
    } else {
      // Tizim sozlamasini o'qi
      initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    setThemeState(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    // OS dark mode o'zgarganda avtomatik yangilansin (faqat localStorage'da qiymat bo'lmasa)
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const t: Theme = e.matches ? 'dark' : 'light';
        setThemeState(t);
        document.documentElement.setAttribute('data-theme', t);
      }
    };
    mq.addEventListener('change', onSystemChange);

    const savedLang = localStorage.getItem('lang') as Lang;
    if (savedLang) setLangState(savedLang);
    setMounted(true);

    return () => mq.removeEventListener('change', onSystemChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  };

  const t = (key: string) => {
    return (translations[lang] as Record<string, string>)[key] || key;
  };

  // Hidratsiya mosligini saqlash uchun mount bo'lguncha yengil splash
  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div className="spinner" aria-label="Yuklanmoqda" />
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ theme, toggleTheme, lang, setLang, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
