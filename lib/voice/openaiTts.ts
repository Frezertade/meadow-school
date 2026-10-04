/** Native / non-web stub — OpenAI TTS runs in the browser. */
export type OpenAiTtsVoice = 'nova' | 'shimmer' | 'alloy' | 'echo' | 'fable' | 'onyx';

export function configureOpenAiTts(_key: string | null): void {}

export function isOpenAiTtsConfigured(): boolean {
  return false;
}

export function stopOpenAiTts(): void {}

export function unlockOpenAiAudio(): void {}

export async function speakOpenAiTts(
  _text: string,
  _opts?: { voice?: OpenAiTtsVoice; speed?: number }
): Promise<boolean> {
  return false;
}
