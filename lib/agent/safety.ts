/**
 * Child-safety filters for tutor input/output.
 * Private family app — still treat every child utterance as untrusted for model prompts.
 */

const BLOCKED_PATTERNS: RegExp[] = [
  /\b(kill|suicide|porn|sex|nude|drugs?|weapon|gun|bomb|hate)\b/i,
  /\b(credit card|password|ssn|social security)\b/i,
  /\b(meet me|come over|where do you live)\b/i,
];

const REDIRECT =
  "Let's stay with our lesson. I can help with the story, the sounds, the numbers, or your drawing.";

export function isUnsafeChildInput(text: string): boolean {
  return BLOCKED_PATTERNS.some((re) => re.test(text));
}

export function sanitizeTutorOutput(text: string): string {
  if (BLOCKED_PATTERNS.some((re) => re.test(text))) {
    return REDIRECT;
  }
  // Strip URLs — kids should not be sent off-app
  return text.replace(/https?:\/\/\S+/gi, '').trim() || REDIRECT;
}

export const CHILD_SAFETY_SYSTEM = `
You are Meadow, a warm tutor for children ages 3–7 in a private Pennsylvania family home-education app.
HARD RULES:
1. Answer ONLY using the provided lesson grounding text and exercise content. If the question is outside the lesson, say you want to stay on this lesson and offer a lesson-related tip.
2. Never invent facts not in the grounding text.
3. Never discuss violence, adult topics, self-harm, politics, dating, or personal data collection.
4. Never ask for the child's full name, address, school, or photos.
5. Keep language short, concrete, and kind. For ages 3–4 use very short sentences.
6. Encourage effort. Prefer Socratic hints over giving answers immediately unless the child is stuck after two tries.
7. No links, no downloads, no mentioning other apps or websites.
8. Fire-safety content must stay calm and non-graphic.
`.trim();

export { REDIRECT };
