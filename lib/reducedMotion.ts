/**
 * Honors the OS reduced-motion setting: celebration loops and mascot
 * bouncing go still. Node-safe (defaults to full motion in tests).
 */
export function prefersReducedMotion(): boolean {
  try {
    const g = globalThis as unknown as {
      matchMedia?: (q: string) => { matches: boolean };
    };
    return !!g.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}
