import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, space } from '@/lib/theme';

interface Props {
  stars: number;
  childName: string;
}

/** A meadow that grows with finished lessons — visible progress in 2 taps. */
export function MeadowGarden({ stars, childName }: Props) {
  const garden =
    stars <= 0
      ? '🌱'
      : stars <= 2
        ? '🌱 🌱'
        : stars <= 5
          ? '🌱 🌷 🌱'
          : stars <= 9
            ? '🌷 🌻 🌱 🌷'
            : '🌻 🌷 🌼 🦋 🌻';
  const line =
    stars <= 0
      ? `${childName}'s meadow is waiting for its first seed — finish a lesson!`
      : stars === 1
        ? 'One star! Your meadow sprouted.'
        : `${stars} stars! Look how your meadow grows.`;
  return (
    <View style={styles.card}>
      <Text style={styles.label}>My meadow · ⭐ {stars}</Text>
      <Text style={styles.garden}>{garden}</Text>
      <Text style={styles.line}>{line}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.paperDeep,
    gap: 4,
    marginBottom: space.sm,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.meadow,
    letterSpacing: 1,
  },
  garden: { fontSize: 30, letterSpacing: 4 },
  line: { fontFamily: fonts.body, fontSize: 14, color: colors.inkSoft },
});
