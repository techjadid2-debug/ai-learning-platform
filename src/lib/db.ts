import { supabase, isSupabaseConfigured } from './supabase';
import { courses as staticCourses, Course } from '../courses';
import { lessons as staticLessons, Lesson, LessonStep, CourseId } from '../lessons';

// Admin ekanligini tekshirish
export async function checkIsAdmin(email?: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || !email) return false;
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('email')
      .eq('email', email)
      .maybeSingle();
    return !!data;
  } catch (err) {
    console.error('Error checking admin status:', err);
    return false;
  }
}

// ── Kurslar amallari ───────────────────────────────────────────

export async function getDBCourses(): Promise<Course[]> {
  if (!isSupabaseConfigured || !supabase) {
    return staticCourses;
  }
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return staticCourses;

    return data.map((row) => ({
      id: row.id as CourseId,
      slug: row.slug,
      title: row.title,
      subtitle: row.subtitle || '',
      desc: row.description || '',
      color: row.color || '#2f6bff',
      bg: row.bg_color || 'rgba(47,107,255,0.08)',
      icon: row.icon || '📚',
      estimate: row.estimate || '',
      level: row.level || '',
      coverImage: row.cover_image || '',
    }));
  } catch (err) {
    console.error('Error fetching courses from DB, using static fallback:', err);
    return staticCourses;
  }
}

export async function getAllDBCoursesAdmin(): Promise<any[]> {
  if (!isSupabaseConfigured || !supabase) return staticCourses;
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

// ── Darslar amallari ───────────────────────────────────────────

export async function getDBLessons(courseId: CourseId): Promise<Lesson[]> {
  if (!isSupabaseConfigured || !supabase) {
    return staticLessons.filter(l => l.course === courseId);
  }
  try {
    // Darslarni yuklash
    const { data: lessonsData, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('sort_order', { ascending: true });

    if (lessonsError) throw lessonsError;
    if (!lessonsData || lessonsData.length === 0) {
      return staticLessons.filter(l => l.course === courseId);
    }

    // Har bir darsning qadamlarini yuklash
    const { data: stepsData, error: stepsError } = await supabase
      .from('lesson_steps')
      .select('*')
      .order('sort_order', { ascending: true });

    if (stepsError) throw stepsError;

    return lessonsData.map((lessonRow) => {
      const lessonSteps = (stepsData || [])
        .filter((stepRow) => stepRow.lesson_id === lessonRow.id)
        .map((stepRow) => {
          const step: LessonStep = {
            type: stepRow.type as any,
            title: stepRow.title,
            content: stepRow.content,
          };
          if (stepRow.code) step.code = stepRow.code;
          if (stepRow.success_check) step.successCheck = stepRow.success_check;
          if (stepRow.quiz_data) step.quiz = stepRow.quiz_data;
          if (stepRow.questions_data) step.questions = stepRow.questions_data;
          if (stepRow.playground_data) step.playground = stepRow.playground_data;
          if (stepRow.video_data) step.video = stepRow.video_data;
          return step;
        });

      return {
        id: lessonRow.id,
        course: courseId,
        phase: lessonRow.phase || 0,
        topic: lessonRow.topic || 0,
        title: lessonRow.title,
        xp: lessonRow.xp || 100,
        steps: lessonSteps,
      };
    });
  } catch (err) {
    console.error(`Error fetching lessons for ${courseId}, using static fallback:`, err);
    return staticLessons.filter(l => l.course === courseId);
  }
}

export async function getAllDBLessonsAdmin(): Promise<any[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from('lessons')
    .select('*, courses(title)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getDBLessonById(lessonId: string): Promise<Lesson | null> {
  if (!isSupabaseConfigured || !supabase) {
    return staticLessons.find(l => l.id === lessonId) || null;
  }
  try {
    const { data: lessonRow, error: lessonError } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .maybeSingle();

    if (lessonError) throw lessonError;
    if (!lessonRow) {
      return staticLessons.find(l => l.id === lessonId) || null;
    }

    const { data: stepsData, error: stepsError } = await supabase
      .from('lesson_steps')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('sort_order', { ascending: true });

    if (stepsError) throw stepsError;

    const lessonSteps = (stepsData || []).map((stepRow) => {
      const step: LessonStep = {
        type: stepRow.type as any,
        title: stepRow.title,
        content: stepRow.content,
      };
      if (stepRow.code) step.code = stepRow.code;
      if (stepRow.success_check) step.successCheck = stepRow.success_check;
      if (stepRow.quiz_data) step.quiz = stepRow.quiz_data;
      if (stepRow.questions_data) step.questions = stepRow.questions_data;
      if (stepRow.playground_data) step.playground = stepRow.playground_data;
      if (stepRow.video_data) step.video = stepRow.video_data;
      return step;
    });

    return {
      id: lessonRow.id,
      course: lessonRow.course_id as CourseId,
      phase: lessonRow.phase || 0,
      topic: lessonRow.topic || 0,
      title: lessonRow.title,
      xp: lessonRow.xp || 100,
      steps: lessonSteps,
    };
  } catch (err) {
    console.error(`Error fetching lesson ${lessonId} from DB, using static fallback:`, err);
    return staticLessons.find(l => l.id === lessonId) || null;
  }
}
