import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ReadingExercise as ReadingExerciseType } from '@/content/schema';
import { colors, fonts, radii, space } from '@/lib/theme';

interface Props {
  exercise: ReadingExerciseType;
  onComplete: () => void;
}

export function ReadingExercise({ exercise, onComplete }: Props) {
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
      <View style={styles.promptCard}>
        <Text style={styles.prompt}>{exercise.prompt}</Text>
      </View>
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
        <Text style={styles.ok}>Nice reading!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm },
  instruction: { fontFamily: fonts.bodyBold, fontSize: 18, color: colors.ink },
  promptCard: {
    backgroundColor: colors.skySoft,
    borderRadius: radii.md,
    padding: space.md,
  },
  prompt: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.ink,
    textAlign: 'center',
  },
  choices: { gap: space.sm },
  choice: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: radii.md,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.paperDeep,
  },
  choiceText: { fontFamily: fonts.bodyBold, fontSize: 18, color: colors.ink },
  correct: { borderColor: colors.success, backgroundColor: '#E3F2E9' },
  wrong: { borderColor: colors.danger, backgroundColor: '#F8E8E5' },
  hint: { fontFamily: fonts.body, color: colors.inkSoft, fontSize: 15 },
  ok: { fontFamily: fonts.bodyBold, color: colors.success, fontSize: 16 },
});
