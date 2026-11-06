import { SupabaseClient } from '@supabase/supabase-js';
import { courses as staticCourses } from '../courses';
import { lessons as staticLessons } from '../lessons';

export interface SyncResult {
  success: boolean;
  message: string;
  details?: string;
}

export async function syncStaticDataToDB(supabaseClient: SupabaseClient): Promise<SyncResult> {
  try {
    console.log('Syncing courses...');
    for (let i = 0; i < staticCourses.length; i++) {
      const course = staticCourses[i];
      const { error: courseErr } = await supabaseClient
        .from('courses')
        .upsert({
          id: course.id,
          slug: course.slug,
          title: course.title,
          subtitle: course.subtitle,
          description: course.desc,
          icon: course.icon,
          color: course.color,
          bg_color: course.bg,
          cover_image: course.coverImage,
          estimate: course.estimate,
          level: course.level,
          is_published: true,
          sort_order: i,
        }, { onConflict: 'id' });

      if (courseErr) {
        throw new Error(`Course upsert error (${course.id}): ${courseErr.message}`);
      }
    }

    console.log('Syncing lessons and steps...');
    for (let i = 0; i < staticLessons.length; i++) {
      const lesson = staticLessons[i];
      
      const { error: lessonErr } = await supabaseClient
        .from('lessons')
        .upsert({
          id: lesson.id,
          course_id: lesson.course,
          title: lesson.title,
          phase: lesson.phase,
          topic: lesson.topic,
          xp: lesson.xp,
          sort_order: i,
          is_published: true,
        }, { onConflict: 'id' });

      if (lessonErr) {
        throw new Error(`Lesson upsert error (${lesson.id}): ${lessonErr.message}`);
      }

      // Delete existing steps for this lesson to prevent duplicates or orphans
      const { error: deleteStepsErr } = await supabaseClient
        .from('lesson_steps')
        .delete()
        .eq('lesson_id', lesson.id);

      if (deleteStepsErr) {
        throw new Error(`Delete steps error (${lesson.id}): ${deleteStepsErr.message}`);
      }

      // Insert new steps
      if (lesson.steps && lesson.steps.length > 0) {
        const stepsToInsert = lesson.steps.map((step, stepIndex) => ({
          lesson_id: lesson.id,
          type: step.type,
          title: step.title,
          content: step.content,
          code: step.code || null,
          success_check: step.successCheck || null,
          quiz_data: step.quiz || null,
          questions_data: step.questions || null,
          playground_data: step.playground || null,
          video_data: step.video || null,
          sort_order: stepIndex,
        }));

        const { error: insertStepsErr } = await supabaseClient
          .from('lesson_steps')
          .insert(stepsToInsert);

        if (insertStepsErr) {
          throw new Error(`Insert steps error (${lesson.id}): ${insertStepsErr.message}`);
        }
      }
    }

    return {
      success: true,
      message: `Muvaffaqiyatli sinxronizatsiya qilindi: ${staticCourses.length} ta kurs, ${staticLessons.length} ta dars va ularning qadamlari bazada yangilandi.`,
    };
  } catch (err: any) {
    console.error('Sinxronizatsiya xatoligi:', err);
    return {
      success: false,
      message: 'Sinxronizatsiya jarayonida xatolik yuz berdi.',
      details: err.message || String(err),
    };
  }
}
