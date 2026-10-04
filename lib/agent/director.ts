import type { Lesson } from '@/content/schema';
import type { TeachTurn } from './teachScript';

export type MascotMood =
  | 'idle'
  | 'talk'
  | 'cheer'
  | 'think'
  | 'nudge'
  | 'wiggle'
  | 'celebrate';

export interface DirectorInput {
  turn?: TeachTurn;
  lesson: Lesson;
  /** Ms since the child's last tap, answer, or finished challenge */
  idleMs: number;
  /** Waiting on a smart (LLM) reply */
  thinking: boolean;
  /** Outcome of the latest exercise moment, cleared on advance */
  lastResult?: 'correct' | 'wrong' | null;
}

export interface Direction {
  mood: MascotMood;
  /** Spoken only when the mascot must refocus a drifting child */
  focusLine?: string;
}

/** A drifted child gets one gentle pull back to the mission per lesson. */
export const IDLE_NUDGE_MS = 30_000;

/**
 * Meadow's agentic brain: every moment maps to a mood + optional action.
 * Rule-based and offline-first — the mascot decides, never just reads.
 */
export function directMascot(s: DirectorInput): Direction {
  if (s.thinking) return { mood: 'think' };
  if (s.turn?.phase === 'celebrate') return { mood: 'celebrate' };
  if (s.turn?.phase === 'break') return { mood: 'wiggle' };
  if (s.turn?.phase === 'level_up') return { mood: 'cheer' };
  if (s.lastResult === 'correct') return { mood: 'cheer' };
  if (s.lastResult === 'wrong') return { mood: 'talk' };
  if (s.turn?.waitForChild && s.idleMs > IDLE_NUDGE_MS) {
    return {
      mood: 'nudge',
      focusLine: `Our mission: ${s.lesson.summary} — let's do it together!`,
    };
  }
  if (s.turn?.phase === 'exercise') return { mood: 'idle' };
  return { mood: 'talk' };
}
