import type { Lesson } from '@/content/schema';
import {
  CHILD_SAFETY_SYSTEM,
  isUnsafeChildInput,
  REDIRECT,
  sanitizeTutorOutput,
} from './safety';

export interface TutorMessage {
  role: 'child' | 'meadow';
  text: string;
}

export interface TutorContext {
  lesson: Lesson;
  childName?: string;
  ageBandLabel: string;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Local grounded tutor — works offline; never leaves the lesson pack. */
export function answerFromLesson(question: string, ctx: TutorContext): string {
  if (isUnsafeChildInput(question)) {
    return REDIRECT;
  }

  const q = normalize(question);
  const lesson = ctx.lesson;
  const name = ctx.childName?.trim() || 'friend';

  if (!q || q.length < 2) {
    return `Hi ${name}! Ask me about this lesson: “${lesson.title}”. I can help with reading, math, or drawing.`;
  }

  if (/\b(hint|help|stuck|idk|i don't know|dont know)\b/.test(q)) {
    const withHint = lesson.exercises.find(
      (e) => e.kind === 'math' || e.kind === 'reading'
    );
    if (withHint && 'hint' in withHint) {
      return `Let's try a hint: ${withHint.hint}`;
    }
    return lesson.blocks[0]?.tutorCue || `Look at the lesson words again. You can do this, ${name}!`;
  }

  if (/\b(draw|drawing|color|paint|art)\b/.test(q)) {
    const draw = lesson.exercises.find((e) => e.kind === 'drawing');
    if (draw) {
      return `For drawing: ${draw.prompt} Take your time. Artists try things.`;
    }
    return 'You can draw ideas from our lesson. Keep it simple and fun.';
  }

  if (/\b(answer|what is it|tell me)\b/.test(q)) {
    return `I won't spoil it yet. Try once more — use the pictures and the words in “${lesson.title}”. Want a hint?`;
  }

  if (/\b(read|letter|sound|word|spell)\b/.test(q) && lesson.subject === 'english') {
    const teach = lesson.blocks.find((b) => b.kind === 'teach') || lesson.blocks[0];
    return teach
      ? `From our lesson: ${teach.text}`
      : 'Say the sounds slowly, then push them together.';
  }

  if (/\b(count|number|math|add|plus|how many)\b/.test(q) && lesson.subject === 'math') {
    const teach = lesson.blocks.find((b) => b.kind === 'teach') || lesson.blocks[0];
    return teach
      ? `Math tip from the lesson: ${teach.text}`
      : 'Touch each thing once while you count.';
  }

  if (/\b(who are you|your name)\b/.test(q)) {
    return `I'm Meadow, your lesson helper for ${ctx.ageBandLabel}. I only talk about what we are learning right now.`;
  }

  // Keyword overlap against grounding paragraphs
  const chunks = lesson.groundingText
    .split(/\n+/)
    .map((c) => c.trim())
    .filter((c) => c.length > 20);

  const scored = chunks
    .map((chunk) => {
      const words = normalize(chunk).split(' ').filter((w) => w.length > 3);
      const hits = words.filter((w) => q.includes(w)).length;
      return { chunk, hits };
    })
    .sort((a, b) => b.hits - a.hits);

  if (scored[0] && scored[0].hits > 0) {
    const clean = scored[0].chunk.replace(/^[-*•]\s*/, '').slice(0, 280);
    return sanitizeTutorOutput(`Here's what our lesson says: ${clean}`);
  }

  return sanitizeTutorOutput(
    `Let's stay with “${lesson.title}”. ${lesson.summary} Ask me for a hint, help drawing, or help with a sound or number.`
  );
}

export function buildLlmMessages(question: string, ctx: TutorContext) {
  return [
    { role: 'system' as const, content: CHILD_SAFETY_SYSTEM },
    {
      role: 'system' as const,
      content: `AGE BAND: ${ctx.ageBandLabel}\nLESSON TITLE: ${ctx.lesson.title}\nGROUNDING (sole knowledge source):\n${ctx.lesson.groundingText}\n\nEXERCISES:\n${JSON.stringify(ctx.lesson.exercises, null, 2)}`,
    },
    { role: 'user' as const, content: question },
  ];
}

/**
 * Prefer local grounded answers. Optional parent-configured API can be wired later;
 * always fall back to answerFromLesson so the app never depends on the network for safety.
 */
export async function askMeadow(
  question: string,
  ctx: TutorContext,
  _opts?: { apiKey?: string }
): Promise<string> {
  // Network LLM intentionally not required for v1 private family build.
  // When apiKey is present in a future iteration, call provider with buildLlmMessages
  // then sanitizeTutorOutput. Until then: local grounding only.
  return answerFromLesson(question, ctx);
}
