import React from 'react';
import { Blobby } from './Blobby';
import { Sprout } from './Sprout';
import { Starby } from './Starby';
import type { PaintColor } from '../../constants/colorMap';
import type { ZoneState } from '../../hooks/useStorage';

interface Props {
  characterId: string;
  zones: ZoneState;
  onTapZone: (zoneId: string) => void;
  size?: number;
}

export function SprunkiCharacter({ characterId, zones, onTapZone, size = 300 }: Props) {
  const props = { zones, onTapZone, size };

  switch (characterId) {
    case 'blobby': return <Blobby {...props} />;
    case 'sprout': return <Sprout {...props} />;
    case 'starby': return <Starby {...props} />;
    default: return <Blobby {...props} />;
  }
}
