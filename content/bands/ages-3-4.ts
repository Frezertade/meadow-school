import type { CurriculumBand } from '../schema';

export const ages34: CurriculumBand = {
  id: 'ages-3-4',
  label: 'Little Meadow',
  ageRange: 'Ages 3–4',
  description:
    'Play-first literacy, counting, and art. Short lessons, big pictures, lots of talking.',
  lessons: [
    {
      id: 'a34-letters-a',
      ageBand: 'ages-3-4',
      subject: 'english',
      title: 'Letter A Adventure',
      minutes: 8,
      summary: 'Meet the letter A with apple stories and sound play.',
      groundingText: `
Lesson: Letter A Adventure (ages 3–4).
Goal: Hear and say the /a/ sound; recognize the letter A; connect A to "apple".
Key facts for the tutor:
- The letter is called "A".
- The short sound we practice today is /a/ as in apple (ah).
- Apple starts with A.
- We look at capital A and lowercase a.
- Keep answers short, warm, and concrete. No scary topics. No off-lesson trivia.
Teaching steps: say "A says /a/"; find A on the page; clap for apple; celebrate effort.
`,
      pa: {
        level: 'prek',
        statuteSubjects: ['English (spelling, reading, writing)'],
        standardsTags: ['ELDS Language & Literacy', 'Letter knowledge', 'Phonological awareness'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'story',
          title: 'Meet A',
          text: 'This is the letter A. A likes to say /a/ — like the beginning of apple!',
          tutorCue: 'Point to A and say the sound together: /a/.',
        },
        {
          id: 'b2',
          kind: 'teach',
          title: 'Apple starts with A',
          text: 'Apple. /a/-pple. Can you say /a/? Great work!',
          tutorCue: 'Ask the child to say /a/ three times, then apple once.',
        },
        {
          id: 'b3',
          kind: 'prompt',
          text: 'Find the letter A. Trace it with your finger in the air.',
        },
      ],
      exercises: [
        {
          kind: 'reading',
          id: 'r1',
          instruction: 'Which letter is A?',
          prompt: 'Tap the letter A',
          choices: ['A', 'B', 'M'],
          answer: 'A',
          hint: 'A looks like a tall tent.',
        },
        {
          kind: 'drawing',
          id: 'd1',
          instruction: 'Draw an apple for A',
          prompt: 'Draw a round red apple. You can add a little leaf on top.',
          successMessage: 'What a wonderful apple for letter A!',
        },
      ],
    },
    {
      id: 'a34-count-3',
      ageBand: 'ages-3-4',
      subject: 'math',
      title: 'Count to Three',
      minutes: 7,
      summary: 'Count 1-2-3 with berries and fingers.',
      groundingText: `
Lesson: Count to Three (ages 3–4).
Goal: Count objects from 1 to 3; say the numbers in order; match quantity to numeral.
Key facts:
- Numbers in order: one, two, three.
- Three means three things — not two, not four.
- Count by touching each object once (one-to-one).
- Celebrate counting even if the child needs help.
`,
      pa: {
        level: 'prek',
        statuteSubjects: ['Arithmetic'],
        standardsTags: ['ELDS Mathematical Thinking', 'Counting', 'Cardinality'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: 'One, two, three',
          text: 'Hold up fingers: one… two… three! We can count berries the same way.',
          tutorCue: 'Count slowly with the child. Touch each berry once.',
        },
      ],
      exercises: [
        {
          kind: 'math',
          id: 'm1',
          instruction: 'How many berries?',
          visual: '🫐🫐🫐',
          prompt: 'Count the berries',
          choices: ['2', '3', '4'],
          answer: '3',
          hint: 'Touch each berry and say one, two, three.',
        },
        {
          kind: 'drawing',
          id: 'd1',
          instruction: 'Draw three circles',
          prompt: 'Draw three round circles. They can be berries, balls, or bubbles!',
          successMessage: 'Three beautiful shapes — perfect counting!',
        },
      ],
    },
    {
      id: 'a34-colors-sky',
      ageBand: 'ages-3-4',
      subject: 'art',
      title: 'Sky and Meadow Colors',
      minutes: 10,
      summary: 'Name colors and paint a simple outdoor scene.',
      groundingText: `
Lesson: Sky and Meadow Colors (ages 3–4).
Goal: Name blue, green, and yellow; use them in a drawing of outdoors.
Key facts:
- Sky is often blue.
- Grass and trees are often green.
- Sun is often yellow (honey-bright).
- There is no wrong art — encourage trying.
`,
      pa: {
        level: 'prek',
        statuteSubjects: ['Art'],
        standardsTags: ['ELDS Creative Thinking & Expression', 'Color recognition'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          text: 'Blue for sky. Green for grass. Yellow for sun. Let’s make a tiny meadow!',
        },
      ],
      exercises: [
        {
          kind: 'drawing',
          id: 'd1',
          instruction: 'Draw your meadow',
          prompt: 'Draw a blue sky, green grass, and a yellow sun. Add anything happy you like.',
          successMessage: 'Your meadow is beautiful. Artists look carefully — you did!',
        },
      ],
    },
    {
      id: 'a34-fire-safety',
      ageBand: 'ages-3-4',
      subject: 'safety',
      title: 'Stop, Drop, and Hugs',
      minutes: 6,
      summary: 'Gentle fire-safety habits without scary details.',
      groundingText: `
Lesson: Stop, Drop, and Hugs (ages 3–4) — soft fire safety.
Goal: Know smoke alarms mean go outside with a grown-up; practice stop and drop as a calm game.
Key facts (keep calm, never graphic):
- Smoke alarms beep to keep us safe.
- If there is smoke or a fire drill, stay low and go outside with a parent.
- Stop, drop, and roll is a practice move if clothes catch fire — teach as calm practice, not fear.
- Grown-ups help. Kids never hide. Kids never go back inside alone.
- Do NOT describe injuries, burn details, or scary media.
`,
      pa: {
        level: 'prek',
        statuteSubjects: ['Safety education (including fire safety)'],
        standardsTags: ['ELDS Health & Wellness', 'Personal safety'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          text: 'The beep-beep alarm means: find a grown-up and go outside. We stay calm and help each other.',
          tutorCue: 'Practice walking calmly to a pretend door. Praise calm bodies.',
        },
      ],
      exercises: [
        {
          kind: 'reading',
          id: 'r1',
          instruction: 'What do we do when the alarm beeps?',
          prompt: 'Choose the safe plan',
          choices: ['Find a grown-up and go outside', 'Hide under the bed', 'Go back for toys'],
          answer: 'Find a grown-up and go outside',
          hint: 'Grown-ups help. Outside is the safe place.',
        },
      ],
    },
  ],
};
