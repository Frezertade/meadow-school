import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, space } from '@/lib/theme';

interface Props {
  streakDays: number;
  lessonsCompleted: number;
  bestStreakCorrect: number;
  childName: string;
}

export function BadgePanel({ streakDays, lessonsCompleted, bestStreakCorrect, childName }: Props) {
  const badges = [];
  if (lessonsCompleted >= 1) badges.push('🌱 First sprout');
  if (streakDays >= 3) badges.push('🔥 3-day streak');
  if (streakDays >= 7) badges.push('⭐ 7-day streak');
  if (bestStreakCorrect >= 5) badges.push('💚 Steady 5');
  if (bestStreakCorrect >= 10) badges.push('🎯 Focus master');
  if (badges.length === 0) badges.push('Keep going — your first badge is near!');
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{childName}'s badges</Text>
      {badges.map((b, i) => (
        <Text key={i} style={styles.badge}>{b}</Text>
      ))}
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
  label: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.meadow },
  badge: { fontFamily: fonts.body, fontSize: 15, color: colors.ink, lineHeight: 24 },
});
