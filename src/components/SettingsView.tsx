import React, { useEffect, useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Compass,
  Info,
  Moon,
  Palette,
  Plus,
  ShieldCheck,
  Smartphone,
  Sun,
  Trash2,
  Volume2,
  X,
} from 'lucide-react';
import { TranslationDict } from '../i18n/translations';
import {
  AppSettings,
  CounterButtonStyle,
  FontSizeLevel,
  Language,
  SoundStyle,
  ThemePreset,
} from '../types';
import { playTapSound } from '../utils/audio';
import { isVibrationSupported, triggerTapVibration } from '../utils/haptics';
import { THEME_PRESETS } from '../utils/themes';
import { ConfirmModal } from './ConfirmModal';
import { PWAInstallButton } from './PWAInstallButton';

interface SettingsViewProps {
  t: TranslationDict;
  settings: AppSettings;
  accentHex: string;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  onOpenOnboarding: () => void;
  onResetAllData: () => void;
}

const THEME_KEYS: ThemePreset[] = ['emerald', 'midnight', 'sand', 'rose', 'ocean'];
const SOUND_STYLES: SoundStyle[] = ['wood', 'chime', 'pulse', 'tick'];
const FONT_SIZES: FontSizeLevel[] = ['small', 'medium', 'large', 'xlarge'];
const COUNTER_STYLES: CounterButtonStyle[] = ['ring', 'pad', 'minimal'];

export const SettingsView: React.FC<SettingsViewProps> = ({
  t,
  settings,
  accentHex,
  onUpdateSettings,
  onOpenOnboarding,
  onResetAllData,
}) => {
  const [newPresetInput, setNewPresetInput] = useState('');
  const [dailyGoalDraft, setDailyGoalDraft] = useState(String(settings.dailyGoal));
  const [showResetAllModal, setShowResetAllModal] = useState(false);
  const vibrationSupported = isVibrationSupported();

  useEffect(() => {
    setDailyGoalDraft(String(settings.dailyGoal));
  }, [settings.dailyGoal]);

  const handleAddPreset = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(newPresetInput, 10);
    if (!Number.isNaN(val) && val > 0 && val <= 100000) {
      const next = Array.from(new Set([...settings.customTargetPresets, val])).sort(
        (a, b) => a - b
      );
      onUpdateSettings({ customTargetPresets: next });
      setNewPresetInput('');
    }
  };

  const handleRemovePreset = (val: number) => {
    if (settings.customTargetPresets.length <= 1) return;
    onUpdateSettings({
      customTargetPresets: settings.customTargetPresets.filter((p) => p !== val),
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 pb-24 sm:px-6 md:py-8 md:pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t.settings.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {t.settings.subtitle}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Language & Layout */}
        <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <Compass className="h-5 w-5" style={{ color: accentHex }} />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {t.settings.languageSection}
            </h2>
          </div>

          <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
            {t.settings.languageLabel}
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(
              [
                { id: 'bn', label: 'বাংলা' },
                { id: 'en', label: 'English' },
                { id: 'ar', label: 'العربية' },
              ] as { id: Language; label: string }[]
            ).map((lang) => {
              const active = settings.language === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => onUpdateSettings({ language: lang.id })}
                  style={
                    active
                      ? { backgroundColor: accentHex, borderColor: accentHex, color: '#fff' }
                      : undefined
                  }
                  className={`min-h-[44px] rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? 'shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Appearance & Theme */}
        <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <Palette className="h-5 w-5" style={{ color: accentHex }} />
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {t.settings.appearanceSection}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {settings.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span>{t.settings.darkMode}</span>
            </button>
          </div>

          {/* Preset Themes */}
          <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            {t.settings.themePreset}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {THEME_KEYS.map((key) => {
              const token = THEME_PRESETS[key];
              const active = settings.themePreset === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onUpdateSettings({ themePreset: key })}
                  style={active ? { borderColor: token.swatchHex } : undefined}
                  className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300'
                  }`}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full"
                    style={{ backgroundColor: token.swatchHex }}
                  />
                  <span>{t.settings.themes[key]}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Background Color */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {t.settings.customBg}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={
                  settings.customBgColor ||
                  (settings.darkMode
                    ? THEME_PRESETS[settings.themePreset].darkBg
                    : THEME_PRESETS[settings.themePreset].lightBg)
                }
                onChange={(e) => onUpdateSettings({ customBgColor: e.target.value })}
                aria-label={t.settings.customBg}
                className="h-10 w-12 cursor-pointer rounded-lg border border-slate-300 bg-transparent p-0.5 dark:border-slate-700"
              />
              {settings.customBgColor && (
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ customBgColor: null })}
                  className="min-h-[40px] rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  {t.settings.resetBg}
                </button>
              )}
            </div>
          </div>

          {/* Font Size */}
          <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            {t.settings.fontSize}
          </p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {FONT_SIZES.map((sz) => {
              const active = settings.fontSize === sz;
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onUpdateSettings({ fontSize: sz })}
                  style={
                    active
                      ? { backgroundColor: accentHex, borderColor: accentHex, color: '#fff' }
                      : undefined
                  }
                  className="min-h-[40px] rounded-xl border border-slate-200 px-2 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-300"
                >
                  {t.settings.fontSizes[sz]}
                </button>
              );
            })}
          </div>

          {/* Counter Button Style */}
          <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            {t.settings.counterStyle}
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {COUNTER_STYLES.map((cs) => {
              const active = settings.counterStyle === cs;
              return (
                <button
                  key={cs}
                  type="button"
                  onClick={() => onUpdateSettings({ counterStyle: cs })}
                  style={
                    active
                      ? { backgroundColor: accentHex, borderColor: accentHex, color: '#fff' }
                      : undefined
                  }
                  className="min-h-[40px] rounded-xl border border-slate-200 px-2 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-300"
                >
                  {t.settings.counterStyles[cs]}
                </button>
              );
            })}
          </div>
        </section>

        {/* Sound & Vibration */}
        <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <Volume2 className="h-5 w-5" style={{ color: accentHex }} />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {t.settings.soundVibrationSection}
            </h2>
          </div>

          <div className="mt-4 space-y-3.5">
            <label className="flex min-h-[44px] cursor-pointer items-center justify-between gap-3">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {t.settings.clickSound}
              </span>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                className="h-5 w-5 accent-emerald-700"
              />
            </label>

            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {t.settings.soundStyle}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {SOUND_STYLES.map((st) => {
                  const active = settings.soundStyle === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        onUpdateSettings({ soundStyle: st });
                        playTapSound(st);
                      }}
                      style={
                        active
                          ? { backgroundColor: accentHex, borderColor: accentHex, color: '#fff' }
                          : undefined
                      }
                      className="min-h-[40px] rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-300"
                    >
                      {t.settings.soundStyles[st]}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="flex min-h-[44px] cursor-pointer items-center justify-between gap-3">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {t.settings.completionSound}
              </span>
              <input
                type="checkbox"
                checked={settings.completionSoundEnabled}
                onChange={(e) =>
                  onUpdateSettings({ completionSoundEnabled: e.target.checked })
                }
                className="h-5 w-5 accent-emerald-700"
              />
            </label>

            <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
              <label
                className={`flex min-h-[44px] items-center justify-between gap-3 ${
                  vibrationSupported ? 'cursor-pointer' : 'opacity-50'
                }`}
              >
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {t.settings.vibration}
                </span>
                <input
                  type="checkbox"
                  disabled={!vibrationSupported}
                  checked={vibrationSupported && settings.vibrationEnabled}
                  onChange={(e) =>
                    onUpdateSettings({ vibrationEnabled: e.target.checked })
                  }
                  className="h-5 w-5 accent-emerald-700"
                />
              </label>

              <label
                className={`flex min-h-[44px] items-center justify-between gap-3 ${
                  vibrationSupported ? 'cursor-pointer' : 'opacity-50'
                }`}
              >
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {t.settings.completionVibration}
                </span>
                <input
                  type="checkbox"
                  disabled={!vibrationSupported}
                  checked={vibrationSupported && settings.completionVibrationEnabled}
                  onChange={(e) =>
                    onUpdateSettings({ completionVibrationEnabled: e.target.checked })
                  }
                  className="h-5 w-5 accent-emerald-700"
                />
              </label>

              {!vibrationSupported && (
                <p className="mt-1.5 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                  {t.settings.vibrationUnsupported}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => playTapSound(settings.soundStyle)}
                className="min-h-[40px] rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {t.settings.testSound}
              </button>
              <button
                type="button"
                disabled={!vibrationSupported}
                onClick={() => triggerTapVibration()}
                className="min-h-[40px] rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {t.settings.testVibration}
              </button>
            </div>
          </div>
        </section>

        {/* Goals & Target Presets */}
        <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <Bell className="h-5 w-5" style={{ color: accentHex }} />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {t.settings.goalsPresetsSection}
            </h2>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
              {t.settings.dailyGoalLabel}
            </label>
            <input
              type="number"
              min={1}
              max={100000}
              value={dailyGoalDraft}
              onChange={(e) => {
                const raw = e.target.value;
                setDailyGoalDraft(raw);
                const v = parseInt(raw, 10);
                if (!Number.isNaN(v) && v > 0 && v <= 100000) {
                  onUpdateSettings({ dailyGoal: v });
                }
              }}
              onBlur={() => {
                const v = parseInt(dailyGoalDraft, 10);
                if (Number.isNaN(v) || v < 1) {
                  setDailyGoalDraft(String(settings.dailyGoal));
                } else {
                  const clamped = Math.min(100000, v);
                  setDailyGoalDraft(String(clamped));
                  onUpdateSettings({ dailyGoal: clamped });
                }
              }}
              className="font-mono-num mt-1.5 min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {t.settings.customPresetsLabel}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {settings.customTargetPresets.map((val) => (
                <span
                  key={val}
                  className="font-mono-num inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  {val}
                  {settings.customTargetPresets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePreset(val)}
                      aria-label={t.common.delete}
                      className="rounded p-0.5 text-slate-400 hover:text-rose-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </span>
              ))}
            </div>

            <form onSubmit={handleAddPreset} className="mt-3 flex gap-2">
              <input
                type="number"
                min={1}
                max={100000}
                value={newPresetInput}
                onChange={(e) => setNewPresetInput(e.target.value)}
                placeholder={t.settings.addPresetPlaceholder}
                className="font-mono-num min-h-[44px] flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <button
                type="submit"
                style={{ backgroundColor: accentHex }}
                className="inline-flex min-h-[44px] items-center gap-1 rounded-xl px-4 py-2 text-xs font-semibold text-white"
              >
                <Plus className="h-4 w-4" />
                <span>{t.common.add}</span>
              </button>
            </form>
          </div>
        </section>

        {/* PWA Installation & Offline Support */}
        <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <Smartphone className="h-5 w-5" style={{ color: accentHex }} />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {t.settings.pwaSection}
            </h2>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <PWAInstallButton t={t} accentHex={accentHex} />
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              {t.settings.offlineReady}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {t.settings.androidGuideTitle}
              </h3>
              <ol className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {t.settings.androidGuideSteps.map((s, idx) => (
                  <li key={idx}>
                    <span className="font-mono-num font-semibold">{idx + 1}. </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {t.settings.iosGuideTitle}
              </h3>
              <ol className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {t.settings.iosGuideSteps.map((s, idx) => (
                  <li key={idx}>
                    <span className="font-mono-num font-semibold">{idx + 1}. </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenOnboarding}
            className="mt-4 min-h-[42px] rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {t.settings.openGuide}
          </button>
        </section>

        {/* Privacy, App Info & Danger Zone */}
        <section className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900/90">
          <div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5" style={{ color: accentHex }} />
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {t.settings.privacySection}
              </h2>
            </div>

            <ul className="mt-4 space-y-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {t.settings.privacyPoints.map((pt, i) => (
                <li key={i} className="flex gap-2">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs font-medium text-slate-400 dark:text-slate-500">
              {t.settings.versionLabel}
            </p>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
            <h3 className="text-xs font-bold text-rose-700 dark:text-rose-400">
              {t.settings.dangerSection}
            </h3>
            <button
              type="button"
              onClick={() => setShowResetAllModal(true)}
              className="mt-2.5 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/60"
            >
              <Trash2 className="h-4 w-4" />
              <span>{t.settings.resetAllData}</span>
            </button>
          </div>
        </section>
      </div>

      <ConfirmModal
        open={showResetAllModal}
        title={t.settings.resetAllTitle}
        message={t.settings.resetAllMessage}
        confirmLabel={t.settings.resetAllData}
        cancelLabel={t.common.cancel}
        destructive
        requireTypeWord={t.settings.resetConfirmWord}
        requireTypeHint={t.settings.resetTypeHint}
        onConfirm={() => {
          onResetAllData();
          setShowResetAllModal(false);
        }}
        onCancel={() => setShowResetAllModal(false)}
      />
    </div>
  );
};
