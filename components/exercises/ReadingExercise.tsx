import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ReadingExercise as ReadingExerciseType } from '@/content/schema';
import { colors, fonts, radii, space } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { meadowSpeak, unlockVoice } from '@/lib/voice/meadowVoice';
import { narrateCorrect, narrateWrong } from '@/lib/voice/scripts';

interface Props {
  exercise: ReadingExerciseType;
  childName: string;
  onComplete: () => void;
}

export function ReadingExercise({ exercise, childName, onComplete }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const voiceEnabled = useAppStore((s) => s.voiceEnabled);

  const choose = async (choice: string) => {
    unlockVoice();
    setSelected(choice);
    // Speak the tapped choice (letter / word)
    if (voiceEnabled) {
      await meadowSpeak(choice.length === 1 ? `You chose letter ${choice}` : `You chose ${choice}`, {
        enabled: true,
        rate: 0.9,
      });
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
      <Pressable
        style={styles.promptCard}
        onPress={() => {
          unlockVoice();
          if (voiceEnabled) meadowSpeak(`${exercise.instruction}. ${exercise.prompt}`, { enabled: true });
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
  tapHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: 6,
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
