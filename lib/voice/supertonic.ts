/** Native / non-web stub — Supertonic runs in the browser only. */
export type SupertonicVoiceId = 'F2' | 'F5' | 'M4' | 'F1';

export type SupertonicStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'unavailable'
  | 'error';

export type SupertonicProgress = {
  status: SupertonicStatus;
  progress: number;
  detail: string;
};

export function isSupertonicSupported(): boolean {
  return false;
}

export function getSupertonicStatus(): SupertonicStatus {
  return 'unavailable';
}

export function getSupertonicProgress(): SupertonicProgress {
  return { status: 'unavailable', progress: 0, detail: 'Neural voice is web-only' };
}

export async function ensureSupertonic(_voice?: SupertonicVoiceId): Promise<boolean> {
  return false;
}

export async function waitForSupertonic(_timeoutMs?: number): Promise<boolean> {
  return false;
}

export async function speakSupertonic(
  _text: string,
  _opts?: { voice?: SupertonicVoiceId; speed?: number; steps?: number }
): Promise<boolean> {
  return false;
}

export function stopSupertonic(): void {
  // no-op
}

export function unlockSupertonicAudio(): void {
  // no-op
}

export function onSupertonicStatus(
  cb: (s: SupertonicProgress | SupertonicStatus) => void
): () => void {
  cb({ status: 'unavailable', progress: 0, detail: 'Neural voice is web-only' });
  return () => {};
}
