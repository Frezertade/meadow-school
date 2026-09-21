import type { CurriculumBand } from '../schema';

export const ages67: CurriculumBand = {
  id: 'ages-6-7',
  label: 'Grade 1 Trail',
  ageRange: 'Ages 6–7',
  description:
    'Maps to PA elementary subjects once a home education program is active: reading, arithmetic, science, PA/US stories, art, safety.',
  lessons: [
    {
      id: 'a67-reading-short-a',
      ageBand: 'ages-6-7',
      subject: 'english',
      title: 'Short A Word Family',
      minutes: 15,
      summary: 'Read and sort -at / -an words; write a short sentence.',
      groundingText: `
Lesson: Short A Word Family (ages 6–7 / grade 1 trail).
Goal: Read CVC words with short a; notice -at and -an families; write one simple sentence.
Key facts:
- Short a sounds like /a/ in cat, map, fan.
- -at family: cat, hat, mat, sat.
- -an family: can, man, pan, fan.
- A sentence starts with a capital and ends with a period (gentle intro).
- Spelling: stretch the sounds, write each sound you hear.
`,
      pa: {
        level: 'elementary-K6',
        statuteSubjects: ['English (spelling, reading, writing)'],
        standardsTags: ['Phonics', 'Word families', 'Sentence writing'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: '-at and -an',
          text: 'cat, hat, mat all share -at. can, man, pan share -an. Same middle sound: /a/.',
          tutorCue: 'Have the child read each word aloud. Cheer accurate blends.',
        },
        {
          id: 'b2',
          kind: 'prompt',
          text: 'Try this sentence: The cat sat.',
        },
      ],
      exercises: [
        {
          kind: 'reading',
          id: 'r1',
          instruction: 'Which word belongs in the -at family?',
          prompt: 'Pick the -at word',
          choices: ['hat', 'man', 'cup'],
          answer: 'hat',
          hint: 'It rhymes with cat.',
        },
        {
          kind: 'reading',
          id: 'r2',
          instruction: 'Read and choose',
          prompt: 'The ___ sat on the mat.',
          choices: ['cat', 'bus', 'moon'],
          answer: 'cat',
          hint: 'It is the -at animal from our lesson.',
        },
        {
          kind: 'drawing',
          id: 'd1',
          instruction: 'Illustrate the sentence',
          prompt: 'Draw: The cat sat. Add a mat under the cat.',
          successMessage: 'You turned words into a picture — that is real reading power.',
        },
      ],
    },
    {
      id: 'a67-math-add-10',
      ageBand: 'ages-6-7',
      subject: 'math',
      title: 'Adding Within 10',
      minutes: 15,
      summary: 'Add two groups within 10 using pictures and number sentences.',
      groundingText: `
Lesson: Adding Within 10 (ages 6–7).
Goal: Combine two groups; write number sentences like 3+4=7; stay within 10.
Key facts:
- Addition means putting groups together.
- Plus sign + means "and" / "put together".
- Equals = means "the same as" / "the total".
- Strategies: count all; count on from the bigger number.
- Answers today stay between 0 and 10.
`,
      pa: {
        level: 'elementary-K6',
        statuteSubjects: ['Arithmetic'],
        standardsTags: ['Addition within 10', 'Number sentences'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          text: '3 blueberries and 4 blueberries. Put together: 3 + 4 = 7.',
          tutorCue: 'Use fingers or drawings. Count on from 3: 4,5,6,7.',
        },
      ],
      exercises: [
        {
          kind: 'math',
          id: 'm1',
          instruction: 'Solve',
          visual: '🔵🔵 + 🔵🔵🔵',
          prompt: '2 + 3 =',
          choices: ['4', '5', '6'],
          answer: '5',
          hint: 'Start at 2, then count 3 more.',
        },
        {
          kind: 'math',
          id: 'm2',
          instruction: 'Solve',
          prompt: '4 + 5 =',
          choices: ['8', '9', '10'],
          answer: '9',
          hint: 'Count on from 5: 6,7,8,9.',
        },
      ],
    },
    {
      id: 'a67-science-plants',
      ageBand: 'ages-6-7',
      subject: 'science',
      title: 'What Plants Need',
      minutes: 12,
      summary: 'Observe that plants need water, light, and soil.',
      groundingText: `
Lesson: What Plants Need (ages 6–7).
Goal: Name three needs of plants: water, light, soil (or good place to grow); observe a leaf or plant.
Key facts:
- Most plants need water, light from the sun, and soil or another place for roots.
- Roots drink water; leaves use light to help the plant make food (keep simple).
- We care for plants gently.
- No chemicals, no experiments that could be unsafe at home without an adult.
`,
      pa: {
        level: 'elementary-K6',
        statuteSubjects: ['Science'],
        standardsTags: ['Life science', 'Observation'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          text: 'Plants are living things. They need water, light, and soil. Let’s notice a plant near you.',
        },
      ],
      exercises: [
        {
          kind: 'reading',
          id: 'r1',
          instruction: 'What do plants need?',
          prompt: 'Pick a true need',
          choices: ['Water and light', 'Video games', 'Candy'],
          answer: 'Water and light',
          hint: 'Think about sunshine and rain.',
        },
        {
          kind: 'drawing',
          id: 'd1',
          instruction: 'Draw a healthy plant',
          prompt: 'Draw a plant with roots, a stem, leaves, and a sun + water drops.',
          successMessage: 'You showed what a plant needs. Scientist eyes!',
        },
      ],
    },
    {
      id: 'a67-pa-symbols',
      ageBand: 'ages-6-7',
      subject: 'social',
      title: 'Pennsylvania Symbols',
      minutes: 12,
      summary: 'Meet a few PA symbols and practice map vocabulary.',
      groundingText: `
Lesson: Pennsylvania Symbols (ages 6–7).
Goal: Know Pennsylvania is our state; recognize the ruffed grouse (state bird) and mountain laurel (state flower) as friendly facts; use words town, state, country.
Key facts (keep accurate and light):
- Pennsylvania is a state in the United States.
- State bird: ruffed grouse.
- State flower: mountain laurel.
- State tree: eastern hemlock (optional).
- Civics seed: people in a community help make rules that keep everyone safer.
- Avoid partisan politics.
`,
      pa: {
        level: 'elementary-K6',
        statuteSubjects: [
          'Geography',
          'History of the United States and Pennsylvania',
          'Civics',
        ],
        standardsTags: ['Pennsylvania studies', 'Community rules'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'story',
          text: 'Pennsylvania’s state flower is mountain laurel. The state bird is the ruffed grouse. Learning symbols helps us know our home.',
        },
      ],
      exercises: [
        {
          kind: 'reading',
          id: 'r1',
          instruction: 'Pennsylvania’s state flower is…',
          prompt: 'Choose the flower',
          choices: ['Mountain laurel', 'Cactus bloom', 'Sunflower only'],
          answer: 'Mountain laurel',
          hint: 'It has two words and grows on mountainsides.',
        },
      ],
    },
    {
      id: 'a67-fire-plan',
      ageBand: 'ages-6-7',
      subject: 'safety',
      title: 'Home Fire Drill Plan',
      minutes: 10,
      summary: 'Practice a calm family exit plan and meeting place.',
      groundingText: `
Lesson: Home Fire Drill Plan (ages 6–7).
Goal: Know two ways out when possible; know an outdoor meeting place; never go back inside; grown-ups lead.
Key facts (calm, never graphic):
- Smoke alarms warn us. Test them with adults.
- Have a meeting place outside (tree, mailbox, neighbor’s step).
- Crawl low under smoke in drills if practicing that skill with a parent.
- Call 911 from outside with an adult when appropriate — kids learn the number with parents.
- Do not describe injuries. Praise calm practice.
`,
      pa: {
        level: 'elementary-K6',
        statuteSubjects: ['Safety education (including fire safety)'],
        standardsTags: ['Fire safety', 'Emergency readiness'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          text: 'We practice so our bodies know what to do. Exit calmly. Meet at our family meeting spot outside.',
        },
      ],
      exercises: [
        {
          kind: 'reading',
          id: 'r1',
          instruction: 'After we go outside, we…',
          prompt: 'Choose the safe next step',
          choices: ['Meet at our outdoor meeting place', 'Run back in for toys', 'Hide quietly inside'],
          answer: 'Meet at our outdoor meeting place',
          hint: 'Families meet outside so everyone can be counted.',
        },
        {
          kind: 'drawing',
          id: 'd1',
          instruction: 'Draw your meeting place',
          prompt: 'Draw your house and an X where your family meets outside.',
          successMessage: 'A clear plan helps everyone stay calm and safe.',
        },
      ],
    },
  ],
};
