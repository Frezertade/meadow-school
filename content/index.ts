import type { AgeBand, CurriculumBand, Lesson } from './schema';
import { ages34 } from './bands/ages-3-4';
import { ages5 } from './bands/ages-5';
import { ages67 } from './bands/ages-6-7';

export const curriculumBands: CurriculumBand[] = [ages34, ages5, ages67];

export function getBand(id: AgeBand): CurriculumBand {
  const band = curriculumBands.find((b) => b.id === id);
  if (!band) throw new Error(`Unknown age band: ${id}`);
  return band;
}

export function getLesson(id: string): Lesson | undefined {
  for (const band of curriculumBands) {
    const lesson = band.lessons.find((l) => l.id === id);
    if (lesson) return lesson;
  }
  return undefined;
}

export function getAllLessons(): Lesson[] {
  return curriculumBands.flatMap((b) => b.lessons);
}

export { ages34, ages5, ages67 };
