import type { CurriculumBand } from '../schema';

export const ages34: CurriculumBand = {
  id: 'ages-3-4',
  label: 'Little Meadow',
  ageRange: 'Ages 3–4',
  description:
    'Play-first literacy, counting, and art. Clear warm-ups, then stronger challenges.',
  lessons: [
    {
      id: 'a34-letters-a',
      ageBand: 'ages-3-4',
      subject: 'english',
      title: 'Letter A Adventure',
      minutes: 10,
      pathOrder: 1,
      summary: 'Meet letter A, then try harder A finds and sounds.',
      groundingText: `
Lesson: Letter A Adventure (ages 3–4). Incremental path: warm-up → stretch → strong.
Goal: Hear and say the /a/ sound; recognize A; connect A to apple; later find A among more letters and match sound to letter.
Key facts: Letter A; short sound /a/ as in apple; apple starts with A; capital A and lowercase a.
`,
      pa: {
        level: 'prek',
        statuteSubjects: ['English (spelling, reading, writing)'],
        standardsTags: ['ELDS Language & Literacy', 'Letter knowledge'],
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
      ],
      exercises: [
        {
          kind: 'reading',
          id: 'r1',
          difficulty: 1,
          instruction: 'Warm-up: Which letter is A?',
          prompt: 'Tap the letter A',
          choices: ['A', 'B', 'M'],
          answer: 'A',
          hint: 'A looks like a tall tent.',
        },
        {
          kind: 'drawing',
          id: 'd1',
          difficulty: 1,
          instruction: 'Warm-up: Draw an apple for A',
          prompt: 'Draw a round red apple. You can add a little leaf on top.',
          successMessage: 'What a wonderful apple for letter A!',
        },
        {
          kind: 'reading',
          id: 'r2',
          difficulty: 2,
          instruction: 'Stretch: Find A among more letters',
          prompt: 'Which one is A?',
          choices: ['S', 'A', 'O', 'E'],
          answer: 'A',
          hint: 'Still the tent shape — not a circle like O.',
        },
        {
          kind: 'reading',
          id: 'r3',
          difficulty: 3,
          instruction: 'Strong: What sound does A say in apple?',
          prompt: 'A in apple says…',
          choices: ['ah', 'ooo', 'mmm'],
          answer: 'ah',
          hint: 'Open your mouth a little: /a/ like apple.',
        },
      ],
    },
    {
      id: 'a34-count-3',
      ageBand: 'ages-3-4',
      subject: 'math',
      title: 'Count to Three',
      minutes: 10,
      pathOrder: 2,
      requiresLessonId: 'a34-letters-a',
      summary: 'Count to 3, then compare and match numerals.',
      groundingText: `
Lesson: Count to Three (ages 3–4). Warm-up counting → stretch comparing → strong numeral match.
Numbers: one, two, three. Three means three things. Touch each object once.
`,
      pa: {
        level: 'prek',
        statuteSubjects: ['Arithmetic'],
        standardsTags: ['ELDS Mathematical Thinking', 'Counting'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: 'One, two, three',
          text: 'Hold up fingers: one… two… three! We can count berries the same way.',
          tutorCue: 'Count slowly. Touch each berry once.',
        },
      ],
      exercises: [
        {
          kind: 'math',
          id: 'm1',
          difficulty: 1,
          instruction: 'Warm-up: How many berries?',
          visual: '🫐🫐🫐',
          prompt: 'Count the berries',
          choices: ['2', '3', '4'],
          answer: '3',
          hint: 'Touch each berry: one, two, three.',
        },
        {
          kind: 'drawing',
          id: 'd1',
          difficulty: 1,
          instruction: 'Warm-up: Draw three circles',
          prompt: 'Draw three round circles.',
          successMessage: 'Three beautiful shapes!',
        },
        {
          kind: 'math',
          id: 'm2',
          difficulty: 2,
          instruction: 'Stretch: Which group has MORE?',
          visual: 'A: ⭐⭐   B: ⭐⭐⭐',
          prompt: 'Pick the bigger group',
          choices: ['A', 'B'],
          answer: 'B',
          hint: 'B has three stars. A has two.',
        },
        {
          kind: 'math',
          id: 'm3',
          difficulty: 3,
          instruction: 'Strong: Match the number',
          visual: '🦆🦆',
          prompt: 'How many ducks? Tap the number.',
          choices: ['1', '2', '3'],
          answer: '2',
          hint: 'Two ducks swimming.',
        },
      ],
    },
    {
      id: 'a34-colors-sky',
      ageBand: 'ages-3-4',
      subject: 'art',
      title: 'Sky and Meadow Colors',
      minutes: 10,
      pathOrder: 3,
      requiresLessonId: 'a34-count-3',
      summary: 'Name colors, then choose and draw with more detail.',
      groundingText: `
Lesson: Sky and Meadow Colors. Warm-up name colors → stretch choose color → strong fuller scene.
Sky often blue; grass green; sun yellow.
`,
      pa: {
        level: 'prek',
        statuteSubjects: ['Art'],
        standardsTags: ['ELDS Creative Thinking & Expression'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          text: 'Blue for sky. Green for grass. Yellow for sun. Let’s make a tiny meadow!',
          tutorCue: 'Point up, down, then at the sun as you name each color; invite the child to point and say each color with you.',
        },
      ],
      exercises: [
        {
          kind: 'drawing',
          id: 'd1',
          difficulty: 1,
          instruction: 'Warm-up: Draw your meadow',
          prompt: 'Draw a blue sky, green grass, and a yellow sun.',
          successMessage: 'Your meadow is beautiful!',
        },
        {
          kind: 'reading',
          id: 'r1',
          difficulty: 2,
          instruction: 'Stretch: What color is the sky often?',
          prompt: 'Tap the color',
          choices: ['Blue', 'Purple', 'Black'],
          answer: 'Blue',
          hint: 'Look up on a sunny day.',
        },
        {
          kind: 'drawing',
          id: 'd2',
          difficulty: 3,
          instruction: 'Strong: Add a friend in the meadow',
          prompt: 'Draw your meadow again, and add a bird or a flower.',
          successMessage: 'Strong artist work — more detail!',
        },
      ],
    },
    {
      id: 'a34-fire-safety',
      ageBand: 'ages-3-4',
      subject: 'safety',
      title: 'Stop, Drop, and Hugs',
      minutes: 8,
      pathOrder: 4,
      requiresLessonId: 'a34-colors-sky',
      summary: 'Calm fire-safety habits, then stronger safe choices.',
      groundingText: `
Lesson: soft fire safety. Alarms mean find a grown-up and go outside. Never hide. Never go back for toys.
`,
      pa: {
        level: 'prek',
        statuteSubjects: ['Safety education (including fire safety)'],
        standardsTags: ['ELDS Health & Wellness'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          text: 'The beep-beep alarm means: find a grown-up and go outside. We stay calm and help each other.',
          tutorCue: 'Practice walking calmly to a pretend door.',
        },
      ],
      exercises: [
        {
          kind: 'reading',
          id: 'r1',
          difficulty: 1,
          instruction: 'Warm-up: What do we do when the alarm beeps?',
          prompt: 'Choose the safe plan',
          choices: ['Find a grown-up and go outside', 'Hide under the bed', 'Go back for toys'],
          answer: 'Find a grown-up and go outside',
          hint: 'Grown-ups help. Outside is the safe place.',
        },
        {
          kind: 'reading',
          id: 'r2',
          difficulty: 2,
          instruction: 'Stretch: Should we go back inside for a toy?',
          prompt: 'Pick the safe answer',
          choices: ['No — stay outside', 'Yes — run back fast'],
          answer: 'No — stay outside',
          hint: 'Toys can wait. People stay outside.',
        },
        {
          kind: 'drawing',
          id: 'd1',
          difficulty: 3,
          instruction: 'Strong: Draw your outdoor meeting place',
          prompt: 'Draw a tree, mailbox, or step where your family meets outside.',
          successMessage: 'A clear meeting place helps everyone stay calm.',
        },
      ],
    },
  ],
};
