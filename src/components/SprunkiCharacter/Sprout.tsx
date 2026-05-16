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

export function Sprout({ zones, onTapZone, size = 300 }: Props) {
  const character = CHARACTER_MAP['sprout'];

  return (
    <Svg
      width={size}
      height={size * 1.4}
      viewBox={VIEWBOX}
      accessibilityLabel="Sprout the plant character"
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
      <Circle cx="86" cy="68" r="8" fill={colors.text} />
      <Circle cx="114" cy="68" r="8" fill={colors.text} />
      <Circle cx="89" cy="65" r="2.5" fill={colors.card} />
      <Circle cx="117" cy="65" r="2.5" fill={colors.card} />

      <Path
        d="M90,86 Q100,96 110,86"
        stroke={colors.text}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* colors.blush added to theme for this decorative element */}
      <Circle cx="100" cy="91" r="5" fill={colors.blush} opacity={0.5} />
    </Svg>
  );
}
