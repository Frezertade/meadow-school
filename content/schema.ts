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

export type ExerciseKind = 'reading' | 'math' | 'drawing' | 'listen-say';

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

export type Exercise = ReadingExercise | MathExercise | DrawingExercise;

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
}

export interface CurriculumBand {
  id: AgeBand;
  label: string;
  ageRange: string;
  description: string;
  lessons: Lesson[];
}
