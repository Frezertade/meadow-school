import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Lesson } from '@/content/schema';
import { DrawingCanvas } from '@/components/exercises/DrawingCanvas';
import { MathExercise } from '@/components/exercises/MathExercise';
import { ReadingExercise } from '@/components/exercises/ReadingExercise';
import { TutorFab, TutorSheet } from '@/components/Tutor';
import { colors, fonts, radii, space } from '@/lib/theme';
import { useAppStore } from '@/lib/store';

interface Props {
  lesson: Lesson;
  childName: string;
  onBack: () => void;
}

export function LessonPlayer({ lesson, childName, onBack }: Props) {
  const [step, setStep] = useState(0);
  const [tutorOpen, setTutorOpen] = useState(false);
  const markExerciseDone = useAppStore((s) => s.markExerciseDone);

  const totalBlocks = lesson.blocks.length;
  const totalExercises = lesson.exercises.length;
  const inBlocks = step < totalBlocks;
  const exerciseIndex = step - totalBlocks;
  const finished = step >= totalBlocks + totalExercises;

  const onExerciseComplete = (exerciseId: string) => {
    markExerciseDone(lesson.id, exerciseId);
  };

  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} hitSlop={10}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>
        <Text style={styles.mins}>{lesson.minutes} min</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.kicker}>{lesson.subject.toUpperCase()}</Text>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.summary}>{lesson.summary}</Text>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(
                  100,
                  ((finished ? totalBlocks + totalExercises : step + 1) /
                    Math.max(1, totalBlocks + totalExercises)) *
                    100
                )}%`,
              },
            ]}
          />
        </View>

        {inBlocks && (
          <View style={styles.card}>
            {!!lesson.blocks[step].title && (
              <Text style={styles.cardTitle}>{lesson.blocks[step].title}</Text>
            )}
            <Text style={styles.cardBody}>{lesson.blocks[step].text}</Text>
            {!!lesson.blocks[step].tutorCue && (
              <Text style={styles.cue}>Meadow tip: {lesson.blocks[step].tutorCue}</Text>
            )}
            <Pressable style={styles.next} onPress={() => setStep((s) => s + 1)}>
              <Text style={styles.nextText}>
                {step === totalBlocks - 1 ? 'Start exercises' : 'Next'}
              </Text>
            </Pressable>
          </View>
        )}

        {!inBlocks && !finished && (
          <View style={styles.card}>
            {(() => {
              const ex = lesson.exercises[exerciseIndex];
              if (ex.kind === 'math') {
                return (
                  <MathExercise
                    exercise={ex}
                    onComplete={() => onExerciseComplete(ex.id)}
                  />
                );
              }
              if (ex.kind === 'reading') {
                return (
                  <ReadingExercise
                    exercise={ex}
                    onComplete={() => onExerciseComplete(ex.id)}
                  />
                );
              }
              return (
                <DrawingCanvas
                  instruction={ex.instruction}
                  prompt={ex.prompt}
                  successMessage={ex.successMessage}
                  onComplete={() => onExerciseComplete(ex.id)}
                />
              );
            })()}
            <Pressable style={styles.next} onPress={() => setStep((s) => s + 1)}>
              <Text style={styles.nextText}>
                {exerciseIndex === totalExercises - 1 ? 'Finish lesson' : 'Next exercise'}
              </Text>
            </Pressable>
          </View>
        )}

        {finished && (
          <View style={[styles.card, styles.celebrate]}>
            <Text style={styles.celebrateTitle}>You did it, {childName}!</Text>
            <Text style={styles.cardBody}>
              “{lesson.title}” is complete. Meadow is proud of your careful work.
            </Text>
            <Pressable style={styles.next} onPress={onBack}>
              <Text style={styles.nextText}>Back to lessons</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.paBox}>
          <Text style={styles.paLabel}>PA alignment</Text>
          <Text style={styles.paText}>{lesson.pa.statuteSubjects.join(' · ')}</Text>
        </View>
      </ScrollView>

      <TutorFab onPress={() => setTutorOpen(true)} />
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
  mins: { fontFamily: fonts.body, color: colors.inkSoft },
  content: { padding: space.md, paddingBottom: 120, gap: space.sm },
  kicker: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1.2,
    color: colors.sky,
  },
  title: { fontFamily: fonts.display, fontSize: 32, color: colors.ink, lineHeight: 38 },
  summary: { fontFamily: fonts.body, fontSize: 16, color: colors.inkSoft, lineHeight: 24 },
  progressTrack: {
    height: 8,
    backgroundColor: colors.paperDeep,
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: space.sm,
  },
  progressFill: { height: 8, backgroundColor: colors.meadow },
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
