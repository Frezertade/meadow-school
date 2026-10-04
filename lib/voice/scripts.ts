import type { Exercise, Lesson, LessonBlock } from '@/content/schema';

export function narrateLessonOpen(lesson: Lesson, childName: string): string[] {
  return [
    `Hi ${childName}. I'm Meadow. Today we will learn: ${lesson.title}.`,
    lesson.summary,
    'Listen to me, then tap the big green button when you are ready.',
  ];
}

export function narrateBlock(block: LessonBlock, childName: string): string[] {
  const lines: string[] = [];
  if (block.title) lines.push(block.title);
  lines.push(block.text);
  if (block.tutorCue) lines.push(block.tutorCue);
  lines.push(`${childName}, when you are ready, tap Next.`);
  return lines;
}

export function narrateLevelUp(childName: string, level: number): string {
  if (level === 2) {
    return `${childName}, great work! Ready for a stretch challenge? This one is a little stronger.`;
  }
  return `${childName}, you are strong! Here comes the strongest challenge in this lesson.`;
}

export function narrateExercise(exercise: Exercise, childName: string): string[] {
  const tier =
    exercise.difficulty === 3
      ? 'strong challenge'
      : exercise.difficulty === 2
        ? 'stretch challenge'
        : 'warm-up';
  if (exercise.kind === 'reading') {
    return [
      `${childName}, reading ${tier}.`,
      exercise.instruction,
      exercise.prompt,
      `Your choices are: ${exercise.choices.join(', ')}.`,
      'Tap the answer you think is right. Or tap Hear again if you want me to repeat.',
    ];
  }
  if (exercise.kind === 'math') {
    return [
      `${childName}, math ${tier}.`,
      exercise.instruction,
      exercise.prompt,
      `Your choices are: ${exercise.choices.join(', ')}.`,
      'Tap your answer.',
    ];
  }
  if (exercise.kind === 'sequence') {
    return [
      `${childName}, ordering ${tier}.`,
      exercise.instruction,
      exercise.prompt,
      'Tap the steps in order, first to last.',
    ];
  }
  if (exercise.kind === 'listen-say') {
    return [
      `${childName}, listening ${tier}.`,
      exercise.instruction,
      `Listen for: ${exercise.phrase}. Then say it back into the microphone.`,
    ];
  }
  return [
    `${childName}, drawing ${tier}.`,
    exercise.instruction,
    exercise.prompt,
    'Draw with your finger. When you finish, tap I am done.',
  ];
}

export function narrateCorrect(childName: string): string {
  return `Yes, ${childName}! That is right. Great work.`;
}

export function narrateWrong(hint: string): string {
  return `Not quite. Try again. Here is a hint: ${hint}`;
}

export function narrateLessonDone(lesson: Lesson, childName: string): string[] {
  return [
    `You did it, ${childName}!`,
    `${lesson.title} is finished.`,
    'I am proud of your careful work. Tap Back to lessons when you are ready.',
  ];
}

export function narrateHome(childName: string, bandLabel: string): string[] {
  return [
    `Welcome, ${childName}. I'm Meadow, your learning guide.`,
    `You are on the ${bandLabel} path.`,
    'Tap a lesson card, and I will read everything for you. You do not need a grown-up to read the words.',
  ];
}
