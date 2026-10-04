import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import './lib/register.mjs';

const progress = await import('@/lib/progress');
const {
  exerciseDifficulty,
  orderedExercises,
  unlockedDifficulty,
  isLessonUnlocked,
  skillLevel,
  lessonSkills,
  weakestSkills,
} = progress;

const ex = (id, difficulty, skillId = 'count-3') => ({
  kind: 'reading',
  id,
  skillId,
  difficulty,
  instruction: 'i',
  prompt: 'p',
  choices: ['a', 'b'],
  answer: 'a',
  hint: 'h',
});

const lesson = { id: 'l1', exercises: [ex('r2', 2), ex('r1', 1), ex('r3', 3)] };

describe('exerciseDifficulty', () => {
  it('defaults to 1 when unset', () => {
    assert.equal(exerciseDifficulty({ id: 'x' }), 1);
  });
});

describe('orderedExercises', () => {
  it('sorts easy to strong', () => {
    assert.deepEqual(
      orderedExercises(lesson).map((e) => e.id),
      ['r1', 'r2', 'r3']
    );
  });
});

describe('unlockedDifficulty', () => {
  it('starts at 1 with nothing done', () => {
    assert.equal(unlockedDifficulty(lesson, []), 1);
  });
  it('unlocks 2 when all warm-ups done', () => {
    assert.equal(unlockedDifficulty(lesson, ['r1']), 2);
  });
  it('unlocks 3 when warm-ups and stretch done', () => {
    assert.equal(unlockedDifficulty(lesson, ['r1', 'r2']), 3);
  });
  it('stays gated when a level is half-done', () => {
    const two = { id: 'l2', exercises: [ex('a', 1), ex('b', 1), ex('c', 2)] };
    assert.equal(unlockedDifficulty(two, ['a']), 1);
    assert.equal(unlockedDifficulty(two, ['a', 'b']), 2);
  });
});

describe('isLessonUnlocked', () => {
  const band = [{ id: 'l1', exercises: [{ id: 'e1' }] }, { id: 'l2', requiresLessonId: 'l1', exercises: [] }];
  it('first lesson is always open', () => {
    assert.equal(isLessonUnlocked(band[0], band, {}, 'kid'), true);
  });
  it('locked until every prior exercise is done', () => {
    assert.equal(isLessonUnlocked(band[1], band, {}, 'kid'), false);
    assert.equal(isLessonUnlocked(band[1], band, { 'kid:l1': ['e1'] }, 'kid'), true);
  });
});

describe('skillLevel', () => {
  it('thresholds: 0 new, 1-2 practicing, 3+ solid', () => {
    assert.equal(skillLevel(0), 'new');
    assert.equal(skillLevel(1), 'practicing');
    assert.equal(skillLevel(2), 'practicing');
    assert.equal(skillLevel(3), 'solid');
    assert.equal(skillLevel(9), 'solid');
  });
});

describe('lessonSkills + weakestSkills', () => {
  const l = {
    id: 'l',
    exercises: [ex('a', 1, 's1'), ex('b', 1, 's2'), ex('c', 2, 's1'), ex('d', 3, 's3')],
  };
  it('dedupes skills in first-appearance order', () => {
    assert.deepEqual(lessonSkills(l), ['s1', 's2', 's3']);
  });
  it('returns least-practiced below-solid skills first', () => {
    const mastery = { 'kid:s1': { seen: 3, lastSeen: '2026-01-01' } };
    assert.deepEqual(weakestSkills(l, 'kid', mastery, 5), ['s2', 's3']);
  });
  it('excludes solid skills and respects count', () => {
    const mastery = {
      'kid:s1': { seen: 1, lastSeen: '2026-02-01' },
      'kid:s2': { seen: 2, lastSeen: '2026-01-01' },
    };
    // seen 0 (s3) < seen 1 (s1) < seen 2 (s2): least-practiced first
    assert.deepEqual(weakestSkills(l, 'kid', mastery, 2), ['s3', 's1']);
  });
});
