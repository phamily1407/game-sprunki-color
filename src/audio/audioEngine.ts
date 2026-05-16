import { Platform } from 'react-native';
import type { PaintColor } from '../constants/colorMap';

export interface AudioEngine {
  preloadAll(): Promise<void>;
  playColor(color: PaintColor): void;
  stopColor(color: PaintColor): void;
  stopAll(): void;
  setMuted(muted: boolean): void;
  isReady(): boolean;
}

// ── Web implementation (Howler.js) ────────────────────────────────────────

class WebAudioEngine implements AudioEngine {
  private sounds: Partial<Record<PaintColor, import('howler').Howl>> = {};
  private ready = false;
  private muted = false;

  async preloadAll(): Promise<void> {
    const { Howl, Howler } = await import('howler');

    const files: Record<PaintColor, string> = {
      red:    require('../../assets/audio/drum_loop.mp3'),
      yellow: require('../../assets/audio/guitar_loop.mp3'),
      blue:   require('../../assets/audio/piano_loop.mp3'),
      green:  require('../../assets/audio/marimba_loop.mp3'),
      purple: require('../../assets/audio/synth_loop.mp3'),
      orange: require('../../assets/audio/bass_loop.mp3'),
      white:  require('../../assets/audio/bell_loop.mp3'),
    };

    const colors: PaintColor[] = ['red', 'yellow', 'blue', 'green', 'purple', 'orange', 'white'];

    for (const color of colors) {
      this.sounds[color] = new Howl({
        src: [files[color]],
        loop: true,
        volume: 0,
        preload: true,
      });
    }

    Howler.mute(this.muted);
    this.ready = true;
  }

  playColor(color: PaintColor): void {
    const sound = this.sounds[color];
    if (!sound || this.muted) return;
    if (!sound.playing()) {
      sound.volume(0);
      sound.play();
      sound.fade(0, 0.8, 200);
    }
  }

  stopColor(color: PaintColor): void {
    const sound = this.sounds[color];
    if (!sound || !sound.playing()) return;
    sound.fade(0.8, 0, 300);
    setTimeout(() => sound.stop(), 310);
  }

  stopAll(): void {
    const colors: PaintColor[] = ['red', 'yellow', 'blue', 'green', 'purple', 'orange', 'white'];
    for (const color of colors) {
      this.stopColor(color);
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.ready) {
      import('howler').then(({ Howler }) => Howler.mute(muted));
    }
    if (muted) this.stopAll();
  }

  isReady(): boolean {
    return this.ready;
  }
}

// ── Native implementation (expo-av) ───────────────────────────────────────

class NativeAudioEngine implements AudioEngine {
  private sounds: Partial<Record<PaintColor, import('expo-av').Audio.Sound>> = {};
  private ready = false;
  private muted = false;

  async preloadAll(): Promise<void> {
    const { Audio } = await import('expo-av');

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });

    const files: Record<PaintColor, number> = {
      red:    require('../../assets/audio/drum_loop.mp3'),
      yellow: require('../../assets/audio/guitar_loop.mp3'),
      blue:   require('../../assets/audio/piano_loop.mp3'),
      green:  require('../../assets/audio/marimba_loop.mp3'),
      purple: require('../../assets/audio/synth_loop.mp3'),
      orange: require('../../assets/audio/bass_loop.mp3'),
      white:  require('../../assets/audio/bell_loop.mp3'),
    };

    const colors: PaintColor[] = ['red', 'yellow', 'blue', 'green', 'purple', 'orange', 'white'];

    await Promise.all(
      colors.map(async (color) => {
        const { sound } = await Audio.Sound.createAsync(files[color], {
          isLooping: true,
          volume: 0,
          shouldPlay: false,
        });
        this.sounds[color] = sound;
      })
    );

    this.ready = true;
  }

  playColor(color: PaintColor): void {
    const sound = this.sounds[color];
    if (!sound || this.muted) return;
    sound.setVolumeAsync(0).then(() => {
      sound.playAsync();
      // Simple linear fade approximation for native
      let vol = 0;
      const step = () => {
        vol = Math.min(vol + 0.1, 0.8);
        sound.setVolumeAsync(vol);
        if (vol < 0.8) setTimeout(step, 20);
      };
      step();
    });
  }

  stopColor(color: PaintColor): void {
    const sound = this.sounds[color];
    if (!sound) return;
    let vol = 0.8;
    const step = () => {
      vol = Math.max(vol - 0.1, 0);
      sound.setVolumeAsync(vol);
      if (vol > 0) {
        setTimeout(step, 30);
      } else {
        sound.stopAsync();
      }
    };
    step();
  }

  stopAll(): void {
    const colors: PaintColor[] = ['red', 'yellow', 'blue', 'green', 'purple', 'orange', 'white'];
    for (const color of colors) {
      this.stopColor(color);
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted) this.stopAll();
  }

  isReady(): boolean {
    return this.ready;
  }
}

// ── Singleton export ──────────────────────────────────────────────────────

const audioEngine: AudioEngine =
  Platform.OS === 'web' ? new WebAudioEngine() : new NativeAudioEngine();

export default audioEngine;
