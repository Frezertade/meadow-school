#!/usr/bin/env node
/**
 * Validates all curriculum content against the rules in content/schema.ts
 * plus Meadow's teacher-agent requirements.
 *
 *   npm run validate
 *
 * Exit 1 on any error. Warnings never fail the build.
 */
import { loadBands, loadPaAlignment, RENDERED_EXERCISE_KINDS } from './lib/load-content.mjs';

const SUBJECT_IDS = new Set([
  'english', 'math', 'art', 'science', 'social', 'health', 'music', 'safety',
]);
const BLOCK_KINDS = new Set(['story', 'teach', 'prompt', 'celebrate']);

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

const bands = await loadBands();
const pa = await loadPaAlignment();
const PA_SUBJECTS = new Set(pa.PA_ELEMENTARY_SUBJECTS);
const SUBJECT_TO_PA = pa.SUBJECT_TO_PA;

const seenLessonIds = new Map(); // id -> band file

for (const band of bands) {
  const where = `band ${band.id} (${band.file})`;
  if (!Array.isArray(band.lessons) || band.lessons.length === 0) {
    err(where, 'band has no lessons');
    continue;
  }

  // pathOrder must be unique within the band and form 1..N
  const orders = band.lessons.map((l) => l.pathOrder).filter((o) => o !== undefined);
  if (new Set(orders).size !== orders.length) err(where, 'duplicate pathOrder values');
  const maxOrder = Math.max(0, ...orders);
  for (let i = 1; i <= maxOrder; i++) {
    if (!orders.includes(i)) warn(where, `pathOrder gap: no lesson with pathOrder ${i}`);
  }

  const bandLessonIds = new Set(band.lessons.map((l) => l.id));

  for (const lesson of band.lessons) {
    const L = `lesson ${lesson.id}`;

    // --- identity ---
    if (!lesson.id || typeof lesson.id !== 'string') { err(L, 'missing id'); continue; }
    if (seenLessonIds.has(lesson.id)) {
      err(L, `duplicate lesson id (also in ${seenLessonIds.get(lesson.id)})`);
    } else {
      seenLessonIds.set(lesson.id, band.file);
    }
    if (lesson.ageBand !== band.id) err(L, `ageBand "${lesson.ageBand}" != containing band "${band.id}"`);

    // --- subject + PA alignment ---
    if (!SUBJECT_IDS.has(lesson.subject)) {
      err(L, `unknown subject "${lesson.subject}"`);
    } else {
      const expected = SUBJECT_TO_PA[lesson.subject] ?? [];
      for (const s of expected) {
        if (!lesson.pa?.statuteSubjects?.includes(s)) {
          err(L, `pa.statuteSubjects missing "${s}" required for subject "${lesson.subject}"`);
        }
      }
    }
    if (!lesson.pa || !Array.isArray(lesson.pa.statuteSubjects) || lesson.pa.statuteSubjects.length === 0) {
      err(L, 'pa.statuteSubjects must be a non-empty array');
    } else {
      for (const s of lesson.pa.statuteSubjects) {
        if (!PA_SUBJECTS.has(s)) err(L, `unknown PA statute subject "${s}"`);
      }
    }
    if (!Array.isArray(lesson.pa?.standardsTags) || lesson.pa.standardsTags.length === 0) {
      warn(L, 'pa.standardsTags is empty — add at least one skill tag for the parent skills grid');
    }

    // --- copy basics ---
    if (!lesson.title?.trim()) err(L, 'missing title');
    if (!lesson.summary?.trim()) err(L, 'missing summary');
    if (!lesson.groundingText?.trim()) err(L, 'missing groundingText');
    else if (lesson.groundingText.trim().length < 100) {
      err(L, 'groundingText too short (<100 chars) — Meadow cannot stay grounded on a stub');
    }
    if (typeof lesson.minutes !== 'number' || lesson.minutes < 1 || lesson.minutes > 30) {
      err(L, `minutes must be 1–30 (got ${lesson.minutes})`);
    } else if (lesson.minutes > 15) {
      warn(L, `minutes=${lesson.minutes} exceeds the 5–8 min session arc — consider splitting`);
    }

    // --- path / unlock chain ---
    if (lesson.pathOrder === undefined) warn(L, 'no pathOrder — lesson floats outside the learning path');
    if (lesson.requiresLessonId && !bandLessonIds.has(lesson.requiresLessonId)) {
      err(L, `requiresLessonId "${lesson.requiresLessonId}" does not exist in this band`);
    }
    if (lesson.requiresLessonId === lesson.id) err(L, 'requiresLessonId points to itself (unlock cycle)');
    if (lesson.pathOrder !== undefined && lesson.pathOrder > 1 && !lesson.requiresLessonId) {
      warn(L, `pathOrder ${lesson.pathOrder} has no requiresLessonId — path may unlock out of order`);
    }

    // --- blocks ---
    if (!Array.isArray(lesson.blocks) || lesson.blocks.length === 0) {
      err(L, 'lesson has no blocks');
    } else {
      const blockIds = new Set();
      for (const b of lesson.blocks) {
        const B = `${L} block ${b.id}`;
        if (!b.id) { err(L, 'block missing id'); continue; }
        if (blockIds.has(b.id)) err(B, 'duplicate block id within lesson');
        blockIds.add(b.id);
        if (!BLOCK_KINDS.has(b.kind)) err(B, `unknown block kind "${b.kind}"`);
        if (!b.text?.trim()) err(B, 'missing text');
        if ((b.kind === 'teach' || b.kind === 'story') && !b.tutorCue?.trim()) {
          err(B, `teach/story block needs tutorCue (how Meadow performs this bite, not a paragraph dump)`);
        }
      }
    }

    // --- exercises ---
    if (!Array.isArray(lesson.exercises) || lesson.exercises.length === 0) {
      err(L, 'lesson has no exercises');
    } else {
      const exIds = new Set();
      const difficulties = new Set();
      for (const ex of lesson.exercises) {
        const X = `${L} exercise ${ex.id ?? '(missing id)'}`;
        if (!ex.id) { err(L, 'exercise missing id'); continue; }
        if (exIds.has(ex.id)) err(X, 'duplicate exercise id within lesson');
        exIds.add(ex.id);
        if (!RENDERED_EXERCISE_KINDS.has(ex.kind)) {
          err(X, `kind "${ex.kind}" has no UI renderer (TeacherAgent/LessonPlayer only render reading, math, drawing)`);
          continue;
        }
        const d = ex.difficulty ?? 1;
        if (![1, 2, 3].includes(d)) err(X, `difficulty must be 1–3 (got ${ex.difficulty})`);
        difficulties.add(d);
        if (!ex.instruction?.trim()) err(X, 'missing instruction');
        if (!ex.prompt?.trim()) err(X, 'missing prompt');
        if (ex.kind === 'reading' || ex.kind === 'math') {
          if (!Array.isArray(ex.choices) || ex.choices.length < 2) err(X, 'needs ≥2 choices');
          if (!ex.choices?.includes(ex.answer)) err(X, 'answer must be one of choices');
          if (!ex.hint?.trim()) err(X, 'missing hint');
        }
        if (ex.kind === 'drawing' && !ex.successMessage?.trim()) err(X, 'missing successMessage');
      }
      if (!difficulties.has(1)) err(L, 'no difficulty-1 warm-up exercise — every lesson must start gentle');
    }
  }
}

// --- report ---
for (const w of warnings) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
const lessonCount = [...seenLessonIds.keys()].length;
console.log(`\nValidated ${bands.length} bands, ${lessonCount} lessons: ${errors.length} error(s), ${warnings.length} warning(s).`);
process.exit(errors.length ? 1 : 0);
