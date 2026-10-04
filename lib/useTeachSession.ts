import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Exercise, Lesson } from '@/content/schema';
import { getBand } from '@/content';
import { askMeadow } from '@/lib/agent/tutor';
import {
  buildTeachPlan,
  reactToChildReply,
  type TeachTurn,
} from '@/lib/agent/teachScript';
import { directMascot, type Direction } from '@/lib/agent/director';
import {
  lessonSkills,
  orderedExercises,
  skillLabel,
  skillLevel,
  sortedPathLessons,
  unlockedDifficulty,
  weakestSkills,
} from '@/lib/progress';
import { useAppStore } from '@/lib/store';
import { canListen, listenOnce, stopListening } from '@/lib/voice/listen';
import {
  canUseSpeech,
  unlockAndSpeakNow,
  unlockVoice,
  meadowSpeak,
  stopVoice,
  isVoiceUnlocked,
  configureMeadowVoice,
} from '@/lib/voice/meadowVoice';
import {
  getSupertonicStatus,
  getSupertonicProgress,
  isSupertonicSupported,
  onSupertonicStatus,
  type SupertonicProgress,
  type SupertonicStatus,
} from '@/lib/voice/supertonic';
import { playStinger, unlockSfx, type SfxName } from '@/lib/sfx';
import { voiceEffectFor } from '@/lib/voiceFx';

/** Phases that play by themselves like video scenes (no tap needed). */
const AUTOPLAY_PHASES = new Set(['greet', 'review', 'teach', 'break', 'level_up']);
const NUDGE_BEAT_MS = 1200;

interface Props {
  lesson: Lesson;
  childName: string;
  onBack: () => void;
}

/**
 * The whole teaching session: plan, turns, voice, mic, mastery, autoplay,
 * and the mascot director. Renderers (LessonShow) stay dumb and cinematic.
 */
export function useTeachSession({ lesson, childName, onBack }: Props) {
  const voiceEnabled = useAppStore((s) => s.voiceEnabled);
  const meadowVoiceId = useAppStore((s) => s.meadowVoiceId);
  const openaiKey = useAppStore((s) => s.openaiKey);
  const markExerciseDone = useAppStore((s) => s.markExerciseDone);
  const getCompletedIds = useAppStore((s) => s.getCompletedIds);
  const openLesson = useAppStore((s) => s.openLesson);
  const completeLesson = useAppStore((s) => s.completeLesson);
  const levelUp = useAppStore((s) => s.levelUp);
  const clearActiveLesson = useAppStore((s) => s.clearActiveLesson);
  const completed = useAppStore((s) => s.completed);
  const childId = useAppStore((s) => s.activeChildId);
  const mastery = useAppStore((s) => s.mastery ?? {});
  const stars = useAppStore((s) => s.stars ?? {});
  const logs = useAppStore((s) => s.logs);

  const [openMastery] = useState(mastery);
  const [openLogs] = useState(logs);

  // The plan is frozen for the whole session. It used to be a useMemo over
  // mastery/logs, so a returning child's store hydrated after first render and
  // the plan rebuilt mid-lesson — warm-ups vanished, the total flipped 18 → 17
  // and the transport markers moved while the child was watching. Recompute only
  // when the lesson or the child actually changes.
  const planRef = useRef<{
    key: string;
    plan: TeachTurn[];
    startIndex: number;
  } | null>(null);
  const planKey = `${lesson.id}:${childId ?? ''}`;
  if (!planRef.current || planRef.current.key !== planKey) {
    const weak = childId ? weakestSkills(lesson, childId, openMastery, 2) : [];
    const solidCount = childId
      ? lessonSkills(lesson).filter(
          (s) => skillLevel(openMastery[`${childId}:${s}`]?.seen ?? 0) === 'solid'
        ).length
      : 0;
    const skip = solidCount >= 2;
    let memoryLine: string | undefined;
    if (childId) {
      const prev = openLogs.find(
        (l) =>
          (l.kind === 'lesson_complete' || l.kind === 'lesson_open') &&
          l.childId === childId &&
          l.lessonId &&
          l.lessonId !== lesson.id &&
          l.lessonTitle
      );
      if (prev) {
        memoryLine =
          prev.kind === 'lesson_complete'
            ? `Last time you finished “${prev.lessonTitle}” — amazing!`
            : `Last time we started “${prev.lessonTitle}”.`;
      }
    }
    const path = sortedPathLessons(getBand(lesson.ageBand).lessons);
    const next = path.find((l) => (l.pathOrder ?? 99) > (lesson.pathOrder ?? 99));
    const p = buildTeachPlan(lesson, childName, weak.map(skillLabel), {
      skipWarmups: skip,
      nextTitle: next?.title,
      memoryLine,
    });
    let start = 0;
    if (skip && childId) {
      const target = orderedExercises(lesson).find(
        (e) => skillLevel(openMastery[`${childId}:${e.skillId}`]?.seen ?? 0) !== 'solid'
      );
      if (target) {
        const idx = p.findIndex(
          (t) => t.phase === 'exercise_intro' && t.exerciseId === target.id
        );
        if (idx > 0) start = idx;
      }
    }
    planRef.current = { key: planKey, plan: p, startIndex: start };
  }
  const { plan } = planRef.current;
  const startIndex = planRef.current.startIndex;

  const [turnIndex, setTurnIndex] = useState(startIndex);
  const [busyListen, setBusyListen] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [lastHeard, setLastHeard] = useState('');
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
  const [meadowLine, setMeadowLine] = useState('');
  const [needsTap, setNeedsTap] = useState(!isVoiceUnlocked());
  const [playing, setPlaying] = useState(true);
  const [idleMs, setIdleMs] = useState(0);
  const [voiceStatus, setVoiceStatus] = useState<SupertonicStatus>(() =>
    isSupertonicSupported() ? getSupertonicStatus() : 'unavailable'
  );
  const [voiceProgress, setVoiceProgress] = useState(() => getSupertonicProgress());
  const neuralAnnounced = useRef(false);
  const lastLevel = useRef(1);
  const lastActive = useRef(Date.now());
  const nudgedLesson = useRef<string | null>(null);
  const autoplayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playingRef = useRef(true);
  playingRef.current = playing;

  const turn: TeachTurn | undefined = plan[turnIndex];
  const band = getBand(lesson.ageBand);
  const doneIds = completed[`${childId}:${lesson.id}`] || getCompletedIds(lesson.id);
  const exercises = useMemo(() => orderedExercises(lesson), [lesson]);
  const maxDiff = unlockedDifficulty(lesson, doneIds);
  const starCount = Object.keys(stars).filter((k) => childId && k.startsWith(childId)).length;

  const touch = useCallback(() => {
    lastActive.current = Date.now();
    setIdleMs(0);
  }, []);

  const currentExercise: Exercise | undefined = useMemo(() => {
    if (!turn?.exerciseId) return undefined;
    if (turn.phase !== 'exercise' && turn.phase !== 'exercise_intro') return undefined;
    if (turn.phase === 'exercise_intro') return undefined;
    return exercises.find((e) => e.id === turn.exerciseId);
  }, [turn, exercises]);

  const speakLine = useCallback(
    async (
      text: string,
      opts: { immediate?: boolean; phase?: TeachTurn['phase']; stinger?: SfxName | null } = {}
    ) => {
      const fx = voiceEffectFor(opts.phase ?? turn?.phase ?? 'teach');
      if (opts.stinger !== null && fx.stinger) playStinger(fx.stinger);
      if (!voiceEnabled) {
        setMeadowLine(text);
        return;
      }
      setMeadowLine(text);
      if (!isVoiceUnlocked()) {
        unlockAndSpeakNow(text);
        return;
      }
      if (opts.immediate) {
        unlockVoice();
        await meadowSpeak(text, {
          enabled: true,
          rate: fx.rate,
          pitch: fx.pitch,
          waitNeuralMs: voiceStatus === 'loading' ? 8_000 : 0,
        });
        return;
      }
      await meadowSpeak(text, { enabled: true, rate: fx.rate, pitch: fx.pitch });
    },
    [voiceEnabled, voiceStatus, turn?.phase]
  );

  useEffect(() => {
    configureMeadowVoice(meadowVoiceId || 'F2');
  }, [meadowVoiceId]);

  useEffect(() => {
    if (!isSupertonicSupported() || meadowVoiceId === 'browser') {
      setVoiceStatus(meadowVoiceId === 'browser' ? 'unavailable' : getSupertonicStatus());
      return;
    }
    return onSupertonicStatus((snap) => {
      const s = typeof snap === 'string' ? snap : (snap as SupertonicProgress).status;
      const p = typeof snap === 'string' ? getSupertonicProgress() : (snap as SupertonicProgress);
      setVoiceStatus(s);
      setVoiceProgress(p);
    });
  }, [meadowVoiceId]);

  useEffect(() => {
    if (needsTap || meadowVoiceId === 'browser') return;
    if (openaiKey) return;
    if (voiceStatus !== 'ready' || neuralAnnounced.current) return;
    if (!isVoiceUnlocked() || !voiceEnabled) return;
    neuralAnnounced.current = true;
    const line = `Okay ${childName}, my clearer teacher voice is ready. Let's keep going.`;
    setMeadowLine(line);
    void meadowSpeak(line, { enabled: true, waitNeuralMs: 5000 });
  }, [voiceStatus, needsTap, meadowVoiceId, voiceEnabled, childName, openaiKey]);

  useEffect(() => {
    openLesson(lesson.id, lesson.title);
    return () => {
      stopListening();
      stopVoice();
      if (autoplayTimer.current) clearTimeout(autoplayTimer.current);
      clearActiveLesson();
    };
  }, [lesson.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const advance = useCallback(() => {
    touch();
    stopListening();
    setLastResult(null);
    setTurnIndex((i) => Math.min(i + 1, plan.length - 1));
  }, [plan.length, touch]);

  /** Jump to any scene (transport markers). Gating still applies inside. */
  const seekTo = useCallback(
    (index: number) => {
      touch();
      stopListening();
      void stopVoice();
      if (autoplayTimer.current) clearTimeout(autoplayTimer.current);
      setLastResult(null);
      setTurnIndex(Math.max(0, Math.min(index, plan.length - 1)));
    },
    [plan.length, touch]
  );

  // Autoplay cinematic scenes; idle-nudge drifting children.
  useEffect(() => {
    if (autoplayTimer.current) clearTimeout(autoplayTimer.current);
    if (!turn || needsTap) return;
    if (!isVoiceUnlocked()) {
      setMeadowLine(turn.say);
      return;
    }
    let cancelled = false;
    void (async () => {
      await speakLine(turn.say, { phase: turn.phase });
      if (cancelled) return;
      if (playingRef.current && AUTOPLAY_PHASES.has(turn.phase)) {
        autoplayTimer.current = setTimeout(() => advance(), NUDGE_BEAT_MS);
      }
    })();
    return () => {
      cancelled = true;
      if (autoplayTimer.current) clearTimeout(autoplayTimer.current);
    };
  }, [turnIndex, turn?.say]); // eslint-disable-line react-hooks/exhaustive-deps

  // Idle clock for the director's focus nudge.
  useEffect(() => {
    const id = setInterval(() => setIdleMs(Date.now() - lastActive.current), 5000);
    return () => clearInterval(id);
  }, []);

  const direction: Direction = useMemo(
    () =>
      directMascot({
        turn,
        lesson,
        idleMs,
        thinking,
        lastResult,
      }),
    [turn, lesson, idleMs, thinking, lastResult]
  );

  // One gentle pull back to the mission per lesson — never naggy.
  useEffect(() => {
    if (!direction.focusLine || nudgedLesson.current === lesson.id) return;
    if (!playingRef.current) return;
    nudgedLesson.current = lesson.id;
    void speakLine(direction.focusLine, { phase: turn?.phase ?? 'check', stinger: null });
  }, [direction.focusLine, turnIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (maxDiff > lastLevel.current) {
      levelUp(lesson.id, lesson.title, maxDiff);
      lastLevel.current = maxDiff;
    }
  }, [maxDiff]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChildText = async (text: string, opts?: { heard?: boolean }) => {
    const cleaned = text.trim();
    if (!cleaned || !turn) return;
    touch();
    // Only echo speech the child actually said. Chip taps used to land here too,
    // so tapping "Let's try it" displayed: You said: "Let's try it".
    if (opts?.heard) setLastHeard(cleaned);
    setThinking(true);
    let reaction: string;
    try {
      reaction =
        (await askMeadow(
          cleaned,
          { lesson, childName, ageBandLabel: band.label, turn },
          { apiKey: openaiKey || undefined }
        )) || reactToChildReply(cleaned, turn, lesson, childName);
    } finally {
      setThinking(false);
    }
    await speakLine(reaction, { phase: turn.phase, stinger: null });
    if (/minute|wait|again|repeat|forgot|hint|why|explain/i.test(cleaned)) return;
    setTimeout(() => advance(), 900);
  };

  const onChip = (chip: string) => {
    unlockVoice();
    unlockSfx();
    playStinger('pop');
    void handleChildText(chip);
  };

  const onMic = async () => {
    touch();
    if (!canListen()) {
      const guidance =
        'Mic listening works best in Chrome or Safari. You can tap the big buttons to talk to me.';
      setMeadowLine(guidance);
      unlockAndSpeakNow(guidance);
      return;
    }
    unlockVoice();
    unlockSfx();
    setBusyListen(true);
    setMeadowLine("I'm listening…");
    const heard = await listenOnce({ timeoutMs: 7000 });
    setBusyListen(false);
    if (!heard) {
      const miss = "I didn't catch that. Try a button, or tap the mic again.";
      setMeadowLine(miss);
      unlockAndSpeakNow(miss);
      return;
    }
    await handleChildText(heard, { heard: true });
  };

  const onExerciseComplete = (exerciseId: string) => {
    touch();
    const doneExercise = exercises.find((e) => e.id === exerciseId);
    markExerciseDone(lesson.id, exerciseId, {
      lessonTitle: lesson.title,
      detail: `${childName} cleared ${exerciseId}`,
      skillId: doneExercise?.skillId,
    });
    setLastResult('correct');
    playStinger('ding');
    const nextDone = [...doneIds, exerciseId];
    if (exercises.every((e) => nextDone.includes(e.id))) {
      completeLesson(lesson.id, lesson.title);
    }
    void speakLine(`Yes, ${childName}! That was great. Let's keep going.`, {
      phase: 'react',
      stinger: null,
    });
    setTimeout(() => advance(), 1000);
  };

  const onExerciseWrong = useCallback(() => {
    touch();
    setLastResult('wrong');
  }, [touch]);

  const startTeacher = () => {
    // Drop focus from the start overlay so screen readers don't get trapped.
    const g = globalThis as unknown as {
      document?: { activeElement?: { blur?: () => void } | null };
    };
    try {
      g.document?.activeElement?.blur?.();
    } catch {
      // ignore
    }
    unlockAndSpeakNow(turn?.say || `Hi ${childName}! I'm Meadow, your teacher.`);
    unlockSfx();
    setNeedsTap(false);
    unlockVoice();
    touch();
  };

  const pause = useCallback(() => {
    setPlaying(false);
    if (autoplayTimer.current) clearTimeout(autoplayTimer.current);
    void stopVoice();
  }, []);

  const play = useCallback(() => {
    touch();
    setPlaying(true);
    if (turn) void speakLine(turn.say, { phase: turn.phase, stinger: null });
  }, [touch, turn, speakLine]);

  const replay = useCallback(() => {
    touch();
    if (turn) void speakLine(turn.say, { immediate: true, phase: turn.phase });
  }, [touch, turn, speakLine]);

  const goBack = useCallback(() => {
    stopVoice();
    stopListening();
    onBack();
  }, [onBack]);

  return {
    plan,
    turnIndex,
    turn,
    band,
    exercises,
    currentExercise,
    doneIds,
    maxDiff,
    starCount,
    playing,
    pause,
    play,
    replay,
    advance,
    seekTo,
    handleChildText,
    onChip,
    onMic,
    onExerciseComplete,
    onExerciseWrong,
    startTeacher,
    goBack,
    meadowLine,
    lastHeard,
    needsTap,
    busyListen,
    thinking,
    direction,
    voiceStatus,
    voiceProgress,
    childId,
    canHear: canUseSpeech(),
  };
}
