import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { colors, sizes } from '../constants/theme';
import { PAINT_COLORS, COLOR_MAP, type PaintColor } from '../constants/colorMap';

interface Props {
  activeColors: Set<PaintColor>;
}

function Bar({ color, active }: { color: PaintColor; active: boolean }) {
  const height = useSharedValue(8);
  const def = COLOR_MAP[color];

  useEffect(() => {
    if (active) {
      height.value = withRepeat(
        withSequence(
          withTiming(36 + Math.random() * 20, { duration: 300 + Math.random() * 200, easing: Easing.inOut(Easing.quad) }),
          withTiming(8 + Math.random() * 12, { duration: 300 + Math.random() * 200, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(height);
      height.value = withTiming(8, { duration: 300 });
    }
  }, [active]);

  const animStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <Animated.View
      style={[
        styles.bar,
        { backgroundColor: active ? def.hex : colors.zone.unpainted },
        animStyle,
      ]}
    />
  );
}

export function MusicVisualizer({ activeColors }: Props) {
  return (
    <View style={styles.container}>
      {PAINT_COLORS.map((color) => (
        <Bar key={color} color={color} active={activeColors.has(color)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 60,
    gap: 6,
    paddingHorizontal: sizes.spacing.md,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bar: {
    width: 18,
    borderRadius: 4,
    minHeight: 8,
  },
});
