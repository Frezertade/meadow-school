import { getBand, getLesson } from '@/content';
import { lessonSkills, skillLabel } from '@/lib/progress';
import type { ChildProfile, LearningLog, SkillMastery } from '@/lib/store';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export interface WeeklyFocus {
  childName: string;
  skill: string;
  lessonTitle: string;
  activity: string;
}

export interface WeeklyDigest {
  lessonsOpened: number;
  lessonsFinished: number;
  minutes: number;
  skillsPracticed: string[];
  focus?: WeeklyFocus;
}

/** Honest numbers only: counts + minutes come from real log events. */
export function buildDigest(
  children: ChildProfile[],
  logs: LearningLog[],
  mastery: Record<string, SkillMastery>
): WeeklyDigest {
  const since = Date.now() - WEEK_MS;
  const recent = logs.filter((l) => Date.parse(l.at) >= since);

  const opened = new Set<string>();
  const finished = new Set<string>();
  for (const l of recent) {
    if (!l.lessonId) continue;
    if (l.kind === 'lesson_open') opened.add(`${l.childId}:${l.lessonId}`);
    if (l.kind === 'lesson_complete') finished.add(`${l.childId}:${l.lessonId}`);
  }

  let minutes = 0;
  for (const key of finished) {
    const lessonId = key.split(':').slice(1).join(':');
    minutes += getLesson(lessonId)?.minutes ?? 0;
  }

  const practiced = new Set<string>();
  for (const [key, snap] of Object.entries(mastery)) {
    if (Date.parse(snap.lastSeen) >= since) {
      practiced.add(skillLabel(key.split(':').slice(1).join(':')));
    }
  }

  // Focus: stalest practicing-stage skill with an offline activity attached.
  let focus: WeeklyFocus | undefined;
  let oldest = Number.POSITIVE_INFINITY;
  for (const child of children) {
    const band = getBand(child.ageBand);
    for (const lesson of band.lessons) {
      for (const skillId of lessonSkills(lesson)) {
        const snap = mastery[`${child.id}:${skillId}`];
        if (!snap || snap.seen < 1 || snap.seen >= 3) continue;
        const t = Date.parse(snap.lastSeen);
        if (t < oldest) {
          oldest = t;
          focus = {
            childName: child.name,
            skill: skillLabel(skillId),
            lessonTitle: lesson.title,
            activity:
              lesson.support ??
              `Replay “${lesson.title}” together and celebrate every try.`,
          };
        }
      }
    }
  }

  return {
    lessonsOpened: opened.size,
    lessonsFinished: finished.size,
    minutes,
    skillsPracticed: [...practiced].slice(0, 8),
    focus,
  };
}
