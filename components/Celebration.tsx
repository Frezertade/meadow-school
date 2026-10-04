import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, space } from '@/lib/theme';

interface Props {
  childName: string;
  lessonTitle: string;
  stars: number;
}

/** Big finish moment: every completed lesson ends in delight, not a form. */
export function Celebration({ childName, lessonTitle, stars }: Props) {
  return (
    <View style={styles.card} accessibilityRole="alert">
      <Text style={styles.burst}>🎉</Text>
      <Text style={styles.title}>You did it, {childName}!</Text>
      <Text style={styles.sub}>“{lessonTitle}” is finished.</Text>
      <Text style={styles.stars}>⭐ {stars} {stars === 1 ? 'star' : 'stars'} in your meadow</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: space.lg,
    borderWidth: 2,
    borderColor: colors.honey,
    alignItems: 'center',
    gap: 4,
  },
  burst: { fontSize: 56 },
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.ink, textAlign: 'center' },
  sub: { fontFamily: fonts.body, fontSize: 15, color: colors.inkSoft, textAlign: 'center' },
  stars: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.meadow, marginTop: 4 },
});
