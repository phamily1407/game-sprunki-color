import { Platform } from 'react-native';

// Firebase-ready analytics stub.
// Replace logEvent body with: analytics().logEvent(name, params)
// when @react-native-firebase/analytics is added in Sprint 2.

function logEvent(name: string, params?: Record<string, string | number>): void {
  if (__DEV__) {
    console.log('[Analytics]', name, params ?? '');
  }
}

export const Analytics = {
  appOpen: () =>
    logEvent('app_open', { platform: Platform.OS, version: '1.0.1' }),

  screenView: (screenName: string) =>
    logEvent('screen_view', { screen_name: screenName }),

  characterSelected: (characterId: string) =>
    logEvent('character_selected', { character_id: characterId }),

  zonePainted: (characterId: string, zoneId: string, color: string) =>
    logEvent('zone_painted', { character_id: characterId, zone_id: zoneId, color }),

  zoneErased: (characterId: string, zoneId: string) =>
    logEvent('zone_erased', { character_id: characterId, zone_id: zoneId }),

  allCleared: (characterId: string) =>
    logEvent('all_cleared', { character_id: characterId }),

  paintingSaved: (characterId: string, zonesCount: number) =>
    logEvent('painting_saved', { character_id: characterId, zones_count: zonesCount }),

  audioStarted: (color: string, instrument: string) =>
    logEvent('audio_started', { color, instrument }),

  audioStopped: (color: string, instrument: string) =>
    logEvent('audio_stopped', { color, instrument }),

  audioMuted: () => logEvent('audio_muted'),

  audioUnmuted: () => logEvent('audio_unmuted'),

  audioGateShown: () => logEvent('audio_gate_shown'),

  audioGateDismissed: () => logEvent('audio_gate_dismissed'),
};
