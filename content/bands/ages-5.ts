import type { CurriculumBand } from '../schema';

export const ages5: CurriculumBand = {
  id: 'ages-5',
  label: 'Kindergarten Path',
  ageRange: 'Age 5',
  description:
    'Letter sounds, CVC seeds, counting to 10, and story drawing. Optional K — not required in PA.',
  lessons: [
    {
      id: 'a5-letter-sounds',
      ageBand: 'ages-5',
      subject: 'english',
      title: 'First Sounds: c a t s m p',
      minutes: 10,
      pathOrder: 1,
      summary: 'Say six letter sounds that unlock CVC blending.',
      support: 'Just echo one sound: /mmm/.',
      stretch: 'Next time: blend the sounds into a word!',
      spotlight: 'Cc Ss Mm',
      groundingText: `
Lesson: First Sounds (age 5 / kindergarten path). Warm-up hear sounds → stretch match sound to letter → strong say the sound.
Goal: Say the sounds /c/ /a/ /t/ /s/ /m/ /p/ on sight; later blend them into words.
Key facts:
- c says /c/, a says /a/, t says /t/, s says /s/, m says /mmm/, p says /p/.
- One sound per letter today — no letter names needed.
- Stretch the sound like taffy: /mmm/, /sss/.
Do NOT teach: blending full words yet (next lesson) or silent letters.
`,
      pa: {
        level: 'elementary-K6',
        statuteSubjects: ['English (spelling, reading, writing)'],
        standardsTags: ['Phonemic awareness', 'Letter sounds', 'PA ELA Foundational Skills'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: 'Six sound friends',
          text: '/c/… /a/… /t/… /s/… /mmm/… /p/! Six sounds that will build words tomorrow.',
          tutorCue: 'Stretch each sound like taffy; the child echoes every sound back.',
        },
      ],
      exercises: [
        {
          kind: 'reading',
          id: 'r1',
          skillId: 'letter-sounds',
          difficulty: 1,
          instruction: 'Warm-up: Which letter says /mmm/?',
          prompt: 'Tap the /mmm/ letter',
          choices: ['M', 'S', 'P'],
          answer: 'M',
          hint: 'Hmm it with your lips closed: /mmm/.',
        },
        {
          kind: 'listen-say',
          id: 's1',
          skillId: 'letter-sounds',
          difficulty: 1,
          instruction: 'Warm-up: Say a stretchy sound',
          phrase: 'ssss',
          accept: ['ssss', 'sss', 's'],
          hint: 'Hiss like a snake: /sss/.',
        },
        {
          kind: 'reading',
          id: 'r2',
          skillId: 'letter-sounds',
          difficulty: 2,
          instruction: 'Stretch: Which letter says /p/?',
          prompt: 'A tiny pop sound: /p/',
          choices: ['T', 'P', 'C'],
          answer: 'P',
          hint: 'Pop your lips: /p/ /p/ /p/.',
        },
        {
          kind: 'reading',
          id: 'r3',
          skillId: 'letter-sounds',
          difficulty: 3,
          instruction: 'Strong: Lightning sounds',
          prompt: 'c says…?',
          choices: ['/c/', '/z/', '/w/'],
          answer: '/c/',
          hint: 'Cough a tiny cough: /c/.',
        },
      ],
    },
    {
      id: 'a5-cvc-cat',
      ageBand: 'ages-5',
      subject: 'english',
      title: 'Sound Out: cat',
      minutes: 12,
      pathOrder: 2,
      requiresLessonId: 'a5-letter-sounds',
      summary: 'Blend /c/ /a/ /t/ into cat.',
      support: 'Just say the first sound: /c/.',
      stretch: 'Next time: read a whole -at word alone!',
      spotlight: '🐱',
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
          skillId: 'blend-cat',
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
          skillId: 'blend-cat',
          difficulty: 1,
          instruction: 'Warm-up: Draw a cat',
          prompt: 'Draw a friendly cat. Whiskers welcome!',
          successMessage: 'Your cat looks ready to nap in the sun.',
        },
        {
          kind: 'reading',
          id: 'r2',
          skillId: 'blend-cat',
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
          skillId: 'blend-cat',
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
      id: 'a5-cvc-dog',
      ageBand: 'ages-5',
      subject: 'english',
      title: 'Sound Out: dog',
      minutes: 10,
      pathOrder: 3,
      requiresLessonId: 'a5-cvc-cat',
      summary: 'Blend d/o/g; meet the -og family; hear first sounds.',
      support: 'Just bark the word: dog!',
      stretch: 'Next time: read log and frog too!',
      spotlight: '🐶',
      groundingText: `
Lesson: Sound Out dog (age 5). Warm-up say dog → stretch -og family → strong first sounds.
Goal: Blend /d/ /o/ /g/ into "dog"; read log and frog as -og family; say the first sound of a word.
Key facts:
- d says /d/, o says short /o/, g says /g/.
- dog, log, frog share -og.
- First sound: dog starts with /d/.
- Dogs can be pets; logs come from trees; frogs jump near water.
Do NOT teach: silent-e words (like home) or blends like dr- yet.
`,
      pa: {
        level: 'elementary-K6',
        statuteSubjects: ['English (spelling, reading, writing)'],
        standardsTags: ['Phonics', 'Word families', 'PA ELA Foundational Skills'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: 'Three new sounds',
          text: '/d/… /o/… /g/. Push them together: dog! Woof!',
          tutorCue: 'Blend slowly with a hand-sweep; bark once together at dog.',
        },
      ],
      exercises: [
        {
          kind: 'listen-say',
          id: 's1',
          skillId: 'blend-dog',
          difficulty: 1,
          instruction: 'Warm-up: Say the word',
          phrase: 'dog',
          accept: ['dog'],
          hint: 'Woof! Say ddd-ooo-ggg: dog.',
        },
        {
          kind: 'reading',
          id: 'r1',
          skillId: 'blend-dog',
          difficulty: 2,
          instruction: 'Stretch: Which is in the -og family?',
          prompt: 'Find the -og word',
          choices: ['log', 'leg', 'lip'],
          answer: 'log',
          hint: 'It falls from a tree. Rhymes with dog.',
        },
        {
          kind: 'reading',
          id: 'r2',
          skillId: 'first-sounds',
          difficulty: 2,
          instruction: 'Stretch: First sound of dog?',
          prompt: 'Dog starts with…',
          choices: ['/d/', '/g/', '/o/'],
          answer: '/d/',
          hint: 'The very first puff of the word.',
        },
        {
          kind: 'reading',
          id: 'r3',
          skillId: 'blend-dog',
          difficulty: 3,
          instruction: 'Strong: Which rhymes with frog?',
          prompt: 'Frog and…?',
          choices: ['dog', 'fish', 'duck'],
          answer: 'dog',
          hint: 'Both end in -og. One barks!',
        },
      ],
    },
    {
      id: 'a5-math-10',
      ageBand: 'ages-5',
      subject: 'math',
      title: 'Ten Garden Seeds',
      minutes: 10,
      pathOrder: 4,
      requiresLessonId: 'a5-cvc-dog',
      summary: 'Count to 10 and compare more / less.',
      support: 'Just count to five with me first.',
      stretch: 'Next time: add small groups together!',
      spotlight: '🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱',
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
          skillId: 'count-10',
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
          skillId: 'count-10',
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
          skillId: 'count-10',
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
          skillId: 'count-10',
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
      id: 'a5-add-5',
      ageBand: 'ages-5',
      subject: 'math',
      title: 'Add Up to Five',
      minutes: 10,
      pathOrder: 5,
      requiresLessonId: 'a5-math-10',
      summary: 'Put small groups together; peek at counting to 20.',
      support: 'Just hold up two fingers with me.',
      stretch: 'Next time: add all the way to ten!',
      spotlight: '🍎🍎🍎',
      groundingText: `
Lesson: Add Up to Five (age 5). Warm-up add 2+1 → stretch add 3+2 → strong count past 10.
Goal: Combine two small groups to 5; say "2 and 1 more makes 3"; count to 20 with help.
Key facts:
- Adding means putting groups together.
- Fingers are fair tools: hold up each group, then count all.
- After 10 comes 11… up to 20 (just exposure, no mastery needed).
Do NOT teach: written + signs or sums above 5.
`,
      pa: {
        level: 'elementary-K6',
        statuteSubjects: ['Arithmetic'],
        standardsTags: ['Addition within 5', 'Counting to 20'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: 'Put together',
          text: 'Two apples and one more apple. Put them together: 1, 2, 3! Three apples!',
          tutorCue: 'Push two pretend apples, then one more, into one pile; count the pile with the child.',
        },
      ],
      exercises: [
        {
          kind: 'math',
          id: 'm1',
          skillId: 'add-5',
          difficulty: 1,
          instruction: 'Warm-up: Put together',
          visual: '🍎🍎 + 🍎',
          prompt: '2 and 1 more makes…',
          choices: ['2', '3', '4'],
          answer: '3',
          hint: 'Hold up 2 fingers, add 1 more, count all.',
        },
        {
          kind: 'math',
          id: 'm2',
          skillId: 'add-5',
          difficulty: 2,
          instruction: 'Stretch: Put together',
          visual: '🐝🐝🐝 + 🐝🐝',
          prompt: '3 and 2 more makes…',
          choices: ['4', '5', '6'],
          answer: '5',
          hint: 'Count all the bees: 1, 2, 3, 4, 5.',
        },
        {
          kind: 'reading',
          id: 'r1',
          skillId: 'count-20',
          difficulty: 3,
          instruction: 'Strong: Peek past ten',
          prompt: 'After 19 comes…',
          choices: ['20', '12', '9'],
          answer: '20',
          hint: 'Nineteen… twenty! Two-zero.',
        },
      ],
    },
    {
      id: 'a5-patterns',
      ageBand: 'ages-5',
      subject: 'math',
      title: 'Copy My Pattern',
      minutes: 10,
      pathOrder: 6,
      requiresLessonId: 'a5-add-5',
      summary: 'Copy, extend, and draw AB patterns.',
      support: 'Just copy two: red, blue.',
      stretch: 'Next time: invent an ABC pattern!',
      spotlight: '🔴🔵🔴🔵',
      groundingText: `
Lesson: Copy My Pattern (age 5). Warm-up order red-blue → stretch pick what comes next → strong draw own pattern.
Goal: Copy and extend AB patterns; say what repeats; make a new AB pattern.
Key facts:
- A pattern repeats: red, blue, red, blue…
- AB means two things taking turns.
- To extend, find what repeats and keep going.
Do NOT teach: ABC/AAB patterns (stretch only if the child begs).
`,
      pa: {
        level: 'elementary-K6',
        statuteSubjects: ['Arithmetic'],
        standardsTags: ['Patterns', 'Algebraic thinking'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: 'Taking turns',
          text: 'Red, blue, red, blue! Colors taking turns — that is a pattern. It repeats forever!',
          tutorCue: 'Chant red-blue-red-blue while tapping knees; child joins the chant.',
        },
      ],
      exercises: [
        {
          kind: 'sequence',
          id: 'q1',
          skillId: 'patterns-ab',
          difficulty: 1,
          instruction: 'Warm-up: Build red-blue-red-blue',
          prompt: 'Tap the colors in order',
          items: ['Next: blue', 'First: red', 'Last: blue', 'Then: red'],
          answer: ['First: red', 'Next: blue', 'Then: red', 'Last: blue'],
          hint: 'Red starts. Then they take turns.',
        },
        {
          kind: 'reading',
          id: 'r1',
          skillId: 'patterns-ab',
          difficulty: 2,
          instruction: 'Stretch: What comes next?',
          prompt: 'Sun, moon, sun, ___?',
          choices: ['Moon', 'Star', 'Sun'],
          answer: 'Moon',
          hint: 'Sun and moon are taking turns.',
        },
        {
          kind: 'drawing',
          id: 'd1',
          skillId: 'patterns-ab',
          difficulty: 3,
          instruction: 'Strong: Draw your own pattern',
          prompt: 'Draw an AB pattern with two shapes or colors, repeating twice.',
          successMessage: 'You invented a pattern — pattern artist!',
        },
      ],
    },
    {
      id: 'a5-pa-flag',
      ageBand: 'ages-5',
      subject: 'social',
      title: 'Our State: Pennsylvania',
      minutes: 8,
      pathOrder: 7,
      requiresLessonId: 'a5-patterns',
      summary: 'Learn we live in Pennsylvania in a gentle, concrete way.',
      support: 'Just say the first part: Penn…',
      stretch: 'Next time: find Pennsylvania on a map!',
      spotlight: '🗺️⭐',
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
          skillId: 'pa-home',
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
          skillId: 'pa-home',
          difficulty: 1,
          instruction: 'Warm-up: Draw your home',
          prompt: 'Draw your house or apartment in Pennsylvania. Add a tree or a friendly cloud.',
          successMessage: 'Home sweet Pennsylvania home!',
        },
        {
          kind: 'reading',
          id: 'r2',
          skillId: 'pa-home',
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
          skillId: 'pa-home',
          difficulty: 3,
          instruction: 'Strong: Draw home, town, and state',
          prompt: 'Draw your house, label Mount Joy (your town), and write PA for Pennsylvania.',
          successMessage: 'You showed home → town → state. Geography star!',
        },
      ],
    },
    {
      id: 'a5-seasons',
      ageBand: 'ages-5',
      subject: 'science',
      title: 'Dress for the Weather',
      minutes: 10,
      pathOrder: 8,
      requiresLessonId: 'a5-pa-flag',
      summary: 'Name seasons in order; match weather to clothing.',
      support: 'Just show me shivering for winter!',
      stretch: 'Next time: dress a friend for every season!',
      spotlight: '🌸☀️🍂❄️',
      groundingText: `
Lesson: Dress for the Weather (age 5). Warm-up winter vs summer → stretch order the seasons → strong dress for rain.
Goal: Name Spring, Summer, Fall, Winter in order; match hot/cold/rainy to clothing.
Key facts:
- Spring: flowers, rain. Summer: hot sun. Fall: leaves drop. Winter: cold, sometimes snow.
- Coats for cold; boots and raincoats for rain; light clothes for heat.
- Weather changes; we dress for it.
Do NOT teach: temperature numbers or storm safety beyond dressing warmly.
`,
      pa: {
        level: 'elementary-K6',
        statuteSubjects: ['Science'],
        standardsTags: ['Earth science', 'Seasons', 'Weather'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: 'Four season friends',
          text: 'Spring flowers, summer sun, fall leaves, winter snow! Four seasons taking turns all year.',
          tutorCue: 'Mime each season big — sniff flowers, wipe sweat, crunch leaves, shiver.',
        },
      ],
      exercises: [
        {
          kind: 'reading',
          id: 'r1',
          skillId: 'seasons',
          difficulty: 1,
          instruction: 'Warm-up: Cold and snowy?',
          prompt: 'Which season brings snow?',
          choices: ['Winter', 'Summer', 'Spring'],
          answer: 'Winter',
          hint: 'Brrr! The coldest one.',
        },
        {
          kind: 'sequence',
          id: 'q1',
          skillId: 'seasons',
          difficulty: 2,
          instruction: 'Stretch: Order the seasons',
          prompt: 'Tap the year in order',
          items: ['Winter', 'Spring', 'Fall', 'Summer'],
          answer: ['Spring', 'Summer', 'Fall', 'Winter'],
          hint: 'The year starts with flowers.',
        },
        {
          kind: 'reading',
          id: 'r2',
          skillId: 'seasons',
          difficulty: 3,
          instruction: 'Strong: Rainy day outfit?',
          prompt: 'Rain is falling. Wear…',
          choices: ['Boots and raincoat', 'Shorts and sandals', 'Pajamas'],
          answer: 'Boots and raincoat',
          hint: 'Stay dry from head to toes.',
        },
      ],
    },
    {
      id: 'a5-kind-hands',
      ageBand: 'ages-5',
      subject: 'health',
      title: 'Kind Hands, Kind Words',
      minutes: 8,
      pathOrder: 9,
      requiresLessonId: 'a5-seasons',
      summary: 'Name feelings; choose kind actions; draw kindness.',
      support: 'Just show me a happy face.',
      stretch: 'Next time: solve a sharing problem!',
      spotlight: '💛',
      groundingText: `
Lesson: Kind Hands, Kind Words (age 5). Warm-up help a friend → stretch name the feeling → strong draw kindness.
Goal: Name happy, sad, mad, scared; choose the kind action; use words for big feelings.
Key facts:
- Feelings have names: happy, sad, mad, scared.
- Kind hands help; kind words comfort.
- When mad: stop, breathe, use words, find a grown-up.
Do NOT teach: shaming language; all feelings are allowed, actions have limits.
`,
      pa: {
        level: 'elementary-K6',
        statuteSubjects: ['Health and physiology'],
        standardsTags: ['Social-emotional learning', 'Feelings'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: 'Feelings have names',
          text: 'Happy smiles. Sad cries. Mad stomps. Scared hides. Every feeling is okay — kind hands choose kind actions.',
          tutorCue: 'Make each feeling face big; child mirrors every face.',
        },
      ],
      exercises: [
        {
          kind: 'reading',
          id: 'r1',
          skillId: 'kind-choices',
          difficulty: 1,
          instruction: 'Warm-up: Crayons everywhere!',
          prompt: 'Your friend drops crayons. You…',
          choices: ['Help pick them up', 'Laugh and walk away', 'Hide them'],
          answer: 'Help pick them up',
          hint: 'Kind hands help.',
        },
        {
          kind: 'reading',
          id: 'r2',
          skillId: 'kind-choices',
          difficulty: 2,
          instruction: 'Stretch: Name the feeling',
          prompt: 'Sam lost his ball and is crying. Sam feels…',
          choices: ['Sad', 'Silly', 'Hungry'],
          answer: 'Sad',
          hint: 'Tears mean sad.',
        },
        {
          kind: 'drawing',
          id: 'd1',
          skillId: 'kind-choices',
          difficulty: 3,
          instruction: 'Strong: Draw a kind moment',
          prompt: 'Draw yourself doing something kind for someone.',
          successMessage: 'Kindness you can see — beautiful!',
        },
      ],
    },
    {
      id: 'a5-draw-story',
      ageBand: 'ages-5',
      subject: 'art',
      title: 'Draw It, Tell It',
      minutes: 12,
      pathOrder: 10,
      requiresLessonId: 'a5-kind-hands',
      summary: 'Draw a scene, tell its story, spot a spelled word.',
      support: 'Just draw one big circle with me.',
      stretch: 'Next time: write the word CAT yourself!',
      spotlight: '🖍️📖',
      groundingText: `
Lesson: Draw It, Tell It (age 5). Warm-up draw yourself → stretch spot the spelled word → strong tell two sentences.
Goal: Draw a scene with a person; recognize the spelled word CAT; tell the drawing's story in 2+ sentences.
Key facts:
- Pictures can tell stories.
- CAT is spelled c-a-t, in that order.
- A story tells who and what: "I see a cat. The cat naps."
- Invented spelling is welcome; celebrating comes first.
Do NOT teach: sentence punctuation rules (gentle exposure only).
`,
      pa: {
        level: 'elementary-K6',
        statuteSubjects: ['Art', 'English (spelling, reading, writing)'],
        standardsTags: ['Creative expression', 'Early writing'],
      },
      blocks: [
        {
          id: 'b1',
          kind: 'teach',
          title: 'Pictures tell stories',
          text: 'Draw yourself with your animal friend. Then tell me: who is there, and what is happening?',
          tutorCue: 'Draw alongside the child if possible; ask "who?" then "what is happening?"',
        },
      ],
      exercises: [
        {
          kind: 'drawing',
          id: 'd1',
          skillId: 'draw-tell',
          difficulty: 1,
          instruction: 'Warm-up: Draw you and a friend',
          prompt: 'Draw yourself with an animal friend. Big and colorful!',
          successMessage: 'What a story waiting to be told!',
        },
        {
          kind: 'reading',
          id: 'r1',
          skillId: 'write-cvc',
          difficulty: 2,
          instruction: 'Stretch: Spot CAT spelled right',
          prompt: 'Which spells cat?',
          choices: ['cat', 'cta', 'tac'],
          answer: 'cat',
          hint: 'c first, then a, then t — in blending order!',
        },
        {
          kind: 'drawing',
          id: 'd2',
          skillId: 'draw-tell',
          difficulty: 3,
          instruction: 'Strong: Tell your story',
          prompt: 'Add one more detail to your drawing, then tell its story in two sentences. A grown-up can write your words.',
          successMessage: 'You are an author AND an artist!',
        },
      ],
    },
  ],
};
