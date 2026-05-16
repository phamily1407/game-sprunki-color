import { colors } from './theme';

export type PaintColor = 'red' | 'yellow' | 'blue' | 'green' | 'purple' | 'orange' | 'white';

export interface ColorDef {
  id: PaintColor;
  hex: string;
  instrument: string;
  audioFile: string;
  label: string;
}

export const COLOR_MAP: Record<PaintColor, ColorDef> = {
  red:    { id: 'red',    hex: colors.paint.red,    instrument: 'Drums',   audioFile: 'drum_loop.mp3',    label: 'Red — Drums'   },
  yellow: { id: 'yellow', hex: colors.paint.yellow, instrument: 'Guitar',  audioFile: 'guitar_loop.mp3',  label: 'Yellow — Guitar' },
  blue:   { id: 'blue',   hex: colors.paint.blue,   instrument: 'Piano',   audioFile: 'piano_loop.mp3',   label: 'Blue — Piano'  },
  green:  { id: 'green',  hex: colors.paint.green,  instrument: 'Marimba', audioFile: 'marimba_loop.mp3', label: 'Green — Marimba' },
  purple: { id: 'purple', hex: colors.paint.purple, instrument: 'Synth',   audioFile: 'synth_loop.mp3',   label: 'Purple — Synth' },
  orange: { id: 'orange', hex: colors.paint.orange, instrument: 'Bass',    audioFile: 'bass_loop.mp3',    label: 'Orange — Bass' },
  white:  { id: 'white',  hex: colors.paint.white,  instrument: 'Bell',    audioFile: 'bell_loop.mp3',    label: 'White — Bell'  },
};

export const PAINT_COLORS: PaintColor[] = ['red', 'yellow', 'blue', 'green', 'purple', 'orange', 'white'];
