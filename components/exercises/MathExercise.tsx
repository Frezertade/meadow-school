import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MathExercise as MathExerciseType } from '@/content/schema';
import { colors, fonts, radii, space } from '@/lib/theme';

interface Props {
  exercise: MathExerciseType;
  onComplete: () => void;
}

export function MathExercise({ exercise, onComplete }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const choose = (choice: string) => {
    setSelected(choice);
    if (choice === exercise.answer) {
      setStatus('correct');
      onComplete();
    } else {
      setStatus('wrong');
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.instruction}>{exercise.instruction}</Text>
      {!!exercise.visual && <Text style={styles.visual}>{exercise.visual}</Text>}
      <Text style={styles.prompt}>{exercise.prompt}</Text>
      <View style={styles.choices}>
        {exercise.choices.map((choice) => {
          const isSel = selected === choice;
          const correct = status === 'correct' && choice === exercise.answer;
          const wrong = status === 'wrong' && isSel;
          return (
            <Pressable
              key={choice}
              onPress={() => choose(choice)}
              style={[
                styles.choice,
                correct && styles.correct,
                wrong && styles.wrong,
              ]}
            >
              <Text style={styles.choiceText}>{choice}</Text>
            </Pressable>
          );
        })}
      </View>
      {status === 'wrong' && (
        <Text style={styles.hint}>Hint: {exercise.hint}</Text>
      )}
      {status === 'correct' && (
        <Text style={styles.ok}>Yes! {exercise.answer} is right.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm },
  instruction: { fontFamily: fonts.bodyBold, fontSize: 18, color: colors.ink },
  visual: { fontSize: 36, letterSpacing: 4, textAlign: 'center', marginVertical: space.sm },
  prompt: { fontFamily: fonts.displaySoft, fontSize: 22, color: colors.meadow },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  choice: {
    minWidth: 88,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: radii.md,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.skySoft,
    alignItems: 'center',
  },
  choiceText: { fontFamily: fonts.bodyExtra, fontSize: 22, color: colors.ink },
  correct: { borderColor: colors.success, backgroundColor: '#E3F2E9' },
  wrong: { borderColor: colors.danger, backgroundColor: '#F8E8E5' },
  hint: { fontFamily: fonts.body, color: colors.inkSoft, fontSize: 15 },
  ok: { fontFamily: fonts.bodyBold, color: colors.success, fontSize: 16 },
});
