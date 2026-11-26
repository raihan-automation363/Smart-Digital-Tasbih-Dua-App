import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Download,
  Trash2,
  Upload,
} from 'lucide-react';
import { TranslationDict } from '../i18n/translations';
import { AppState } from '../types';
import { getLocalDateKey, validateBackupJson } from '../utils/storage';
import { ConfirmModal } from './ConfirmModal';

interface StatsViewProps {
  t: TranslationDict;
  state: AppState;
  todayTotal: number;
  accentHex: string;
  onUpdateDailyGoal: (goal: number) => void;
  onClearHistory: () => void;
  onImportState: (newState: AppState) => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  t,
  state,
  todayTotal,
  accentHex,
  onUpdateDailyGoal,
  onClearHistory,
  onImportState,
}) => {
  const [goalInput, setGoalInput] = useState(String(state.settings.dailyGoal));
  const [goalSaved, setGoalSaved] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [backupMessage, setBackupMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setGoalInput(String(state.settings.dailyGoal));
  }, [state.settings.dailyGoal]);

  const last7Days = useMemo(() => {
    const days: { key: string; label: string; count: number }[] = [];
    const locale =
      state.settings.language === 'bn'
        ? 'bn-BD'
        : state.settings.language === 'ar'
        ? 'ar-SA'
        : 'en-US';

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = getLocalDateKey(d);
      const label = d.toLocaleDateString(locale, { weekday: 'short' });
      days.push({
        key,
        label,
        count: state.dailyTotals[key] || 0,
      });
    }
    return days;
  }, [state.dailyTotals, state.settings.language]);

  const maxDayCount = useMemo(
    () => Math.max(state.settings.dailyGoal, ...last7Days.map((d) => d.count), 10),
    [last7Days, state.settings.dailyGoal]
  );

  const topDhikrs = useMemo(() => {
    const map = new Map<string, { title: string; count: number }>();
    for (const s of state.sessions) {
      const title =
        state.settings.language === 'bn' ? s.dhikrTitleBn : s.dhikrTitleEn;
      const existing = map.get(s.dhikrId);
      if (existing) {
        existing.count += s.count;
      } else {
        map.set(s.dhikrId, { title, count: s.count });
      }
    }
    return Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [state.sessions, state.settings.language]);

  const maxTopCount = topDhikrs.length > 0 ? topDhikrs[0].count : 1;

  const dailyProgressPct = Math.min(
    100,
    Math.round((todayTotal / Math.max(1, state.settings.dailyGoal)) * 100)
  );

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(goalInput, 10);
    if (!Number.isNaN(val) && val > 0 && val <= 100000) {
      onUpdateDailyGoal(val);
      setGoalSaved(true);
      window.setTimeout(() => setGoalSaved(false), 1500);
    }
  };

  const handleExport = () => {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `noor-tasbih-backup-${getLocalDateKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const restored = validateBackupJson(text);
      if (!restored) {
        setBackupMessage({ type: 'error', text: t.stats.importError });
      } else {
        onImportState(restored);
        setBackupMessage({ type: 'success', text: t.stats.importSuccess });
      }
    } catch {
      setBackupMessage({ type: 'error', text: t.stats.importError });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 pb-24 sm:px-6 md:py-8 md:pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t.stats.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {t.stats.subtitle}
        </p>
      </div>

      {/* KPI Row */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t.stats.todayTotal}
          </p>
          <p className="font-mono-num mt-1 text-3xl font-bold text-slate-900 dark:text-white">
            {todayTotal}
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${dailyProgressPct}%`, backgroundColor: accentHex }}
            />
          </div>
          <p className="font-mono-num mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            {dailyProgressPct}% · {t.stats.dailyGoal}: {state.settings.dailyGoal}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t.stats.overallTotal}
          </p>
          <p className="font-mono-num mt-1 text-3xl font-bold text-slate-900 dark:text-white">
            {state.totalLifetimeCount}
          </p>
          <form onSubmit={handleGoalSubmit} className="mt-3 flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={100000}
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              aria-label={t.stats.dailyGoal}
              className="font-mono-num min-h-[38px] w-24 rounded-xl border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
            <button
              type="submit"
              className="min-h-[38px] rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {goalSaved ? t.common.done : t.stats.editGoal}
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t.stats.completedTargets}
          </p>
          <p className="font-mono-num mt-1 text-3xl font-bold text-slate-900 dark:text-white">
            {state.totalTargetsCompleted}
          </p>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {t.stats.sessionHistoryTitle}:{' '}
            <strong className="font-mono-num text-slate-700 dark:text-slate-200">
              {state.sessions.length}
            </strong>
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 7-Day Activity Chart */}
        <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm lg:col-span-7 dark:border-slate-800 dark:bg-slate-900/90">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t.stats.weeklyChartTitle}
          </h2>
          <div className="mt-5 grid h-48 grid-cols-7 items-end gap-2 sm:gap-3">
            {last7Days.map((day) => {
              const heightPct = Math.max(4, Math.round((day.count / maxDayCount) * 100));
              const isToday = day.key === getLocalDateKey();
              return (
                <div key={day.key} className="flex h-full flex-col items-center justify-end gap-1.5">
                  <span className="font-mono-num text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {day.count > 0 ? day.count : ''}
                  </span>
                  <div className="flex w-full flex-1 items-end justify-center">
                    <div
                      className="w-full max-w-[34px] rounded-t-xl transition-all duration-300"
                      style={{
                        height: `${day.count > 0 ? heightPct : 4}%`,
                        backgroundColor:
                          day.count > 0
                            ? accentHex
                            : state.settings.darkMode
                            ? '#1E293B'
                            : '#E2E8F0',
                        opacity: isToday || day.count === 0 ? 1 : 0.78,
                      }}
                    />
                  </div>
                  <span
                    className={`text-[11px] font-medium ${
                      isToday
                        ? 'font-bold text-slate-900 dark:text-white'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Top Dhikrs Breakdown */}
        <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm lg:col-span-5 dark:border-slate-800 dark:bg-slate-900/90">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t.stats.topDhikrsTitle}
          </h2>
          {topDhikrs.length === 0 ? (
            <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
              {t.stats.noHistory}
            </p>
          ) : (
            <div className="mt-4 space-y-3.5">
              {topDhikrs.map((item, idx) => {
                const pct = Math.round((item.count / maxTopCount) * 100);
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="truncate font-medium text-slate-800 dark:text-slate-200">
                        {item.title}
                      </span>
                      <span className="font-mono-num shrink-0 font-semibold text-slate-600 dark:text-slate-300">
                        {item.count}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: accentHex }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Backup & Restore */}
      <section className="mt-6 rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t.stats.backupTitle}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {t.stats.backupDesc}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleExport}
              style={{ backgroundColor: accentHex }}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white transition-transform active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />
              <span>{t.stats.exportJson}</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Upload className="h-4 w-4" />
              <span>{t.stats.importJson}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>
        </div>
        {backupMessage && (
          <p
            className={`mt-3 text-xs font-medium ${
              backupMessage.type === 'success'
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {backupMessage.text}
          </p>
        )}
      </section>

      {/* Session History */}
      <section className="mt-6 rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t.stats.sessionHistoryTitle}
          </h2>
          {state.sessions.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/30"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{t.stats.clearHistory}</span>
            </button>
          )}
        </div>

        {state.sessions.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {t.stats.noHistory}
          </p>
        ) : (
          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {state.sessions.slice(0, 40).map((session) => {
              const title =
                state.settings.language === 'bn'
                  ? session.dhikrTitleBn
                  : session.dhikrTitleEn;
              const dateStr = new Date(session.timestamp).toLocaleString(
                state.settings.language === 'bn'
                  ? 'bn-BD'
                  : state.settings.language === 'ar'
                  ? 'ar-SA'
                  : 'en-US',
                { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
              );
              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {dateStr}
                      {session.completedTarget && (
                        <>
                          {' · '}
                          <span className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="inline h-3 w-3" />
                            {t.stats.targetHit}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="font-mono-num shrink-0 text-right">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {session.count}
                    </span>
                    <span className="text-xs text-slate-400"> / {session.target}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <ConfirmModal
        open={showClearConfirm}
        title={t.stats.confirmClearTitle}
        message={t.stats.confirmClearMessage}
        confirmLabel={t.stats.clearHistory}
        cancelLabel={t.common.cancel}
        destructive
        onConfirm={() => {
          onClearHistory();
          setShowClearConfirm(false);
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
};
