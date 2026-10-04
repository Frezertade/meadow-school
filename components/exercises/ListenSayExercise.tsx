import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ListenSayExercise as ListenSayExerciseType } from '@/content/schema';
import { colors, fonts, radii, space } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { meadowSpeak, unlockVoice } from '@/lib/voice/meadowVoice';
import { canListen, listenOnce, stopListening } from '@/lib/voice/listen';
import { narrateCorrect, narrateWrong } from '@/lib/voice/scripts';

interface Props {
  exercise: ListenSayExerciseType;
  childName: string;
  onComplete: () => void;
  onWrong?: () => void;
}

export function ListenSayExercise({ exercise, childName, onComplete, onWrong }: Props) {
  const [heard, setHeard] = useState(false);
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const voiceEnabled = useAppStore((s) => s.voiceEnabled);
  const micAvailable = canListen();

  const hear = async () => {
    unlockVoice();
    setHeard(true);
    setStatus('idle');
    await meadowSpeak(`Listen: ${exercise.phrase}. Now you say it!`, { enabled: true });
  };

  const finish = async (ok: boolean) => {
    if (ok) {
      setStatus('correct');
      onComplete();
      if (voiceEnabled) await meadowSpeak(narrateCorrect(childName), { enabled: true });
    } else {
      setStatus('wrong');
      onWrong?.();
      if (voiceEnabled) await meadowSpeak(narrateWrong(exercise.hint), { enabled: true });
    }
  };

  const sayIt = async () => {
    unlockVoice();
    if (!micAvailable) return;
    setListening(true);
    setStatus('idle');
    try {
      const transcript = await listenOnce();
      const said = transcript.toLowerCase();
      const accepted = exercise.accept ?? exercise.phrase.toLowerCase().split(/\s+/);
      const ok = accepted.some((w) => w && said.includes(w.toLowerCase()));
      await finish(ok);
    } finally {
      stopListening();
      setListening(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.instruction}>{exercise.instruction}</Text>
      <Text style={styles.prompt}>{exercise.phrase}</Text>

      <Pressable
        style={styles.hear}
        onPress={hear}
        accessibilityRole="button"
        accessibilityLabel={`Hear Meadow say ${exercise.phrase}`}
      >
        <Text style={styles.hearText}>🔊 Hear it</Text>
      </Pressable>

      {heard && micAvailable && (
        <Pressable
          style={styles.mic}
          onPress={sayIt}
          disabled={listening}
          accessibilityRole="button"
          accessibilityLabel={`Say ${exercise.phrase} into the microphone`}
        >
          {listening ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.micText}>🎤 Say “{exercise.phrase}”</Text>
          )}
        </Pressable>
      )}

      {heard && (
        <Pressable
          style={styles.said}
          onPress={() => finish(true)}
          accessibilityRole="button"
          accessibilityLabel="I said it, mark complete"
        >
          <Text style={styles.saidText}>✅ I said it!</Text>
        </Pressable>
      )}
      {!micAvailable && (
        <Text style={styles.note}>
          No microphone here — tap Hear it, say it out loud, then tap I said it!
        </Text>
      )}

      {status === 'wrong' && (
        <Text style={styles.hint}>Good try! Hint: {exercise.hint}</Text>
      )}
      {status === 'correct' && (
        <Text style={styles.ok}>Wonderful speaking!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm },
  instruction: { fontFamily: fonts.bodyBold, fontSize: 18, color: colors.ink },
  prompt: {
    fontFamily: fonts.display,
    fontSize: 30,
    color: colors.ink,
    textAlign: 'center',
  },
  hear: {
    backgroundColor: colors.skySoft,
    borderRadius: radii.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  hearText: { fontFamily: fonts.bodyBold, fontSize: 18, color: colors.ink },
  mic: {
    backgroundColor: colors.meadow,
    borderRadius: radii.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  micText: { fontFamily: fonts.bodyBold, fontSize: 18, color: colors.white },
  said: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.paperDeep,
    borderRadius: radii.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saidText: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.ink },
  note: { fontFamily: fonts.body, fontSize: 14, color: colors.inkSoft, textAlign: 'center' },
  hint: { fontFamily: fonts.body, color: colors.inkSoft, fontSize: 15 },
  ok: { fontFamily: fonts.bodyBold, color: colors.success, fontSize: 16 },
});
