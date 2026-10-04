import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { Exercise, Lesson } from '@/content/schema';
import { getBand } from '@/content';
import { DrawingCanvas } from '@/components/exercises/DrawingCanvas';
import { MathExercise } from '@/components/exercises/MathExercise';
import { ReadingExercise } from '@/components/exercises/ReadingExercise';
import { SequenceExercise } from '@/components/exercises/SequenceExercise';
import { ListenSayExercise } from '@/components/exercises/ListenSayExercise';
import {
  askMeadow,
} from '@/lib/agent/tutor';
import {
  buildTeachPlan,
  reactToChildReply,
  type TeachTurn,
} from '@/lib/agent/teachScript';
import {
  difficultyLabel,
  exerciseDifficulty,
  lessonSkills,
  orderedExercises,
  skillLabel,
  skillLevel,
  unlockedDifficulty,
  weakestSkills,
} from '@/lib/progress';
import { useAppStore } from '@/lib/store';
import { colors, fonts, radii, space } from '@/lib/theme';
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

interface Props {
  lesson: Lesson;
  childName: string;
  onBack: () => void;
}

/**
 * Agent-led teacher: Meadow talks in short turns, listens, then unlocks the next challenge.
 * Not a top-to-bottom text reader.
 */
export function TeacherAgent({ lesson, childName, onBack }: Props) {
  const [busyListen, setBusyListen] = useState(false);
  const [lastHeard, setLastHeard] = useState('');
  const [meadowLine, setMeadowLine] = useState('');
  const [needsTap, setNeedsTap] = useState(!isVoiceUnlocked());
  const [chatOpen, setChatOpen] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<SupertonicStatus>(() =>
    isSupertonicSupported() ? getSupertonicStatus() : 'unavailable'
  );
  const [voiceProgress, setVoiceProgress] = useState(() => getSupertonicProgress());
  const neuralAnnounced = useRef(false);

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
  // Snapshot mastery at session open: mid-session progress must not shift
  // the plan (e.g. a vanishing review turn) under the child's feet.
  const [openMastery] = useState(mastery);

  // Spaced review + auto-level: weakest skills resurface after greeting;
  // children solid on 2+ skills skip mastered warm-ups and jump in.
  const { plan, startIndex } = useMemo(() => {
    const weak = childId ? weakestSkills(lesson, childId, openMastery, 2) : [];
    const solidCount = childId
      ? lessonSkills(lesson).filter(
          (s) => skillLevel(openMastery[`${childId}:${s}`]?.seen ?? 0) === 'solid'
        ).length
      : 0;
    const skip = solidCount >= 2;
    const p = buildTeachPlan(lesson, childName, weak.map(skillLabel), {
      skipWarmups: skip,
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
    return { plan: p, startIndex: start };
  }, [lesson, childName, childId, openMastery]);
  const [turnIndex, setTurnIndex] = useState(startIndex);

  const turn: TeachTurn | undefined = plan[turnIndex];
  const band = getBand(lesson.ageBand);
  const doneIds = completed[`${childId}:${lesson.id}`] || getCompletedIds(lesson.id);
  const exercises = useMemo(() => orderedExercises(lesson), [lesson]);
  const maxDiff = unlockedDifficulty(lesson, doneIds);
  const lastLevel = useRef(1);

  const currentExercise: Exercise | undefined = useMemo(() => {
    if (!turn?.exerciseId) return undefined;
    if (turn.phase !== 'exercise' && turn.phase !== 'exercise_intro') return undefined;
    if (turn.phase === 'exercise_intro') return undefined;
    return exercises.find((e) => e.id === turn.exerciseId);
  }, [turn, exercises]);

  const speakLine = useCallback(
    async (text: string, immediate?: boolean) => {
      if (!voiceEnabled) {
        setMeadowLine(text);
        return;
      }
      setMeadowLine(text);
      if (!isVoiceUnlocked()) {
        unlockAndSpeakNow(text);
        return;
      }
      if (immediate) {
        // Prefer neural when ready; wait a bit if still downloading.
        unlockVoice();
        await meadowSpeak(text, {
          enabled: true,
          waitNeuralMs: voiceStatus === 'loading' ? 45_000 : 0,
        });
        return;
      }
      await meadowSpeak(text, { enabled: true });
    },
    [voiceEnabled, voiceStatus]
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
      const p =
        typeof snap === 'string'
          ? getSupertonicProgress()
          : (snap as SupertonicProgress);
      setVoiceStatus(s);
      setVoiceProgress(p);
    });
  }, [meadowVoiceId]);

  // When neural voice finishes loading (and OpenAI isn't covering speech), announce once.
  useEffect(() => {
    if (needsTap || meadowVoiceId === 'browser') return;
    if (openaiKey) return; // OpenAI TTS already sounds different
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
      clearActiveLesson();
    };
  }, [lesson.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!turn) return;
    if (!isVoiceUnlocked()) {
      setNeedsTap(true);
      setMeadowLine(turn.say);
      return;
    }
    speakLine(turn.say);
  }, [turnIndex, turn?.say]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (maxDiff > lastLevel.current) {
      levelUp(lesson.id, lesson.title, maxDiff);
      lastLevel.current = maxDiff;
    }
  }, [maxDiff]); // eslint-disable-line react-hooks/exhaustive-deps

  const advance = () => {
    stopListening();
    setTurnIndex((i) => Math.min(i + 1, plan.length - 1));
  };

  const handleChildText = async (text: string) => {
    const cleaned = text.trim();
    if (!cleaned || !turn) return;
    setLastHeard(cleaned);

    const reaction =
      (await askMeadow(cleaned, {
        lesson,
        childName,
        ageBandLabel: band.label,
        turn,
      }, { apiKey: openaiKey || undefined })) ||
      reactToChildReply(cleaned, turn, lesson, childName);

    await speakLine(reaction);
    // Advance after a short beat unless they asked to wait / repeat
    if (/minute|wait|again|repeat|forgot|hint|why|explain/i.test(cleaned)) {
      return;
    }
    setTimeout(() => advance(), 900);
  };

  const onChip = (chip: string) => {
    unlockVoice();
    void handleChildText(chip);
  };

  const onMic = async () => {
    if (!canListen()) {
      setMeadowLine('Mic listening works best in Chrome or Safari. You can tap the big buttons to talk to me.');
      return;
    }
    unlockVoice();
    setBusyListen(true);
    setMeadowLine("I'm listening…");
    const heard = await listenOnce({ timeoutMs: 7000 });
    setBusyListen(false);
    if (!heard) {
      setMeadowLine("I didn't catch that. Try a button, or tap the mic again.");
      unlockAndSpeakNow("I didn't catch that. Try a button, or tap the mic again.");
      return;
    }
    await handleChildText(heard);
  };

  const startTeacher = () => {
    unlockAndSpeakNow(turn?.say || `Hi ${childName}! I'm Meadow, your teacher.`);
    setNeedsTap(false);
    unlockVoice();
  };

  const onExerciseComplete = (exerciseId: string) => {
    const doneExercise = exercises.find((e) => e.id === exerciseId);
    markExerciseDone(lesson.id, exerciseId, {
      lessonTitle: lesson.title,
      detail: `${childName} cleared ${exerciseId}`,
      skillId: doneExercise?.skillId,
    });
    const nextDone = [...doneIds, exerciseId];
    if (exercises.every((e) => nextDone.includes(e.id))) {
      completeLesson(lesson.id, lesson.title);
    }
    void speakLine(`Yes, ${childName}! That was great. Let's keep going.`);
    setTimeout(() => advance(), 1000);
  };

  const progressPct = Math.round(((turnIndex + 1) / Math.max(1, plan.length)) * 100);

  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => {
            stopVoice();
            stopListening();
            onBack();
          }}
        >
          <Text style={styles.back}>← Back</Text>
        </Pressable>
        <Text style={styles.learner}>Teacher: Meadow · {childName}</Text>
      </View>

      <View style={styles.agentCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>M</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.agentTitle}>Meadow · your teacher</Text>
          <Text style={styles.agentSub}>
            {turn?.phase === 'exercise'
              ? 'Your turn on the challenge'
              : turn?.waitForChild
                ? 'Talk to me — mic or buttons'
                : 'Listening and guiding'}
          </Text>
        </View>
        <Text style={styles.pct}>{progressPct}%</Text>
      </View>

      {needsTap && (
        <Pressable style={styles.startBtn} onPress={startTeacher}>
          <Text style={styles.startTitle}>Tap to start your teacher</Text>
          <Text style={styles.startBody}>
            Meadow will talk with you — not just read the page. One tap turns sound on.
          </Text>
        </Pressable>
      )}

      {!needsTap && !!openaiKey && (
        <Text style={styles.voiceReady}>Speaking with OpenAI voice (nova)</Text>
      )}

      {!needsTap && !openaiKey && meadowVoiceId !== 'browser' && voiceStatus === 'loading' && (
        <View style={styles.voiceBanner}>
          <ActivityIndicator color={colors.meadow} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.voiceBannerText}>
              {voiceProgress.detail ||
                'Loading Meadow’s nicer voice (~250MB first time). Stay on this page…'}
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.round(Math.max(0.05, voiceProgress.progress) * 100)}%` },
                ]}
              />
            </View>
          </View>
        </View>
      )}

      {!needsTap && !openaiKey && meadowVoiceId !== 'browser' && voiceStatus === 'ready' && (
        <Text style={styles.voiceReady}>
          Meadow neural voice on ({meadowVoiceId}) — tap “Hear Meadow again” to sample it
        </Text>
      )}

      {!needsTap && !openaiKey && meadowVoiceId !== 'browser' && voiceStatus === 'error' && (
        <Text style={styles.voiceReady}>
          Nicer voice failed to load — using device voice. ({voiceProgress.detail})
        </Text>
      )}

      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>{meadowLine || turn?.say}</Text>
        {!!turn?.ask && <Text style={styles.ask}>{turn.ask}</Text>}
        {!!lastHeard && (
          <Text style={styles.heard}>You said: “{lastHeard}”</Text>
        )}
      </View>

      {turn?.waitForChild && !needsTap && (
        <View style={styles.replyRow}>
          {(turn.chips || []).map((chip) => (
            <Pressable key={chip} style={styles.chip} onPress={() => onChip(chip)}>
              <Text style={styles.chipText}>{chip}</Text>
            </Pressable>
          ))}
          <Pressable
            style={[styles.mic, busyListen && styles.micOn]}
            onPress={onMic}
            disabled={busyListen}
          >
            {busyListen ? (
              <ActivityIndicator color={colors.ink} />
            ) : (
              <Text style={styles.micText}>{canListen() ? '🎤 Talk' : '🎤'}</Text>
            )}
          </Pressable>
        </View>
      )}

      {!turn?.waitForChild && turn?.phase !== 'exercise' && !needsTap && (
        <Pressable style={styles.continue} onPress={advance}>
          <Text style={styles.continueText}>Continue with Meadow</Text>
        </Pressable>
      )}

      {currentExercise && (
        <View style={styles.exCard}>
          <Text style={styles.diff}>
            {difficultyLabel(exerciseDifficulty(currentExercise))} · Lv{' '}
            {exerciseDifficulty(currentExercise)}
            {exerciseDifficulty(currentExercise) > maxDiff ? ' (finish easier first)' : ''}
          </Text>
          {exerciseDifficulty(currentExercise) <= maxDiff ? (
            <>
              {currentExercise.kind === 'math' && (
                <MathExercise
                  exercise={currentExercise}
                  childName={childName}
                  onComplete={() => onExerciseComplete(currentExercise.id)}
                />
              )}
              {currentExercise.kind === 'reading' && (
                <ReadingExercise
                  exercise={currentExercise}
                  childName={childName}
                  onComplete={() => onExerciseComplete(currentExercise.id)}
                />
              )}
              {currentExercise.kind === 'drawing' && (
                <DrawingCanvas
                  instruction={currentExercise.instruction}
                  prompt={currentExercise.prompt}
                  successMessage={currentExercise.successMessage}
                  onComplete={() => onExerciseComplete(currentExercise.id)}
                />
              )}
              {currentExercise.kind === 'sequence' && (
                <SequenceExercise
                  exercise={currentExercise}
                  childName={childName}
                  onComplete={() => onExerciseComplete(currentExercise.id)}
                />
              )}
              {currentExercise.kind === 'listen-say' && (
                <ListenSayExercise
                  exercise={currentExercise}
                  childName={childName}
                  onComplete={() => onExerciseComplete(currentExercise.id)}
                />
              )}
            </>
          ) : (
            <Text style={styles.lockNote}>
              Clear the warmer challenges first — then this stronger one unlocks.
            </Text>
          )}
        </View>
      )}

      {turn?.phase === 'celebrate' && (
        <Pressable style={styles.continue} onPress={onBack}>
          <Text style={styles.continueText}>Done for now</Text>
        </Pressable>
      )}

      <Pressable style={styles.hear} onPress={() => turn && speakLine(turn.say, true)}>
        <Text style={styles.hearText}>
          {canUseSpeech() ? '🔊 Hear Meadow again' : 'Voice unavailable'}
        </Text>
      </Pressable>

      <Pressable onPress={() => setChatOpen((v) => !v)}>
        <Text style={styles.freeChat}>
          {chatOpen ? 'Hide free ask' : 'Ask Meadow anything about this lesson'}
        </Text>
      </Pressable>
      {chatOpen && (
        <FreeAsk
          lesson={lesson}
          childName={childName}
          bandLabel={band.label}
          turn={turn}
          apiKey={openaiKey}
          onSpeak={(t) => speakLine(t, true)}
        />
      )}
    </View>
  );
}

function FreeAsk({
  lesson,
  childName,
  bandLabel,
  turn,
  apiKey,
  onSpeak,
}: {
  lesson: Lesson;
  childName: string;
  bandLabel: string;
  turn?: TeachTurn;
  apiKey: string | null;
  onSpeak: (t: string) => void;
}) {
  const chips = ['Hint please', 'Say it again', 'What are we learning?'];
  return (
    <View style={styles.freeWrap}>
      {chips.map((c) => (
        <Pressable
          key={c}
          style={styles.chip}
          onPress={async () => {
            unlockVoice();
            const reply = await askMeadow(
              c,
              { lesson, childName, ageBandLabel: bandLabel, turn },
              { apiKey: apiKey || undefined }
            );
            onSpeak(reply);
          }}
        >
          <Text style={styles.chipText}>{c}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper, padding: space.md, gap: space.sm },
  topBar: {
    paddingTop: space.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  back: { fontFamily: fonts.bodyBold, color: colors.meadow, fontSize: 16 },
  learner: { fontFamily: fonts.bodyBold, color: colors.ink, fontSize: 13 },
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: colors.meadow,
    borderRadius: radii.lg,
    padding: space.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.honey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.display, fontSize: 22, color: colors.ink },
  agentTitle: { fontFamily: fonts.displaySoft, fontSize: 18, color: colors.white },
  agentSub: { fontFamily: fonts.body, fontSize: 13, color: colors.honeySoft },
  pct: { fontFamily: fonts.bodyBold, color: colors.white, fontSize: 14 },
  startBtn: {
    backgroundColor: colors.honey,
    borderRadius: radii.lg,
    padding: space.lg,
    gap: 6,
  },
  startTitle: { fontFamily: fonts.display, fontSize: 22, color: colors.ink },
  startBody: { fontFamily: fonts.body, fontSize: 15, color: colors.inkSoft, lineHeight: 22 },
  voiceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.honeySoft,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  voiceBannerText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink,
    lineHeight: 18,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.paperDeep,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.meadow,
  },
  voiceReady: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkSoft,
    textAlign: 'center',
  },
  bubble: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: space.lg,
    borderWidth: 1,
    borderColor: colors.paperDeep,
    gap: 8,
    minHeight: 120,
  },
  bubbleText: { fontFamily: fonts.body, fontSize: 20, color: colors.ink, lineHeight: 30 },
  ask: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.meadow },
  heard: { fontFamily: fonts.body, fontSize: 14, color: colors.inkSoft, fontStyle: 'italic' },
  replyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: colors.skySoft,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radii.pill,
  },
  chipText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  mic: {
    backgroundColor: colors.honey,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radii.pill,
    minWidth: 88,
    alignItems: 'center',
  },
  micOn: { backgroundColor: colors.blush },
  micText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  continue: {
    backgroundColor: colors.meadow,
    borderRadius: radii.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueText: { fontFamily: fonts.bodyBold, color: colors.white, fontSize: 16 },
  exCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.paperDeep,
    gap: space.sm,
  },
  diff: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.ink,
    backgroundColor: colors.honeySoft,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  lockNote: { fontFamily: fonts.body, color: colors.inkSoft, fontSize: 15 },
  hear: { alignItems: 'center', paddingVertical: 8 },
  hearText: { fontFamily: fonts.bodyBold, color: colors.meadow, fontSize: 15 },
  freeChat: {
    fontFamily: fonts.body,
    color: colors.inkSoft,
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  freeWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
});
