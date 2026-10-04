import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const COUNT = 12;

function StarParticle({ angle, delay }: { angle: number; delay: number }) {
  const p = useSharedValue(0);

  useEffect(() => {
    p.value = withDelay(delay, withTiming(1, { duration: 650 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dist = 95 + (angle % 3) * 18;
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: p.value * dist * Math.cos(angle) },
      { translateY: p.value * dist * Math.sin(angle) },
      { scale: 1 - p.value * 0.35 },
    ],
    opacity: 1 - p.value,
  }));

  return <Animated.Text style={[styles.star, style]}>⭐</Animated.Text>;
}

/** One-shot celebration burst — mounted when the finale starts. */
export function StarBurst() {
  return (
    <View style={styles.field} pointerEvents="none">
      {Array.from({ length: COUNT }, (_, i) => (
        <StarParticle key={i} angle={(i / COUNT) * Math.PI * 2} delay={i * 45} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: { position: 'absolute', fontSize: 26 },
});
