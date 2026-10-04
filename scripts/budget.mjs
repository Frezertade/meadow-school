#!/usr/bin/env node
/**
 * Performance budgets — run AFTER `npm run build:web` (needs dist/).
 *
 *   npm run budget
 *
 * Fails CI when the web bundle grows past its budget.
 */
import { readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';

const REPO_ROOT = join(dirname(new URL(import.meta.url).pathname), '..');
const JS_DIR = join(REPO_ROOT, 'dist', '_expo', 'static', 'js', 'web');

// Web entry bundle budget (Expo export output, uncompressed).
const WARN_MB = 3.0;
const FAIL_MB = 3.5;

let files = [];
try {
  files = readdirSync(JS_DIR)
    .filter((f) => f.endsWith('.js'))
    .map((f) => ({ name: f, bytes: statSync(join(JS_DIR, f)).size }))
    .sort((a, b) => b.bytes - a.bytes);
} catch {
  console.error('budget: no web build found — run `npm run build:web` first.');
  process.exit(1);
}

let failed = false;
for (const f of files) {
  const mb = f.bytes / 1024 / 1024;
  const flag = mb > FAIL_MB ? 'FAIL' : mb > WARN_MB ? 'WARN' : 'ok';
  console.log(`budget: ${f.name} ${mb.toFixed(2)}MB [${flag}] (warn ${WARN_MB} / fail ${FAIL_MB})`);
  if (flag === 'FAIL') failed = true;
}

if (failed) {
  console.error('budget: web bundle exceeds the fail threshold.');
  process.exit(1);
}
console.log('budget: all bundles within budget.');
