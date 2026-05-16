import React from 'react';
import Svg, { Circle, Path, Ellipse } from 'react-native-svg';
import { ZoneOverlay } from '../ZoneOverlay';
import { CHARACTER_MAP } from '../../constants/characters';
import { colors } from '../../constants/theme';
import type { ZoneState } from '../../hooks/useStorage';
import type { PaintColor } from '../../constants/colorMap';

interface Props {
  zones: ZoneState;
  onTapZone: (zoneId: string) => void;
  size?: number;
}

export function Sprout({ zones, onTapZone, size = 300 }: Props) {
  const character = CHARACTER_MAP['sprout'];
  const h = Math.round(size * character.aspectRatio);

  return (
    <Svg width={size} height={h} viewBox={character.viewBox} accessibilityLabel="Sprout">
      {['face', 'hair', 'leftEye', 'rightEye', 'nose', 'mouth', 'accessory'].map((id) => {
        const zone = character.zones.find((z) => z.id === id);
        if (!zone) return null;
        return (
          <ZoneOverlay
            key={zone.id}
            zone={zone}
            paintedColor={(zones[zone.id] as PaintColor | null) ?? null}
            onTap={onTapZone}
          />
        );
      })}

      {/* Decorative pupils */}
      <Circle cx={68} cy={113} r={7} fill={colors.text} />
      <Circle cx={120} cy={113} r={7} fill={colors.text} />
      <Circle cx={71} cy={110} r={2.5} fill={colors.card} />
      <Circle cx={123} cy={110} r={2.5} fill={colors.card} />

      {/* Curious mouth blush */}
      <Circle cx={100} cy={148} r={3} fill={colors.blush} opacity={0.7} />

      {/* Flower center highlight */}
      <Circle cx={100} cy={38} r={5} fill={colors.card} opacity={0.5} />
    </Svg>
  );
}
