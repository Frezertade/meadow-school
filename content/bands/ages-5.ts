import type { CurriculumBand } from '../schema';

export const ages5: CurriculumBand = {
  id: 'ages-5',
  label: 'Kindergarten Path',
  ageRange: 'Age 5',
  description:
    'Letter sounds, CVC seeds, counting to 10, and story drawing. Optional K — not required in PA.',
  lessons: [
    {
      id: 'a5-cvc-cat',
      ageBand: 'ages-5',
      subject: 'english',
      title: 'Sound Out: cat',
      minutes: 12,
      pathOrder: 1,
      summary: 'Blend /c/ /a/ /t/ into cat.',
      groundingText: `
Lesson: Sound Out cat (age 5 / kindergarten path). Incremental path: warm-up → stretch → strong.
Goal: Blend three sounds into the word "cat"; recognize letters c, a, t; later blend new CVC words and use rhymes.
Key facts:
- c says /c/, a says /a/ (short), t says /t/.
- Blend slowly: /c/…/a/…/t/ → cat.
- Cat is an animal. Rhymes with mat, hat (optional if child is ready).
- Praise blending attempts. Do not introduce complex spelling rules today.
`,
      pa: {
        level: 'elementary-K6',
        statuteSubjects: ['English (spelling, reading, writing)'],
        standardsTags: ['Phonemic awareness', 'Phonics', 'PA ELA Foundational Skills'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: 'Three sounds',
          text: 'c… a… t. Push them together: cat! A cat says meow.',
          tutorCue: 'Model blending with hand-sweep left to right.',
        },
      ],
      exercises: [
        {
          kind: 'reading',
          id: 'r1',
          difficulty: 1,
          instruction: 'Warm-up: Which word did we blend?',
          prompt: '/c/ /a/ /t/',
          choices: ['cat', 'dog', 'cup'],
          answer: 'cat',
          hint: 'It is a soft pet that says meow.',
        },
        {
          kind: 'drawing',
          id: 'd1',
          difficulty: 1,
          instruction: 'Warm-up: Draw a cat',
          prompt: 'Draw a friendly cat. Whiskers welcome!',
          successMessage: 'Your cat looks ready to nap in the sun.',
        },
        {
          kind: 'reading',
          id: 'r2',
          difficulty: 2,
          instruction: 'Stretch: Sound out a new -at word',
          prompt: '/h/ /a/ /t/',
          choices: ['hat', 'hop', 'hen'],
          answer: 'hat',
          hint: 'You wear it on your head. It rhymes with cat.',
        },
        {
          kind: 'reading',
          id: 'r3',
          difficulty: 3,
          instruction: 'Strong: Which word rhymes with cat?',
          prompt: 'Pick the -at rhyming word',
          choices: ['mat', 'dog', 'sun'],
          answer: 'mat',
          hint: 'You wipe your feet on it. Same ending sound as cat.',
        },
      ],
    },
    {
      id: 'a5-math-10',
      ageBand: 'ages-5',
      subject: 'math',
      title: 'Ten Garden Seeds',
      minutes: 10,
      pathOrder: 2,
      requiresLessonId: 'a5-cvc-cat',
      summary: 'Count to 10 and compare more / less.',
      groundingText: `
Lesson: Ten Garden Seeds (age 5). Incremental path: warm-up → stretch → strong.
Goal: Count to 10; know that 10 is one more than 9; compare small sets; later find one more and compare three groups.
Key facts:
- Count in order 1 through 10.
- Ten fingers can help.
- "More" means a bigger group; "less" means a smaller group.
`,
      pa: {
        level: 'elementary-K6',
        statuteSubjects: ['Arithmetic'],
        standardsTags: ['Counting to 10', 'Compare quantities'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          text: 'Plant one seed at a time until we reach ten. 1-2-3-4-5-6-7-8-9-10!',
          tutorCue: 'Count aloud slowly with the child, one finger per seed; wiggle all ten fingers together at ten.',
        },
      ],
      exercises: [
        {
          kind: 'math',
          id: 'm1',
          difficulty: 1,
          instruction: 'Warm-up: How many seeds?',
          visual: '🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱',
          prompt: 'Count them all',
          choices: ['8', '9', '10'],
          answer: '10',
          hint: 'Use your fingers. Ten fingers, ten seeds.',
        },
        {
          kind: 'math',
          id: 'm2',
          difficulty: 1,
          instruction: 'Warm-up: Which group has MORE?',
          visual: 'A: 🍎🍎   B: 🍎🍎🍎🍎',
          prompt: 'Pick the bigger group',
          choices: ['A', 'B'],
          answer: 'B',
          hint: 'B has four apples. A has two.',
        },
        {
          kind: 'math',
          id: 'm3',
          difficulty: 2,
          instruction: 'Stretch: How many seeds now?',
          visual: '🌱🌱🌱🌱🌱🌱🌱🌱🌱',
          prompt: 'Count these seeds',
          choices: ['8', '9', '10'],
          answer: '9',
          hint: 'One less than ten. Count carefully.',
        },
        {
          kind: 'math',
          id: 'm4',
          difficulty: 3,
          instruction: 'Strong: What is one more than 9?',
          prompt: '9 and one more makes…',
          choices: ['8', '9', '10'],
          answer: '10',
          hint: 'Hold up nine fingers, then add one more.',
        },
      ],
    },
    {
      id: 'a5-pa-flag',
      ageBand: 'ages-5',
      subject: 'social',
      title: 'Our State: Pennsylvania',
      minutes: 8,
      pathOrder: 3,
      requiresLessonId: 'a5-math-10',
      summary: 'Learn we live in Pennsylvania in a gentle, concrete way.',
      groundingText: `
Lesson: Our State Pennsylvania (age 5). Incremental path: warm-up → stretch → strong.
Goal: Say the name Pennsylvania; know it is our state; notice a simple map idea (home is here); later place Pennsylvania in the United States and draw local home.
Key facts:
- We live in Pennsylvania (nicknamed the Keystone State — optional).
- Pennsylvania is in the United States.
- Mount Joy is a town in Pennsylvania.
- Keep geography warm and local: home, town, state, country.
- No political controversy; no adult news topics.
`,
      pa: {
        level: 'elementary-K6',
        statuteSubjects: [
          'Geography',
          'History of the United States and Pennsylvania',
          'Civics',
        ],
        standardsTags: ['Community', 'State identity'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'story',
          text: 'Our home is in Pennsylvania. Pennsylvania is part of the United States. We take care of our neighbors and our home.',
          tutorCue: 'Warm storytelling voice; hand on heart for "our home", arms wide for "Pennsylvania".',
        },
      ],
      exercises: [
        {
          kind: 'reading',
          id: 'r1',
          difficulty: 1,
          instruction: 'Warm-up: Where do we live?',
          prompt: 'Our state is…',
          choices: ['Pennsylvania', 'The Moon', 'The Ocean'],
          answer: 'Pennsylvania',
          hint: 'It is a long word that starts with P.',
        },
        {
          kind: 'drawing',
          id: 'd1',
          difficulty: 1,
          instruction: 'Warm-up: Draw your home',
          prompt: 'Draw your house or apartment in Pennsylvania. Add a tree or a friendly cloud.',
          successMessage: 'Home sweet Pennsylvania home!',
        },
        {
          kind: 'reading',
          id: 'r2',
          difficulty: 2,
          instruction: 'Stretch: Pennsylvania is part of the…',
          prompt: 'Our state is inside the…',
          choices: ['United States', 'Mars', 'The Ocean'],
          answer: 'United States',
          hint: 'It is our country. Stars and stripes on the flag.',
        },
        {
          kind: 'drawing',
          id: 'd2',
          difficulty: 3,
          instruction: 'Strong: Draw home, town, and state',
          prompt: 'Draw your house, label Mount Joy (your town), and write PA for Pennsylvania.',
          successMessage: 'You showed home → town → state. Geography star!',
        },
      ],
    },
  ],
};
