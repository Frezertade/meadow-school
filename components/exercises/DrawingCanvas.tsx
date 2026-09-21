import { useCallback, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts, radii, space } from '@/lib/theme';

type Point = { x: number; y: number };

function pointsToPath(points: Point[]): string {
  if (!points.length) return '';
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');
}

interface Props {
  prompt: string;
  instruction: string;
  onComplete: () => void;
  successMessage: string;
}

export function DrawingCanvas({ prompt, instruction, onComplete, successMessage }: Props) {
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [current, setCurrent] = useState<Point[]>([]);
  const [size, setSize] = useState({ w: 300, h: 280 });
  const [done, setDone] = useState(false);
  const currentRef = useRef<Point[]>([]);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ w: width, h: height });
  };

  const finishStroke = useCallback(() => {
    if (currentRef.current.length > 1) {
      setStrokes((s) => [...s, currentRef.current]);
    }
    currentRef.current = [];
    setCurrent([]);
  }, []);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentRef.current = [{ x: locationX, y: locationY }];
        setCurrent([...currentRef.current]);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentRef.current = [...currentRef.current, { x: locationX, y: locationY }];
        setCurrent([...currentRef.current]);
      },
      onPanResponderRelease: finishStroke,
      onPanResponderTerminate: finishStroke,
    })
  ).current;

  const clear = () => {
    setStrokes([]);
    setCurrent([]);
    currentRef.current = [];
    setDone(false);
  };

  const markDone = () => {
    setDone(true);
    onComplete();
  };

  const hasInk = strokes.length > 0 || current.length > 1;

  return (
    <View style={styles.wrap}>
      <Text style={styles.instruction}>{instruction}</Text>
      <Text style={styles.prompt}>{prompt}</Text>
      <View style={styles.canvas} onLayout={onLayout} {...pan.panHandlers}>
        <Svg width={size.w} height={size.h}>
          {strokes.map((stroke, i) => (
            <Path
              key={`s-${i}`}
              d={pointsToPath(stroke)}
              stroke={colors.ink}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {current.length > 0 && (
            <Path
              d={pointsToPath(current)}
              stroke={colors.meadow}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </Svg>
        {!hasInk && (
          <Text style={styles.placeholder} pointerEvents="none">
            Draw here with your finger
          </Text>
        )}
      </View>
      <View style={styles.row}>
        <Pressable style={styles.secondary} onPress={clear}>
          <Text style={styles.secondaryText}>Clear</Text>
        </Pressable>
        <Pressable
          style={[styles.primary, !hasInk && styles.disabled]}
          disabled={!hasInk}
          onPress={markDone}
        >
          <Text style={styles.primaryText}>{done ? 'Saved!' : "I'm done"}</Text>
        </Pressable>
      </View>
      {done && <Text style={styles.success}>{successMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm },
  instruction: {
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    color: colors.ink,
  },
  prompt: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.inkSoft,
    lineHeight: 24,
  },
  canvas: {
    height: 280,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.paperDeep,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    position: 'absolute',
    fontFamily: fonts.body,
    color: colors.inkSoft,
    opacity: 0.45,
    fontSize: 16,
  },
  row: { flexDirection: 'row', gap: space.sm, marginTop: space.xs },
  primary: {
    flex: 1,
    backgroundColor: colors.meadow,
    paddingVertical: 14,
    borderRadius: radii.pill,
    alignItems: 'center',
  },
  primaryText: { fontFamily: fonts.bodyBold, color: colors.white, fontSize: 16 },
  secondary: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: radii.pill,
    backgroundColor: colors.paperDeep,
  },
  secondaryText: { fontFamily: fonts.bodyBold, color: colors.ink, fontSize: 16 },
  disabled: { opacity: 0.4 },
  success: {
    fontFamily: fonts.displaySoft,
    fontSize: 18,
    color: colors.success,
    marginTop: space.xs,
  },
});
