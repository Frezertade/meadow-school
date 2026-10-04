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
      pathOrder: 1,
      summary: 'Read and sort -at / -an words; write a short sentence.',
      support: 'Just read one word: cat.',
      stretch: 'Next time: write your own -an sentence!',
      groundingText: `
Lesson: Short A Word Family (ages 6–7 / grade 1 trail). Incremental path: warm-up → stretch → strong.
Goal: Read CVC words with short a; notice -at and -an families; write one simple sentence; later sort -an words and complete a sentence.
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
          skillId: 'short-a',
          difficulty: 1,
          instruction: 'Warm-up: Which word belongs in the -at family?',
          prompt: 'Pick the -at word',
          choices: ['hat', 'man', 'cup'],
          answer: 'hat',
          hint: 'It rhymes with cat.',
        },
        {
          kind: 'reading',
          id: 'r2',
          skillId: 'short-a',
          difficulty: 1,
          instruction: 'Warm-up: Read and choose',
          prompt: 'The ___ sat on the mat.',
          choices: ['cat', 'bus', 'moon'],
          answer: 'cat',
          hint: 'It is the -at animal from our lesson.',
        },
        {
          kind: 'drawing',
          id: 'd1',
          skillId: 'short-a',
          difficulty: 1,
          instruction: 'Warm-up: Illustrate the sentence',
          prompt: 'Draw: The cat sat. Add a mat under the cat.',
          successMessage: 'You turned words into a picture — that is real reading power.',
        },
        {
          kind: 'reading',
          id: 'r3',
          skillId: 'short-a',
          difficulty: 2,
          instruction: 'Stretch: Which word belongs in the -an family?',
          prompt: 'Pick the -an word',
          choices: ['pan', 'hat', 'cup'],
          answer: 'pan',
          hint: 'You cook eggs in it. Same ending as man and can.',
        },
        {
          kind: 'reading',
          id: 'r4',
          skillId: 'short-a',
          difficulty: 3,
          instruction: 'Strong: Complete the sentence',
          prompt: 'The ___ can run.',
          choices: ['man', 'bus', 'moon'],
          answer: 'man',
          hint: 'It is a -an word. A person who can move fast.',
        },
      ],
    },
    {
      id: 'a67-math-add-10',
      ageBand: 'ages-6-7',
      subject: 'math',
      title: 'Adding Within 10',
      minutes: 15,
      pathOrder: 2,
      requiresLessonId: 'a67-reading-short-a',
      summary: 'Add two groups within 10 using pictures and number sentences.',
      support: 'Just count all the dots with me.',
      stretch: 'Next time: find missing numbers like 3 + __ = 7!',
      groundingText: `
Lesson: Adding Within 10 (ages 6–7). Incremental path: warm-up → stretch → strong.
Goal: Combine two groups; write number sentences like 3+4=7; stay within 10; later add to 10 and find a missing part.
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
          skillId: 'add-10',
          difficulty: 1,
          instruction: 'Warm-up: Solve',
          visual: '🔵🔵 + 🔵🔵🔵',
          prompt: '2 + 3 =',
          choices: ['4', '5', '6'],
          answer: '5',
          hint: 'Start at 2, then count 3 more.',
        },
        {
          kind: 'math',
          id: 'm2',
          skillId: 'add-10',
          difficulty: 1,
          instruction: 'Warm-up: Solve',
          prompt: '4 + 5 =',
          choices: ['8', '9', '10'],
          answer: '9',
          hint: 'Count on from 5: 6,7,8,9.',
        },
        {
          kind: 'math',
          id: 'm3',
          skillId: 'add-10',
          difficulty: 2,
          instruction: 'Stretch: Add to ten',
          visual: '🔵🔵🔵🔵🔵 + 🔵🔵🔵🔵🔵',
          prompt: '5 + 5 =',
          choices: ['9', '10', '11'],
          answer: '10',
          hint: 'Five fingers on each hand — how many altogether?',
        },
        {
          kind: 'math',
          id: 'm4',
          skillId: 'add-10',
          difficulty: 3,
          instruction: 'Strong: Find the missing number',
          prompt: '3 + ___ = 7',
          choices: ['3', '4', '5'],
          answer: '4',
          hint: 'Start at 3. Count up to 7. How many steps?',
        },
      ],
    },
    {
      id: 'a67-science-plants',
      ageBand: 'ages-6-7',
      subject: 'science',
      title: 'What Plants Need',
      minutes: 12,
      pathOrder: 3,
      requiresLessonId: 'a67-math-add-10',
      summary: 'Observe that plants need water, light, and soil.',
      support: 'Just name one need: water.',
      stretch: 'Next time: label every plant part!',
      groundingText: `
Lesson: What Plants Need (ages 6–7). Incremental path: warm-up → stretch → strong.
Goal: Name three needs of plants: water, light, soil (or good place to grow); observe a leaf or plant; later spot what plants do NOT need and label plant parts.
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
          tutorCue: 'Count the three needs on three fingers; ask the child to find a real plant nearby and point at its leaves.',
        },
      ],
      exercises: [
        {
          kind: 'reading',
          id: 'r1',
          skillId: 'plant-needs',
          difficulty: 1,
          instruction: 'Warm-up: What do plants need?',
          prompt: 'Pick a true need',
          choices: ['Water and light', 'Video games', 'Candy'],
          answer: 'Water and light',
          hint: 'Think about sunshine and rain.',
        },
        {
          kind: 'drawing',
          id: 'd1',
          skillId: 'plant-needs',
          difficulty: 1,
          instruction: 'Warm-up: Draw a healthy plant',
          prompt: 'Draw a plant with roots, a stem, leaves, and a sun + water drops.',
          successMessage: 'You showed what a plant needs. Scientist eyes!',
        },
        {
          kind: 'reading',
          id: 'r2',
          skillId: 'plant-needs',
          difficulty: 2,
          instruction: 'Stretch: Which is NOT a plant need?',
          prompt: 'Plants do NOT need…',
          choices: ['Television', 'Sunlight', 'Water'],
          answer: 'Television',
          hint: 'Plants grow outside in nature, not on a screen.',
        },
        {
          kind: 'drawing',
          id: 'd2',
          skillId: 'plant-needs',
          difficulty: 3,
          instruction: 'Strong: Label your plant drawing',
          prompt: 'Draw a plant and label three parts: roots, stem, leaves. Add arrows to sun and water.',
          successMessage: 'Labels show you understand how a plant works!',
        },
      ],
    },
    {
      id: 'a67-pa-symbols',
      ageBand: 'ages-6-7',
      subject: 'social',
      title: 'Pennsylvania Symbols',
      minutes: 12,
      pathOrder: 4,
      requiresLessonId: 'a67-science-plants',
      summary: 'Meet a few PA symbols and practice map vocabulary.',
      support: 'Just echo: mountain lau-rel.',
      stretch: 'Next time: name bird AND flower from memory!',
      groundingText: `
Lesson: Pennsylvania Symbols (ages 6–7). Incremental path: warm-up → stretch → strong.
Goal: Know Pennsylvania is our state; recognize the ruffed grouse (state bird) and mountain laurel (state flower) as friendly facts; use words town, state, country; later match both symbols and show community care.
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
          tutorCue: 'Storyteller tone; say "ruffed grouse" and "mountain laurel" slowly and invite the child to echo each name.',
        },
      ],
      exercises: [
        {
          kind: 'reading',
          id: 'r1',
          skillId: 'pa-symbols',
          difficulty: 1,
          instruction: 'Warm-up: Pennsylvania’s state flower is…',
          prompt: 'Choose the flower',
          choices: ['Mountain laurel', 'Cactus bloom', 'Sunflower only'],
          answer: 'Mountain laurel',
          hint: 'It has two words and grows on mountainsides.',
        },
        {
          kind: 'reading',
          id: 'r2',
          skillId: 'pa-symbols',
          difficulty: 2,
          instruction: 'Stretch: Pennsylvania’s state bird is…',
          prompt: 'Choose the bird',
          choices: ['Ruffed grouse', 'Penguin', 'Parrot'],
          answer: 'Ruffed grouse',
          hint: 'It is a forest bird found in Pennsylvania woods.',
        },
        {
          kind: 'drawing',
          id: 'd1',
          skillId: 'pa-symbols',
          difficulty: 3,
          instruction: 'Strong: Draw both PA symbols',
          prompt: 'Draw mountain laurel flowers and a ruffed grouse bird. Label each symbol.',
          successMessage: 'You know two official symbols of our state!',
        },
      ],
    },
    {
      id: 'a67-fire-plan',
      ageBand: 'ages-6-7',
      subject: 'safety',
      title: 'Home Fire Drill Plan',
      minutes: 10,
      pathOrder: 5,
      requiresLessonId: 'a67-pa-symbols',
      summary: 'Practice a calm family exit plan and meeting place.',
      support: 'Just walk calmly to me.',
      stretch: 'Next time: map two ways out of every room!',
      groundingText: `
Lesson: Home Fire Drill Plan (ages 6–7). Incremental path: warm-up → stretch → strong.
Goal: Know two ways out when possible; know an outdoor meeting place; never go back inside; grown-ups lead; later recall smoke-alarm steps and map two exits.
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
          tutorCue: 'Calm, steady voice — practice language, never scary; rehearse "outside to our spot" like a game drill.',
        },
      ],
      exercises: [
        {
          kind: 'reading',
          id: 'r1',
          skillId: 'fire-plan',
          difficulty: 1,
          instruction: 'Warm-up: After we go outside, we…',
          prompt: 'Choose the safe next step',
          choices: ['Meet at our outdoor meeting place', 'Run back in for toys', 'Hide quietly inside'],
          answer: 'Meet at our outdoor meeting place',
          hint: 'Families meet outside so everyone can be counted.',
        },
        {
          kind: 'drawing',
          id: 'd1',
          skillId: 'fire-plan',
          difficulty: 1,
          instruction: 'Warm-up: Draw your meeting place',
          prompt: 'Draw your house and an X where your family meets outside.',
          successMessage: 'A clear plan helps everyone stay calm and safe.',
        },
        {
          kind: 'reading',
          id: 'r2',
          skillId: 'fire-plan',
          difficulty: 2,
          instruction: 'Stretch: What do smoke alarms do?',
          prompt: 'Smoke alarms help us by…',
          choices: ['Warning us early so we can exit', 'Playing music at night', 'Keeping toys safe'],
          answer: 'Warning us early so we can exit',
          hint: 'They beep loudly when they sense smoke.',
        },
        {
          kind: 'drawing',
          id: 'd2',
          skillId: 'fire-plan',
          difficulty: 3,
          instruction: 'Strong: Map two ways out',
          prompt: 'Draw your home with TWO exit paths (front door + another way) and mark the outdoor meeting spot.',
          successMessage: 'Two exits and a meeting place — you are drill-ready!',
        },
      ],
    },
    {
      id: 'a67-blends',
      ageBand: 'ages-6-7',
      subject: 'english',
      title: 'Slide the Blends',
      minutes: 12,
      pathOrder: 6,
      requiresLessonId: 'a67-fire-plan',
      summary: 'Read st-, bl-, cr- blends; say a blend word aloud.',
      support: 'Just hiss one s: sss.',
      stretch: 'Next time: read str- words like string!',
      groundingText: `
Lesson: Slide the Blends (ages 6–7). Warm-up say stop → stretch bl- words → strong cr- words.
Goal: Read beginning blends st, bl, cr; slide the two sounds together without a vowel between.
Key facts:
- st says /st/ as in stop, star, step.
- bl says /bl/ as in block, blue, blanket.
- cr says /cr/ as in crab, crown, cracker.
- Slide, don't split: "ssstop", not "suh-tuh-op".
Do NOT teach: ending blends (-st, -nd) or three-letter blends (str-) yet.
`,
      pa: {
        level: 'elementary-K6',
        statuteSubjects: ['English (spelling, reading, writing)'],
        standardsTags: ['Phonics', 'Consonant blends'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: 'Two sounds, one slide',
          text: 's and t hold hands: ssstop! b and l slide: bluuue. Try sliding with me!',
          tutorCue: 'Stretch each blend extra long; the child slides along with you.',
        },
      ],
      exercises: [
        {
          kind: 'listen-say',
          id: 's1',
          skillId: 'blends',
          difficulty: 1,
          instruction: 'Warm-up: Say the blend word',
          phrase: 'stop',
          accept: ['stop'],
          hint: 'Sssslide s and t together: stop.',
        },
        {
          kind: 'reading',
          id: 'r1',
          skillId: 'blends',
          difficulty: 2,
          instruction: 'Stretch: Which starts with bl-?',
          prompt: 'Find the bl- word',
          choices: ['Block', 'Rock', 'Socks'],
          answer: 'Block',
          hint: 'Bouncy b-l at the very front.',
        },
        {
          kind: 'reading',
          id: 'r2',
          skillId: 'blends',
          difficulty: 3,
          instruction: 'Strong: Which starts with cr-?',
          prompt: 'Find the cr- word',
          choices: ['Crab', 'Table', 'Apple'],
          answer: 'Crab',
          hint: 'Crunchy c-r at the front. It walks sideways!',
        },
      ],
    },
    {
      id: 'a67-sentences',
      ageBand: 'ages-6-7',
      subject: 'english',
      title: 'My Two Sentences',
      minutes: 12,
      pathOrder: 7,
      requiresLessonId: 'a67-blends',
      summary: 'Build a sentence word-by-word; order a tiny story.',
      support: 'Just say two words: The cat.',
      stretch: 'Next time: write three sentences alone!',
      groundingText: `
Lesson: My Two Sentences (ages 6–7). Warm-up capitals → stretch build a sentence → strong order a story.
Goal: Start sentences with capitals; arrange words into "The cat sat."; order beginning→middle→end of a 3-step story.
Key facts:
- A sentence starts with a capital letter.
- Words go in order: who, what. "The cat sat."
- Stories go beginning → middle → end.
- Periods end sentences (recognition only).
Do NOT teach: formal grammar terms beyond capital and period.
`,
      pa: {
        level: 'elementary-K6',
        statuteSubjects: ['English (spelling, reading, writing)'],
        standardsTags: ['Sentence building', 'Sequencing', 'Retelling'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: 'Words in order',
          text: 'The… cat… sat. Three words in order make a sentence! Capitals start, periods stop.',
          tutorCue: 'Hold up one finger per word; child counts the three words with you.',
        },
      ],
      exercises: [
        {
          kind: 'reading',
          id: 'r1',
          skillId: 'write-sentences',
          difficulty: 1,
          instruction: 'Warm-up: Sentences start with…',
          prompt: 'Pick the starter',
          choices: ['A capital letter', 'A period', 'A nap'],
          answer: 'A capital letter',
          hint: 'Big and tall at the very beginning.',
        },
        {
          kind: 'sequence',
          id: 'q1',
          skillId: 'write-sentences',
          difficulty: 2,
          instruction: 'Stretch: Build the sentence',
          prompt: 'Tap the words in order',
          items: ['cat', 'sat.', 'The'],
          answer: ['The', 'cat', 'sat.'],
          hint: 'Who starts? The cat…',
        },
        {
          kind: 'sequence',
          id: 'q2',
          skillId: 'retell',
          difficulty: 3,
          instruction: 'Strong: Order the story',
          prompt: 'Beginning → middle → end',
          items: ['Last: a flower grows', 'First: Sam plants a seed', 'Next: rain falls'],
          answer: ['First: Sam plants a seed', 'Next: rain falls', 'Last: a flower grows'],
          hint: 'Seeds go in the ground first.',
        },
      ],
    },
    {
      id: 'a67-sub-10',
      ageBand: 'ages-6-7',
      subject: 'math',
      title: 'Take Away to Ten',
      minutes: 12,
      pathOrder: 8,
      requiresLessonId: 'a67-sentences',
      summary: 'Subtract within 10; solve a take-away word problem.',
      support: 'Just fold down one finger with me.',
      stretch: 'Next time: solve two-step stories!',
      groundingText: `
Lesson: Take Away to Ten (ages 6–7). Warm-up take 2 away → stretch count back → strong word problem.
Goal: Subtract within 10 as take-away; count back from the start; solve one-step take-away stories.
Key facts:
- Minus − means take away / how many are left.
- Strategy: count back from the big number.
- Word problems tell a tiny story; find the numbers, then subtract.
- Answers stay between 0 and 10.
Do NOT teach: borrowing/regrouping or subtraction above 10.
`,
      pa: {
        level: 'elementary-K6',
        statuteSubjects: ['Arithmetic'],
        standardsTags: ['Subtraction within 10', 'Word problems'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: 'Take away',
          text: 'Five cookies. I eat two. Count what is left: 5… 4… 3! Three cookies: 5 − 2 = 3.',
          tutorCue: 'Hold up five fingers, fold two down slowly; count the standing fingers together.',
        },
      ],
      exercises: [
        {
          kind: 'math',
          id: 'm1',
          skillId: 'sub-10',
          difficulty: 1,
          instruction: 'Warm-up: Take 2 away',
          visual: '🍪🍪🍪🍪🍪',
          prompt: '5 − 2 =',
          choices: ['2', '3', '4'],
          answer: '3',
          hint: 'Count the cookies left after 2 are gone.',
        },
        {
          kind: 'math',
          id: 'm2',
          skillId: 'sub-10',
          difficulty: 2,
          instruction: 'Stretch: Count back',
          prompt: '9 − 4 =',
          choices: ['4', '5', '6'],
          answer: '5',
          hint: 'Count back from 9: 8, 7, 6, 5.',
        },
        {
          kind: 'math',
          id: 'm3',
          skillId: 'word-problems',
          difficulty: 3,
          instruction: 'Strong: Bird story',
          visual: '🐦🐦🐦🐦🐦🐦🐦',
          prompt: '7 birds sat. 3 flew away. How many are left?',
          choices: ['3', '4', '5'],
          answer: '4',
          hint: 'Draw 7 birds, cross out 3, count the rest.',
        },
      ],
    },
    {
      id: 'a67-tens-ones',
      ageBand: 'ages-6-7',
      subject: 'math',
      title: 'Tens and Ones Towers',
      minutes: 12,
      pathOrder: 9,
      requiresLessonId: 'a67-sub-10',
      summary: 'Build tens and ones to 100; count by tens.',
      support: 'Just count towers: ten, twenty.',
      stretch: 'Next time: build 100 with ten towers!',
      groundingText: `
Lesson: Tens and Ones Towers (ages 6–7). Warm-up tens in 30 → stretch break 24 apart → strong count by tens.
Goal: Say 30 is three tens; split 24 into 2 tens and 4 ones; count 10, 20, 30… to 100.
Key facts:
- Ten ones make one ten.
- 24 = 2 tens and 4 ones; the 2 tells tens, the 4 tells ones.
- Counting by tens: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100.
- Towers of ten cubes show tens; single cubes show ones.
Do NOT teach: hundreds place or adding two-digit numbers.
`,
      pa: {
        level: 'elementary-K6',
        statuteSubjects: ['Arithmetic'],
        standardsTags: ['Place value', 'Counting by tens'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: 'Towers of ten',
          text: 'Ten cubes snap into a tower — one ten! Two towers and four singles make 24.',
          tutorCue: 'Stack pretend towers; child holds up towers for tens, fingers for ones.',
        },
      ],
      exercises: [
        {
          kind: 'math',
          id: 'm1',
          skillId: 'tens-ones',
          difficulty: 1,
          instruction: 'Warm-up: Tens in 30?',
          visual: '🟧🟧🟧 (three ten-towers)',
          prompt: 'How many tens make 30?',
          choices: ['3', '13', '30'],
          answer: '3',
          hint: 'Ten, twenty, thirty — three towers.',
        },
        {
          kind: 'math',
          id: 'm2',
          skillId: 'tens-ones',
          difficulty: 2,
          instruction: 'Stretch: Break 24 apart',
          prompt: '24 means…',
          choices: ['2 tens and 4 ones', '4 tens and 2 ones', '24 ones only'],
          answer: '2 tens and 4 ones',
          hint: 'Tens first, then ones.',
        },
        {
          kind: 'math',
          id: 'm3',
          skillId: 'tens-ones',
          difficulty: 3,
          instruction: 'Strong: Count by tens',
          prompt: '10, 20, ___?',
          choices: ['30', '25', '12'],
          answer: '30',
          hint: 'Twenty, then…?',
        },
      ],
    },
    {
      id: 'a67-weather',
      ageBand: 'ages-6-7',
      subject: 'science',
      title: 'Where Rain Comes From',
      minutes: 12,
      pathOrder: 10,
      requiresLessonId: 'a67-tens-ones',
      summary: 'Trace sun→cloud→rain; draw and label today’s weather.',
      support: 'Just point at the sky with me.',
      stretch: 'Next time: track weather for a whole week!',
      groundingText: `
Lesson: Where Rain Comes From (ages 6–7). Warm-up rain from clouds → stretch order the water trip → strong draw today.
Goal: Say rain falls from clouds; order sun-heats-water → clouds-gather → rain-falls; observe and label today's weather.
Key facts:
- The sun warms water; water rises into the sky (keep simple: "floats up").
- Clouds gather the water; heavy clouds let rain fall.
- Weather words: sunny, cloudy, rainy, snowy, windy.
- We observe weather safely from windows and porches.
Do NOT teach: evaporation vocabulary tests or storm chasing of any kind.
`,
      pa: {
        level: 'elementary-K6',
        statuteSubjects: ['Science'],
        standardsTags: ['Earth science', 'Water cycle', 'Observation'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: 'Water’s round trip',
          text: 'Sun warms the water. Clouds gather it up. Then splish-splash — rain falls down!',
          tutorCue: 'Sweep hands up for rising water, gather arms for clouds, wiggle fingers down for rain.',
        },
      ],
      exercises: [
        {
          kind: 'reading',
          id: 'r1',
          skillId: 'weather',
          difficulty: 1,
          instruction: 'Warm-up: What falls from clouds?',
          prompt: 'Splish-splash from the sky',
          choices: ['Rain', 'Sand', 'Marbles'],
          answer: 'Rain',
          hint: 'Pitter-patter on the roof.',
        },
        {
          kind: 'sequence',
          id: 'q1',
          skillId: 'weather',
          difficulty: 2,
          instruction: 'Stretch: Order the water trip',
          prompt: 'Tap first → next → last',
          items: ['Last: rain falls', 'First: sun heats water', 'Next: clouds gather'],
          answer: ['First: sun heats water', 'Next: clouds gather', 'Last: rain falls'],
          hint: 'Sunshine starts the trip.',
        },
        {
          kind: 'drawing',
          id: 'd1',
          skillId: 'weather',
          difficulty: 3,
          instruction: 'Strong: Draw today’s weather',
          prompt: 'Look outside, then draw what you see. Add one weather word if you can.',
          successMessage: 'A real weather observation — meteorologist work!',
        },
      ],
    },
    {
      id: 'a67-map-home',
      ageBand: 'ages-6-7',
      subject: 'social',
      title: 'Map of My Street',
      minutes: 12,
      pathOrder: 11,
      requiresLessonId: 'a67-weather',
      summary: 'Read map symbols; draw your street; explain one safety rule.',
      support: 'Just point at the star: you!',
      stretch: 'Next time: map your whole neighborhood!',
      groundingText: `
Lesson: Map of My Street (ages 6–7). Warm-up star means you → stretch draw your street → strong why rules exist.
Goal: Read "you are here" star and simple symbols; draw a street with 2+ landmarks; explain one rule that keeps people safe.
Key facts:
- Maps are bird-view pictures of places.
- A star often marks "you are here".
- Symbols stand for real things: blue for water, green for parks, lines for streets.
- Community rules (stop at red lights, look both ways) keep everyone safer.
- Home addresses are private family information — practice with pretend addresses only.
Do NOT teach: sharing real addresses or any partisan content.
`,
      pa: {
        level: 'elementary-K6',
        statuteSubjects: ['Geography', 'Civics'],
        standardsTags: ['Map skills', 'Community rules'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: 'Bird-view pictures',
          text: 'Pretend you are a bird! From the sky, streets are lines and houses are little squares. The star is YOU.',
          tutorCue: 'Flap arms like wings; point at an imaginary star for "you are here".',
        },
      ],
      exercises: [
        {
          kind: 'reading',
          id: 'r1',
          skillId: 'map-skills',
          difficulty: 1,
          instruction: 'Warm-up: The map star means…',
          prompt: 'Find the star’s job',
          choices: ['You are here', 'The ocean', 'A dragon'],
          answer: 'You are here',
          hint: 'Stars mark the spot — you!',
        },
        {
          kind: 'drawing',
          id: 'd1',
          skillId: 'map-skills',
          difficulty: 2,
          instruction: 'Stretch: Draw your street',
          prompt: 'Draw your street from bird-view: a line for the street plus 2 landmarks (tree, house, park).',
          successMessage: 'A real map of your world!',
        },
        {
          kind: 'reading',
          id: 'r2',
          skillId: 'community-rules',
          difficulty: 3,
          instruction: 'Strong: Why stop at red lights?',
          prompt: 'Rules keep us safe because…',
          choices: ['Everyone knows what to expect', 'Cars like the color red', 'It is nap time'],
          answer: 'Everyone knows what to expect',
          hint: 'Rules protect people when everyone follows them.',
        },
      ],
    },
  ],
};
