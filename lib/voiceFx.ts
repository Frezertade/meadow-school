import type { TeachPhase } from '@/lib/agent/teachScript';
import type { SfxName } from '@/lib/sfx';

export interface VoiceEffect {
  /** Speech rate multiplier (device TTS + neural where supported) */
  rate: number;
  /** Voice pitch multiplier — the character knob */
  pitch: number;
  /** Sound-effect stinger fired with the line */
  stinger?: SfxName;
}

/**
 * Meadow's character voices, one per teaching moment.
 * A celebration should SOUND like a celebration — never flat narration.
 */
export const VOICE_FX: Record<TeachPhase, VoiceEffect> = {
  greet: { rate: 0.92, pitch: 1.1, stinger: 'pop' },
  review: { rate: 0.9, pitch: 1.05 },
  teach: { rate: 0.9, pitch: 1.05 },
  check: { rate: 0.95, pitch: 1.12 },
  exercise_intro: { rate: 0.93, pitch: 1.08, stinger: 'whoosh' },
  exercise: { rate: 0.9, pitch: 1.0 },
  react: { rate: 0.95, pitch: 1.1 },
  level_up: { rate: 0.95, pitch: 1.18, stinger: 'ding' },
  celebrate: { rate: 1.0, pitch: 1.3, stinger: 'fanfare' },
  break: { rate: 1.02, pitch: 1.25, stinger: 'boing' },
  chat: { rate: 0.93, pitch: 1.08 },
};

export function voiceEffectFor(phase: TeachPhase): VoiceEffect {
  return VOICE_FX[phase];
}
