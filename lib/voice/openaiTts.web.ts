/**
 * Optional OpenAI TTS — fast kid-friendly voice when parent pastes an API key.
 * Voices: nova (default), shimmer, alloy, echo, fable, onyx
 */

export type OpenAiTtsVoice = 'nova' | 'shimmer' | 'alloy' | 'echo' | 'fable' | 'onyx';

let currentAudio: HTMLAudioElement | null = null;
let speakGen = 0;
let apiKey: string | null = null;
let unlockEl: HTMLAudioElement | null = null;

export function configureOpenAiTts(key: string | null): void {
  apiKey = key?.trim() || null;
}

export function isOpenAiTtsConfigured(): boolean {
  return !!apiKey && typeof window !== 'undefined';
}

/** Call from a user tap so later HTMLAudio play() is allowed. */
export function unlockOpenAiAudio(): void {
  if (typeof window === 'undefined') return;
  if (!unlockEl) unlockEl = new Audio();
  try {
    // Tiny silent wav
    unlockEl.src =
      'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
    void unlockEl.play().then(
      () => {
        try {
          unlockEl?.pause();
        } catch {
          // ignore
        }
      },
      () => {}
    );
  } catch {
    // ignore
  }
}

export function stopOpenAiTts(): void {
  speakGen += 1;
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.src = '';
    } catch {
      // ignore
    }
    currentAudio = null;
  }
}

export async function speakOpenAiTts(
  text: string,
  opts?: { voice?: OpenAiTtsVoice; speed?: number }
): Promise<boolean> {
  if (!apiKey || !text.trim() || typeof window === 'undefined') return false;

  const gen = ++speakGen;
  stopOpenAiTts();
  speakGen = gen;

  try {
    const res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: opts?.voice ?? 'nova',
        input: text.slice(0, 4096),
        speed: opts?.speed ?? 0.95,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn('[Meadow] OpenAI TTS failed', res.status, errText.slice(0, 200));
      return false;
    }

    if (gen !== speakGen) return false;

    const buf = await res.arrayBuffer();
    if (gen !== speakGen) return false;

    const blob = new Blob([buf], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    const el = new Audio(url);
    currentAudio = el;

    await new Promise<void>((resolve, reject) => {
      el.onended = () => {
        URL.revokeObjectURL(url);
        if (currentAudio === el) currentAudio = null;
        resolve();
      };
      el.onerror = () => {
        URL.revokeObjectURL(url);
        if (currentAudio === el) currentAudio = null;
        reject(new Error('openai audio play failed'));
      };
      void el.play().then(
        () => {
          if (gen !== speakGen) {
            el.pause();
            URL.revokeObjectURL(url);
            resolve();
          }
        },
        reject
      );
    });
    return true;
  } catch (err) {
    console.warn('[Meadow] speakOpenAiTts error', err);
    return false;
  }
}
