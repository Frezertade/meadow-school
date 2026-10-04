import type { Exercise, Lesson, LessonBlock } from '@/content/schema';
import { exerciseDifficulty, orderedExercises } from '@/lib/progress';

export type TeachPhase =
  | 'greet'
  | 'review'
  | 'break'
  | 'teach'
  | 'check'
  | 'exercise_intro'
  | 'exercise'
  | 'react'
  | 'level_up'
  | 'celebrate'
  | 'chat';

export interface TeachTurn {
  phase: TeachPhase;
  /** What Meadow says (short, conversational — not a page read) */
  say: string;
  /** Optional prompt shown to the child */
  ask?: string;
  /** Quick reply chips */
  chips?: string[];
  /** Expect mic / chip answer before advancing */
  waitForChild?: boolean;
  blockIndex?: number;
  exerciseId?: string;
}

export interface TeachPlanOpts {
  skipWarmups?: boolean;
  /** Next path lesson title — teased at celebration as a cliffhanger */
  nextTitle?: string;
  /** Recalled win from a previous session ("Last time you finished X!") */
  memoryLine?: string;
}

/** Build a teaching conversation from lesson content — agent leads, does not read the whole page. */
export function buildTeachPlan(
  lesson: Lesson,
  childName: string,
  reviewLabels: string[] = [],
  opts: TeachPlanOpts = {}
): TeachTurn[] {
  const name = childName.trim() || 'friend';
  const turns: TeachTurn[] = [];

  const greetSay = opts.skipWarmups
    ? `Welcome back, ${name}! Warm-ups done — straight to the good stuff. Ready?`
    : opts.memoryLine
      ? `Hi ${name}! ${opts.memoryLine} Today: ${lesson.title}. Ready?`
      : `Hi ${name}! Today: ${lesson.title}. Ready to play?`;
  turns.push({
    phase: 'greet',
    say: greetSay,
    ask: 'Are you ready?',
    chips: ["I'm ready!", 'Tell me more', 'Need a minute'],
    waitForChild: true,
  });

  // Spaced review: weakest skills surface automatically right after greeting.
  if (reviewLabels.length > 0) {
    const what = reviewLabels.length === 1 ? reviewLabels[0] : `${reviewLabels[0]} and ${reviewLabels[1]}`;
    turns.push({
      phase: 'review',
      say: `Before we start — last time we practiced ${what}. Can you tell me one thing you remember?`,
      ask: 'What do you remember?',
      chips: ['I remember!', 'Say it again', 'Show me'],
      waitForChild: true,
    });
  }

  const teachBlocks = lesson.blocks.filter((b) => b.kind === 'teach' || b.kind === 'story');
  const blocks: LessonBlock[] = teachBlocks.length ? teachBlocks : lesson.blocks.slice(0, 2);

  blocks.forEach((block, i) => {
    const bite = conversationalBite(block, lesson);
    turns.push({
      phase: 'teach',
      say: bite,
      blockIndex: lesson.blocks.indexOf(block),
      chips: ['Got it', 'Say that again', 'Why?'],
      waitForChild: true,
    });

    const check = checkQuestion(block, lesson);
    turns.push({
      phase: 'check',
      say: check.say,
      ask: check.ask,
      chips: checkChips(block, lesson),
      waitForChild: true,
      blockIndex: lesson.blocks.indexOf(block),
    });
  });

  const exercises = orderedExercises(lesson);
  let lastDiff = 0;
  exercises.forEach((ex) => {
    const d = exerciseDifficulty(ex);
    if (d > lastDiff && lastDiff > 0) {
      turns.push({
        phase: 'level_up',
        say:
          d === 2
            ? `Nice work, ${name}! Now a stretch challenge — a little stronger.`
            : `You're doing great! Strongest challenge coming up. I believe in you.`,
        chips: ["Let's go!", 'I need a hint first'],
        waitForChild: true,
      });
    }
    lastDiff = d;

    turns.push({
      phase: 'exercise_intro',
      say: introduceExercise(ex),
      exerciseId: ex.id,
      chips: ["Let's try it", 'Explain again'],
      waitForChild: true,
    });

    turns.push({
      phase: 'exercise',
      say: `Your turn on the screen, ${name}. I'll stay right here if you need me.`,
      exerciseId: ex.id,
      waitForChild: false,
    });
  });

  // Movement break halfway through longer lessons (5–8 min arcs).
  const introIdx: number[] = [];
  turns.forEach((t, i) => {
    if (t.phase === 'exercise_intro') introIdx.push(i);
  });
  if (exercises.length >= 4 && introIdx.length >= 2) {
    turns.splice(introIdx[1], 0, {
      phase: 'break',
      say: `${name}, wiggle break! Stand up tall, shake your shoulders, take one big breath… and sit back down like a quiet mouse.`,
      ask: 'Ready to keep going?',
      chips: ["I'm back!", 'One more wiggle'],
      waitForChild: true,
    });
  }

  turns.push({
    phase: 'celebrate',
    say: `You finished “${lesson.title}”, ${name}! I'm proud of how you listened and tried. Want to tell me your favorite part?${
      lesson.stretch ? ` Next challenge: ${lesson.stretch}` : ''
    }${opts.nextTitle ? ` After that: ${opts.nextTitle}!` : ''}`,
    chips: ['The sounds', 'The drawing', 'The counting', 'All of it!'],
    waitForChild: true,
  });

  return turns;
}

function conversationalBite(block: LessonBlock, lesson: Lesson): string {
  // Short teacher talk — the TEACHING (block.text), never the stage
  // direction (tutorCue). Meadow performs; she does not read directions aloud.
  const raw = (block.text || block.tutorCue || '').trim();
  const first = raw.split(/(?<=[.!?])\s+/)[0] || raw;
  const lead = block.title ? `${block.title}. ` : '';
  if (lesson.subject === 'english') {
    return `${lead}${first} Say it with me — nice and slow.`;
  }
  if (lesson.subject === 'math') {
    return `${lead}${first} We'll count together.`;
  }
  return `${lead}${first}`;
}

function checkQuestion(block: LessonBlock, lesson: Lesson): { say: string; ask: string } {
  if (lesson.subject === 'english' && /letter|sound|\/[a-z]\//i.test(block.text + lesson.groundingText)) {
    return { say: 'Quick check!', ask: 'What letter or sound are we practicing?' };
  }
  if (lesson.subject === 'math') {
    return { say: 'Quick check!', ask: 'What were we counting?' };
  }
  if (lesson.subject === 'safety') {
    return { say: 'Quick check!', ask: 'What is the safe thing to do?' };
  }
  return { say: 'Quick check!', ask: 'Tell me one thing we just learned!' };
}

function checkChips(block: LessonBlock, lesson: Lesson): string[] {
  if (lesson.subject === 'english') {
    if (/letter\s*a|\bA\b/i.test(lesson.title + lesson.groundingText)) {
      return ['Letter A', 'Letter B', 'Say it again'];
    }
    if (/cat|cvc/i.test(lesson.id + lesson.title)) {
      return ['cat', 'dog', 'Say it again'];
    }
    return ['I got it', 'Say it again', 'I forgot'];
  }
  if (lesson.subject === 'math') return ['I can count', 'Need help', 'Say it again'];
  if (lesson.subject === 'safety') return ['Go outside with a grown-up', 'Hide', 'Say it again'];
  return ['I remember!', 'Say it again', 'I forgot'];
}

function introduceExercise(ex: Exercise): string {
  // Instructions already say Warm-up/Stretch/Strong — keep the line to one beat.
  return `Your turn — ${ex.instruction}`;
}

export function reactToChildReply(
  reply: string,
  turn: TeachTurn,
  lesson: Lesson,
  childName: string
): string {
  const r = reply.toLowerCase().trim();
  const name = childName.trim() || 'friend';

  if (/minute|wait|later|not ready/.test(r)) {
    return `No rush, ${name}. Tap I'm ready when you want to start. I'll wait.`;
  }
  if (/again|repeat|say that|forgot|idk|don't know|dont know/.test(r)) {
    return `Of course. ${turn.say} You've got this.`;
  }
  if (/hint|help|stuck/.test(r)) {
    const ex = lesson.exercises.find((e) => e.id === turn.exerciseId);
    // Below-level branch: hint plus the lesson's easier on-ramp when stuck.
    if (ex && 'hint' in ex) {
      return `Hint: ${ex.hint}${lesson.support ? ` ${lesson.support}` : ''}`;
    }
    return `Look at the pictures and try one careful answer. I'm here with you.`;
  }
  if (/why/.test(r)) {
    return `We practice so your brain gets stronger — just like muscles when you play outside.`;
  }
  if (/ready|got it|let's|lets|try|go|remember|all of it|sounds|drawing|counting/.test(r)) {
    return `Wonderful, ${name}. Let's keep going.`;
  }
  // Soft default — stay in teacher mode
  return `Thanks for telling me, ${name}. Let's take the next step together.`;
}
