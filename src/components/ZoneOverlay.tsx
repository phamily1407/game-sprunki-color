import React, { useState } from 'react';
import { Circle, Ellipse, Path } from 'react-native-svg';
import type { PaintColor } from '../constants/colorMap';
import type { ZoneDefinition } from '../constants/characters';
import { COLOR_MAP } from '../constants/colorMap';
import { colors } from '../constants/theme';

interface Props {
  zone: ZoneDefinition;
  paintedColor: PaintColor | null;
  onTap: (zoneId: string) => void;
}

export function ZoneOverlay({ zone, paintedColor, onTap }: Props) {
  const [pressed, setPressed] = useState(false);

  const fill = paintedColor ? COLOR_MAP[paintedColor].hex : colors.zone.unpainted;
  const opacity = pressed ? 0.45 : 1;

  const sharedProps = {
    fill,
    stroke: colors.zone.outline,
    strokeWidth: 2,
    opacity,
    onPressIn: () => setPressed(true),
    onPressOut: () => setPressed(false),
    onPress: () => onTap(zone.id),
    accessibilityLabel: zone.label,
    accessibilityRole: 'button' as const,
  };

  const { shape } = zone;

  if (shape.kind === 'circle') {
    return <Circle {...sharedProps} cx={shape.cx} cy={shape.cy} r={shape.r} />;
  }
  if (shape.kind === 'ellipse') {
    return <Ellipse {...sharedProps} cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} />;
  }
  return <Path {...sharedProps} d={shape.d} />;
}
