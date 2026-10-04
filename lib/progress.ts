import type { Difficulty, Exercise, Lesson } from '@/content/schema';

/** Parent-facing label per scope.md skill slug */
export const SKILL_LABELS: Record<string, string> = {
  'letter-names': 'Letter names',
  'count-3': 'Counting to 3',
  'color-name': 'Color names',
  'stop-drop': 'Fire drill basics',
  'rhyme-play': 'Rhyming play',
  'book-habits': 'Book habits',
  'count-5': 'Counting to 5',
  'shapes-basic': 'Basic shapes',
  'sort-one': 'Sorting by color',
  'nature-notice': 'Noticing nature',
  'community-me': 'Neighbor helpers',
  'beat-clap': 'Rhythm & beat',
  'healthy-habits': 'Healthy habits',
  'letter-sounds': 'Letter sounds',
  'blend-cat': 'Blending: cat',
  'blend-dog': 'Blending: dog',
  'first-sounds': 'First sounds',
  'count-10': 'Counting to 10',
  'add-5': 'Adding to 5',
  'count-20': 'Counting to 20',
  'patterns-ab': 'AB patterns',
  'pa-home': 'Pennsylvania is home',
  seasons: 'Seasons & weather',
  'kind-choices': 'Kind choices',
  'draw-tell': 'Draw and tell',
  'write-cvc': 'Spelling CVC words',
  'short-a': 'Short-a families',
  'add-10': 'Adding to 10',
  'plant-needs': 'What plants need',
  'pa-symbols': 'PA symbols',
  'fire-plan': 'Family fire plan',
  blends: 'Beginning blends',
  'write-sentences': 'Writing sentences',
  retell: 'Retelling stories',
  'sub-10': 'Subtracting to 10',
  'word-problems': 'Word problems',
  'tens-ones': 'Tens and ones',
  weather: 'Where rain comes from',
  'map-skills': 'Map skills',
  'community-rules': 'Community rules',
};

export function skillLabel(skillId: string): string {
  return SKILL_LABELS[skillId] ?? skillId;
}

export type SkillLevel = 'new' | 'practicing' | 'solid';

/** seen = completed exercises practicing this skill */
export function skillLevel(seen: number): SkillLevel {
  if (seen >= 3) return 'solid';
  if (seen >= 1) return 'practicing';
  return 'new';
}

/** Distinct skill ids practiced in a lesson, in first-appearance order */
export function lessonSkills(lesson: Lesson): string[] {
  const out: string[] = [];
  for (const ex of lesson.exercises) {
    if (!out.includes(ex.skillId)) out.push(ex.skillId);
  }
  return out;
}

export interface SkillSnapshot {
  seen: number;
  lastSeen: string;
}

/**
 * Skills in this lesson that need review most: least-practiced first,
 * stalest first. Only returns skills the child has actually touched but not
 * yet mastered — unseen skills are new material, not review.
 */
export function weakestSkills(
  lesson: Lesson,
  childId: string,
  mastery: Record<string, SkillSnapshot>,
  count: number
): string[] {
  return lessonSkills(lesson)
    .map((skillId) => {
      const snap = mastery[`${childId}:${skillId}`];
      return { skillId, seen: snap?.seen ?? 0, lastSeen: snap?.lastSeen ?? '' };
    })
    .filter((s) => s.seen >= 1 && skillLevel(s.seen) !== 'solid')
    .sort((a, b) => a.seen - b.seen || a.lastSeen.localeCompare(b.lastSeen))
    .slice(0, Math.max(0, count))
    .map((s) => s.skillId);
}

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
