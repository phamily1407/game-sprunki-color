import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import type { PaintColor } from '../constants/colorMap';
import type { ZoneState } from './useStorage';
import audioEngine from '../audio/audioEngine';
import { Analytics } from '../utils/analytics';

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

async function triggerHaptic(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const Haptics = await import('expo-haptics');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // haptics unavailable — silent fail
  }
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
      triggerHaptic(); // W-08: native haptic on every zone tap

      setZones((prev) => {
        const currentColor = prev[zoneId] ?? null;

        if (currentColor !== null) {
          const next = { ...prev, [zoneId]: null };
          const newActiveColors = getActiveColors(next);

          if (!newActiveColors.has(currentColor)) {
            audioEngine.stopColor(currentColor);
          }
          Analytics.zoneErased(characterId, zoneId);
          return next;
        }

        if (selectedColor === null) return prev;

        const next = { ...prev, [zoneId]: selectedColor };
        const prevActiveColors = getActiveColors(prev);

        if (!prevActiveColors.has(selectedColor)) {
          audioEngine.playColor(selectedColor);
        }
        Analytics.zonePainted(characterId, zoneId, selectedColor);
        return next;
      });
    },
    [selectedColor, characterId]
  );

  const clearAll = useCallback(() => {
    setZones((prev) => {
      const active = getActiveColors(prev);
      active.forEach((color) => audioEngine.stopColor(color));
      Analytics.allCleared(characterId);
      return {};
    });
  }, [characterId]);

  const hasChanges = Object.values(zones).some((v) => v !== null);

  return { zones, selectedColor, activeColors, selectColor, tapZone, clearAll, hasChanges };
}
