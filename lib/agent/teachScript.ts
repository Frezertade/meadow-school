import type { Exercise, Lesson, LessonBlock } from '@/content/schema';
import { exerciseDifficulty, orderedExercises } from '@/lib/progress';

export type TeachPhase =
  | 'greet'
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

/** Build a teaching conversation from lesson content — agent leads, does not read the whole page. */
export function buildTeachPlan(lesson: Lesson, childName: string): TeachTurn[] {
  const name = childName.trim() || 'friend';
  const turns: TeachTurn[] = [];

  turns.push({
    phase: 'greet',
    say: `Hi ${name}! I'm Meadow, your teacher for today. We're learning about ${lesson.title}. Ready to play and learn with me?`,
    ask: 'Are you ready?',
    chips: ["I'm ready!", 'Tell me more', 'Need a minute'],
    waitForChild: true,
  });

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

    turns.push({
      phase: 'check',
      say: checkQuestion(block, lesson, name),
      ask: 'What do you think?',
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
      say: introduceExercise(ex, name),
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

  turns.push({
    phase: 'celebrate',
    say: `You finished “${lesson.title}”, ${name}! I'm proud of how you listened and tried. Want to tell me your favorite part?`,
    chips: ['The sounds', 'The drawing', 'The counting', 'All of it!'],
    waitForChild: true,
  });

  return turns;
}

function conversationalBite(block: LessonBlock, lesson: Lesson): string {
  // Short teacher talk — not dumping the full block
  const raw = (block.tutorCue || block.text).trim();
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

function checkQuestion(block: LessonBlock, lesson: Lesson, name: string): string {
  if (lesson.subject === 'english' && /letter|sound|\/[a-z]\//i.test(block.text + lesson.groundingText)) {
    return `${name}, quick check — what letter or sound are we practicing?`;
  }
  if (lesson.subject === 'math') {
    return `${name}, quick check — what were we counting or adding?`;
  }
  if (lesson.subject === 'safety') {
    return `${name}, quick check — what should we do if the alarm beeps?`;
  }
  return `${name}, can you tell me one thing we just learned?`;
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

function introduceExercise(ex: Exercise, name: string): string {
  if (ex.kind === 'reading') {
    return `${name}, tap challenge: ${ex.instruction} Listen first, then choose.`;
  }
  if (ex.kind === 'math') {
    return `${name}, math challenge: ${ex.instruction} Take your time.`;
  }
  if (ex.kind === 'sequence') {
    return `${name}, ordering challenge: ${ex.instruction} Tap each step in order.`;
  }
  if (ex.kind === 'listen-say') {
    return `${name}, listening challenge: ${ex.instruction} Hear it, then say it back.`;
  }
  return `${name}, drawing time: ${ex.instruction} There is no wrong art.`;
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
    if (ex && 'hint' in ex) return `Hint: ${ex.hint}`;
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
