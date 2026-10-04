import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, space } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import {
  canUseSpeech,
  unlockAndSpeakNow,
  unlockVoice,
} from '@/lib/voice/meadowVoice';

interface Props {
  onHearAgain: () => void;
  label?: string;
  /** Spoken immediately on tap (same gesture) before optional async follow-up */
  immediateLine?: string;
}

/** Always-visible Meadow voice controls for kid-driven flow. */
export function VoiceBar({
  onHearAgain,
  label = 'Hear Meadow again',
  immediateLine = "Hi! I'm Meadow. I will read for you.",
}: Props) {
  const voiceEnabled = useAppStore((s) => s.voiceEnabled);
  const setVoiceEnabled = useAppStore((s) => s.setVoiceEnabled);
  const [status, setStatus] = useState('');

  const hear = () => {
    if (!canUseSpeech()) {
      setStatus('Voice is not supported in this browser. Try Chrome or Safari on this device.');
      return;
    }
    if (!voiceEnabled) {
      setVoiceEnabled(true);
    }
    setStatus('Meadow is talking… turn volume up if needed.');
    // Speak immediately in this tap (browser requirement)
    unlockAndSpeakNow(immediateLine);
    // Continue full script after the short greeting without canceling mid-word too soon
    setTimeout(() => {
      unlockVoice();
      onHearAgain();
    }, 1600);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Pressable
          style={styles.primary}
          onPress={hear}
          accessibilityLabel={label}
        >
          <Text style={styles.primaryText}>🔊 {label}</Text>
        </Pressable>
        <Pressable
          style={styles.secondary}
          onPress={() => {
            unlockVoice();
            setVoiceEnabled(!voiceEnabled);
            setStatus(voiceEnabled ? 'Muted' : 'Voice on');
          }}
          accessibilityLabel={voiceEnabled ? 'Mute Meadow' : 'Unmute Meadow'}
        >
          <Text style={styles.secondaryText}>{voiceEnabled ? 'Mute' : 'Unmute'}</Text>
        </Pressable>
      </View>
      {!!status && <Text style={styles.status}>{status}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  row: { flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' },
  primary: {
    flexGrow: 1,
    backgroundColor: colors.honey,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    alignItems: 'center',
  },
  primaryText: { fontFamily: fonts.bodyBold, color: colors.ink, fontSize: 16 },
  secondary: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    backgroundColor: colors.paperDeep,
  },
  secondaryText: { fontFamily: fonts.bodyBold, color: colors.inkSoft, fontSize: 14 },
  status: { fontFamily: fonts.body, fontSize: 13, color: colors.meadow },
});
