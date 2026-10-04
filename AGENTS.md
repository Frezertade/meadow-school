# Meadow School — Agent Guide

Private Pennsylvania family home-education app (web + iOS via Expo).
Primary learners: ages **3–7**. Parent-controlled. No public signup.

## Product north star

**Meadow is a teacher agent**, not a text-to-speech screen reader.

Beat generic schoolware by being: **age-appropriate, lesson-grounded, conversational, always-helped, and safe.**

### What “teacher agent” means here

- Meadow **leads** short turns: greet → teach one bite → check understanding → introduce challenge → react → celebrate.
- Child answers via **big chips** or **mic** (where the browser supports speech recognition).
- Answers stay inside the lesson’s `groundingText` + exercises.
- Difficulty still climbs warm-up → stretch → strong; path lessons unlock in order.

### Honest limits (do not over-promise)

| You get now | You do not get yet (without extra services) |
|---|---|
| Conversational teaching script + reactions | Studio-quality “cartoon kid” voice |
| Mic talk-back on Chrome/Safari web | Perfect speech recognition for ages 3–4 |
| Optional OpenAI key for smarter replies (parent desk) | Fully offline LLM |
| Device/browser TTS + **OpenAI TTS** (with parent key) + **Supertonic** on web (~250MB first load, F2) | Studio “cartoon kid” voice without a key |
| Local grounded teacher if no API key | Open-web knowledge |

Premium kid voice = add a TTS provider later (parent-configured key). Mic quality varies by device/noise.

## Stack

- Expo Router: web + iOS
- Teacher flow: `components/LessonShow.tsx` + `lib/useTeachSession.ts` + `lib/agent/teachScript.ts` + `lib/agent/director.ts` (mascot decides each moment; never reads the screen)
- Voice out: `lib/voice/meadowVoice.ts` + `lib/voice/supertonic.web.ts` (Supertonic F2 on web, speechSynthesis/expo-speech fallback)
- Voice in: `lib/voice/listen.ts` (Web Speech Recognition)
- Progress + logs + optional OpenAI key: `lib/store.ts`
- Theme: `lib/theme.ts` — Storybook Meadow

## Where to add course material

1. Band files under `content/bands/`
2. `Lesson` matches `content/schema.ts` with `groundingText`, blocks, exercises (`difficulty` 1–3), `pathOrder`, `requiresLessonId`
3. Teaching turns are **derived** from blocks/exercises — write `tutorCue` lines that sound like a teacher, not a paragraph dump

## Safety

- `isUnsafeChildInput` / `sanitizeTutorOutput`
- Optional LLM must use `buildLlmMessages` + `CHILD_SAFETY_SYSTEM` and fall back to local teacher
- Parent PIN; API keys only in SecureStore / local storage — never commit

## Do not

- Go back to “read the whole page top to bottom” as the main mode
- Let Meadow leave the lesson grounding
- Ship social/ads/outbound browsers for kids
