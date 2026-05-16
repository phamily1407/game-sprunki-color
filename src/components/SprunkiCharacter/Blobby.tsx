import React from 'react';
import Svg, { Circle, Path, G } from 'react-native-svg';
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

const VIEWBOX = '0 0 200 280';

export function Blobby({ zones, onTapZone, size = 300 }: Props) {
  const character = CHARACTER_MAP['blobby'];

  return (
    <Svg
      width={size}
      height={size * 1.4}
      viewBox={VIEWBOX}
      accessibilityLabel="Blobby the blob character"
    >
      <G>
        {character.zones.map((zone) => (
          <ZoneOverlay
            key={zone.id}
            id={zone.id}
            path={zone.path}
            label={zone.label}
            paintedColor={(zones[zone.id] as PaintColor | null) ?? null}
            onTap={onTapZone}
          />
        ))}
      </G>

      {/* W-06: use theme colors — no hardcoded hex */}
      <Circle cx="84" cy="76" r="9" fill={colors.text} />
      <Circle cx="116" cy="76" r="9" fill={colors.text} />
      <Circle cx="87" cy="73" r="3" fill={colors.card} />
      <Circle cx="119" cy="73" r="3" fill={colors.card} />

      <Path
        d="M86,96 Q100,108 114,96"
        stroke={colors.text}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
