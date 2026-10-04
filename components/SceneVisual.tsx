import { StyleSheet, Text, View } from 'react-native';
import type { Exercise, Lesson } from '@/content/schema';
import type { TeachTurn } from '@/lib/agent/teachScript';
import { colors, fonts } from '@/lib/theme';

interface Props {
  lesson: Lesson;
  turn?: TeachTurn;
  exercise?: Exercise;
}

const RIBBONS: Partial<Record<TeachTurn['phase'], string>> = {
  greet: '👋 Hello!',
  review: '🧠 Remember?',
  teach: '👀 Watch',
  check: '💬 Your turn',
  exercise_intro: '🎮 Play break',
  exercise: '🎮 Play break',
  level_up: '💪 Stronger!',
  break: '🌀 Wiggle break',
  celebrate: '🎉 Finale',
};

/**
 * What the stage shows: the lesson spotlight for watching moments,
 * the live exercise content for play breaks. Big, glanceable, silent —
 * Meadow's voice carries the words, the stage carries the meaning.
 */
export function SceneVisual({ lesson, turn, exercise }: Props) {
  const ribbon = (turn && RIBBONS[turn.phase]) || null;

  let body: string | null = null;
  if (exercise) {
    if (exercise.kind === 'math' && exercise.visual) body = exercise.visual;
    else if (exercise.kind === 'listen-say') body = `🔊 ${exercise.phrase}`;
    else if (exercise.kind === 'sequence') body = '🔀 First → Next → Last';
    else if (exercise.kind === 'drawing') body = '🖍️';
    else body = lesson.spotlight ?? null;
  } else {
    body = lesson.spotlight ?? null;
  }

  return (
    <View style={styles.wrap}>
      {!!ribbon && <Text style={styles.ribbon}>{ribbon}</Text>}
      {!!body && (
        <Text style={styles.body} numberOfLines={3}>
          {body}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 4 },
  ribbon: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.white,
    backgroundColor: colors.ink,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    overflow: 'hidden',
  },
  body: { fontSize: 44, textAlign: 'center', lineHeight: 56 },
});
