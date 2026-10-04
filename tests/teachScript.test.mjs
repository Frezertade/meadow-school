import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import './lib/register.mjs';

const { buildTeachPlan, reactToChildReply } = await import('@/lib/agent/teachScript');

const reading = (id, difficulty, skillId = 'short-a') => ({
  kind: 'reading',
  id,
  skillId,
  difficulty,
  instruction: 'Do it',
  prompt: 'Pick',
  choices: ['a', 'b'],
  answer: 'a',
  hint: 'Think again',
});

const lesson = (over = {}) => ({
  id: 't1',
  ageBand: 'ages-5',
  subject: 'english',
  title: 'Test Lesson',
  minutes: 8,
  summary: 's',
  groundingText: 'goal facts '.repeat(20),
  pa: {
    level: 'elementary-K6',
    statuteSubjects: ['English (spelling, reading, writing)'],
    standardsTags: ['t'],
  },
  blocks: [{ id: 'b1', kind: 'teach', text: 'Hello there.', tutorCue: 'Wave hello.' }],
  exercises: [reading('r1', 1), reading('r2', 2), reading('r3', 3), reading('r4', 3)],
  support: 'Just point with me.',
  stretch: 'Read two words next time!',
  ...over,
});

describe('buildTeachPlan', () => {
  it('opens with a greet turn and closes with celebrate', () => {
    const plan = buildTeachPlan(lesson(), 'Sam');
    assert.equal(plan[0].phase, 'greet');
    assert.ok(plan[0].say.includes('Sam'));
    assert.equal(plan[plan.length - 1].phase, 'celebrate');
  });
  it('inserts a spaced-review turn when labels are passed', () => {
    const plan = buildTeachPlan(lesson(), 'Sam', ['Counting to 10']);
    assert.equal(plan[1].phase, 'review');
    assert.ok(plan[1].say.includes('Counting to 10'));
  });
  it('skips the review turn when no labels', () => {
    const plan = buildTeachPlan(lesson(), 'Sam');
    assert.ok(!plan.some((t) => t.phase === 'review'));
  });
  it('inserts a wiggle break for lessons with 4+ exercises', () => {
    const plan = buildTeachPlan(lesson(), 'Sam');
    const breaks = plan.filter((t) => t.phase === 'break');
    assert.equal(breaks.length, 1);
    assert.ok(breaks[0].say.includes('wiggle break'));
  });
  it('no break for short lessons', () => {
    const short = lesson({ exercises: [reading('r1', 1), reading('r2', 2)] });
    assert.ok(!buildTeachPlan(short, 'Sam').some((t) => t.phase === 'break'));
  });
  it('never reads a difficulty tier label or card title aloud', () => {
    const ex = reading('r1', 1);
    ex.instruction = 'Warm-up: Tap the Aa card';
    const plan = buildTeachPlan(lesson({ exercises: [ex] }), 'Sam');
    const spoken = plan.map((t) => t.say || '').join(' | ');
    assert.ok(!/\b(Warm-up|Stretch|Strong)\b/.test(spoken), `tier label spoken: ${spoken}`);
    assert.ok(!spoken.includes('Tap the Aa card'), `card title spoken: ${spoken}`);
  });
  it('speaks the real prompt on the exercise turn', () => {
    const ex = reading('r1', 1);
    ex.prompt = 'Which one says Aa?';
    const plan = buildTeachPlan(lesson({ exercises: [ex] }), 'Sam');
    const turn = plan.find((t) => t.phase === 'exercise');
    assert.equal(turn.say, 'Which one says Aa?');
  });
  it('drops the canned presence line that repeated on every exercise', () => {
    const plan = buildTeachPlan(lesson(), 'Sam');
    const spoken = plan.map((t) => t.say || '');
    assert.ok(!spoken.some((s) => /stay right here/i.test(s)));
  });
  it('celebrate teases the stretch twist and next lesson', () => {
    const plan = buildTeachPlan(lesson(), 'Sam', [], { nextTitle: 'Next One' });
    const last = plan[plan.length - 1];
    assert.ok(last.say.includes('Read two words next time!'));
    assert.ok(last.say.includes('Next One'));
  });
  it('skipWarmups greets a returning learner', () => {
    const plan = buildTeachPlan(lesson(), 'Sam', [], { skipWarmups: true });
    assert.ok(plan[0].say.includes('Welcome back'));
  });
  it('memory line personalizes the greeting', () => {
    const plan = buildTeachPlan(lesson(), 'Sam', [], { memoryLine: 'Last time you finished Apples!' });
    assert.ok(plan[0].say.includes('Last time you finished Apples!'));
  });
});

describe('reactToChildReply', () => {
  const exTurn = { phase: 'exercise', say: 'go', exerciseId: 'r2' };
  it('hint returns the exercise hint plus the support on-ramp', () => {
    const out = reactToChildReply('I need a hint', exTurn, lesson(), 'Sam');
    assert.ok(out.includes('Think again'));
    assert.ok(out.includes('Just point with me.'));
  });
  it('repeat replays the turn line', () => {
    const out = reactToChildReply('say that again', exTurn, lesson(), 'Sam');
    assert.ok(out.includes('go'));
  });
  it('waiting is honored without advancing', () => {
    const out = reactToChildReply('need a minute', exTurn, lesson(), 'Sam');
    assert.ok(out.includes('No rush'));
  });
});
