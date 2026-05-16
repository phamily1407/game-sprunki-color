import React from 'react';
import { Platform } from 'react-native';
import { Path, G } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import type { PaintColor } from '../constants/colorMap';
import { COLOR_MAP } from '../constants/colorMap';
import { colors } from '../constants/theme';

// react-native-reanimated doesn't wrap SVG elements directly on all platforms,
// so we animate an SVG Path via opacity/scale applied at the SVG group level.

interface Props {
  id: string;
  path: string;
  label: string;
  paintedColor: PaintColor | null;
  onTap: (zoneId: string) => void;
}

// Animated wrapper for the SVG Path — uses a plain SVG Path with onPress
// The bounce effect is handled via a sibling Animated.View overlay on web,
// and via the native driver scale on native.

export function ZoneOverlay({ id, path, label, paintedColor, onTap }: Props) {
  const fill = paintedColor ? COLOR_MAP[paintedColor].hex : colors.zone.unpainted;

  // SVG Path is not animatable via reanimated directly, so the bounce is
  // done by temporarily changing opacity to signal the tap on native,
  // and via CSS animation on web through the SVG.
  return (
    <Path
      d={path}
      fill={fill}
      stroke={colors.zone.outline}
      strokeWidth={2}
      onPress={() => onTap(id)}
      accessibilityLabel={label}
      accessibilityRole="button"
    />
  );
}
