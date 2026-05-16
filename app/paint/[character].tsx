import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, sizes } from '../../src/constants/theme';
import { CHARACTER_MAP } from '../../src/constants/characters';
import { usePaintState } from '../../src/hooks/usePaintState';
import { useStorage } from '../../src/hooks/useStorage';
import { SprunkiCharacter } from '../../src/components/SprunkiCharacter';
import { ColorPalette } from '../../src/components/ColorPalette';
import { MusicVisualizer } from '../../src/components/MusicVisualizer';
import audioEngine from '../../src/audio/audioEngine';
import { Analytics } from '../../src/utils/analytics';
import type { SavedPainting } from '../../src/hooks/useStorage';
import { v4 as uuidv4 } from 'uuid';

function AudioGate({ onDismiss }: { onDismiss: () => void }) {
  return (
    <TouchableOpacity style={styles.gate} onPress={onDismiss} activeOpacity={1}>
      <Text style={styles.gateEmoji}>🎵</Text>
      <Text style={styles.gateText}>Tap to start music!</Text>
    </TouchableOpacity>
  );
}

export default function PaintScreen() {
  const { character: rawCharacterId } = useLocalSearchParams<{ character: string }>();

  // F-03: resolve to a valid character ID before any hook runs
  const characterId =
    rawCharacterId && CHARACTER_MAP[rawCharacterId] ? rawCharacterId : 'blobby';
  const character = CHARACTER_MAP[characterId];

  const router = useRouter();
  const { zones, selectedColor, activeColors, selectColor, tapZone, clearAll, hasChanges } =
    usePaintState(characterId);

  const { savePainting } = useStorage();
  const [muted, setMuted] = useState(false);
  // F-02: skip gate for returning web users who already gestured
  const [showGate, setShowGate] = useState(
    Platform.OS === 'web' && !audioEngine.isReady()
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Analytics.screenView('paint');
    if (Platform.OS !== 'web') {
      audioEngine.preloadAll();
    }
    if (showGate) {
      Analytics.audioGateShown();
    }
    return () => {
      audioEngine.stopAll();
    };
  }, []);

  const handleAudioGateDismiss = async () => {
    Analytics.audioGateDismissed();
    setShowGate(false);
    await audioEngine.preloadAll();
  };

  const handleMute = () => {
    const next = !muted;
    setMuted(next);
    audioEngine.setMuted(next);
    next ? Analytics.audioMuted() : Analytics.audioUnmuted();
  };

  const handleSave = async () => {
    if (!hasChanges) return;
    const painting: SavedPainting = {
      id: uuidv4(),
      characterId: character.id,
      zones,
      createdAt: new Date().toISOString(),
    };
    await savePainting(painting);
    Analytics.paintingSaved(
      character.id,
      Object.values(zones).filter(Boolean).length
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  // F-06: use Alert.alert on all platforms — works on web via Expo's web Alert
  const handleHome = () => {
    if (hasChanges) {
      Alert.alert('Go home?', 'Unsaved changes will be lost.', [
        { text: 'Stay', style: 'cancel' },
        {
          text: 'Go home',
          style: 'destructive',
          onPress: () => {
            audioEngine.stopAll();
            router.back();
          },
        },
      ]);
    } else {
      audioEngine.stopAll();
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={handleHome}
          accessibilityLabel="Go home"
          accessibilityRole="button"
        >
          <Text style={styles.headerBtnText}>🏠</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Sprunki Color</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={handleMute}
            accessibilityLabel={muted ? 'Unmute' : 'Mute'}
            accessibilityRole="button"
          >
            <Text style={styles.headerBtnText}>{muted ? '🔇' : '🔊'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={handleSave}
            accessibilityLabel="Save painting"
            accessibilityRole="button"
          >
            <Text style={styles.headerBtnText}>{saved ? '✅' : '💾'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.canvas}>
        <SprunkiCharacter
          characterId={character.id}
          zones={zones}
          onTapZone={tapZone}
          size={280}
        />
      </View>

      <MusicVisualizer activeColors={activeColors} />

      <ColorPalette
        selectedColor={selectedColor}
        onSelectColor={selectColor}
        onClear={clearAll}
      />

      {showGate && <AudioGate onDismiss={handleAudioGateDismiss} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sizes.spacing.xs,
    height: 56,
    backgroundColor: colors.card,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  headerBtn: {
    width: sizes.touchMin,
    height: sizes.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnText: {
    fontSize: 26,
  },
  headerTitle: {
    fontSize: sizes.font.md,
    fontWeight: '700',
    color: colors.text,
  },
  headerRight: {
    flexDirection: 'row',
  },
  canvas: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  gate: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,249,240,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  gateEmoji: {
    fontSize: 72,
    marginBottom: sizes.spacing.md,
  },
  gateText: {
    fontSize: sizes.font.xl,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
});
