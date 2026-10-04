import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { MascotMood } from '@/lib/agent/director';

interface Props {
  mood: MascotMood;
  size?: number;
}

/**
 * Meadow herself: a blossom sprite whose body language IS the feedback.
 * Parents remount per mood (`key={mood}`) so each mood starts its own loop.
 */
export function MeadowMascot({ mood, size = 104 }: Props) {
  const y = useSharedValue(0);
  const r = useSharedValue(0);
  const s = useSharedValue(1);

  useEffect(() => {
    cancelAnimation(y);
    cancelAnimation(r);
    cancelAnimation(s);
    const loop = (v: number, ms: number) =>
      withRepeat(withSequence(withTiming(v, { duration: ms }), withTiming(0, { duration: ms })), -1, true);
    switch (mood) {
      case 'idle':
        y.value = loop(-6, 1600);
        break;
      case 'talk':
        y.value = loop(-4, 480);
        break;
      case 'cheer':
        y.value = withRepeat(withSequence(withTiming(-18, { duration: 260 }), withTiming(0, { duration: 260 })), -1);
        r.value = loop(6, 520);
        break;
      case 'celebrate':
        y.value = withRepeat(withSequence(withTiming(-30, { duration: 300 }), withTiming(0, { duration: 300 })), -1);
        s.value = withRepeat(withSequence(withTiming(1.12, { duration: 300 }), withTiming(1, { duration: 300 })), -1);
        break;
      case 'think':
        r.value = withRepeat(
          withSequence(
            withTiming(-8, { duration: 900, easing: Easing.inOut(Easing.ease) }),
            withTiming(8, { duration: 900, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
        s.value = 0.98;
        break;
      case 'nudge':
        s.value = withRepeat(withSequence(withTiming(1.08, { duration: 700 }), withTiming(1, { duration: 700 })), -1);
        y.value = withSpring(-8);
        break;
      case 'wiggle':
        r.value = withRepeat(withSequence(withTiming(-12, { duration: 220 }), withTiming(12, { duration: 220 })), -1, true);
        y.value = loop(-8, 440);
        break;
    }
    return () => {
      cancelAnimation(y);
      cancelAnimation(r);
      cancelAnimation(s);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }, { rotate: `${r.value}deg` }, { scale: s.value }],
  }));

  return <Animated.Text style={[styles.sprite, { fontSize: size }, style]}>🌼</Animated.Text>;
}

const styles = StyleSheet.create({
  sprite: { textAlign: 'center' },
});
