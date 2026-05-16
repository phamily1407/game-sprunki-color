import React from 'react';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { Path } from 'react-native-svg';
import type { PaintColor } from '../constants/colorMap';
import { COLOR_MAP } from '../constants/colorMap';
import { colors } from '../constants/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
  id: string;
  path: string;
  label: string;
  paintedColor: PaintColor | null;
  onTap: (zoneId: string) => void;
}

export function ZoneOverlay({ id, path, label, paintedColor, onTap }: Props) {
  const fill = paintedColor ? COLOR_MAP[paintedColor].hex : colors.zone.unpainted;
  const fillOpacity = useSharedValue(1);

  const animatedProps = useAnimatedProps(() => ({
    fillOpacity: fillOpacity.value,
  }));

  // F-08: bounce feedback — quick dim then spring back
  const handlePress = () => {
    fillOpacity.value = withSequence(
      withTiming(0.45, { duration: 70 }),
      withSpring(1, { damping: 6, stiffness: 200 })
    );
    onTap(id);
  };

  return (
    <AnimatedPath
      animatedProps={animatedProps}
      d={path}
      fill={fill}
      stroke={colors.zone.outline}
      strokeWidth={2}
      onPress={handlePress}
      accessibilityLabel={label}
      accessibilityRole="button"
    />
  );
}
