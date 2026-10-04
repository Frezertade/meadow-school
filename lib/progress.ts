import type { Difficulty, Exercise, Lesson } from '@/content/schema';

export function exerciseDifficulty(ex: Exercise): Difficulty {
  return ex.difficulty ?? 1;
}

/** Exercises sorted easy → strong */
export function orderedExercises(lesson: Lesson): Exercise[] {
  return [...lesson.exercises].sort(
    (a, b) => exerciseDifficulty(a) - exerciseDifficulty(b) || a.id.localeCompare(b.id)
  );
}

/** Highest difficulty the learner may attempt right now */
export function unlockedDifficulty(
  lesson: Lesson,
  completedExerciseIds: string[]
): Difficulty {
  const ordered = orderedExercises(lesson);
  const levels: Difficulty[] = [1, 2, 3];
  let unlocked: Difficulty = 1;

  for (const level of levels) {
    const atLevel = ordered.filter((e) => exerciseDifficulty(e) === level);
    if (atLevel.length === 0) continue;
    const allDone = atLevel.every((e) => completedExerciseIds.includes(e.id));
    if (allDone && level < 3) {
      unlocked = (level + 1) as Difficulty;
    } else {
      break;
    }
  }
  return unlocked;
}

export function isExerciseUnlocked(
  lesson: Lesson,
  exercise: Exercise,
  completedExerciseIds: string[]
): boolean {
  return exerciseDifficulty(exercise) <= unlockedDifficulty(lesson, completedExerciseIds);
}

export function isLessonUnlocked(
  lesson: Lesson,
  bandLessons: Lesson[],
  completedMap: Record<string, string[]>,
  childId: string
): boolean {
  if (!lesson.requiresLessonId) return true;
  const prior = bandLessons.find((l) => l.id === lesson.requiresLessonId);
  if (!prior) return true;
  const key = `${childId}:${prior.id}`;
  const done = completedMap[key] || [];
  return prior.exercises.every((e) => done.includes(e.id));
}

export function sortedPathLessons(lessons: Lesson[]): Lesson[] {
  return [...lessons].sort(
    (a, b) => (a.pathOrder ?? 99) - (b.pathOrder ?? 99) || a.title.localeCompare(b.title)
  );
}

export function difficultyLabel(d: Difficulty): string {
  if (d === 1) return 'Warm-up';
  if (d === 2) return 'Stretch';
  return 'Strong';
}
