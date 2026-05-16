import { Platform } from 'react-native';

export type AppPlatform = 'ios' | 'android' | 'web';

export function usePlatform(): AppPlatform {
  return Platform.OS as AppPlatform;
}

export function useIsWeb(): boolean {
  return Platform.OS === 'web';
}

export function useIsNative(): boolean {
  return Platform.OS !== 'web';
}
