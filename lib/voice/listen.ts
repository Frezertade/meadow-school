import { Platform } from 'react-native';

type ResultEvent = {
  results: ArrayLike<{ 0?: { transcript?: string }; isFinal?: boolean }>;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((ev: ResultEvent) => void) | null;
  onerror: ((ev: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function canListen(): boolean {
  return !!getRecognitionCtor();
}

let active: SpeechRecognitionLike | null = null;

export function stopListening(): void {
  try {
    active?.abort();
  } catch {
    // ignore
  }
  active = null;
}

/**
 * Listen for one child utterance. Must be started from a tap (mic permission).
 * Returns transcript or empty string.
 */
export function listenOnce(opts?: { lang?: string; timeoutMs?: number }): Promise<string> {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return Promise.resolve('');

  stopListening();

  return new Promise((resolve) => {
    const rec = new Ctor();
    active = rec;
    rec.lang = opts?.lang || 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.continuous = false;

    let done = false;
    const finish = (text: string) => {
      if (done) return;
      done = true;
      try {
        rec.stop();
      } catch {
        // ignore
      }
      active = null;
      resolve(text.trim());
    };

    rec.onresult = (ev) => {
      const piece = ev.results?.[0]?.[0]?.transcript || '';
      finish(piece);
    };
    rec.onerror = () => finish('');
    rec.onend = () => finish('');

    try {
      rec.start();
    } catch {
      finish('');
      return;
    }

    setTimeout(() => finish(''), opts?.timeoutMs ?? 8000);
  });
}
