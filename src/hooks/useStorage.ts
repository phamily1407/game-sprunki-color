import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import type { PaintColor } from '../constants/colorMap';

export type ZoneState = Record<string, PaintColor | null>;

export interface SavedPainting {
  id: string;
  characterId: string;
  zones: ZoneState;
  createdAt: string;
}

const MAX_PAINTINGS = 20;
const INDEX_KEY = 'painting_index';
const paintingKey = (id: string) => `painting_${id}`;

// ── Storage adapter ───────────────────────────────────────────────────────

async function storageGet(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
  return AsyncStorage.getItem(key);
}

async function storageSet(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
  await AsyncStorage.setItem(key, value);
}

async function storageRemove(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
    return;
  }
  const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
  await AsyncStorage.removeItem(key);
}

// ── Hook ──────────────────────────────────────────────────────────────────

export function useStorage() {
  const [saving, setSaving] = useState(false);

  const savePainting = useCallback(async (painting: SavedPainting): Promise<void> => {
    setSaving(true);
    try {
      const indexRaw = await storageGet(INDEX_KEY);
      let index: string[] = indexRaw ? JSON.parse(indexRaw) : [];

      // Enforce max
      while (index.length >= MAX_PAINTINGS) {
        const oldest = index.shift();
        if (oldest) await storageRemove(paintingKey(oldest));
      }

      index.push(painting.id);
      await storageSet(paintingKey(painting.id), JSON.stringify(painting));
      await storageSet(INDEX_KEY, JSON.stringify(index));
    } finally {
      setSaving(false);
    }
  }, []);

  const listPaintings = useCallback(async (): Promise<SavedPainting[]> => {
    const indexRaw = await storageGet(INDEX_KEY);
    if (!indexRaw) return [];

    const index: string[] = JSON.parse(indexRaw);
    const results: SavedPainting[] = [];

    for (const id of index) {
      const raw = await storageGet(paintingKey(id));
      if (raw) results.push(JSON.parse(raw) as SavedPainting);
    }

    return results.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, []);

  const deletePainting = useCallback(async (id: string): Promise<void> => {
    const indexRaw = await storageGet(INDEX_KEY);
    if (!indexRaw) return;

    const index: string[] = JSON.parse(indexRaw);
    const updated = index.filter((i) => i !== id);

    await storageRemove(paintingKey(id));
    await storageSet(INDEX_KEY, JSON.stringify(updated));
  }, []);

  const getWebSessionCount = useCallback((): number => {
    if (Platform.OS !== 'web') return 0;
    const count = parseInt(localStorage.getItem('session_count') ?? '0', 10);
    const next = count + 1;
    localStorage.setItem('session_count', String(next));
    return next;
  }, []);

  return { savePainting, listPaintings, deletePainting, getWebSessionCount, saving };
}
