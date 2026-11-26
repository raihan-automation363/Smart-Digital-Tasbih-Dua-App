import { DEFAULT_DHIKRS } from '../data/defaultDhikrs';
import { DEFAULT_DUAS } from '../data/defaultDuas';
import { AppSettings, AppState, DhikrItem, DuaItem } from '../types';

export const STORAGE_KEY = 'noor_tasbih_state_v1';

export function getLocalDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  darkMode: false,
  themePreset: 'emerald',
  customBgColor: null,
  fontSize: 'medium',
  counterStyle: 'ring',
  soundEnabled: true,
  soundStyle: 'wood',
  completionSoundEnabled: true,
  vibrationEnabled: true,
  completionVibrationEnabled: true,
  wakeLockEnabled: false,
  dailyGoal: 300,
  customTargetPresets: [33, 99, 100, 1000],
  hasCompletedOnboarding: false,
};

export function createInitialState(): AppState {
  return {
    version: 1,
    counter: {
      activeDhikrId: DEFAULT_DHIKRS[0].id,
      count: 0,
      target: 33,
      roundsCompletedToday: 0,
      sessionStartCount: 0,
      prayerMode: {
        active: false,
        stepIndex: 0,
      },
    },
    settings: { ...DEFAULT_SETTINGS },
    dhikrs: DEFAULT_DHIKRS.map((d) => ({ ...d })),
    duas: DEFAULT_DUAS.map((d) => ({ ...d })),
    favouriteDhikrIds: ['dhikr-subhanallah', 'dhikr-astaghfirullah'],
    favouriteDuaIds: ['dua-forgiveness-1'],
    favouriteQuranIds: ['quran-ayatul-kursi', 'quran-baqarah-201'],
    sessions: [],
    dailyTotals: {},
    totalLifetimeCount: 0,
    totalTargetsCompleted: 0,
  };
}

export function loadAppState(): AppState {
  const fallback = createInitialState();
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return mergeWithDefaults(parsed);
  } catch {
    return fallback;
  }
}

export function saveAppState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Handle quota exceeded silently without crashing UI
  }
}

export function mergeWithDefaults(parsed: Partial<AppState>): AppState {
  const base = createInitialState();
  const settings: AppSettings = {
    ...base.settings,
    ...(parsed.settings || {}),
    customTargetPresets:
      Array.isArray(parsed.settings?.customTargetPresets) &&
      parsed.settings.customTargetPresets.length > 0
        ? parsed.settings.customTargetPresets.filter((n) => typeof n === 'number' && n > 0)
        : base.settings.customTargetPresets,
  };

  const dhikrs: DhikrItem[] =
    Array.isArray(parsed.dhikrs) && parsed.dhikrs.length > 0 ? parsed.dhikrs : base.dhikrs;

  const duas: DuaItem[] =
    Array.isArray(parsed.duas) && parsed.duas.length > 0 ? parsed.duas : base.duas;

  const activeExists = dhikrs.some((d) => d.id === parsed.counter?.activeDhikrId);

  return {
    version: 1,
    counter: {
      ...base.counter,
      ...(parsed.counter || {}),
      activeDhikrId: activeExists
        ? (parsed.counter?.activeDhikrId as string)
        : dhikrs[0].id,
      count: typeof parsed.counter?.count === 'number' && parsed.counter.count >= 0 ? parsed.counter.count : 0,
      target: typeof parsed.counter?.target === 'number' && parsed.counter.target > 0 ? parsed.counter.target : 33,
      prayerMode: {
        active: Boolean(parsed.counter?.prayerMode?.active),
        stepIndex: typeof parsed.counter?.prayerMode?.stepIndex === 'number' ? parsed.counter?.prayerMode?.stepIndex : 0,
      },
    },
    settings,
    dhikrs,
    duas,
    favouriteDhikrIds: Array.isArray(parsed.favouriteDhikrIds)
      ? parsed.favouriteDhikrIds
      : base.favouriteDhikrIds,
    favouriteDuaIds: Array.isArray(parsed.favouriteDuaIds)
      ? parsed.favouriteDuaIds
      : base.favouriteDuaIds,
    favouriteQuranIds: Array.isArray(parsed.favouriteQuranIds)
      ? parsed.favouriteQuranIds
      : base.favouriteQuranIds,
    sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    dailyTotals: parsed.dailyTotals && typeof parsed.dailyTotals === 'object' ? parsed.dailyTotals : {},
    totalLifetimeCount:
      typeof parsed.totalLifetimeCount === 'number' ? parsed.totalLifetimeCount : 0,
    totalTargetsCompleted:
      typeof parsed.totalTargetsCompleted === 'number' ? parsed.totalTargetsCompleted : 0,
  };
}

export function validateBackupJson(rawText: string): AppState | null {
  try {
    const parsed = JSON.parse(rawText) as Partial<AppState>;
    if (!parsed || typeof parsed !== 'object') return null;
    if (!parsed.settings && !parsed.counter && !Array.isArray(parsed.dhikrs)) {
      return null;
    }
    return mergeWithDefaults(parsed);
  } catch {
    return null;
  }
}

export function resetAllStoredState(): AppState {
  const fresh = createInitialState();
  saveAppState(fresh);
  return fresh;
}
