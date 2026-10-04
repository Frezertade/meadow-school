import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MathExercise as MathExerciseType } from '@/content/schema';
import { colors, fonts, radii, space } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { meadowSpeak, unlockVoice } from '@/lib/voice/meadowVoice';
import { narrateCorrect, narrateWrong } from '@/lib/voice/scripts';

interface Props {
  exercise: MathExerciseType;
  childName: string;
  onComplete: () => void;
}

export function MathExercise({ exercise, childName, onComplete }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const voiceEnabled = useAppStore((s) => s.voiceEnabled);

  const choose = async (choice: string) => {
    unlockVoice();
    setSelected(choice);
    if (voiceEnabled) {
      await meadowSpeak(`You chose ${choice}`, { enabled: true, rate: 0.9 });
    }
    if (choice === exercise.answer) {
      setStatus('correct');
      onComplete();
      if (voiceEnabled) await meadowSpeak(narrateCorrect(childName), { enabled: true });
    } else {
      setStatus('wrong');
      if (voiceEnabled) await meadowSpeak(narrateWrong(exercise.hint), { enabled: true });
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.instruction}>{exercise.instruction}</Text>
      {!!exercise.visual && <Text style={styles.visual}>{exercise.visual}</Text>}
      <Pressable
        onPress={() => {
          unlockVoice();
          if (voiceEnabled) {
            meadowSpeak(`${exercise.instruction}. ${exercise.prompt}. Choices: ${exercise.choices.join(', ')}`, {
              enabled: true,
            });
          }
        }}
      >
        <Text style={styles.prompt}>{exercise.prompt}</Text>
        <Text style={styles.tapHint}>Tap to hear the question</Text>
      </Pressable>
      <View style={styles.choices}>
        {exercise.choices.map((choice) => {
          const isSel = selected === choice;
          const correct = status === 'correct' && choice === exercise.answer;
          const wrong = status === 'wrong' && isSel;
          return (
            <Pressable
              key={choice}
              onPress={() => choose(choice)}
              accessibilityRole="button"
              accessibilityLabel={`Answer: ${choice}`}
              accessibilityState={{ selected: isSel }}
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
  prompt: { fontFamily: fonts.displaySoft, fontSize: 22, color: colors.meadow, textAlign: 'center' },
  tapHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkSoft,
    textAlign: 'center',
    marginBottom: space.xs,
  },
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
