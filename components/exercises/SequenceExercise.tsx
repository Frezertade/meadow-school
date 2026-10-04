import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SequenceExercise as SequenceExerciseType } from '@/content/schema';
import { colors, fonts, radii, space } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { meadowSpeak, unlockVoice } from '@/lib/voice/meadowVoice';
import { narrateCorrect, narrateWrong } from '@/lib/voice/scripts';

interface Props {
  exercise: SequenceExerciseType;
  childName: string;
  onComplete: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // Guarantee the shuffle is not already solved so the child must think
  if (a.length > 1 && a.every((v, i) => v === arr[i])) {
    [a[0], a[a.length - 1]] = [a[a.length - 1], a[0]];
  }
  return a;
}

export function SequenceExercise({ exercise, childName, onComplete }: Props) {
  // Shuffle once per exercise — never reshuffle under tapping fingers
  const offered = useMemo(() => shuffle(exercise.items), [exercise]);
  const [picked, setPicked] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const voiceEnabled = useAppStore((s) => s.voiceEnabled);

  const remaining = offered.filter((item) => !picked.includes(item));

  const tap = async (item: string) => {
    unlockVoice();
    const next = [...picked, item];
    setPicked(next);
    setStatus('idle');
    if (voiceEnabled) await meadowSpeak(item, { enabled: true, rate: 0.9 });
    if (next.length === exercise.items.length) {
      const right = next.every((v, i) => v === exercise.answer[i]);
      if (right) {
        setStatus('correct');
        onComplete();
        if (voiceEnabled) await meadowSpeak(narrateCorrect(childName), { enabled: true });
      } else {
        setStatus('wrong');
        if (voiceEnabled) await meadowSpeak(narrateWrong(exercise.hint), { enabled: true });
        setPicked([]);
      }
    }
  };

  const undo = () => {
    unlockVoice();
    setPicked((p) => p.slice(0, -1));
    setStatus('idle');
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.instruction}>{exercise.instruction}</Text>
      <Text style={styles.prompt}>{exercise.prompt}</Text>

      <Text style={styles.zoneLabel}>Your order ({picked.length}/{exercise.items.length})</Text>
      <View style={styles.zone}>
        {picked.length === 0 && (
          <Text style={styles.zoneEmpty}>Tap the steps below, first to last.</Text>
        )}
        {picked.map((item, i) => (
          <View key={`${item}-${i}`} style={styles.slot}>
            <Text style={styles.slotNum}>{i + 1}</Text>
            <Text style={styles.slotText}>{item}</Text>
          </View>
        ))}
      </View>
      {picked.length > 0 && status !== 'correct' && (
        <Pressable
          style={styles.undo}
          onPress={undo}
          accessibilityRole="button"
          accessibilityLabel="Undo last step"
        >
          <Text style={styles.undoText}>↩ Undo last</Text>
        </Pressable>
      )}

      <Text style={styles.zoneLabel}>Choices</Text>
      <View style={styles.choices}>
        {remaining.map((item) => (
          <Pressable
            key={item}
            onPress={() => tap(item)}
            accessibilityRole="button"
            accessibilityLabel={`Place step: ${item}`}
            style={styles.choice}
          >
            <Text style={styles.choiceText}>{item}</Text>
          </Pressable>
        ))}
      </View>

      {status === 'wrong' && (
        <Text style={styles.hint}>Not that order. Hint: {exercise.hint}</Text>
      )}
      {status === 'correct' && (
        <Text style={styles.ok}>Perfect order!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm },
  instruction: { fontFamily: fonts.bodyBold, fontSize: 18, color: colors.ink },
  prompt: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.ink,
    textAlign: 'center',
  },
  zoneLabel: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.inkSoft },
  zone: {
    gap: 6,
    backgroundColor: colors.skySoft,
    borderRadius: radii.md,
    padding: space.sm,
    minHeight: 64,
  },
  zoneEmpty: { fontFamily: fonts.body, fontSize: 14, color: colors.inkSoft, textAlign: 'center' },
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  slotNum: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.white,
    backgroundColor: colors.meadow,
    borderRadius: 999,
    width: 26,
    height: 26,
    textAlign: 'center',
    lineHeight: 26,
  },
  slotText: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.ink, flexShrink: 1 },
  undo: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 12 },
  undoText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.meadow },
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
  hint: { fontFamily: fonts.body, color: colors.inkSoft, fontSize: 15 },
  ok: { fontFamily: fonts.bodyBold, color: colors.success, fontSize: 16 },
});
