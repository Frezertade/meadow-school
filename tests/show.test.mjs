import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import './lib/register.mjs';

const { VOICE_FX, voiceEffectFor } = await import('@/lib/voiceFx');
const { directMascot, IDLE_NUDGE_MS } = await import('@/lib/agent/director');
const { playStinger } = await import('@/lib/sfx');

const lesson = { id: 'l', summary: 'Count to 3.' };
const turn = (phase, waitForChild = true) => ({ phase, say: 'hi', waitForChild });

describe('voiceFx', () => {
  it('every phase has a sane preset', () => {
    for (const [phase, fx] of Object.entries(VOICE_FX)) {
      assert.ok(fx.rate >= 0.7 && fx.rate <= 1.15, `${phase} rate in TTS range`);
      assert.ok(fx.pitch >= 0.8 && fx.pitch <= 1.5, `${phase} pitch in character range`);
    }
  });
  it('celebrate is the most excited voice', () => {
    const pitches = Object.values(VOICE_FX).map((f) => f.pitch);
    assert.equal(voiceEffectFor('celebrate').pitch, Math.max(...pitches));
  });
  it('milestones carry stingers', () => {
    assert.equal(voiceEffectFor('celebrate').stinger, 'fanfare');
    assert.equal(voiceEffectFor('level_up').stinger, 'ding');
    assert.equal(voiceEffectFor('break').stinger, 'boing');
  });
});

describe('sfx', () => {
  it('never throws without audio hardware', () => {
    assert.doesNotThrow(() => playStinger('ding'));
    assert.doesNotThrow(() => playStinger('fanfare'));
  });
});

describe('directMascot', () => {
  const base = { lesson, idleMs: 0, thinking: false };
  it('thinks while waiting on a smart reply', () => {
    assert.equal(directMascot({ ...base, thinking: true }).mood, 'think');
  });
  it('celebrates, cheers level-ups, wiggles on breaks', () => {
    assert.equal(directMascot({ ...base, turn: turn('celebrate') }).mood, 'celebrate');
    assert.equal(directMascot({ ...base, turn: turn('level_up') }).mood, 'cheer');
    assert.equal(directMascot({ ...base, turn: turn('break') }).mood, 'wiggle');
  });
  it('mirrors the latest exercise outcome', () => {
    assert.equal(
      directMascot({ ...base, turn: turn('exercise'), lastResult: 'correct' }).mood,
      'cheer'
    );
    assert.equal(
      directMascot({ ...base, turn: turn('exercise'), lastResult: 'wrong' }).mood,
      'talk'
    );
  });
  it('nudges a drifting child back to the mission', () => {
    const d = directMascot({ ...base, turn: turn('check'), idleMs: IDLE_NUDGE_MS + 1 });
    assert.equal(d.mood, 'nudge');
    assert.ok(d.focusLine?.includes('Our mission'));
    assert.ok(d.focusLine?.includes('Count to 3.'));
  });
  it('stays quiet-talking when the child is engaged', () => {
    assert.equal(directMascot({ ...base, turn: turn('teach'), idleMs: 1000 }).mood, 'talk');
  });
  it('watches silently during challenges', () => {
    assert.equal(directMascot({ ...base, turn: turn('exercise') }).mood, 'idle');
  });
});
