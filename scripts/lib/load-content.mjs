/**
 * Shared loader for content-validation tooling.
 *
 * Band files are TypeScript but only use `import type` (erased at compile).
 * We transpile them with the repo's own `typescript` devDependency into a
 * temp dir and dynamic-import the result — no extra deps, works in CI.
 */
import { readdirSync, readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { transpileModule } = require('typescript');

const REPO_ROOT = join(new URL('.', import.meta.url).pathname, '..', '..');
const BANDS_DIR = join(REPO_ROOT, 'content', 'bands');

export const RENDERED_EXERCISE_KINDS = new Set(['reading', 'math', 'drawing', 'listen-say', 'sequence']);

export async function loadBands() {
  const tmp = mkdtempSync(join(tmpdir(), 'meadow-content-'));
  const files = readdirSync(BANDS_DIR)
    .filter((f) => f.endsWith('.ts') && !basename(f).startsWith('_'))
    .sort();
  const bands = [];
  for (const file of files) {
    const src = readFileSync(join(BANDS_DIR, file), 'utf8');
    const { outputText } = transpileModule(src, {
      compilerOptions: { module: 'ESNext', target: 'ES2020' },
    });
    const outPath = join(tmp, file.replace(/\.ts$/, '.mjs'));
    writeFileSync(outPath, outputText);
    const mod = await import(pathToFileURL(outPath).href);
    const band = Object.values(mod).find(
      (v) => v && typeof v === 'object' && Array.isArray(v.lessons),
    );
    if (!band) throw new Error(`No CurriculumBand export found in ${file}`);
    bands.push({ file, ...band });
  }
  return bands;
}

export async function loadPaAlignment() {
  const tmp = mkdtempSync(join(tmpdir(), 'meadow-pa-'));
  const src = readFileSync(join(REPO_ROOT, 'content', 'pa-alignment.ts'), 'utf8');
  const { outputText } = transpileModule(src, {
    compilerOptions: { module: 'ESNext', target: 'ES2020' },
  });
  const outPath = join(tmp, 'pa-alignment.mjs');
  writeFileSync(outPath, outputText);
  return import(pathToFileURL(outPath).href);
}
