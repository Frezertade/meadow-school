# Changelog

## 1.3.1 — 2026-10-04 — Bugs found by watching a real lesson

Fixed by clicking through lessons, not by reading the code.

- **Scene count no longer shifts mid-lesson** — the teach plan was rebuilt when the
  progress store hydrated, so a returning child saw "Scene 2/18" become "6/17" and
  the transport markers moved. The plan is now frozen per lesson/child
- **Meadow stopped reading internal labels aloud** — intros spoke the exercise's
  `instruction`, which carries the `Warm-up:` / `Stretch:` / `Strong:` tier, so
  children heard an internal difficulty tag. Intros are now a short varied handoff
- **Meadow says the real instruction** — the exercise turn speaks `prompt` (or the
  `phrase` for listen-say) instead of a canned "I'll stay right here" line that
  repeated on every exercise, ~20x per lesson
- **Buttons no longer masquerade as speech** — tapping a chip showed
  `You said: "Let's try it"`. Only real mic input is echoed now

## 1.3.0 — 2026-10-04 — Show polish loop

Every scene teaches visually; transport seeks; home leads with Next up.

- Lesson `spotlight` visuals (31 backfilled): the stage shows the teaching —
  big letters, counts, shapes, patterns — plus a moment ribbon per scene
- Exercise content on stage: math visuals, listen-say phrases, sequence maps
- Captions cut to two beats (short line + question); greetings trimmed
- Transport markers are tappable: jump straight to any play break (locks still hold)
- Home is Next-up-first: hero start card + compact full path, no wall of locked doors
- Idle nudge at 30s, once per lesson; focus blur fix; prefers-reduced-motion path
- Fixed: fresh children no longer get a bogus "last time we practiced" review

## 1.2.0 — 2026-10-04 — Meadow Show

Video-style animated lessons with an agentic mascot. Replaces the static
lesson players (`TeacherAgent`, `LessonPlayer` removed).

**Meadow Show player**
- Lessons play like episodes: scenes auto-play with big captions, transport bar
  (play/pause, scene progress with play-break markers, replay), exercises as
  🎮 play breaks, star-burst + fanfare finale
- Animated Meadow mascot (Reanimated): bobs, cheers, thinks, wiggles, celebrates
- Mascot director (`lib/agent/director.ts`): decides each moment's mood, nudges
  drifting children back to the mission after 20s idle, mirrors right/wrong
- Voice effects per moment (excited celebration, silly break) + synthesized
  sound-effect stingers, zero new dependencies
- Speaks the teaching, never stage directions (`tutorCue` no longer read aloud)

## 1.1.0 — 2026-10-04 — Meadow v2

Teacher-led learning: 31 lessons, real mastery tracking, parent paperwork.

**Content (12 → 31 lessons)**
- 19 new lessons across all bands: phonics chains, math progressions, seasons,
  feelings, maps, weather, music, health habits
- Every exercise carries a `skillId` from the new scope & sequence (`content/scope.md`)
- Every lesson has `support` (stuck on-ramp) and `stretch` (harder twist) branches
- New exercise kinds with full UI: `sequence` (tap steps in order) and
  `listen-say` (hear it, say it back via mic with graceful fallback)
- Coverage matrix (`npm run coverage`) + PA honesty audit in scope doc

**Teaching engine**
- Spaced review: weakest skills resurface automatically after greeting
- Auto-level: children solid on 2+ skills skip mastered warm-ups and jump in
- Wiggle breaks in longer lessons; next-lesson cliffhangers at celebration
- Meadow remembers last session by name ("Last time you finished…")

**Progress & parents**
- Per-skill mastery (new → practicing → solid) persisted per child
- Parent skills grid, weekly digest with offline activity, one-tap PA portfolio
  (PDF on native / HTML on web), backup export + restore
- Stars + a meadow garden that grows with finished lessons

**Quality gates**
- `npm run validate` (content rules, in CI), `npm test` (32 unit tests, in CI),
  coverage freshness + web bundle budgets in CI

## 1.0.0 — 2026-09-21

Ship Meadow School: PA-aligned ages 3–7 app with grounded tutor.
