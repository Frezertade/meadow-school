/**
 * ESM hooks: resolve `@/` aliases to repo .ts files and transpile
 * TypeScript on load with the repo's own `typescript` devDependency.
 * No test framework or bundler to install.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { transpileModule } = require('typescript');

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const url = pathToFileURL(join(REPO_ROOT, specifier.slice(2) + '.ts')).href;
    return { url, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.endsWith('.ts') && fileURLToPath(url).startsWith(REPO_ROOT)) {
    const src = readFileSync(fileURLToPath(url), 'utf8');
    const { outputText } = transpileModule(src, {
      compilerOptions: { module: 'ESNext', target: 'ES2020' },
    });
    return { format: 'module', source: outputText, shortCircuit: true };
  }
  return nextLoad(url, context);
}
