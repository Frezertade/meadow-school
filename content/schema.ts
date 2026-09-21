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

export type PaLevel = 'prek' | 'elementary-K6';

export interface PaAlignment {
  /** PA home-ed subject bucket from 24 P.S. § 13-1327.1(c)(1) when applicable */
  statuteSubjects: string[];
  /** Optional Chapter 4 / ELDS style tags for planning */
  standardsTags: string[];
  level: PaLevel;
}

export interface LessonBlock {
  id: string;
  kind: 'story' | 'teach' | 'prompt' | 'celebrate';
  title?: string;
  text: string;
  /** Short spoken-friendly line for the tutor to echo */
  tutorCue?: string;
}

export interface ReadingExercise {
  kind: 'reading';
  id: string;
  instruction: string;
  /** Words or letters to identify */
  prompt: string;
  choices: string[];
  answer: string;
  hint: string;
}

export interface MathExercise {
  kind: 'math';
  id: string;
  instruction: string;
  /** Visual count objects, e.g. "🍎🍎🍎" */
  visual?: string;
  prompt: string;
  choices: string[];
  answer: string;
  hint: string;
}

export interface DrawingExercise {
  kind: 'drawing';
  id: string;
  instruction: string;
  /** What to draw — kept concrete and age-safe */
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
  /** Full text the tutor may use — ONLY this + exercises for grounding */
  groundingText: string;
  pa: PaAlignment;
  blocks: LessonBlock[];
  exercises: Exercise[];
}

export interface CurriculumBand {
  id: AgeBand;
  label: string;
  ageRange: string;
  description: string;
  lessons: Lesson[];
}
