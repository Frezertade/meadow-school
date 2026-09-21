/**
 * Pennsylvania alignment map for HomeSchool curriculum.
 * Source of truth for agents and parents: statute subjects + early learning domains.
 *
 * Compulsory filing begins at age 6 (or earlier if public K / grade-1+ affidavit).
 * Ages 3–5 content is intentional preschool prep — not a legal program until filed.
 */

export const PA_ELEMENTARY_SUBJECTS = [
  'English (spelling, reading, writing)',
  'Arithmetic',
  'Science',
  'Geography',
  'History of the United States and Pennsylvania',
  'Civics',
  'Safety education (including fire safety)',
  'Health and physiology',
  'Physical education',
  'Music',
  'Art',
] as const;

export const PA_NOTES = {
  compulsoryAge:
    'PA compulsory attendance is generally ages 6–18. Kindergarten is not required. Affidavit + evaluation apply once a home education program begins for compulsory-age children (or earlier if public K / grade 1+ enrollment triggers).',
  statute: '24 P.S. § 13-1327.1 Home Education Program',
  hoursElementary: '180 days OR 900 hours once a legal home education program is active',
  chapter4:
    '22 Pa. Code Chapter 4 academic standards are a planning reference; home programs need not match district order.',
  earlyLearning:
    'PA Early Learning Standards (ELDS) domains inform ages 3–5: Approaches to Learning through Play; Language & Literacy; Mathematical Thinking; Scientific Thinking; Social Studies Thinking; Creative Thinking & Expression; Health, Wellness & Physical Development; Social & Emotional Development.',
} as const;

/** Maps our SubjectId to PA elementary buckets (for ages 6–7 / K–1) */
export const SUBJECT_TO_PA: Record<string, string[]> = {
  english: ['English (spelling, reading, writing)'],
  math: ['Arithmetic'],
  art: ['Art'],
  science: ['Science'],
  social: ['Geography', 'History of the United States and Pennsylvania', 'Civics'],
  health: ['Health and physiology', 'Physical education'],
  music: ['Music'],
  safety: ['Safety education (including fire safety)'],
};
