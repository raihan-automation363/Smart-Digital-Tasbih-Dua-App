import { ThemePreset } from '../types';

export interface ThemeTokens {
  id: ThemePreset;
  lightBg: string;
  darkBg: string;
  accentHex: string;
  accentDarkHex: string;
  accentSoftLight: string;
  accentSoftDark: string;
  accentTextLight: string;
  accentTextDark: string;
  ringTrackLight: string;
  ringTrackDark: string;
  swatchHex: string;
}

export const THEME_PRESETS: Record<ThemePreset, ThemeTokens> = {
  emerald: {
    id: 'emerald',
    lightBg: '#F4F7F5',
    darkBg: '#081410',
    accentHex: '#0B5E46',
    accentDarkHex: '#10B981',
    accentSoftLight: '#E5F2EC',
    accentSoftDark: '#0D2B22',
    accentTextLight: '#084C38',
    accentTextDark: '#6EE7B7',
    ringTrackLight: '#DCE6E0',
    ringTrackDark: '#163329',
    swatchHex: '#0B5E46',
  },
  midnight: {
    id: 'midnight',
    lightBg: '#F3F6FA',
    darkBg: '#090F1A',
    accentHex: '#1E40AF',
    accentDarkHex: '#38BDF8',
    accentSoftLight: '#E6EEF9',
    accentSoftDark: '#13223A',
    accentTextLight: '#1E3A8A',
    accentTextDark: '#7DD3FC',
    ringTrackLight: '#DCE4F0',
    ringTrackDark: '#1A2C48',
    swatchHex: '#1E40AF',
  },
  sand: {
    id: 'sand',
    lightBg: '#FAF7F2',
    darkBg: '#16120D',
    accentHex: '#8C5A2B',
    accentDarkHex: '#F59E0B',
    accentSoftLight: '#F3EAD9',
    accentSoftDark: '#2B2116',
    accentTextLight: '#6E451E',
    accentTextDark: '#FCD34D',
    ringTrackLight: '#E8DFCF',
    ringTrackDark: '#33281B',
    swatchHex: '#8C5A2B',
  },
  rose: {
    id: 'rose',
    lightBg: '#FAF5F7',
    darkBg: '#180D12',
    accentHex: '#8F2D56',
    accentDarkHex: '#FB7185',
    accentSoftLight: '#F7E7EE',
    accentSoftDark: '#2E1621',
    accentTextLight: '#7A2247',
    accentTextDark: '#FDA4AF',
    ringTrackLight: '#EBDCE2',
    ringTrackDark: '#3B1E2B',
    swatchHex: '#8F2D56',
  },
  ocean: {
    id: 'ocean',
    lightBg: '#F2F8F9',
    darkBg: '#071519',
    accentHex: '#0E6275',
    accentDarkHex: '#22D3EE',
    accentSoftLight: '#E1F2F5',
    accentSoftDark: '#0D2932',
    accentTextLight: '#0B4E5E',
    accentTextDark: '#67E8F9',
    ringTrackLight: '#D6E7EB',
    ringTrackDark: '#133640',
    swatchHex: '#0E6275',
  },
};

export function getThemeTokens(preset: ThemePreset): ThemeTokens {
  return THEME_PRESETS[preset] || THEME_PRESETS.emerald;
}

export function isLightColor(hex: string): boolean {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return true;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55;
}
