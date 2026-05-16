import { Platform } from 'react-native';
import type { PaintColor } from '../constants/colorMap';
import { COLOR_MAP } from '../constants/colorMap';
import { Analytics } from '../utils/analytics';

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

    const paintColors: PaintColor[] = ['red', 'yellow', 'blue', 'green', 'purple', 'orange', 'white'];

    for (const color of paintColors) {
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
    if (!sound) return;
    if (sound.playing()) return;
    sound.volume(0);
    sound.play();
    sound.fade(0, 0.8, 200);
    Analytics.audioStarted(color, COLOR_MAP[color].instrument);
  }

  stopColor(color: PaintColor): void {
    const sound = this.sounds[color];
    if (!sound || !sound.playing()) return;
    sound.fade(0.8, 0, 300);
    setTimeout(() => sound.stop(), 310);
    Analytics.audioStopped(color, COLOR_MAP[color].instrument);
  }

  stopAll(): void {
    const paintColors: PaintColor[] = ['red', 'yellow', 'blue', 'green', 'purple', 'orange', 'white'];
    for (const color of paintColors) this.stopColor(color);
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.ready) {
      import('howler').then(({ Howler }) => Howler.mute(muted));
    }
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
  // Tracks which colors should be playing — used to resume on unmute (F-05)
  private activeColors: Set<PaintColor> = new Set();

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

    const paintColors: PaintColor[] = ['red', 'yellow', 'blue', 'green', 'purple', 'orange', 'white'];

    await Promise.all(
      paintColors.map(async (color) => {
        const { sound } = await import('expo-av').then(({ Audio }) =>
          Audio.Sound.createAsync(files[color], {
            isLooping: true,
            volume: 0,
            shouldPlay: false,
          })
        );
        this.sounds[color] = sound;
      })
    );

    this.ready = true;
  }

  private fadeIn(sound: import('expo-av').Audio.Sound): void {
    let vol = 0;
    const step = () => {
      vol = Math.min(vol + 0.1, 0.8);
      sound.setVolumeAsync(vol);
      if (vol < 0.8) setTimeout(step, 20);
    };
    step();
  }

  private async stopSound(sound: import('expo-av').Audio.Sound): Promise<void> {
    // W-01: guard against stopping an already-stopped sound
    const status = await sound.getStatusAsync();
    if (!status.isLoaded || !status.isPlaying) return;
    let vol = 0.8;
    const step = () => {
      vol = Math.max(vol - 0.1, 0);
      sound.setVolumeAsync(vol);
      if (vol > 0) setTimeout(step, 30);
      else sound.stopAsync();
    };
    step();
  }

  async playColor(color: PaintColor): Promise<void> {
    this.activeColors.add(color);
    if (this.muted) return;

    const sound = this.sounds[color];
    if (!sound) return;

    // F-04: guard against double-play
    const status = await sound.getStatusAsync();
    if (status.isLoaded && status.isPlaying) return;

    await sound.setVolumeAsync(0);
    await sound.playAsync();
    this.fadeIn(sound);
    Analytics.audioStarted(color, COLOR_MAP[color].instrument);
  }

  stopColor(color: PaintColor): void {
    this.activeColors.delete(color);
    const sound = this.sounds[color];
    if (!sound) return;
    this.stopSound(sound).then(() => {
      Analytics.audioStopped(color, COLOR_MAP[color].instrument);
    });
  }

  stopAll(): void {
    this.activeColors.clear();
    const paintColors: PaintColor[] = ['red', 'yellow', 'blue', 'green', 'purple', 'orange', 'white'];
    for (const color of paintColors) {
      const sound = this.sounds[color];
      if (sound) this.stopSound(sound);
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted) {
      // Silence all sounds but preserve activeColors for resume
      const snapshot = new Set(this.activeColors);
      const paintColors: PaintColor[] = ['red', 'yellow', 'blue', 'green', 'purple', 'orange', 'white'];
      for (const color of paintColors) {
        const sound = this.sounds[color];
        if (sound) this.stopSound(sound);
      }
      this.activeColors = snapshot;
    } else {
      // F-05: resume all colors that were active before mute
      for (const color of this.activeColors) {
        this.playColor(color);
      }
    }
  }

  isReady(): boolean {
    return this.ready;
  }
}

// ── Singleton export ──────────────────────────────────────────────────────

const audioEngine: AudioEngine =
  Platform.OS === 'web' ? new WebAudioEngine() : new NativeAudioEngine();

export default audioEngine;
