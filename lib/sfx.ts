export type SfxName = 'pop' | 'ding' | 'fanfare' | 'whoosh' | 'boing';

/**
 * Tiny synthesized sound effects — no audio files, no new dependencies.
 * Web: Web Audio API (unlocked on first tap). Anywhere else: silent no-op
 * (voice narration still carries feedback there). Deliberately imports
 * nothing platform-specific so this module stays unit-testable in node.
 */
let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    try {
      ctx = new AC();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') {
    void ctx.resume().catch(() => {});
  }
  return ctx;
}

/** MUST be called from a tap handler at least once (browser autoplay policy). */
export function unlockSfx(): void {
  audio();
}

function tone(
  ac: AudioContext,
  freq: number,
  startIn: number,
  dur: number,
  type: OscillatorType = 'sine',
  vol = 0.12
): void {
  const t0 = ac.currentTime + startIn;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function play(fn: (ac: AudioContext) => void): void {
  try {
    const ac = audio();
    if (ac) fn(ac);
  } catch {
    // sound must never break the lesson
  }
}

export function playPop(): void {
  play((ac) => tone(ac, 620, 0, 0.12, 'triangle', 0.14));
}

export function playDing(): void {
  play((ac) => {
    tone(ac, 880, 0, 0.25, 'sine', 0.14);
    tone(ac, 1320, 0.08, 0.3, 'sine', 0.1);
  });
}

export function playFanfare(): void {
  play((ac) => {
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => tone(ac, n, i * 0.11, 0.28, 'triangle', 0.14));
    tone(ac, 1319, 0.44, 0.5, 'sine', 0.1);
  });
}

export function playWhoosh(): void {
  play((ac) => {
    tone(ac, 300, 0, 0.22, 'sawtooth', 0.05);
    tone(ac, 700, 0.06, 0.2, 'sawtooth', 0.04);
  });
}

export function playBoing(): void {
  play((ac) => {
    tone(ac, 180, 0, 0.3, 'square', 0.06);
    tone(ac, 320, 0.05, 0.28, 'square', 0.05);
  });
}

const PLAYERS: Record<SfxName, () => void> = {
  pop: playPop,
  ding: playDing,
  fanfare: playFanfare,
  whoosh: playWhoosh,
  boing: playBoing,
};

export function playStinger(name: SfxName): void {
  PLAYERS[name]();
}
