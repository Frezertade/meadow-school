/**
 * Supertonic TTS (web) — neural on-device voice via Transformers.js + ONNX.
 * Loaded from CDN at runtime so Metro does not bundle onnxruntime-web.
 * Default Meadow voice: F2 (bright, playful, youthful).
 * @see https://github.com/supertone-inc/supertonic
 */

export type SupertonicVoiceId = 'F2' | 'F5' | 'M4' | 'F1';

export type SupertonicStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'unavailable'
  | 'error';

export type SupertonicProgress = {
  status: SupertonicStatus;
  /** 0–1 while downloading / loading model files */
  progress: number;
  detail: string;
};

const MODEL_ID = 'onnx-community/Supertonic-TTS-ONNX';
/** ESM build — kept out of the Metro graph via runtime import(). */
const TRANSFORMERS_CDN =
  'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.0/+esm';

const VOICE_URL: Record<SupertonicVoiceId, string> = {
  F2: 'https://huggingface.co/onnx-community/Supertonic-TTS-ONNX/resolve/main/voices/F2.bin',
  F5: 'https://huggingface.co/onnx-community/Supertonic-TTS-ONNX/resolve/main/voices/F5.bin',
  M4: 'https://huggingface.co/onnx-community/Supertonic-TTS-ONNX/resolve/main/voices/M4.bin',
  F1: 'https://huggingface.co/onnx-community/Supertonic-TTS-ONNX/resolve/main/voices/F1.bin',
};

type RawAudioResult = {
  audio?: Float32Array | Float32Array[];
  sampling_rate?: number;
  toBlob?: () => Blob | Promise<Blob>;
};

type TtsPipeline = (
  text: string,
  options: Record<string, unknown>
) => Promise<RawAudioResult>;

type TransformersMod = {
  pipeline: (
    task: string,
    model: string,
    options?: Record<string, unknown>
  ) => Promise<TtsPipeline>;
  env: {
    allowLocalModels: boolean;
    useBrowserCache: boolean;
    backends?: { onnx?: { wasm?: { numThreads?: number; proxy?: boolean } } };
  };
};

let pipelinePromise: Promise<TtsPipeline> | null = null;
let status: SupertonicStatus = 'idle';
let progress = 0;
let detail = '';
const listeners = new Set<(s: SupertonicProgress) => void>();

let audioCtx: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;
let currentAudio: HTMLAudioElement | null = null;
let speakGen = 0;

function emit() {
  const snap: SupertonicProgress = { status, progress, detail };
  listeners.forEach((cb) => cb(snap));
}

function setState(
  next: SupertonicStatus,
  nextProgress?: number,
  nextDetail?: string
) {
  status = next;
  if (typeof nextProgress === 'number') progress = nextProgress;
  if (typeof nextDetail === 'string') detail = nextDetail;
  emit();
}

export function isSupertonicSupported(): boolean {
  return typeof window !== 'undefined';
}

export function getSupertonicStatus(): SupertonicStatus {
  return status;
}

export function getSupertonicProgress(): SupertonicProgress {
  return { status, progress, detail };
}

export function onSupertonicStatus(
  cb: (s: SupertonicProgress | SupertonicStatus) => void
): () => void {
  const wrapped = (p: SupertonicProgress) => cb(p);
  listeners.add(wrapped);
  wrapped({ status, progress, detail });
  return () => {
    listeners.delete(wrapped);
  };
}

/** Call from a user tap so Web Audio can play later. */
export function unlockSupertonicAudio(): void {
  if (typeof window === 'undefined') return;
  if (!audioCtx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx?.state === 'suspended') {
    void audioCtx.resume();
  }
}

function haltPlayback(): void {
  try {
    currentSource?.stop();
  } catch {
    // ignore
  }
  currentSource = null;
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

export function stopSupertonic(): void {
  speakGen += 1;
  haltPlayback();
}

/** Bypass Metro static analysis — CDN ESM only. */
function importTransformers(): Promise<TransformersMod> {
  // eslint-disable-next-line no-new-func
  const dynImport = new Function('u', 'return import(u)') as (
    u: string
  ) => Promise<TransformersMod>;
  return dynImport(TRANSFORMERS_CDN);
}

function onHfProgress(info: {
  status?: string;
  progress?: number;
  file?: string;
  name?: string;
}) {
  const file = info.file || info.name || '';
  if (info.status === 'progress' && typeof info.progress === 'number') {
    // HF reports 0–100 sometimes, 0–1 other times
    const p = info.progress > 1 ? info.progress / 100 : info.progress;
    setState('loading', Math.min(0.95, Math.max(progress, p * 0.9)), `Downloading ${file || 'voice model'}…`);
  } else if (info.status === 'done') {
    setState('loading', Math.max(progress, 0.92), 'Finishing voice setup…');
  } else if (info.status === 'initiate' || info.status === 'download') {
    setState('loading', Math.max(progress, 0.05), `Fetching ${file || 'voice model'}…`);
  }
}

async function getPipeline(): Promise<TtsPipeline> {
  if (pipelinePromise) return pipelinePromise;

  setState('loading', 0.02, 'Loading Meadow’s teacher voice…');
  pipelinePromise = (async () => {
    setState('loading', 0.05, 'Loading voice engine…');
    const { pipeline, env } = await importTransformers();

    env.allowLocalModels = false;
    env.useBrowserCache = true;
    // Avoid threaded WASM (needs COOP/COEP which breaks HF CDN fetches)
    try {
      if (env.backends?.onnx?.wasm) {
        env.backends.onnx.wasm.numThreads = 1;
        env.backends.onnx.wasm.proxy = false;
      }
    } catch {
      // ignore
    }

    setState('loading', 0.1, 'Downloading Supertonic model (≈120MB, first time only)…');

    const tts = await pipeline('text-to-speech', MODEL_ID, {
      progress_callback: onHfProgress,
      // Model ships fp32 + external data only (see transformers.js_config)
      dtype: 'fp32',
      device: 'wasm',
    });

    setState('ready', 1, 'Meadow voice ready');
    console.info('[Meadow] Supertonic ready');
    return tts;
  })().catch((err) => {
    console.warn('[Meadow] Supertonic failed to load', err);
    setState('error', 0, String(err?.message || err || 'Voice load failed'));
    pipelinePromise = null;
    throw err;
  });

  return pipelinePromise;
}

export async function ensureSupertonic(
  _voice?: SupertonicVoiceId
): Promise<boolean> {
  if (!isSupertonicSupported()) {
    setState('unavailable', 0, 'Neural voice is web-only');
    return false;
  }
  try {
    await getPipeline();
    return true;
  } catch {
    return false;
  }
}

/**
 * Wait until ready (or timeout / error). Used so teaching turns can use neural voice.
 */
export async function waitForSupertonic(timeoutMs = 120_000): Promise<boolean> {
  if (status === 'ready') return true;
  if (status === 'error' || status === 'unavailable') return false;
  if (!isSupertonicSupported()) return false;

  const load = ensureSupertonic();
  const ok = await Promise.race([
    load,
    new Promise<boolean>((resolve) => setTimeout(() => resolve(false), timeoutMs)),
  ]);
  return Boolean(ok) && getSupertonicStatus() === 'ready';
}

async function playBlob(blob: Blob, gen: number): Promise<void> {
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
      reject(new Error('audio play failed'));
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
}

async function playPcm(
  samples: Float32Array,
  sampleRate: number,
  gen: number
): Promise<void> {
  unlockSupertonicAudio();
  if (!audioCtx) throw new Error('no AudioContext');
  if (audioCtx.state === 'suspended') await audioCtx.resume();

  const buffer = audioCtx.createBuffer(1, samples.length, sampleRate);
  buffer.copyToChannel(new Float32Array(samples), 0);
  const src = audioCtx.createBufferSource();
  src.buffer = buffer;
  src.connect(audioCtx.destination);
  currentSource = src;

  await new Promise<void>((resolve) => {
    src.onended = () => {
      if (currentSource === src) currentSource = null;
      resolve();
    };
    src.start();
    if (gen !== speakGen) {
      try {
        src.stop();
      } catch {
        // ignore
      }
      resolve();
    }
  });
}

/**
 * Speak with Supertonic. Returns false if unavailable / failed (caller should fall back).
 */
export async function speakSupertonic(
  text: string,
  opts?: { voice?: SupertonicVoiceId; speed?: number; steps?: number }
): Promise<boolean> {
  if (!text.trim() || !isSupertonicSupported()) return false;

  const gen = ++speakGen;
  haltPlayback();
  unlockSupertonicAudio();

  try {
    const tts = await getPipeline();
    if (gen !== speakGen) return false;

    const voice = opts?.voice ?? 'F2';
    const result = await tts(text, {
      speaker_embeddings: VOICE_URL[voice],
      num_inference_steps: opts?.steps ?? 5,
      speed: opts?.speed ?? 0.95,
    });

    if (gen !== speakGen) return false;

    if (typeof result.toBlob === 'function') {
      const maybe = result.toBlob() as Blob | Promise<Blob>;
      const blob = maybe instanceof Promise ? await maybe : maybe;
      if (gen !== speakGen) return false;
      await playBlob(blob, gen);
      return true;
    }

    if (result.audio && result.sampling_rate) {
      const pcm = Array.isArray(result.audio) ? result.audio[0] : result.audio;
      await playPcm(pcm, result.sampling_rate, gen);
      return true;
    }

    console.warn('[Meadow] Supertonic returned no audio', result);
    return false;
  } catch (err) {
    console.warn('[Meadow] speakSupertonic error', err);
    return false;
  }
}
