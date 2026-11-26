export type Language = 'bn' | 'en' | 'ar';

export type ThemePreset = 'emerald' | 'midnight' | 'sand' | 'rose' | 'ocean';

export type CounterButtonStyle = 'ring' | 'pad' | 'minimal';

export type SoundStyle = 'wood' | 'chime' | 'pulse' | 'tick';

export type FontSizeLevel = 'small' | 'medium' | 'large' | 'xlarge';

export type TabRoute = 'counter' | 'dhikr' | 'duas' | 'stats' | 'settings';

export type DuaCategory =
  | 'morning'
  | 'evening'
  | 'before_sleep'
  | 'after_waking'
  | 'before_eating'
  | 'after_eating'
  | 'forgiveness'
  | 'protection'
  | 'daily_life';

export type QuranPassageGroup =
  | 'surah_hashr'
  | 'ayatul_kursi'
  | 'baqarah_end'
  | 'baqarah_duas';

export interface QuranVerse {
  verseNumber: number;
  arabic: string;
  transliterationEn: string;
  transliterationBn: string;
  translationEn: string;
  translationBn: string;
}

export interface QuranPassage {
  id: string;
  group: QuranPassageGroup;
  surahNumber: number;
  surahNameEn: string;
  surahNameBn: string;
  surahNameAr: string;
  verseRange: string;
  titleEn: string;
  titleBn: string;
  titleAr: string;
  sourceNoteEn: string;
  sourceNoteBn: string;
  sourceNoteAr: string;
  recommendedCount?: number;
  verses: QuranVerse[];
}

export interface DhikrItem {
  id: string;
  arabic: string;
  transliterationEn: string;
  transliterationBn: string;
  meaningEn: string;
  meaningBn: string;
  meaningAr?: string;
  recommendedCount: number;
  countVerified: boolean;
  sourceEn: string;
  sourceBn: string;
  sourceAr: string;
  isCustom?: boolean;
  isEdited?: boolean;
}

export interface DuaItem {
  id: string;
  category: DuaCategory;
  titleEn: string;
  titleBn: string;
  titleAr: string;
  arabic: string;
  transliterationEn: string;
  transliterationBn: string;
  translationEn: string;
  translationBn: string;
  translationAr?: string;
  sourceEn: string;
  sourceBn: string;
  sourceAr: string;
  recommendedCount?: number;
  countVerified: boolean;
  notesEn?: string;
  notesBn?: string;
  notesAr?: string;
  isCustom?: boolean;
  isEdited?: boolean;
}

export interface SessionRecord {
  id: string;
  dhikrId: string;
  dhikrTitleEn: string;
  dhikrTitleBn: string;
  dhikrArabic: string;
  count: number;
  target: number;
  completedTarget: boolean;
  timestamp: string; // ISO timestamp
  dateKey: string; // YYYY-MM-DD local date
  isPrayerMode?: boolean;
}

export interface PrayerModeState {
  active: boolean;
  stepIndex: number; // 0: SubhanAllah (33), 1: Alhamdulillah (33), 2: Allahu Akbar (34), 3: Tahlil (1)
}

export interface CounterState {
  activeDhikrId: string;
  count: number;
  target: number;
  roundsCompletedToday: number;
  sessionStartCount: number;
  prayerMode: PrayerModeState;
}

export interface AppSettings {
  language: Language;
  darkMode: boolean;
  themePreset: ThemePreset;
  customBgColor: string | null;
  fontSize: FontSizeLevel;
  counterStyle: CounterButtonStyle;
  soundEnabled: boolean;
  soundStyle: SoundStyle;
  completionSoundEnabled: boolean;
  vibrationEnabled: boolean;
  completionVibrationEnabled: boolean;
  wakeLockEnabled: boolean;
  dailyGoal: number;
  customTargetPresets: number[];
  hasCompletedOnboarding: boolean;
}

export interface AppState {
  version: number;
  counter: CounterState;
  settings: AppSettings;
  dhikrs: DhikrItem[];
  duas: DuaItem[];
  favouriteDhikrIds: string[];
  favouriteDuaIds: string[];
  favouriteQuranIds: string[];
  sessions: SessionRecord[];
  dailyTotals: Record<string, number>; // YYYY-MM-DD -> count
  totalLifetimeCount: number;
  totalTargetsCompleted: number;
}
