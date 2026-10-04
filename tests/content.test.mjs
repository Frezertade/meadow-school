import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import './lib/register.mjs';
import { loadBands } from '../scripts/lib/load-content.mjs';

const { SKILL_LABELS, skillLevel } = await import('@/lib/progress');

describe('content ↔ engine consistency', () => {
  it('every exercised skill has a parent-facing label', async () => {
    const bands = await loadBands();
    const missing = new Set();
    for (const band of bands) {
      for (const lesson of band.lessons) {
        for (const ex of lesson.exercises) {
          if (!SKILL_LABELS[ex.skillId]) missing.add(ex.skillId);
        }
      }
    }
    assert.deepEqual([...missing], []);
  });

  it('support/stretch lines exist on every lesson (differentiation)', async () => {
    const bands = await loadBands();
    const missing = [];
    for (const band of bands) {
      for (const lesson of band.lessons) {
        if (!lesson.support?.trim() || !lesson.stretch?.trim()) missing.push(lesson.id);
      }
    }
    assert.deepEqual(missing, []);
  });

  it('skillLevel never reports solid below 3 sightings', () => {
    assert.notEqual(skillLevel(2), 'solid');
  });
});
