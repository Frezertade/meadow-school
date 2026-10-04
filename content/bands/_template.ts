import type { Lesson } from '../schema';

/**
 * LESSON AUTHORING CHECKLIST (copy this file, rename, add to a band file)
 *
 * 1. Copy the skeleton below into `content/bands/ages-<band>.ts`.
 * 2. Give the lesson a unique `id` prefixed with the band (a34- / a5- / a67-).
 * 3. Set `pathOrder` = (highest in band) + 1, and `requiresLessonId` = previous lesson.
 * 4. Write `groundingText` FIRST (≥100 chars): Goal, Key facts, what NOT to teach.
 *    Meadow's answers may only use groundingText + exercises — if it isn't
 *    written here, Meadow must not say it.
 * 5. Blocks: one small bite each. Every `teach`/`story` block needs `tutorCue` —
 *    a stage direction for Meadow's voice, gestures, and pacing (NOT a summary).
 * 5b. Differentiation: write `support` (easier on-ramp when stuck) and
 *    `stretch` (harder twist teased at celebration) — one line each.
 * 6. Exercises: at least one difficulty-1 warm-up; climb 1 → 2 → 3.
 *    Every exercise needs a `skillId` slug from content/scope.md.
 *    reading/math: `answer` MUST appear in `choices`; always write `hint`.
 *    drawing: always write `successMessage`.
 *    listen-say: `phrase` + `hint`; `accept` defaults to the phrase words.
 *    sequence: `items` shuffled at runtime; `answer` lists every item once.
 *    Kinds with UI renderers: reading, math, drawing, listen-say, sequence.
 * 7. PA: `statuteSubjects` must include every bucket mapped from your `subject`
 *    (see SUBJECT_TO_PA in content/pa-alignment.ts); add ≥1 `standardsTags` skill.
 * 8. Keep `minutes` ≤ 15 (5–8 ideal). Longer? Split into two lessons.
 * 9. Run `npm run validate` — it must pass with 0 errors.
 * 10. Run `npm run coverage` and commit the regenerated content/coverage.md.
 *
 * This file is skipped by tooling (underscore prefix) and never ships.
 */

export const TEMPLATE_LESSON: Lesson = {
  id: 'aXX-topic-name',
  ageBand: 'ages-5',
  subject: 'english',
  title: 'Lesson Title in 2–5 Words',
  minutes: 10,
  pathOrder: 99,
  requiresLessonId: 'previous-lesson-id',
  summary: 'One line: what the child will be able to do.',
  support: 'Easier on-ramp offered when the child is stuck.',
  stretch: 'Harder twist teased at celebration for breezing children.',
  groundingText: `
Lesson: <title> (age band). Incremental path: warm-up → stretch → strong.
Goal: <observable skill, e.g. "Blend three sounds into a CVC word">.
Key facts:
- <fact 1 the tutor may state>
- <fact 2>
- <what to praise / how to correct gently>
Do NOT teach: <out-of-scope topics for this lesson>.
`,
  pa: {
    level: 'elementary-K6',
    statuteSubjects: ['English (spelling, reading, writing)'],
    standardsTags: ['<skill tag for the parent skills grid>'],
  },
  blocks: [
    {
      id: 'b1',
      kind: 'teach',
      title: 'Short bite name',
      text: 'What Meadow says — one idea, two sentences max.',
      tutorCue: 'HOW to perform it: voice, gesture, pacing, child participation.',
    },
    {
      id: 'b2',
      kind: 'story',
      text: 'Optional story beat that makes the idea stick.',
      tutorCue: 'Storyteller tone; pause before the surprise; invite the child to guess.',
    },
  ],
  exercises: [
    {
      kind: 'reading',
      id: 'r1',
      skillId: 'example-skill',
      difficulty: 1,
      instruction: 'Warm-up: <what to do>',
      prompt: '<the question>',
      choices: ['right answer', 'wrong 1', 'wrong 2'],
      answer: 'right answer',
      hint: 'Nudge, not the answer.',
    },
    {
      kind: 'math',
      id: 'm1',
      skillId: 'example-skill',
      difficulty: 2,
      instruction: 'Stretch: <what to do>',
      visual: '🍎🍎🍎',
      prompt: '<the question>',
      choices: ['2', '3', '4'],
      answer: '3',
      hint: 'Nudge, not the answer.',
    },
    {
      kind: 'drawing',
      id: 'd1',
      skillId: 'example-skill',
      difficulty: 3,
      instruction: 'Strong: <what to do>',
      prompt: '<the invitation>',
      successMessage: 'Celebrate the specific effort.',
    },
    {
      kind: 'listen-say',
      id: 's1',
      skillId: 'example-skill',
      difficulty: 1,
      instruction: 'Warm-up: Hear it, then say it',
      phrase: 'sun',
      accept: ['sun'],
      hint: 'Starts with /s/, like a snake.',
    },
    {
      kind: 'sequence',
      id: 'q1',
      skillId: 'example-skill',
      difficulty: 2,
      instruction: 'Stretch: Put the steps in order',
      prompt: 'What happens first, next, last?',
      items: ['Last: brush teeth', 'First: wake up', 'Next: eat breakfast'],
      answer: ['First: wake up', 'Next: eat breakfast', 'Last: brush teeth'],
      hint: 'Mornings start with waking up.',
    },
  ],
};
