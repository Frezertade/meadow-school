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
      support: 'Let’s make it tiny: just find BIG A together.',
      stretch: 'Next time: find little a hiding among BIG letters!',
      spotlight: 'Aa 🍎',
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
          skillId: 'letter-names',
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
          skillId: 'letter-names',
          difficulty: 1,
          instruction: 'Warm-up: Draw an apple for A',
          prompt: 'Draw a round red apple. You can add a little leaf on top.',
          successMessage: 'What a wonderful apple for letter A!',
        },
        {
          kind: 'reading',
          id: 'r2',
          skillId: 'letter-names',
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
          skillId: 'letter-names',
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
      support: 'Just touch ONE berry with me: one!',
      stretch: 'Next time: count all the way to five!',
      spotlight: '🫐🫐🫐',
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
          skillId: 'count-3',
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
          skillId: 'count-3',
          difficulty: 1,
          instruction: 'Warm-up: Draw three circles',
          prompt: 'Draw three round circles.',
          successMessage: 'Three beautiful shapes!',
        },
        {
          kind: 'math',
          id: 'm2',
          skillId: 'count-3',
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
          skillId: 'count-3',
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
      support: 'Just point at the sky with me: blue!',
      stretch: 'Next time: paint a whole meadow sunset!',
      spotlight: '🟦🟩🟨',
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
          skillId: 'color-name',
          difficulty: 1,
          instruction: 'Warm-up: Draw your meadow',
          prompt: 'Draw a blue sky, green grass, and a yellow sun.',
          successMessage: 'Your meadow is beautiful!',
        },
        {
          kind: 'reading',
          id: 'r1',
          skillId: 'color-name',
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
          skillId: 'color-name',
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
      support: 'Just practice walking calmly to me.',
      stretch: 'Next time: name our outdoor meeting place from memory!',
      spotlight: '🧯🚪',
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
          skillId: 'stop-drop',
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
          skillId: 'stop-drop',
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
          skillId: 'stop-drop',
          difficulty: 3,
          instruction: 'Strong: Draw your outdoor meeting place',
          prompt: 'Draw a tree, mailbox, or step where your family meets outside.',
          successMessage: 'A clear meeting place helps everyone stay calm.',
        },
      ],
    },
    {
      id: 'a34-rhymes-animals',
      ageBand: 'ages-3-4',
      subject: 'english',
      title: 'Animals That Rhyme',
      minutes: 8,
      pathOrder: 5,
      requiresLessonId: 'a34-fire-safety',
      summary: 'Hear rhyming pairs, finish a nursery line, draw a rhyme.',
      support: 'Just echo me: cat… hat!',
      stretch: 'Next time: invent your own rhyme pair!',
      spotlight: '🐱🎩',
      groundingText: `
Lesson: Animals That Rhyme (ages 3–4). Warm-up hear rhymes → stretch finish a rhyme → strong draw a pair.
Goal: Hear that cat/hat share ending sounds; finish a familiar rhyming line; later make own rhymes.
Key facts:
- Cat and hat rhyme — same sound at the end.
- Dog and frog rhyme.
- Rhymes hide in songs and books; clap when you hear one.
- Books open with the front cover; pages turn one at a time.
Do NOT teach: spelling or letter names beyond echo play.
`,
      pa: {
        level: 'prek',
        statuteSubjects: ['English (spelling, reading, writing)'],
        standardsTags: ['ELDS Language & Literacy', 'Phonological awareness'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: 'Same at the end',
          text: 'Cat… hat! They sound the same at the end. Dog… frog! Bouncy rhymes!',
          tutorCue: 'Say each pair slowly and stretch the ending; invite the child to echo.',
        },
        {
          id: 'b2',
          kind: 'story',
          title: 'Rhymes in books',
          text: 'Rhymes hide in songs and books. When you hear one, clap your hands!',
          tutorCue: 'Clap once on each rhyme; the child claps with you.',
        },
      ],
      exercises: [
        {
          kind: 'listen-say',
          id: 's1',
          skillId: 'rhyme-play',
          difficulty: 1,
          instruction: 'Warm-up: Say the rhyme',
          phrase: 'cat hat',
          accept: ['cat', 'hat'],
          hint: 'Cat… hat! Say both words.',
        },
        {
          kind: 'reading',
          id: 'r1',
          skillId: 'rhyme-play',
          difficulty: 1,
          instruction: 'Warm-up: Which rhymes with dog?',
          prompt: 'Dog and…?',
          choices: ['Frog', 'Fish', 'Sun'],
          answer: 'Frog',
          hint: 'Dog… frog! A bouncy green friend.',
        },
        {
          kind: 'reading',
          id: 'r2',
          skillId: 'book-habits',
          difficulty: 2,
          instruction: 'Stretch: Finish the song line',
          prompt: 'Twinkle twinkle little…',
          choices: ['Star', 'Car', 'Dog'],
          answer: 'Star',
          hint: 'It shines in the night sky.',
        },
        {
          kind: 'drawing',
          id: 'd1',
          skillId: 'rhyme-play',
          difficulty: 3,
          instruction: 'Strong: Draw a rhyming pair',
          prompt: 'Draw a cat wearing a hat. Rhymes you can see!',
          successMessage: 'A rhyming picture — cat in a hat!',
        },
      ],
    },
    {
      id: 'a34-count-5',
      ageBand: 'ages-3-4',
      subject: 'math',
      title: 'Five Little Ducks',
      minutes: 8,
      pathOrder: 6,
      requiresLessonId: 'a34-rhymes-animals',
      summary: 'Count to 5 by touching, order 1–5, find one more than 4.',
      support: 'Just count to three with me first.',
      stretch: 'Next time: count ten garden seeds!',
      spotlight: '🦆🦆🦆🦆🦆',
      groundingText: `
Lesson: Five Little Ducks (ages 3–4). Warm-up count to 5 → stretch order 1–5 → strong one more than 4.
Goal: Count 1–5 touching each object once; know 5 is more than 3; say what comes after 4.
Key facts:
- Numbers in order: one, two, three, four, five.
- One whole hand makes five fingers.
- Touch each thing once while counting.
Do NOT teach: adding two groups (that comes at age 5).
`,
      pa: {
        level: 'prek',
        statuteSubjects: ['Arithmetic'],
        standardsTags: ['ELDS Mathematical Thinking', 'Counting to 5'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: 'Touch and count',
          text: 'One duck, two ducks, three, four… five! Touch each one as we count.',
          tutorCue: 'Touch-and-count together slowly; celebrate five wiggly fingers at the end.',
        },
      ],
      exercises: [
        {
          kind: 'math',
          id: 'm1',
          skillId: 'count-5',
          difficulty: 1,
          instruction: 'Warm-up: How many ducks?',
          visual: '🦆🦆🦆🦆🦆',
          prompt: 'Count the ducks',
          choices: ['4', '5', '6'],
          answer: '5',
          hint: 'Touch each duck once: 1, 2, 3, 4, 5.',
        },
        {
          kind: 'sequence',
          id: 'q1',
          skillId: 'count-5',
          difficulty: 2,
          instruction: 'Stretch: Tap 1 to 5 in order',
          prompt: 'Smallest first, up to five',
          items: ['3', '1', '4', '5', '2'],
          answer: ['1', '2', '3', '4', '5'],
          hint: 'Start at 1 — the smallest number.',
        },
        {
          kind: 'math',
          id: 'm2',
          skillId: 'count-5',
          difficulty: 3,
          instruction: 'Strong: One more than 4?',
          prompt: '4 and one more makes…',
          choices: ['3', '5', '6'],
          answer: '5',
          hint: 'Count up: 1, 2, 3, 4… what comes next?',
        },
      ],
    },
    {
      id: 'a34-shapes',
      ageBand: 'ages-3-4',
      subject: 'math',
      title: 'Round and Pointy Shapes',
      minutes: 8,
      pathOrder: 7,
      requiresLessonId: 'a34-count-5',
      summary: 'Name circle, square, triangle; sort by color.',
      support: 'Just find something round with me.',
      stretch: 'Next time: sort shapes AND colors together!',
      spotlight: '⚪🟥🔺',
      groundingText: `
Lesson: Round and Pointy Shapes (ages 3–4). Warm-up circle → stretch triangle vs square → strong sort by color.
Goal: Name circle, square, triangle; find them in the room; put same colors together.
Key facts:
- Circle is round with no corners, like the sun.
- Square has four same-size sides and four corners.
- Triangle has three sides and three pointy corners.
- Sorting means putting same-with-same.
Do NOT teach: rectangle, oval, or side counting beyond 4.
`,
      pa: {
        level: 'prek',
        statuteSubjects: ['Arithmetic'],
        standardsTags: ['ELDS Mathematical Thinking', 'Shapes', 'Sorting'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: 'Three shape friends',
          text: 'Circle goes round and round. Square has four corners. Triangle is pointy with three sides.',
          tutorCue: 'Draw each shape big in the air; the child copies with a finger.',
        },
      ],
      exercises: [
        {
          kind: 'reading',
          id: 'r1',
          skillId: 'shapes-basic',
          difficulty: 1,
          instruction: 'Warm-up: Which is a circle?',
          prompt: 'Tap the round one with no corners',
          choices: ['Circle', 'Square', 'Triangle'],
          answer: 'Circle',
          hint: 'Round like the sun.',
        },
        {
          kind: 'drawing',
          id: 'd1',
          skillId: 'shapes-basic',
          difficulty: 1,
          instruction: 'Warm-up: Draw a circle sun',
          prompt: 'Draw a big round sun with rays.',
          successMessage: 'Perfectly round sunshine!',
        },
        {
          kind: 'reading',
          id: 'r2',
          skillId: 'shapes-basic',
          difficulty: 2,
          instruction: 'Stretch: Which has three sides?',
          prompt: 'Count the pointy corners',
          choices: ['Triangle', 'Square', 'Circle'],
          answer: 'Triangle',
          hint: 'Count the pointy corners: 1, 2, 3.',
        },
        {
          kind: 'reading',
          id: 'r3',
          skillId: 'sort-one',
          difficulty: 3,
          instruction: 'Strong: Sort by color',
          prompt: 'The red apple goes with the…',
          choices: ['Red ball', 'Green leaf', 'Blue car'],
          answer: 'Red ball',
          hint: 'Same color goes together.',
        },
      ],
    },
    {
      id: 'a34-nature-walk',
      ageBand: 'ages-3-4',
      subject: 'science',
      title: 'Living or Not? Walk',
      minutes: 10,
      pathOrder: 8,
      requiresLessonId: 'a34-shapes',
      summary: 'Tell living from non-living; meet neighbor helpers.',
      support: 'Just point at one tree with me.',
      stretch: 'Next time: find three living things on a walk!',
      spotlight: '🌳🪨',
      groundingText: `
Lesson: Living or Not Walk (ages 3–4). Warm-up alive vs not → stretch plant needs → strong helpers.
Goal: Say trees and flowers are alive and growing; rocks and chairs are not; name one neighbor helper.
Key facts:
- Living things grow and need water and sun.
- Trees, flowers, birds, and people are alive.
- Rocks, chairs, and toys are not alive.
- Doctors, mail carriers, and farmers are neighbor helpers.
Do NOT teach: death, scary weather, or anything that could frighten.
`,
      pa: {
        level: 'prek',
        statuteSubjects: ['Science'],
        standardsTags: ['ELDS Scientific Thinking', 'Living things'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: 'Growing or not?',
          text: 'Trees and flowers are alive — they grow! Rocks and chairs just sit still.',
          tutorCue: 'Compare a plant and a stone slowly; ask the child which one grows.',
        },
        {
          id: 'b2',
          kind: 'story',
          title: 'Neighbor helpers',
          text: 'Mail carriers, doctors, and farmers are neighbor helpers. They take care of us!',
          tutorCue: 'Name one helper the child knows; wave hello together.',
        },
      ],
      exercises: [
        {
          kind: 'reading',
          id: 'r1',
          skillId: 'nature-notice',
          difficulty: 1,
          instruction: 'Warm-up: Which one is alive?',
          prompt: 'Tap the living thing',
          choices: ['Tree', 'Rock', 'Chair'],
          answer: 'Tree',
          hint: 'It grows leaves in spring.',
        },
        {
          kind: 'reading',
          id: 'r2',
          skillId: 'nature-notice',
          difficulty: 2,
          instruction: 'Stretch: What do plants drink?',
          prompt: 'Plants need a drink of…',
          choices: ['Water', 'Paint', 'Juice boxes'],
          answer: 'Water',
          hint: 'Rain gives plants a drink.',
        },
        {
          kind: 'reading',
          id: 'r3',
          skillId: 'community-me',
          difficulty: 2,
          instruction: 'Stretch: Who helps sick people?',
          prompt: 'Pick the neighbor helper',
          choices: ['Doctor', 'Baker', 'Driver'],
          answer: 'Doctor',
          hint: 'White coat, kind smile.',
        },
        {
          kind: 'drawing',
          id: 'd1',
          skillId: 'nature-notice',
          difficulty: 3,
          instruction: 'Strong: Draw something alive outside',
          prompt: 'Draw a tree, flower, or bird you could meet on a walk.',
          successMessage: 'Scientist eyes — you found life!',
        },
      ],
    },
    {
      id: 'a34-songs-clap',
      ageBand: 'ages-3-4',
      subject: 'music',
      title: 'Clap the Beat',
      minutes: 8,
      pathOrder: 9,
      requiresLessonId: 'a34-nature-walk',
      summary: 'Feel a steady beat, hear loud vs soft, draw an instrument.',
      support: 'Just clap with me: clap… clap…',
      stretch: 'Next time: lead the pattern yourself!',
      spotlight: '👏👏🦶',
      groundingText: `
Lesson: Clap the Beat (ages 3–4). Warm-up sing back → stretch loud vs soft → strong copy a pattern.
Goal: Clap a steady beat; show loud vs soft; copy clap-clap-stomp.
Key facts:
- Music has a heartbeat called the beat.
- Loud is big sound; soft is tiny sound.
- Clap-clap-stomp is a pattern we can copy.
Do NOT teach: written notes or instrument names beyond what we play.
`,
      pa: {
        level: 'prek',
        statuteSubjects: ['Music'],
        standardsTags: ['ELDS Creative Thinking & Expression', 'Rhythm'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: 'Music heartbeat',
          text: 'Clap-clap-stomp! Music has a heartbeat called the beat. Let’s feel it together.',
          tutorCue: 'Clap a slow steady beat; the child joins; speed up once for giggles.',
        },
      ],
      exercises: [
        {
          kind: 'listen-say',
          id: 's1',
          skillId: 'beat-clap',
          difficulty: 1,
          instruction: 'Warm-up: Sing it back',
          phrase: 'la la la',
          accept: ['la'],
          hint: 'Just sing la-la-la with me!',
        },
        {
          kind: 'reading',
          id: 'r1',
          skillId: 'beat-clap',
          difficulty: 1,
          instruction: 'Warm-up: Which sound is LOUD?',
          prompt: 'Tap the loud one',
          choices: ['Lion roar', 'Baby whisper', 'Falling leaf'],
          answer: 'Lion roar',
          hint: 'A roar is big and loud!',
        },
        {
          kind: 'sequence',
          id: 'q1',
          skillId: 'beat-clap',
          difficulty: 2,
          instruction: 'Stretch: Copy clap-clap-stomp',
          prompt: 'Tap the pattern in order',
          items: ['Last: stomp', 'First: clap', 'Next: clap'],
          answer: ['First: clap', 'Next: clap', 'Last: stomp'],
          hint: 'Two claps come before the stomp.',
        },
        {
          kind: 'drawing',
          id: 'd1',
          skillId: 'beat-clap',
          difficulty: 3,
          instruction: 'Strong: Draw your instrument',
          prompt: 'Draw a drum, shaker, or anything that makes music.',
          successMessage: 'Your band is ready to play!',
        },
      ],
    },
    {
      id: 'a34-healthy-habits',
      ageBand: 'ages-3-4',
      subject: 'health',
      title: 'Wash, Brush, Sleep',
      minutes: 8,
      pathOrder: 10,
      requiresLessonId: 'a34-songs-clap',
      summary: 'Practice handwashing order and name daily healthy steps.',
      support: 'Just rub-rub your hands with me.',
      stretch: 'Next time: teach a toy the steps in order!',
      spotlight: '🧼💧',
      groundingText: `
Lesson: Wash, Brush, Sleep (ages 3–4). Warm-up when to wash → stretch wash in order → strong draw the habit.
Goal: Say hands wash before eating; order water-soap-rinse; name brushing teeth and sleep as healthy steps.
Key facts:
- Water, soap, rub-rub, rinse — in that order.
- Brush teeth morning and night.
- Sleep helps brains and bodies grow.
- Germs are tiny; washing sends them away.
Do NOT teach: illness, fear, or medicine of any kind.
`,
      pa: {
        level: 'prek',
        statuteSubjects: ['Health and physiology'],
        standardsTags: ['ELDS Health & Wellness', 'Daily routines'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: 'Rub-rub-rinse',
          text: 'Water, soap, rub-rub, rinse! Clean hands keep the tiny germs away.',
          tutorCue: 'Mime each step big and silly; the child copies the rub-rub.',
        },
      ],
      exercises: [
        {
          kind: 'reading',
          id: 'r1',
          skillId: 'healthy-habits',
          difficulty: 1,
          instruction: 'Warm-up: When do we wash hands?',
          prompt: 'Pick the healthy time',
          choices: ['Before eating', 'After the moon rises', 'Never'],
          answer: 'Before eating',
          hint: 'Clean hands before yummy food.',
        },
        {
          kind: 'sequence',
          id: 'q1',
          skillId: 'healthy-habits',
          difficulty: 2,
          instruction: 'Stretch: Wash in order',
          prompt: 'Tap the steps first to last',
          items: ['Last: rinse', 'First: water', 'Next: soap and rub'],
          answer: ['First: water', 'Next: soap and rub', 'Last: rinse'],
          hint: 'Water comes first.',
        },
        {
          kind: 'drawing',
          id: 'd1',
          skillId: 'healthy-habits',
          difficulty: 3,
          instruction: 'Strong: Draw your toothbrush',
          prompt: 'Draw a toothbrush and sparkling clean teeth.',
          successMessage: 'Shiny teeth love brushing!',
        },
      ],
    },
  ],
};
