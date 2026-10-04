import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Lesson } from '@/content/schema';
import { DrawingCanvas } from '@/components/exercises/DrawingCanvas';
import { MathExercise } from '@/components/exercises/MathExercise';
import { ReadingExercise } from '@/components/exercises/ReadingExercise';
import { SequenceExercise } from '@/components/exercises/SequenceExercise';
import { ListenSayExercise } from '@/components/exercises/ListenSayExercise';
import { TutorFab, TutorSheet } from '@/components/Tutor';
import { VoiceBar } from '@/components/VoiceBar';
import {
  difficultyLabel,
  exerciseDifficulty,
  orderedExercises,
  unlockedDifficulty,
} from '@/lib/progress';
import { colors, fonts, radii, space } from '@/lib/theme';
import { useActiveChild, useAppStore } from '@/lib/store';
import {
  isVoiceUnlocked,
  meadowSpeak,
  meadowSpeakSequence,
  stopVoice,
  unlockAndSpeakNow,
  unlockVoice,
} from '@/lib/voice/meadowVoice';
import {
  narrateBlock,
  narrateExercise,
  narrateLessonDone,
  narrateLessonOpen,
  narrateLevelUp,
} from '@/lib/voice/scripts';

interface Props {
  lesson: Lesson;
  childName: string;
  onBack: () => void;
}

export function LessonPlayer({ lesson, childName, onBack }: Props) {
  const [step, setStep] = useState(0);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [needsTapToHear, setNeedsTapToHear] = useState(!isVoiceUnlocked());
  const openedRef = useRef(false);
  const lastLevelRef = useRef(1);
  const gen = useRef(0);

  const child = useActiveChild();
  const voiceEnabled = useAppStore((s) => s.voiceEnabled);
  const markExerciseDone = useAppStore((s) => s.markExerciseDone);
  const getCompletedIds = useAppStore((s) => s.getCompletedIds);
  const openLesson = useAppStore((s) => s.openLesson);
  const completeLesson = useAppStore((s) => s.completeLesson);
  const levelUp = useAppStore((s) => s.levelUp);
  const clearActiveLesson = useAppStore((s) => s.clearActiveLesson);
  const completed = useAppStore((s) => s.completed);

  const doneIds = useMemo(() => {
    const key = `${child.id}:${lesson.id}`;
    return completed[key] || getCompletedIds(lesson.id);
  }, [completed, child.id, lesson.id, getCompletedIds]);

  const exercises = useMemo(() => orderedExercises(lesson), [lesson]);
  const maxDiff = unlockedDifficulty(lesson, doneIds);
  const playable = useMemo(
    () => exercises.filter((e) => exerciseDifficulty(e) <= maxDiff),
    [exercises, maxDiff]
  );

  const totalBlocks = lesson.blocks.length;
  const totalPlayable = playable.length;
  const inBlocks = step < totalBlocks;
  const exerciseIndex = step - totalBlocks;
  const allDone =
    exercises.length > 0 && exercises.every((e) => doneIds.includes(e.id));
  const finished = allDone && step >= totalBlocks + totalPlayable;

  useEffect(() => {
    openLesson(lesson.id, lesson.title);
    return () => clearActiveLesson();
  }, [lesson.id, lesson.title]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (maxDiff > lastLevelRef.current) {
      levelUp(lesson.id, lesson.title, maxDiff);
      if (voiceEnabled && isVoiceUnlocked()) {
        meadowSpeak(narrateLevelUp(childName, maxDiff), { enabled: true });
      }
      lastLevelRef.current = maxDiff;
    }
  }, [maxDiff]); // eslint-disable-line react-hooks/exhaustive-deps

  const speakCurrent = useCallback(async () => {
    if (!voiceEnabled) return;
    unlockVoice();
    setNeedsTapToHear(false);
    const my = ++gen.current;
    // Don't await stop before first words when coming from a tap — VoiceBar already spoke

    let lines: string[] = [];
    if (!openedRef.current) {
      openedRef.current = true;
      lines = narrateLessonOpen(lesson, childName);
    }

    if (finished) {
      lines = [...lines, ...narrateLessonDone(lesson, childName)];
    } else if (inBlocks) {
      lines = [...lines, ...narrateBlock(lesson.blocks[step], childName)];
    } else if (playable[exerciseIndex]) {
      lines = [...lines, ...narrateExercise(playable[exerciseIndex], childName)];
    }

    if (my !== gen.current) return;
    await meadowSpeakSequence(lines, { enabled: voiceEnabled, gapMs: 280 });
  }, [
    voiceEnabled,
    lesson,
    childName,
    finished,
    inBlocks,
    step,
    exerciseIndex,
    playable,
  ]);

  useEffect(() => {
    if (!voiceEnabled) {
      stopVoice();
      return;
    }
    // Web: never auto-start without unlock (browser policy)
    if (!isVoiceUnlocked()) {
      setNeedsTapToHear(true);
      return;
    }
    speakCurrent();
    return () => {
      gen.current += 1;
      stopVoice();
    };
  }, [step, finished, voiceEnabled, playable.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => { stopVoice(); }, []);

  const onExerciseComplete = (exerciseId: string) => {
    const doneExercise = exercises.find((e) => e.id === exerciseId);
    markExerciseDone(lesson.id, exerciseId, {
      lessonTitle: lesson.title,
      detail: `${childName} cleared exercise ${exerciseId} in “${lesson.title}”`,
      skillId: doneExercise?.skillId,
    });
    const nextDone = [...doneIds, exerciseId];
    if (exercises.every((e) => nextDone.includes(e.id))) {
      completeLesson(lesson.id, lesson.title);
    }
  };

  const goNext = () => {
    unlockVoice();
    // If more playable exercises unlocked after completing, expand step range
    setStep((s) => s + 1);
  };

  // When new exercises unlock, allow continuing if we were at end of previous playable set
  useEffect(() => {
    if (!inBlocks && !finished && exerciseIndex >= playable.length && playable.length > 0) {
      // stay on last available until they tap next after unlock — clamp
      setStep(totalBlocks + playable.length - 1);
    }
  }, [playable.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentEx = !inBlocks && !finished ? playable[exerciseIndex] : null;

  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => {
            stopVoice();
            onBack();
          }}
          hitSlop={10}
        >
          <Text style={styles.back}>← Back</Text>
        </Pressable>
        <Text style={styles.learner}>Learning: {childName}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.kicker}>
          {lesson.subject.toUpperCase()} · Path step {lesson.pathOrder ?? '—'} · Level {maxDiff}/3
        </Text>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.summary}>{lesson.summary}</Text>

        <VoiceBar
          onHearAgain={speakCurrent}
          immediateLine={`Hi ${childName}! Let's learn ${lesson.title}.`}
        />

        {needsTapToHear && (
          <Pressable
            style={styles.unlock}
            onPress={() => {
              unlockAndSpeakNow(`Hi ${childName}! I'm Meadow. Let's learn ${lesson.title}.`);
              setNeedsTapToHear(false);
              setTimeout(() => speakCurrent(), 60);
            }}
          >
            <Text style={styles.unlockTitle}>Tap to hear Meadow</Text>
            <Text style={styles.unlockBody}>
              Browsers need one tap for sound. After this, Meadow reads each page for you.
            </Text>
          </Pressable>
        )}

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(
                  100,
                  (doneIds.length / Math.max(1, exercises.length)) * 100
                )}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.progressLabel}>
          {doneIds.length}/{exercises.length} challenges cleared
        </Text>

        {inBlocks && (
          <View style={styles.card}>
            {!!lesson.blocks[step].title && (
              <Text style={styles.cardTitle}>{lesson.blocks[step].title}</Text>
            )}
            <Text style={styles.cardBody}>{lesson.blocks[step].text}</Text>
            {!!lesson.blocks[step].tutorCue && (
              <Text style={styles.cue}>Meadow tip: {lesson.blocks[step].tutorCue}</Text>
            )}
            <Pressable style={styles.next} onPress={goNext}>
              <Text style={styles.nextText}>
                {step === totalBlocks - 1 ? 'Start challenges' : 'Next'}
              </Text>
            </Pressable>
          </View>
        )}

        {currentEx && (
          <View style={styles.card}>
            <Text style={styles.diffBadge}>
              {difficultyLabel(exerciseDifficulty(currentEx))} · Level{' '}
              {exerciseDifficulty(currentEx)}
            </Text>
            {currentEx.kind === 'math' && (
              <MathExercise
                exercise={currentEx}
                childName={childName}
                onComplete={() => onExerciseComplete(currentEx.id)}
              />
            )}
            {currentEx.kind === 'reading' && (
              <ReadingExercise
                exercise={currentEx}
                childName={childName}
                onComplete={() => onExerciseComplete(currentEx.id)}
              />
            )}
            {currentEx.kind === 'drawing' && (
              <DrawingCanvas
                instruction={currentEx.instruction}
                prompt={currentEx.prompt}
                successMessage={currentEx.successMessage}
                onComplete={() => onExerciseComplete(currentEx.id)}
              />
            )}
            {currentEx.kind === 'sequence' && (
              <SequenceExercise
                exercise={currentEx}
                childName={childName}
                onComplete={() => onExerciseComplete(currentEx.id)}
              />
            )}
            {currentEx.kind === 'listen-say' && (
              <ListenSayExercise
                exercise={currentEx}
                childName={childName}
                onComplete={() => onExerciseComplete(currentEx.id)}
              />
            )}
            <Pressable
              style={styles.next}
              onPress={() => {
                const ids = useAppStore.getState().getCompletedIds(lesson.id);
                if (!ids.includes(currentEx.id)) {
                  if (voiceEnabled) {
                    meadowSpeak(
                      'Finish this challenge first. Then tap Next challenge.',
                      { enabled: true }
                    );
                  }
                  return;
                }
                const nextOrdered = orderedExercises(lesson);
                const nextMax = unlockedDifficulty(lesson, ids);
                const nextPlayable = nextOrdered.filter(
                  (e) => exerciseDifficulty(e) <= nextMax
                );
                if (exerciseIndex < nextPlayable.length - 1) {
                  goNext();
                  return;
                }
                if (nextOrdered.every((e) => ids.includes(e.id))) {
                  setStep(totalBlocks + nextPlayable.length);
                  return;
                }
                if (voiceEnabled) {
                  meadowSpeak(
                    'You unlocked a stronger challenge. Tap Next challenge again!',
                    { enabled: true }
                  );
                }
                // Expand playable list — bump step to newly unlocked item
                setStep(totalBlocks + nextPlayable.length - 1);
              }}
            >
              <Text style={styles.nextText}>
                {allDone ? 'Finish lesson' : 'Next challenge'}
              </Text>
            </Pressable>
          </View>
        )}

        {finished && (
          <View style={[styles.card, styles.celebrate]}>
            <Text style={styles.celebrateTitle}>You did it, {childName}!</Text>
            <Text style={styles.cardBody}>
              “{lesson.title}” is complete — warm-ups through strong challenges. Meadow logged your work.
            </Text>
            <Pressable
              style={styles.next}
              onPress={() => {
                stopVoice();
                onBack();
              }}
            >
              <Text style={styles.nextText}>Back to lessons</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.paBox}>
          <Text style={styles.paLabel}>PA alignment</Text>
          <Text style={styles.paText}>{lesson.pa.statuteSubjects.join(' · ')}</Text>
        </View>
      </ScrollView>

      <TutorFab
        onPress={() => {
          unlockVoice();
          setTutorOpen(true);
        }}
      />
      <TutorSheet
        visible={tutorOpen}
        onClose={() => setTutorOpen(false)}
        lesson={lesson}
        childName={childName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  topBar: {
    paddingTop: space.lg,
    paddingHorizontal: space.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  back: { fontFamily: fonts.bodyBold, color: colors.meadow, fontSize: 16 },
  learner: { fontFamily: fonts.bodyBold, color: colors.ink, fontSize: 14 },
  content: { padding: space.md, paddingBottom: 120, gap: space.sm },
  kicker: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 0.8,
    color: colors.sky,
  },
  title: { fontFamily: fonts.display, fontSize: 32, color: colors.ink, lineHeight: 38 },
  summary: { fontFamily: fonts.body, fontSize: 16, color: colors.inkSoft, lineHeight: 24 },
  unlock: {
    backgroundColor: colors.meadow,
    borderRadius: radii.lg,
    padding: space.lg,
    gap: 8,
  },
  unlockTitle: { fontFamily: fonts.display, fontSize: 22, color: colors.white },
  unlockBody: { fontFamily: fonts.body, fontSize: 15, color: colors.white, lineHeight: 22 },
  progressTrack: {
    height: 8,
    backgroundColor: colors.paperDeep,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: { height: 8, backgroundColor: colors.meadow },
  progressLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.inkSoft },
  diffBadge: {
    alignSelf: 'flex-start',
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.ink,
    backgroundColor: colors.honeySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: space.lg,
    gap: space.md,
    borderWidth: 1,
    borderColor: colors.paperDeep,
  },
  cardTitle: { fontFamily: fonts.displaySoft, fontSize: 22, color: colors.meadow },
  cardBody: { fontFamily: fonts.body, fontSize: 18, color: colors.ink, lineHeight: 28 },
  cue: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.inkSoft,
    backgroundColor: colors.honeySoft,
    padding: space.sm,
    borderRadius: radii.sm,
  },
  next: {
    backgroundColor: colors.meadow,
    borderRadius: radii.pill,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: space.xs,
  },
  nextText: { fontFamily: fonts.bodyBold, color: colors.white, fontSize: 17 },
  celebrate: { backgroundColor: colors.skySoft, borderColor: colors.sky },
  celebrateTitle: { fontFamily: fonts.display, fontSize: 28, color: colors.ink },
  paBox: { marginTop: space.md, opacity: 0.85 },
  paLabel: { fontFamily: fonts.bodyBold, fontSize: 11, color: colors.inkSoft, letterSpacing: 0.8 },
  paText: { fontFamily: fonts.body, fontSize: 13, color: colors.inkSoft },
});
