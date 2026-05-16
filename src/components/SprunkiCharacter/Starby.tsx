import React from 'react';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { ZoneOverlay } from '../ZoneOverlay';
import { CHARACTER_MAP } from '../../constants/characters';
import type { ZoneState } from '../../hooks/useStorage';
import type { PaintColor } from '../../constants/colorMap';

interface Props {
  zones: ZoneState;
  onTapZone: (zoneId: string) => void;
  size?: number;
}

const VIEWBOX = '0 0 200 210';

export function Starby({ zones, onTapZone, size = 300 }: Props) {
  const character = CHARACTER_MAP['starby'];

  return (
    <Svg
      width={size}
      height={size * 1.05}
      viewBox={VIEWBOX}
      accessibilityLabel="Starby the star character"
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

      {/* Eyes are included as zones (leftEyeZone / rightEyeZone) */}
      {/* Smile */}
      <Path
        d="M90,118 Q100,126 110,118"
        stroke="#2D1B00"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
