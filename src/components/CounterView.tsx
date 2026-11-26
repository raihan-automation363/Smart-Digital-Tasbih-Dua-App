import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Sun,
  Target,
  Undo2,
} from 'lucide-react';
import { useWakeLock } from '../hooks/useWakeLock';
import { TranslationDict } from '../i18n/translations';
import {
  AppSettings,
  CounterState,
  DhikrItem,
  FontSizeLevel,
} from '../types';
import { ConfirmModal } from './ConfirmModal';

export interface PrayerStep {
  dhikrId: string;
  target: number;
}

export const PRAYER_MODE_STEPS: PrayerStep[] = [
  { dhikrId: 'dhikr-subhanallah', target: 33 },
  { dhikrId: 'dhikr-alhamdulillah', target: 33 },
  { dhikrId: 'dhikr-allahuakbar', target: 34 },
  { dhikrId: 'dhikr-tahlil-100', target: 1 },
];

interface CounterViewProps {
  t: TranslationDict;
  counter: CounterState;
  settings: AppSettings;
  activeDhikr: DhikrItem;
  dhikrs: DhikrItem[];
  todayTotal: number;
  accentHex: string;
  accentSoftBg: string;
  accentTextHex: string;
  ringTrackHex: string;
  justCompletedPulse: number;
  prayerCompleteBanner: boolean;
  onIncrement: () => void;
  onUndo: () => void;
  onReset: () => void;
  onNewRound: () => void;
  onChangeTarget: (newTarget: number) => void;
  onSelectDhikr: (dhikrId: string) => void;
  onToggleWakeLock: () => void;
  onTogglePrayerMode: () => void;
  onDismissPrayerComplete: () => void;
  onOpenDhikrLibrary: () => void;
}

const ARABIC_SIZE_MAP: Record<FontSizeLevel, string> = {
  small: 'text-2xl sm:text-3xl',
  medium: 'text-3xl sm:text-4xl',
  large: 'text-4xl sm:text-5xl',
  xlarge: 'text-5xl sm:text-6xl',
};

const TEXT_SIZE_MAP: Record<FontSizeLevel, string> = {
  small: 'text-xs sm:text-sm',
  medium: 'text-sm sm:text-base',
  large: 'text-base sm:text-lg',
  xlarge: 'text-lg sm:text-xl',
};

export const CounterView: React.FC<CounterViewProps> = ({
  t,
  counter,
  settings,
  activeDhikr,
  dhikrs,
  todayTotal,
  accentHex,
  accentSoftBg,
  accentTextHex,
  ringTrackHex,
  justCompletedPulse,
  prayerCompleteBanner,
  onIncrement,
  onUndo,
  onReset,
  onNewRound,
  onChangeTarget,
  onSelectDhikr,
  onToggleWakeLock,
  onTogglePrayerMode,
  onDismissPrayerComplete,
  onOpenDhikrLibrary,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showDhikrPicker, setShowDhikrPicker] = useState(false);
  const [customTargetInput, setCustomTargetInput] = useState(String(counter.target));
  const [tapPressed, setTapPressed] = useState(false);

  const { isSupported: wakeSupported, isActive: wakeActive } = useWakeLock(
    settings.wakeLockEnabled
  );

  useEffect(() => {
    setCustomTargetInput(String(counter.target));
  }, [counter.target]);

  // Keyboard Space / Enter support for counting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showResetConfirm || showTargetModal || showDhikrPicker) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'BUTTON')
      ) {
        return;
      }
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        onIncrement();
        setTapPressed(true);
        window.setTimeout(() => setTapPressed(false), 110);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onIncrement, showResetConfirm, showTargetModal, showDhikrPicker]);

  const progressRatio = useMemo(() => {
    if (counter.target <= 0) return 0;
    return Math.min(1, counter.count / counter.target);
  }, [counter.count, counter.target]);

  const progressPercent = Math.round((counter.count / Math.max(1, counter.target)) * 100);
  const targetReached = counter.count >= counter.target;

  const dailyGoalPercent = Math.min(
    100,
    Math.round((todayTotal / Math.max(1, settings.dailyGoal)) * 100)
  );

  const transliteration =
    settings.language === 'bn'
      ? activeDhikr.transliterationBn
      : activeDhikr.transliterationEn;

  const meaning =
    settings.language === 'bn'
      ? activeDhikr.meaningBn
      : settings.language === 'ar'
      ? activeDhikr.meaningAr || activeDhikr.meaningEn
      : activeDhikr.meaningEn;

  const source =
    settings.language === 'bn'
      ? activeDhikr.sourceBn
      : settings.language === 'ar'
      ? activeDhikr.sourceAr
      : activeDhikr.sourceEn;

  const handleTap = () => {
    setTapPressed(true);
    onIncrement();
    window.setTimeout(() => setTapPressed(false), 110);
  };

  const handleApplyCustomTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customTargetInput, 10);
    if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 100000) {
      onChangeTarget(parsed);
      setShowTargetModal(false);
    }
  };

  const radius = 108;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const allPresets = useMemo(() => {
    const merged = Array.from(
      new Set([33, 99, 100, 1000, ...settings.customTargetPresets])
    ).sort((a, b) => a - b);
    return merged;
  }, [settings.customTargetPresets]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 pb-24 sm:px-6 md:py-8 md:pb-12">
      {/* After-Prayer Complete Celebration */}
      {prayerCompleteBanner && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/70 dark:bg-emerald-950/50 dark:text-emerald-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium">{t.counter.prayerModeComplete}</span>
          </div>
          <button
            type="button"
            onClick={onDismissPrayerComplete}
            className="min-h-[36px] rounded-xl px-3 py-1 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
          >
            {t.common.close}
          </button>
        </div>
      )}

      {/* Active After-Prayer Mode Banner */}
      {counter.prayerMode.active && (
        <div
          className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3"
          style={{
            backgroundColor: settings.darkMode ? 'rgba(16, 185, 129, 0.1)' : accentSoftBg,
            borderColor: settings.darkMode ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0,0,0,0.08)',
          }}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: settings.darkMode ? '#6EE7B7' : accentTextHex }}>
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>
                {t.counter.prayerMode} · {t.counter.stepOf} {counter.prayerMode.stepIndex + 1}/
                {PRAYER_MODE_STEPS.length}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {t.counter.prayerModeDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={onTogglePrayerMode}
            className="min-h-[40px] rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0"
          >
            {t.counter.exitPrayerMode}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Main Column: Active Dhikr + Tactile Counter */}
        <div className="space-y-5 lg:col-span-7">
          {/* Active Dhikr Display Card */}
          <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm backdrop-blur-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900/90">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowDhikrPicker(true)}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <span className="truncate max-w-[180px] sm:max-w-[260px]">
                  {transliteration}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>
                  {t.counter.rounds}: <strong className="font-mono-num text-slate-800 dark:text-slate-200">{counter.roundsCompletedToday}</strong>
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-num">
                  {progressPercent}%
                </span>
              </div>
            </div>

            <div className="mt-5 text-center">
              <p
                dir="rtl"
                lang="ar"
                className={`font-arabic font-bold text-slate-900 dark:text-slate-50 ${ARABIC_SIZE_MAP[settings.fontSize]}`}
              >
                {activeDhikr.arabic}
              </p>

              {settings.language !== 'ar' && (
                <p
                  className={`mt-3 font-semibold text-slate-800 dark:text-slate-200 ${TEXT_SIZE_MAP[settings.fontSize]}`}
                >
                  {transliteration}
                </p>
              )}

              <p
                className={`mt-1.5 leading-relaxed text-slate-600 dark:text-slate-400 ${TEXT_SIZE_MAP[settings.fontSize]}`}
              >
                {meaning}
              </p>

              <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400">
                {source}
              </p>
            </div>
          </section>

          {/* Main Counter Tap Area */}
          <section className="relative flex flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm backdrop-blur-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900/90">
            {/* Completion Status Banner */}
            {targetReached && (
              <div
                className="mb-4 flex w-full flex-wrap items-center justify-between gap-2 rounded-2xl border px-4 py-2.5 text-xs sm:text-sm"
                style={{
                  backgroundColor: settings.darkMode ? 'rgba(16,185,129,0.12)' : accentSoftBg,
                  borderColor: settings.darkMode ? 'rgba(16,185,129,0.3)' : 'rgba(0,0,0,0.06)',
                  color: settings.darkMode ? '#6EE7B7' : accentTextHex,
                }}
              >
                <span className="inline-flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  {t.counter.targetReached}
                </span>
                {!counter.prayerMode.active && (
                  <button
                    type="button"
                    onClick={onNewRound}
                    style={{ backgroundColor: accentHex }}
                    className="min-h-[36px] rounded-xl px-3 py-1 text-xs font-semibold text-white transition-transform active:scale-95"
                  >
                    {t.counter.newRound}
                  </button>
                )}
              </div>
            )}

            {/* Style 1: Classic Ring */}
            {settings.counterStyle === 'ring' && (
              <button
                type="button"
                onClick={handleTap}
                aria-label={`${t.counter.tapAction} ${t.counter.tapSubtitle} (${counter.count} / ${counter.target})`}
                className={`group relative flex h-64 w-64 select-none items-center justify-center rounded-full transition-transform duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/40 sm:h-72 sm:w-72 ${
                  tapPressed ? 'scale-[0.97]' : 'scale-100 hover:scale-[1.01]'
                }`}
              >
                {justCompletedPulse > 0 && (
                  <span
                    key={justCompletedPulse}
                    aria-hidden="true"
                    className="animate-completion-ring pointer-events-none absolute inset-0 rounded-full border-4"
                    style={{ borderColor: accentHex }}
                  />
                )}

                <svg
                  className="h-full w-full -rotate-90"
                  viewBox="0 0 240 240"
                >
                  <circle
                    cx="120"
                    cy="120"
                    r={radius}
                    fill="none"
                    stroke={ringTrackHex}
                    strokeWidth="12"
                  />
                  <circle
                    cx="120"
                    cy="120"
                    r={radius}
                    fill="none"
                    stroke={accentHex}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-[stroke-dashoffset] duration-150 ease-out"
                  />
                </svg>

                <div className="absolute inset-4 flex flex-col items-center justify-center overflow-hidden rounded-full border border-[#C89B3C]/35 bg-slate-50/80 px-4 text-center shadow-inner dark:border-[#C89B3C]/30 dark:bg-slate-950/75">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {t.counter.currentCount}
                  </span>
                  <span
                    className={`font-mono-num mt-0.5 font-bold leading-none tracking-tight text-slate-900 dark:text-white ${
                      counter.count >= 10000
                        ? 'text-4xl sm:text-5xl'
                        : counter.count >= 1000
                        ? 'text-5xl sm:text-6xl'
                        : 'text-6xl sm:text-7xl'
                    }`}
                  >
                    {counter.count}
                  </span>
                  <span className="font-mono-num mt-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 sm:text-sm">
                    / {counter.target}
                  </span>
                  <div className="mt-2 flex max-w-[140px] flex-col items-center leading-tight">
                    <span
                      className="text-xs font-semibold sm:text-sm"
                      style={{ color: settings.darkMode ? '#6EE7B7' : accentHex }}
                    >
                      {t.counter.tapAction}
                    </span>
                    <span className="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                      {t.counter.tapSubtitle}
                    </span>
                  </div>
                </div>
              </button>
            )}

            {/* Style 2: Tactile Pad */}
            {settings.counterStyle === 'pad' && (
              <button
                type="button"
                onClick={handleTap}
                aria-label={`${t.counter.tapAction} ${t.counter.tapSubtitle} (${counter.count} / ${counter.target})`}
                style={{
                  borderColor: targetReached ? accentHex : undefined,
                }}
                className={`relative flex min-h-[256px] w-full select-none flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-slate-200 bg-slate-50 p-6 transition-transform duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/40 dark:border-slate-800 dark:bg-slate-950/70 ${
                  tapPressed ? 'scale-[0.98]' : 'scale-100'
                }`}
              >
                {justCompletedPulse > 0 && (
                  <span
                    key={justCompletedPulse}
                    aria-hidden="true"
                    className="animate-completion-ring pointer-events-none absolute inset-2 rounded-2xl border-2"
                    style={{ borderColor: accentHex }}
                  />
                )}
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {t.counter.currentCount}
                </span>
                <span
                  className={`font-mono-num mt-2 font-bold tracking-tight text-slate-900 dark:text-white ${
                    counter.count >= 10000 ? 'text-5xl sm:text-6xl' : 'text-6xl sm:text-7xl'
                  }`}
                >
                  {counter.count}
                </span>
                <span className="font-mono-num mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {t.counter.target}: {counter.target} · {progressPercent}%
                </span>
                <div className="mt-6 h-2.5 w-full max-w-xs overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-150"
                    style={{
                      width: `${Math.min(100, progressPercent)}%`,
                      backgroundColor: accentHex,
                    }}
                  />
                </div>
                <span className="mt-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {t.counter.tapAction} · <span className="font-normal text-slate-400">{t.counter.tapSubtitle}</span>
                </span>
              </button>
            )}

            {/* Style 3: Minimal Zen */}
            {settings.counterStyle === 'minimal' && (
              <button
                type="button"
                onClick={handleTap}
                aria-label={`${t.counter.tapAction} ${t.counter.tapSubtitle} (${counter.count} / ${counter.target})`}
                className={`relative flex min-h-[256px] w-full select-none flex-col items-center justify-center rounded-3xl p-6 transition-transform duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/40 ${
                  tapPressed ? 'scale-[0.985]' : 'scale-100'
                }`}
              >
                <span
                  className={`font-mono-num font-bold tracking-tight ${
                    counter.count >= 10000 ? 'text-5xl sm:text-7xl' : 'text-6xl sm:text-8xl'
                  }`}
                  style={{ color: settings.darkMode ? '#F8FAFC' : accentHex }}
                >
                  {counter.count}
                </span>
                <div className="mt-4 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-mono-num">
                    {t.counter.target}: {counter.target}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">{progressPercent}%</span>
                </div>
                <div className="mt-5 h-1.5 w-48 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-150"
                    style={{
                      width: `${Math.min(100, progressPercent)}%`,
                      backgroundColor: accentHex,
                    }}
                  />
                </div>
                <span className="mt-5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {t.counter.tapAction} · <span className="font-normal text-slate-400">{t.counter.tapSubtitle}</span>
                </span>
              </button>
            )}

            {/* Action Toolbar below tap area */}
            <div className="mt-6 grid w-full grid-cols-4 gap-1.5 sm:gap-3">
              <button
                type="button"
                onClick={onUndo}
                disabled={counter.count === 0}
                className="flex min-h-[50px] flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-1.5 py-2 text-[11px] font-medium leading-tight text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-2 sm:text-xs dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Undo2 className="h-4 w-4 shrink-0" />
                <span className="max-w-full truncate">{t.counter.undo}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (counter.count > 0) {
                    setShowResetConfirm(true);
                  }
                }}
                disabled={counter.count === 0}
                className="flex min-h-[50px] flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-1.5 py-2 text-[11px] font-medium leading-tight text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-2 sm:text-xs dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4 shrink-0" />
                <span className="max-w-full truncate">{t.counter.reset}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTargetModal(true)}
                className="flex min-h-[50px] flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-1.5 py-2 text-[11px] font-medium leading-tight text-slate-700 transition-colors hover:bg-slate-100 sm:px-2 sm:text-xs dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Target className="h-4 w-4 shrink-0" />
                <span className="font-mono-num max-w-full truncate">
                  {t.counter.changeTarget} ({counter.target})
                </span>
              </button>

              <button
                type="button"
                onClick={onToggleWakeLock}
                disabled={!wakeSupported}
                title={!wakeSupported ? t.counter.wakeLockUnsupported : t.counter.wakeLock}
                style={
                  settings.wakeLockEnabled && wakeSupported
                    ? {
                        borderColor: accentHex,
                        backgroundColor: settings.darkMode ? 'rgba(16,185,129,0.14)' : accentSoftBg,
                        color: settings.darkMode ? '#6EE7B7' : accentTextHex,
                      }
                    : undefined
                }
                className="flex min-h-[50px] flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-1.5 py-2 text-[11px] font-medium leading-tight text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-45 sm:px-2 sm:text-xs dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Sun className="h-4 w-4 shrink-0" />
                <span className="max-w-full truncate">
                  {wakeActive ? t.counter.wakeLockActive : t.counter.wakeLock}
                </span>
              </button>
            </div>

            <p className="mt-3 hidden text-xs text-slate-400 md:block dark:text-slate-500">
              {t.counter.keyboardHint}
            </p>
          </section>
        </div>

        {/* Side Column (Desktop 5 cols, Mobile stacked cleanly below) */}
        <aside className="space-y-5 lg:col-span-5">
          {/* Daily Goal Card */}
          <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t.counter.dailyProgress}
              </h2>
              <span className="font-mono-num text-sm font-semibold text-slate-700 dark:text-slate-200">
                {todayTotal} / {settings.dailyGoal}
              </span>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${dailyGoalPercent}%`,
                  backgroundColor: accentHex,
                }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono-num">{dailyGoalPercent}%</span>
              <span>
                {t.counter.rounds}: <strong className="font-mono-num">{counter.roundsCompletedToday}</strong>
              </span>
            </div>
          </section>

          {/* Quick Target Presets */}
          <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t.counter.changeTarget}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {allPresets.map((preset) => {
                const isSelected = counter.target === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => onChangeTarget(preset)}
                    style={
                      isSelected
                        ? { backgroundColor: accentHex, borderColor: accentHex, color: '#ffffff' }
                        : undefined
                    }
                    className={`font-mono-num min-h-[42px] min-w-[58px] rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors ${
                      isSelected
                        ? 'shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setShowTargetModal(true)}
                className="min-h-[42px] rounded-xl border border-dashed border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                + {t.counter.customTarget}
              </button>
            </div>
          </section>

          {/* After-Prayer Sunnah Sequence Card */}
          <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t.counter.prayerMode}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {t.counter.prayerModeDesc}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onTogglePrayerMode}
                style={
                  counter.prayerMode.active
                    ? undefined
                    : { backgroundColor: accentHex, color: '#ffffff' }
                }
                className={`min-h-[44px] flex-1 rounded-xl px-4 py-2 text-xs font-semibold transition-transform active:scale-[0.98] ${
                  counter.prayerMode.active
                    ? 'border border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
                    : ''
                }`}
              >
                {counter.prayerMode.active ? t.counter.exitPrayerMode : t.counter.prayerModeShort}
              </button>
              <button
                type="button"
                onClick={onOpenDhikrLibrary}
                className="min-h-[44px] rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {t.counter.switchDhikr}
              </button>
            </div>
          </section>
        </aside>
      </div>

      {/* Confirm Reset Dialog */}
      <ConfirmModal
        open={showResetConfirm}
        title={t.counter.confirmResetTitle}
        message={t.counter.confirmResetMessage}
        confirmLabel={t.common.reset}
        cancelLabel={t.common.cancel}
        destructive
        onConfirm={() => {
          onReset();
          setShowResetConfirm(false);
        }}
        onCancel={() => setShowResetConfirm(false)}
      />

      {/* Custom Target Modal */}
      {showTargetModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t.counter.changeTarget}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {allPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    onChangeTarget(preset);
                    setShowTargetModal(false);
                  }}
                  style={
                    counter.target === preset
                      ? { backgroundColor: accentHex, color: '#fff', borderColor: accentHex }
                      : undefined
                  }
                  className="font-mono-num min-h-[42px] rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {preset}
                </button>
              ))}
            </div>
            <form onSubmit={handleApplyCustomTarget} className="mt-5">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                {t.counter.customTarget}
              </label>
              <div className="mt-1.5 flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={100000}
                  value={customTargetInput}
                  onChange={(e) => setCustomTargetInput(e.target.value)}
                  className="font-mono-num min-h-[44px] flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
                <button
                  type="submit"
                  style={{ backgroundColor: accentHex }}
                  className="min-h-[44px] rounded-xl px-4 py-2 text-sm font-semibold text-white"
                >
                  {t.counter.applyTarget}
                </button>
              </div>
            </form>
            <button
              type="button"
              onClick={() => setShowTargetModal(false)}
              className="mt-4 min-h-[44px] w-full rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {t.common.close}
            </button>
          </div>
        </div>
      )}

      {/* Quick Dhikr Picker Modal */}
      {showDhikrPicker && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[82vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:rounded-3xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {t.counter.switchDhikr}
              </h3>
              <button
                type="button"
                onClick={() => setShowDhikrPicker(false)}
                className="min-h-[40px] rounded-xl px-3 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {t.common.close}
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {dhikrs.map((item) => {
                const isSelected = item.id === activeDhikr.id;
                const title =
                  settings.language === 'bn'
                    ? item.transliterationBn
                    : item.transliterationEn;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectDhikr(item.id);
                      setShowDhikrPicker(false);
                    }}
                    style={
                      isSelected
                        ? {
                            borderColor: accentHex,
                            backgroundColor: settings.darkMode ? 'rgba(16,185,129,0.12)' : accentSoftBg,
                          }
                        : undefined
                    }
                    className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 p-3.5 text-start transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
                  >
                    <div className="min-w-0 flex-1">
                      <p dir="rtl" className="font-arabic text-lg font-bold text-slate-900 dark:text-slate-100">
                        {item.arabic}
                      </p>
                      <p className="mt-0.5 truncate text-xs font-medium text-slate-600 dark:text-slate-300">
                        {title}
                      </p>
                    </div>
                    <span className="font-mono-num shrink-0 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {item.recommendedCount}×
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
