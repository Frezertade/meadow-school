/**
 * Curriculum schema for HomeSchool.
 * Aligns with PA home-education subject expectations while staying age-appropriate.
 * See content/pa-alignment.ts for statute/standards mapping.
 */

export type AgeBand = 'ages-3-4' | 'ages-5' | 'ages-6-7';

export type SubjectId =
  | 'english'
  | 'math'
  | 'art'
  | 'science'
  | 'social'
  | 'health'
  | 'music'
  | 'safety';

export type ExerciseKind = 'reading' | 'math' | 'drawing' | 'listen-say' | 'sequence';

/** 1 = warm-up, 2 = stretch, 3 = strong challenge */
export type Difficulty = 1 | 2 | 3;

export type PaLevel = 'prek' | 'elementary-K6';

export interface PaAlignment {
  statuteSubjects: string[];
  standardsTags: string[];
  level: PaLevel;
}

export interface LessonBlock {
  id: string;
  kind: 'story' | 'teach' | 'prompt' | 'celebrate';
  title?: string;
  text: string;
  tutorCue?: string;
}

interface ExerciseBase {
  id: string;
  /** Stable skill slug from content/scope.md — drives mastery + parent grid */
  skillId: string;
  /** Incremental difficulty within the lesson (default 1) */
  difficulty?: Difficulty;
}

export interface ReadingExercise extends ExerciseBase {
  kind: 'reading';
  instruction: string;
  prompt: string;
  choices: string[];
  answer: string;
  hint: string;
}

export interface MathExercise extends ExerciseBase {
  kind: 'math';
  instruction: string;
  visual?: string;
  prompt: string;
  choices: string[];
  answer: string;
  hint: string;
}

export interface DrawingExercise extends ExerciseBase {
  kind: 'drawing';
  instruction: string;
  prompt: string;
  successMessage: string;
}

export interface ListenSayExercise extends ExerciseBase {
  kind: 'listen-say';
  instruction: string;
  /** Word/phrase Meadow says and the child repeats back */
  phrase: string;
  /** Accepted transcript words (lowercase). Defaults to the phrase's words. */
  accept?: string[];
  hint: string;
}

export interface SequenceExercise extends ExerciseBase {
  kind: 'sequence';
  instruction: string;
  prompt: string;
  /** Steps to arrange (presented shuffled) */
  items: string[];
  /** Correct order — same multiset as items */
  answer: string[];
  hint: string;
}

export type Exercise =
  | ReadingExercise
  | MathExercise
  | DrawingExercise
  | ListenSayExercise
  | SequenceExercise;

export interface Lesson {
  id: string;
  ageBand: AgeBand;
  subject: SubjectId;
  title: string;
  minutes: number;
  summary: string;
  groundingText: string;
  pa: PaAlignment;
  blocks: LessonBlock[];
  exercises: Exercise[];
  /** Order in the age-band learning path (1 = first) */
  pathOrder?: number;
  /** Must finish this lesson before unlocking (same band) */
  requiresLessonId?: string;
  /** Easier on-ramp line offered when the child is stuck (below-level branch) */
  support?: string;
  /** Harder twist teased at celebration (above-level branch) */
  stretch?: string;
  /** Big on-stage visual for the Show (emoji/letters, e.g. "Aa 🍎") */
  spotlight?: string;
}

export interface CurriculumBand {
  id: AgeBand;
  label: string;
  ageRange: string;
  description: string;
  lessons: Lesson[];
}
