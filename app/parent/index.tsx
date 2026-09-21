import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { curriculumBands } from '@/content';
import { PA_ELEMENTARY_SUBJECTS, PA_NOTES } from '@/content/pa-alignment';
import type { AgeBand } from '@/content/schema';
import { colors, fonts, radii, space } from '@/lib/theme';
import { useAppStore } from '@/lib/store';

const BANDS: { id: AgeBand; label: string }[] = [
  { id: 'ages-3-4', label: 'Ages 3–4' },
  { id: 'ages-5', label: 'Age 5' },
  { id: 'ages-6-7', label: 'Ages 6–7' },
];

export default function ParentScreen() {
  const insets = useSafeAreaInsets();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [needsSetup, setNeedsSetup] = useState(false);
  const parentUnlocked = useAppStore((s) => s.parentUnlocked);
  const setParentUnlocked = useAppStore((s) => s.setParentUnlocked);
  const children = useAppStore((s) => s.children);
  const renameChild = useAppStore((s) => s.renameChild);
  const setChildBand = useAppStore((s) => s.setChildBand);
  const completed = useAppStore((s) => s.completed);
  const verifyPin = useAppStore((s) => s.verifyPin);
  const hasPin = useAppStore((s) => s.hasPin);
  const ensurePin = useAppStore((s) => s.ensurePin);

  useEffect(() => {
    hasPin().then((exists) => setNeedsSetup(!exists));
  }, [hasPin]);

  const unlock = async () => {
    if (pin.length < 4) {
      setError('Use at least 4 digits.');
      return;
    }
    const ok = await verifyPin(pin);
    if (!ok) {
      setError('That PIN does not match.');
      return;
    }
    if (needsSetup) await ensurePin(pin);
    setError('');
    setParentUnlocked(true);
  };

  const lock = () => {
    setParentUnlocked(false);
    setPin('');
    router.back();
  };

  if (!parentUnlocked) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + space.lg }]}>
        <Text style={styles.title}>Parent gate</Text>
        <Text style={styles.lede}>
          {needsSetup
            ? 'Create a PIN so kids cannot change settings.'
            : 'Enter your PIN to open the parent desk.'}
        </Text>
        <TextInput
          style={styles.pin}
          value={pin}
          onChangeText={setPin}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={8}
          placeholder="PIN"
          placeholderTextColor={colors.inkSoft}
        />
        {!!error && <Text style={styles.error}>{error}</Text>}
        <Pressable style={styles.primary} onPress={unlock}>
          <Text style={styles.primaryText}>{needsSetup ? 'Save PIN' : 'Unlock'}</Text>
        </Pressable>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>Back to kids</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingTop: insets.top + space.md, padding: space.md, gap: space.md, paddingBottom: 60 }}
    >
      <View style={styles.row}>
        <Text style={styles.title}>Parent desk</Text>
        <Pressable onPress={lock}>
          <Text style={styles.link}>Lock</Text>
        </Pressable>
      </View>
      <Text style={styles.lede}>
        Private family app. Meadow answers only from each lesson’s grounding text. No ads, no social, no outbound links for kids.
      </Text>

      {children.map((c) => (
        <View key={c.id} style={styles.card}>
          <Text style={styles.cardLabel}>Child</Text>
          <TextInput
            style={styles.nameInput}
            value={c.name}
            onChangeText={(t) => renameChild(c.id, t)}
          />
          <Text style={styles.cardLabel}>Age band</Text>
          <View style={styles.bandRow}>
            {BANDS.map((b) => (
              <Pressable
                key={b.id}
                style={[styles.bandChip, c.ageBand === b.id && styles.bandChipOn]}
                onPress={() => setChildBand(c.id, b.id)}
              >
                <Text
                  style={[styles.bandChipText, c.ageBand === b.id && styles.bandChipTextOn]}
                >
                  {b.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.progress}>
            Progress keys stored:{' '}
            {Object.keys(completed).filter((k) => k.startsWith(c.id)).length} lesson records
          </Text>
        </View>
      ))}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pennsylvania map</Text>
        <Text style={styles.body}>{PA_NOTES.compulsoryAge}</Text>
        <Text style={[styles.body, { marginTop: 8 }]}>{PA_NOTES.statute}</Text>
        <Text style={[styles.body, { marginTop: 8 }]}>
          Elementary subjects to cover once a legal program runs:
        </Text>
        {PA_ELEMENTARY_SUBJECTS.map((s) => (
          <Text key={s} style={styles.bullet}>
            · {s}
          </Text>
        ))}
        <Text style={[styles.body, { marginTop: 12 }]}>
          Lessons in-app ({curriculumBands.reduce((n, b) => n + b.lessons.length, 0)} now) tag
          statute subjects so your portfolio log stays honest.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper, padding: space.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontFamily: fonts.display, fontSize: 32, color: colors.ink },
  lede: { fontFamily: fonts.body, fontSize: 16, color: colors.inkSoft, lineHeight: 24 },
  pin: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: space.md,
    fontSize: 28,
    letterSpacing: 8,
    textAlign: 'center',
    fontFamily: fonts.bodyBold,
    borderWidth: 1,
    borderColor: colors.paperDeep,
    marginTop: space.md,
  },
  error: { fontFamily: fonts.body, color: colors.danger },
  primary: {
    backgroundColor: colors.ink,
    borderRadius: radii.pill,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: space.sm,
  },
  primaryText: { fontFamily: fonts.bodyBold, color: colors.white, fontSize: 16 },
  link: { fontFamily: fonts.bodyBold, color: colors.meadow, fontSize: 16, textAlign: 'center', marginTop: space.md },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.paperDeep,
    gap: 8,
  },
  cardLabel: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.inkSoft, letterSpacing: 0.6 },
  cardTitle: { fontFamily: fonts.displaySoft, fontSize: 22, color: colors.ink },
  nameInput: {
    fontFamily: fonts.bodyBold,
    fontSize: 20,
    color: colors.ink,
    borderBottomWidth: 1,
    borderBottomColor: colors.paperDeep,
    paddingVertical: 6,
  },
  bandRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bandChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.paperDeep,
  },
  bandChipOn: { backgroundColor: colors.meadow },
  bandChipText: { fontFamily: fonts.bodyBold, color: colors.ink, fontSize: 13 },
  bandChipTextOn: { color: colors.white },
  progress: { fontFamily: fonts.body, fontSize: 13, color: colors.inkSoft },
  body: { fontFamily: fonts.body, fontSize: 15, color: colors.inkSoft, lineHeight: 22 },
  bullet: { fontFamily: fonts.body, fontSize: 14, color: colors.ink, lineHeight: 22 },
});
