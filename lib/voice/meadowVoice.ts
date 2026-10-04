import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import {
  ensureSupertonic,
  getSupertonicStatus,
  isSupertonicSupported,
  speakSupertonic,
  stopSupertonic,
  unlockSupertonicAudio,
  type SupertonicVoiceId,
} from '@/lib/voice/supertonic';
import {
  configureOpenAiTts,
  isOpenAiTtsConfigured,
  speakOpenAiTts,
  stopOpenAiTts,
  unlockOpenAiAudio,
} from '@/lib/voice/openaiTts';

/** Kid-friendly spoken form for phonemes and symbols. */
export function prepareForSpeech(raw: string): string {
  let text = raw
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/…/g, '...')
    .replace(/\u2026/g, '...');

  text = text
    .replace(/\/a\//gi, ' ah ')
    .replace(/\/c\//gi, ' cuh ')
    .replace(/\/t\//gi, ' tuh ')
    .replace(/\/[a-z]+\//gi, (m) => ` ${m.slice(1, -1)} sound `);

  const trimmed = text.trim();
  if (/^[A-Za-z]$/.test(trimmed)) {
    return `the letter ${trimmed.toUpperCase()}`;
  }

  return text.replace(/\s+/g, ' ').trim();
}

export type SpeakOptions = {
  rate?: number;
  pitch?: number;
  /** Force device/browser TTS even if Supertonic is ready. */
  forceBrowser?: boolean;
  /**
   * If neural voice is still loading, wait up to this many ms before falling back.
   * Default 0 = don't block teaching turns. Use a larger value for "Hear again" demos.
   */
  waitNeuralMs?: number;
};

export type MeadowVoiceChoice = SupertonicVoiceId | 'browser';

let unlocked = Platform.OS !== 'web';
let speaking = false;
let speakGeneration = 0;
let voiceChoice: MeadowVoiceChoice = 'F2';
let preloadStarted = false;

type Synth = SpeechSynthesis;
type Utterance = SpeechSynthesisUtterance;

function getSynth(): Synth | null {
  if (Platform.OS !== 'web') return null;
  if (typeof window === 'undefined') return null;
  return window.speechSynthesis ?? null;
}

function pickEnglishVoice(synth: Synth): SpeechSynthesisVoice | null {
  const voices = synth.getVoices();
  if (!voices.length) return null;
  return (
    voices.find((v) => /^en(-|_)/i.test(v.lang) && /female|samantha|karen|moira|zira/i.test(v.name)) ||
    voices.find((v) => /^en(-|_)/i.test(v.lang)) ||
    voices.find((v) => v.lang.toLowerCase().startsWith('en')) ||
    voices[0] ||
    null
  );
}

/** Sync OpenAI key from parent desk (enables fast neural TTS). */
export function configureMeadowOpenAiKey(key: string | null): void {
  configureOpenAiTts(key);
}

/** Parent desk / store sync — F2 is Meadow's default on-device neural voice. */
export function configureMeadowVoice(choice: MeadowVoiceChoice): void {
  voiceChoice = choice;
  if (choice !== 'browser' && isSupertonicSupported() && unlocked) {
    void warmSupertonic();
  }
}

export function getMeadowVoiceChoice(): MeadowVoiceChoice {
  return voiceChoice;
}

export function isVoiceUnlocked(): boolean {
  return unlocked;
}

export function isSpeaking(): boolean {
  return speaking;
}

function warmSupertonic(): void {
  if (voiceChoice === 'browser') return;
  if (!isSupertonicSupported()) return;
  const st = getSupertonicStatus();
  if (st === 'ready' || st === 'loading') return;
  if (st === 'error') {
    // allow retry
    preloadStarted = false;
  }
  if (preloadStarted) return;
  preloadStarted = true;
  void ensureSupertonic(voiceChoice).then((ok) => {
    if (!ok) preloadStarted = false;
  });
}

/**
 * MUST be called directly from a tap handler (same JS turn).
 * Browsers block speech until a user gesture; async awaits lose that gesture.
 */
export function unlockVoice(): void {
  unlocked = true;
  unlockSupertonicAudio();
  unlockOpenAiAudio();
  const synth = getSynth();
  if (synth) {
    try {
      void synth.getVoices();
      synth.cancel();
      const warmup = new SpeechSynthesisUtterance('ok');
      warmup.volume = 0.01;
      warmup.rate = 2;
      synth.speak(warmup);
      synth.cancel();
    } catch {
      // ignore
    }
  }
  warmSupertonic();
}

function speakBrowserNow(prepared: string, opts: SpeakOptions): void {
  const synth = getSynth();
  if (!synth) return;
  try {
    void synth.getVoices();
    synth.cancel();
    speaking = true;
    const utter = new SpeechSynthesisUtterance(prepared);
    utter.lang = 'en-US';
    utter.rate = clampRate(opts.rate ?? 0.92);
    utter.pitch = opts.pitch ?? 1.05;
    utter.volume = 1;
    const voice = pickEnglishVoice(synth);
    if (voice) utter.voice = voice;
    utter.onend = () => {
      speaking = false;
    };
    utter.onerror = () => {
      speaking = false;
    };
    synth.speak(utter);
    if (synth.paused) synth.resume();
  } catch {
    speaking = false;
  }
}

/**
 * Tap-safe unlock + speak.
 * Prefer OpenAI TTS (if key) or Supertonic (if ready); else browser TTS + warm neural.
 */
export function unlockAndSpeakNow(text: string, opts: SpeakOptions = {}): void {
  unlocked = true;
  unlockSupertonicAudio();
  unlockOpenAiAudio();
  warmSupertonic();

  const prepared = prepareForSpeech(text);
  if (!prepared) return;

  if (Platform.OS === 'web') {
    if (!opts.forceBrowser && isOpenAiTtsConfigured()) {
      speakGeneration += 1;
      const myGen = speakGeneration;
      speaking = true;
      stopOpenAiTts();
      stopSupertonic();
      void speakOpenAiTts(prepared, { voice: 'nova', speed: 0.95 }).then((ok) => {
        speaking = false;
        if (!ok && myGen === speakGeneration) {
          speakBrowserNow(prepared, opts);
        }
      });
      return;
    }

    const canNeural =
      !opts.forceBrowser &&
      voiceChoice !== 'browser' &&
      getSupertonicStatus() === 'ready';

    if (canNeural) {
      speakGeneration += 1;
      const myGen = speakGeneration;
      speaking = true;
      void speakSupertonic(prepared, {
        voice: voiceChoice as SupertonicVoiceId,
        speed: 0.95,
        steps: 5,
      }).then((ok) => {
        speaking = false;
        if (!ok && myGen === speakGeneration) {
          speakBrowserNow(prepared, opts);
        }
      });
      return;
    }

    speakBrowserNow(prepared, opts);
    return;
  }

  void meadowSpeak(prepared, { ...opts, enabled: true });
}

function clampRate(rate: number): number {
  return Math.min(1.15, Math.max(0.7, rate));
}

export async function stopVoice(): Promise<void> {
  speaking = false;
  speakGeneration += 1;
  stopOpenAiTts();
  stopSupertonic();
  const synth = getSynth();
  if (synth) {
    try {
      synth.cancel();
    } catch {
      // ignore
    }
    return;
  }
  try {
    Speech.stop();
  } catch {
    // ignore
  }
}

function estimateMs(text: string, rate: number): number {
  const words = Math.max(1, text.split(/\s+/).length);
  return Math.min(60000, Math.max(2500, (words / (rate * 2.4)) * 1000 + 800));
}

function speakWeb(prepared: string, opts: SpeakOptions, myGen: number): Promise<void> {
  const synth = getSynth();
  if (!synth) return Promise.resolve();

  const rate = clampRate(opts.rate ?? 0.92);

  const speakNow = (resolve: () => void) => {
    if (myGen !== speakGeneration) {
      resolve();
      return;
    }
    try {
      synth.cancel();
      const utter: Utterance = new SpeechSynthesisUtterance(prepared);
      utter.lang = 'en-US';
      utter.rate = rate;
      utter.pitch = opts.pitch ?? 1.05;
      utter.volume = 1;
      const voice = pickEnglishVoice(synth);
      if (voice) utter.voice = voice;

      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        speaking = false;
        resolve();
      };

      utter.onend = finish;
      utter.onerror = finish;
      speaking = true;
      synth.speak(utter);
      if (synth.paused) synth.resume();

      setTimeout(finish, estimateMs(prepared, rate));
    } catch {
      speaking = false;
      resolve();
    }
  };

  return new Promise<void>((resolve) => {
    if (synth.getVoices().length > 0) {
      speakNow(resolve);
      return;
    }
    const onVoices = () => {
      synth.removeEventListener('voiceschanged', onVoices);
      speakNow(resolve);
    };
    synth.addEventListener('voiceschanged', onVoices);
    setTimeout(() => speakNow(resolve), 300);
  });
}

function speakNative(prepared: string, opts: SpeakOptions, myGen: number): Promise<void> {
  speaking = true;
  return new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      speaking = false;
      resolve();
    };
    try {
      Speech.speak(prepared, {
        language: 'en-US',
        rate: opts.rate ?? 0.88,
        pitch: opts.pitch ?? 1.08,
        onDone: finish,
        onStopped: finish,
        onError: finish,
      });
      setTimeout(finish, estimateMs(prepared, opts.rate ?? 0.88));
    } catch {
      finish();
    }
    if (myGen !== speakGeneration) finish();
  });
}

async function speakNeuralOrBrowser(
  prepared: string,
  opts: SpeakOptions,
  myGen: number
): Promise<void> {
  // 1) OpenAI TTS — instant, clearly different from browser (needs parent key)
  if (
    Platform.OS === 'web' &&
    !opts.forceBrowser &&
    isOpenAiTtsConfigured()
  ) {
    speaking = true;
    const ok = await speakOpenAiTts(prepared, { voice: 'nova', speed: 0.95 });
    speaking = false;
    if (myGen !== speakGeneration) return;
    if (ok) return;
  }

  const wantNeural =
    Platform.OS === 'web' &&
    !opts.forceBrowser &&
    voiceChoice !== 'browser' &&
    isSupertonicSupported();

  if (wantNeural) {
    let st = getSupertonicStatus();
    if (st === 'idle' || st === 'error') {
      warmSupertonic();
      st = getSupertonicStatus();
    }

    if (st === 'ready') {
      speaking = true;
      const ok = await speakSupertonic(prepared, {
        voice: voiceChoice as SupertonicVoiceId,
        speed: 0.95,
        steps: 5,
      });
      speaking = false;
      if (myGen !== speakGeneration) return;
      if (ok) return;
    } else if (st === 'loading' && (opts.waitNeuralMs ?? 0) > 0) {
      warmSupertonic();
      const deadline = Date.now() + (opts.waitNeuralMs ?? 0);
      while (Date.now() < deadline && myGen === speakGeneration) {
        if (getSupertonicStatus() === 'ready') {
          speaking = true;
          const ok = await speakSupertonic(prepared, {
            voice: voiceChoice as SupertonicVoiceId,
            speed: 0.95,
            steps: 5,
          });
          speaking = false;
          if (myGen !== speakGeneration) return;
          if (ok) return;
          break;
        }
        if (getSupertonicStatus() === 'error') break;
        await new Promise((r) => setTimeout(r, 250));
      }
    } else {
      warmSupertonic();
    }
  }

  if (Platform.OS === 'web') {
    await speakWeb(prepared, opts, myGen);
    return;
  }
  await speakNative(prepared, opts, myGen);
}

/**
 * Meadow voice. On web: Supertonic (F2) when loaded, else browser speechSynthesis.
 * Prefer unlockAndSpeakNow() for the first tap so browsers allow audio.
 */
export async function meadowSpeak(
  text: string,
  opts: SpeakOptions & { enabled?: boolean } = {}
): Promise<void> {
  if (opts.enabled === false) return;
  if (!unlocked) return;
  const prepared = prepareForSpeech(text);
  if (!prepared) return;

  const myGen = ++speakGeneration;
  const synth = getSynth();
  if (synth) {
    try {
      synth.cancel();
    } catch {
      // ignore
    }
  }
  stopOpenAiTts();
  stopSupertonic();
  await speakNeuralOrBrowser(prepared, opts, myGen);
}

export async function meadowSpeakSequence(
  lines: string[],
  opts: SpeakOptions & { enabled?: boolean; gapMs?: number } = {}
): Promise<void> {
  if (opts.enabled === false) return;
  if (!unlocked) return;

  const cleaned = lines.map((l) => prepareForSpeech(l)).filter(Boolean);
  if (!cleaned.length) return;

  const myGen = ++speakGeneration;

  for (let i = 0; i < cleaned.length; i++) {
    if (myGen !== speakGeneration) return;
    await speakNeuralOrBrowser(cleaned[i], opts, myGen);
    if (opts.gapMs && i < cleaned.length - 1) {
      await new Promise((r) => setTimeout(r, opts.gapMs));
    }
  }
}

export function canUseSpeech(): boolean {
  if (Platform.OS !== 'web') return true;
  return !!getSynth() || isSupertonicSupported();
}
