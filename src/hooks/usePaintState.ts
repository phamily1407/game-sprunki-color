import { useState, useCallback } from 'react';
import type { PaintColor } from '../constants/colorMap';
import type { ZoneState } from './useStorage';
import audioEngine from '../audio/audioEngine';

export type { ZoneState };

interface PaintState {
  zones: ZoneState;
  selectedColor: PaintColor | null;
  activeColors: Set<PaintColor>;
  selectColor: (color: PaintColor) => void;
  tapZone: (zoneId: string) => void;
  clearAll: () => void;
  hasChanges: boolean;
}

export function usePaintState(characterId: string): PaintState {
  const [zones, setZones] = useState<ZoneState>({});
  const [selectedColor, setSelectedColor] = useState<PaintColor | null>(null);

  const getActiveColors = (z: ZoneState): Set<PaintColor> =>
    new Set(Object.values(z).filter((v): v is PaintColor => v !== null));

  const activeColors = getActiveColors(zones);

  const selectColor = useCallback((color: PaintColor) => {
    setSelectedColor(color);
  }, []);

  const tapZone = useCallback(
    (zoneId: string) => {
      setZones((prev) => {
        const currentColor = prev[zoneId] ?? null;

        if (currentColor !== null) {
          // Erase: remove this zone's color
          const next = { ...prev, [zoneId]: null };
          const newActiveColors = getActiveColors(next);

          // Stop audio only if no other zone uses this color
          if (!newActiveColors.has(currentColor)) {
            audioEngine.stopColor(currentColor);
          }
          return next;
        }

        if (selectedColor === null) return prev;

        // Paint: set zone color
        const next = { ...prev, [zoneId]: selectedColor };
        const prevActiveColors = getActiveColors(prev);

        // Start audio only if this color wasn't already playing
        if (!prevActiveColors.has(selectedColor)) {
          audioEngine.playColor(selectedColor);
        }

        return next;
      });
    },
    [selectedColor]
  );

  const clearAll = useCallback(() => {
    setZones((prev) => {
      const active = getActiveColors(prev);
      active.forEach((color) => audioEngine.stopColor(color));
      return {};
    });
  }, []);

  const hasChanges = Object.values(zones).some((v) => v !== null);

  return { zones, selectedColor, activeColors, selectColor, tapZone, clearAll, hasChanges };
}
