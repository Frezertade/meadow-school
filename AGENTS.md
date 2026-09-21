# Meadow School — Agent Guide

Private Pennsylvania family home-education app (web + iOS via Expo).
Primary learners: ages **3–7** (prek through grade 1 trail). Parent-controlled. No public signup.

## Product north star

Beat generic schoolware by being: **age-appropriate, lesson-grounded, always-helped, and safe.**

Every child screen must keep **Meadow** (tutor FAB) available. Meadow may only answer from the **current lesson’s `groundingText` + exercises**. Never open-web knowledge for kids.

## Stack

- Expo Router (`apps` live at repo root): web + iOS from one codebase
- Curriculum: typed lessons in `content/`
- Tutor: `lib/agent/tutor.ts` + `lib/agent/safety.ts`
- Progress + PIN: `lib/store.ts` (AsyncStorage + SecureStore)
- UI theme: `lib/theme.ts` — Storybook Meadow (linen paper, forest, honey). Do **not** use purple gradients or cream+terracotta AI defaults.

## Where to add course material

1. Pick age band file:
   - `content/bands/ages-3-4.ts`
   - `content/bands/ages-5.ts`
   - `content/bands/ages-6-7.ts`
2. Add a `Lesson` matching `content/schema.ts`.
3. Fill `groundingText` as the **only** knowledge Meadow may teach for that lesson (facts, steps, calm safety notes).
4. Add `blocks` (story/teach/prompt) then `exercises` (`reading` | `math` | `drawing`).
5. Set `pa.statuteSubjects` using labels from `content/pa-alignment.ts` / `PA_ELEMENTARY_SUBJECTS`.
6. Register happens automatically via band `lessons` arrays + `content/index.ts`.

### Lesson quality bar

- Ages 3–4: very short sentences, concrete objects, 5–10 minutes.
- Age 5: gentle phonics / count to 10; still playful.
- Ages 6–7: map to PA elementary buckets (English, arithmetic, science, PA/US/civics/geography, art, safety). Keep fire-safety calm and non-graphic.
- Every lesson needs at least one interactive exercise. Prefer draw + read/math combo.
- No ads, trackers, external links, or chat that can leave the lesson.

## UI directions for agents

| Surface | Build |
|---|---|
| Home | Child switcher, age-band card, lesson list, parent gate entry |
| Lesson player | Progress, teach blocks, then exercises; Meadow FAB always visible |
| Reading exercise | Large prompt card + big tap choices |
| Math exercise | Visual countable objects + numeral choices + hint on miss |
| Drawing | Full finger canvas, clear / done, success line |
| Meadow sheet | Lesson-scoped chat, quick chips (hint / draw / what are we learning) |
| Parent desk | PIN gate, rename kids, set age band, PA statute reminder |

Touch targets ≥ 44px. Prefer `Pressable` over tiny icons-only controls for ages 3–5.

## Safety rules (non-negotiable)

- Run child text through `isUnsafeChildInput` before answering.
- Sanitize outputs with `sanitizeTutorOutput` (strip URLs; block adult topics).
- Parent PIN required before settings.
- Optional future LLM must use `buildLlmMessages` + `CHILD_SAFETY_SYSTEM` and still fall back to local `answerFromLesson`.

## PA compliance notes (for parents + content authors)

- Compulsory program (affidavit/evaluation) generally starts at age **6** in PA; kindergarten is optional.
- This app is a **curriculum + portfolio helper**, not a substitute for filing with Donegal SD.
- Tag lessons so a yearly portfolio can show English, arithmetic, science, social studies seeds, art, and fire safety.

## Do not

- Add social feeds, public leaderboards, or in-app browsers for children.
- Let Meadow answer off-lesson trivia.
- Ship purple “AI SaaS” chrome or Inter-only typography.
- Commit API keys. Family secrets stay in SecureStore / local env ignored by git.
