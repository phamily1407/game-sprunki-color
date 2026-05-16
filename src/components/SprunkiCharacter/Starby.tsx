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

export function Starby({ zones, onTapZone, size = 300 }: Props) {
  const character = CHARACTER_MAP['starby'];
  const h = Math.round(size * character.aspectRatio);

  return (
    <Svg width={size} height={h} viewBox={character.viewBox} accessibilityLabel="Starby">
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
      <Circle cx={70} cy={105} r={7} fill={colors.text} />
      <Circle cx={118} cy={105} r={7} fill={colors.text} />
      <Circle cx={73} cy={102} r={2.5} fill={colors.card} />
      <Circle cx={121} cy={102} r={2.5} fill={colors.card} />

      {/* Tiara gems */}
      <Circle cx={100} cy={58} r={4} fill={colors.card} opacity={0.6} />
      <Circle cx={88} cy={63} r={2.5} fill={colors.card} opacity={0.5} />
      <Circle cx={112} cy={63} r={2.5} fill={colors.card} opacity={0.5} />
    </Svg>
  );
}
