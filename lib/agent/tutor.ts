import type { Lesson } from '@/content/schema';
import {
  CHILD_SAFETY_SYSTEM,
  isUnsafeChildInput,
  REDIRECT,
  sanitizeTutorOutput,
} from './safety';
import { reactToChildReply, type TeachTurn } from './teachScript';

export interface TutorMessage {
  role: 'child' | 'meadow';
  text: string;
}

export interface TutorContext {
  lesson: Lesson;
  childName?: string;
  ageBandLabel: string;
  /** Current teaching turn, if in agent lesson flow */
  turn?: TeachTurn;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Conversational local teacher — grounded, short, not a page reader. */
export function answerFromLesson(question: string, ctx: TutorContext): string {
  if (isUnsafeChildInput(question)) return REDIRECT;

  const q = normalize(question);
  const lesson = ctx.lesson;
  const name = ctx.childName?.trim() || 'friend';

  if (ctx.turn) {
    return sanitizeTutorOutput(reactToChildReply(question, ctx.turn, lesson, name));
  }

  if (!q || q.length < 2) {
    return `I'm listening, ${name}. Tell me what you need — a hint, the sound again, or help with the challenge.`;
  }

  if (/\b(hint|help|stuck|idk|i don't know|dont know)\b/.test(q)) {
    const withHint = lesson.exercises.find((e) => e.kind === 'math' || e.kind === 'reading');
    if (withHint && 'hint' in withHint) {
      return `Let's try together. Hint: ${withHint.hint}`;
    }
    return lesson.blocks[0]?.tutorCue || `Look carefully and try one answer. I'm with you.`;
  }

  if (/\b(again|repeat|say)\b/.test(q)) {
    const teach = lesson.blocks.find((b) => b.kind === 'teach') || lesson.blocks[0];
    return teach
      ? `Okay, again: ${teach.tutorCue || teach.text.split(/(?<=[.!?])\s+/)[0]}`
      : `Let's say it slowly one more time.`;
  }

  if (/\b(draw|drawing|color|paint|art)\b/.test(q)) {
    const draw = lesson.exercises.find((e) => e.kind === 'drawing');
    if (draw) return `For drawing: ${draw.prompt} Have fun — artists try things.`;
    return `You can draw something from our lesson. Keep it simple and fun.`;
  }

  if (/\b(answer|what is it|tell me the answer)\b/.test(q)) {
    return `I won't give it away yet. Try once — then ask me for a hint if you need one.`;
  }

  if (/\b(who are you|your name)\b/.test(q)) {
    return `I'm Meadow, your teacher for ${ctx.ageBandLabel}. I only teach what's in this lesson, and I'm here to talk with you.`;
  }

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

  if (scored[0]?.hits) {
    const clean = scored[0].chunk.replace(/^[-*•]\s*/, '').slice(0, 180);
    return sanitizeTutorOutput(`From what we're learning: ${clean} Want to try the challenge now?`);
  }

  return sanitizeTutorOutput(
    `Let's stay with “${lesson.title}”. You can ask for a hint, ask me to say it again, or tell me what you see.`
  );
}

export function buildLlmMessages(question: string, ctx: TutorContext) {
  return [
    {
      role: 'system' as const,
      content: `${CHILD_SAFETY_SYSTEM}

You are Meadow, a warm conversational TEACHER (not a text reader).
- Speak in short turns (1–3 kid sentences).
- Ask checks, give hints, celebrate effort.
- Never read a whole lesson page aloud.
- Use ONLY the grounding text and exercises.
- Sound like a kind preschool/early-elementary teacher.`,
    },
    {
      role: 'system' as const,
      content: `AGE BAND: ${ctx.ageBandLabel}
LESSON: ${ctx.lesson.title}
GROUNDING:
${ctx.lesson.groundingText}

CURRENT TURN: ${ctx.turn ? JSON.stringify(ctx.turn) : 'free chat'}
EXERCISES: ${JSON.stringify(ctx.lesson.exercises)}`,
    },
    { role: 'user' as const, content: question },
  ];
}

async function askOpenAi(question: string, ctx: TutorContext, apiKey: string): Promise<string | null> {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.6,
        max_tokens: 180,
        messages: buildLlmMessages(question, ctx),
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content?.trim();
    return text ? sanitizeTutorOutput(text) : null;
  } catch {
    return null;
  }
}

export async function askMeadow(
  question: string,
  ctx: TutorContext,
  opts?: { apiKey?: string }
): Promise<string> {
  if (opts?.apiKey) {
    const llm = await askOpenAi(question, ctx, opts.apiKey);
    if (llm) return llm;
  }
  return answerFromLesson(question, ctx);
}
