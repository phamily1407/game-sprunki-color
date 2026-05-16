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

export function Blobby({ zones, onTapZone, size = 300 }: Props) {
  const character = CHARACTER_MAP['blobby'];
  const h = Math.round(size * character.aspectRatio);

  return (
    <Svg width={size} height={h} viewBox={character.viewBox} accessibilityLabel="Blobby">
      {/* Zones rendered bottom to top: face first, accessories last */}
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

      {/* Decorative pupils — not paintable */}
      <Circle cx={62} cy={103} r={8} fill={colors.text} />
      <Circle cx={126} cy={103} r={8} fill={colors.text} />
      <Circle cx={65} cy={100} r={3} fill={colors.card} />
      <Circle cx={129} cy={100} r={3} fill={colors.card} />

      {/* Bow knot highlight */}
      <Circle cx={100} cy={46} r={4} fill={colors.card} opacity={0.6} />
    </Svg>
  );
}
