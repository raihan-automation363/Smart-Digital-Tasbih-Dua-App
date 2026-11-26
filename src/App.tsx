import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { BottomNav } from './components/BottomNav';
import { CounterView, PRAYER_MODE_STEPS } from './components/CounterView';
import { DhikrLibraryView } from './components/DhikrLibraryView';
import { DuaLibraryView } from './components/DuaLibraryView';
import { HeaderBar } from './components/HeaderBar';
import { IslamicPatternBg } from './components/IslamicPatternBg';
import { OnboardingModal } from './components/OnboardingModal';
import { SettingsView } from './components/SettingsView';
import { StatsView } from './components/StatsView';
import { DEFAULT_DUAS } from './data/defaultDuas';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { TRANSLATIONS } from './i18n/translations';
import {
  AppSettings,
  AppState,
  DhikrItem,
  DuaItem,
  QuranPassage,
  SessionRecord,
  TabRoute,
} from './types';
import { playCompletionSound, playTapSound } from './utils/audio';
import { triggerCompletionVibration, triggerTapVibration } from './utils/haptics';
import {
  getLocalDateKey,
  loadAppState,
  resetAllStoredState,
  saveAppState,
} from './utils/storage';
import { getThemeTokens, isLightColor } from './utils/themes';

export default function App() {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const stateRef = useRef<AppState>(state);
  stateRef.current = state;

  const [activeTab, setActiveTab] = useState<TabRoute>('counter');
  const [justCompletedPulse, setJustCompletedPulse] = useState(0);
  const [prayerCompleteBanner, setPrayerCompleteBanner] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(
    () => !state.settings.hasCompletedOnboarding
  );

  const isOnline = useOnlineStatus();
  const t = TRANSLATIONS[state.settings.language];
  const themeTokens = getThemeTokens(state.settings.themePreset);
  const accentHex = state.settings.darkMode
    ? themeTokens.accentDarkHex
    : themeTokens.accentHex;
  const accentSoftBg = state.settings.darkMode
    ? themeTokens.accentSoftDark
    : themeTokens.accentSoftLight;
  const accentTextHex = state.settings.darkMode
    ? themeTokens.accentTextDark
    : themeTokens.accentTextLight;
  const ringTrackHex = state.settings.darkMode
    ? themeTokens.ringTrackDark
    : themeTokens.ringTrackLight;

  // Persist every state change locally
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Apply Dark mode, Language, and RTL direction on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (state.settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    if (state.settings.language === 'ar') {
      root.setAttribute('dir', 'rtl');
      root.setAttribute('lang', 'ar');
    } else {
      root.setAttribute('dir', 'ltr');
      root.setAttribute('lang', state.settings.language);
    }

    // Update browser theme-color meta tag
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', accentHex);
    }
  }, [state.settings.darkMode, state.settings.language, accentHex]);

  const activeDhikr = useMemo(() => {
    return (
      state.dhikrs.find((d) => d.id === state.counter.activeDhikrId) ||
      state.dhikrs[0]
    );
  }, [state.dhikrs, state.counter.activeDhikrId]);

  const todayKey = getLocalDateKey();
  const todayTotal = state.dailyTotals[todayKey] || 0;

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...patch },
    }));
  }, []);

  const recordSessionIfNeeded = (
    prevState: AppState,
    completed: boolean,
    explicitCount?: number
  ): SessionRecord[] => {
    const countToLog =
      typeof explicitCount === 'number' ? explicitCount : prevState.counter.count;
    if (countToLog <= 0) return prevState.sessions;

    const dhikr =
      prevState.dhikrs.find((d) => d.id === prevState.counter.activeDhikrId) ||
      prevState.dhikrs[0];

    const record: SessionRecord = {
      id: `sess-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      dhikrId: dhikr.id,
      dhikrTitleEn: dhikr.transliterationEn,
      dhikrTitleBn: dhikr.transliterationBn,
      dhikrArabic: dhikr.arabic,
      count: countToLog,
      target: prevState.counter.target,
      completedTarget: completed,
      timestamp: new Date().toISOString(),
      dateKey: getLocalDateKey(),
      isPrayerMode: prevState.counter.prayerMode.active,
    };

    return [record, ...prevState.sessions].slice(0, 200);
  };

  const handleIncrement = useCallback(() => {
    const prev = stateRef.current;
    const nextCount = prev.counter.count + 1;
    const reachedTarget = nextCount === prev.counter.target;
    const dateKey = getLocalDateKey();
    const prevDaily = prev.dailyTotals[dateKey] || 0;

    setPrayerCompleteBanner(false);

    // Side effects triggered outside state updater for React StrictMode purity
    if (reachedTarget) {
      if (prev.settings.completionSoundEnabled) {
        playCompletionSound();
      } else if (prev.settings.soundEnabled) {
        playTapSound(prev.settings.soundStyle);
      }
      if (prev.settings.completionVibrationEnabled) {
        triggerCompletionVibration();
      } else if (prev.settings.vibrationEnabled) {
        triggerTapVibration();
      }
      setJustCompletedPulse((n) => n + 1);
    } else {
      if (prev.settings.soundEnabled) {
        playTapSound(prev.settings.soundStyle);
      }
      if (prev.settings.vibrationEnabled) {
        triggerTapVibration();
      }
    }

    let nextState: AppState;

    // Handle After-Prayer Mode auto-advance when target is reached
    if (prev.counter.prayerMode.active && reachedTarget) {
      const loggedSessions = recordSessionIfNeeded(
        { ...prev, counter: { ...prev.counter, count: nextCount } },
        true,
        nextCount
      );

      const nextStepIdx = prev.counter.prayerMode.stepIndex + 1;
      if (nextStepIdx < PRAYER_MODE_STEPS.length) {
        const nextStep = PRAYER_MODE_STEPS[nextStepIdx];
        nextState = {
          ...prev,
          counter: {
            ...prev.counter,
            activeDhikrId: nextStep.dhikrId,
            count: 0,
            target: nextStep.target,
            roundsCompletedToday: prev.counter.roundsCompletedToday + 1,
            prayerMode: {
              active: true,
              stepIndex: nextStepIdx,
            },
          },
          sessions: loggedSessions,
          dailyTotals: {
            ...prev.dailyTotals,
            [dateKey]: prevDaily + 1,
          },
          totalLifetimeCount: prev.totalLifetimeCount + 1,
          totalTargetsCompleted: prev.totalTargetsCompleted + 1,
        };
      } else {
        // Completed full 33-33-34-1 sequence
        setPrayerCompleteBanner(true);
        nextState = {
          ...prev,
          counter: {
            ...prev.counter,
            activeDhikrId: PRAYER_MODE_STEPS[0].dhikrId,
            count: 0,
            target: PRAYER_MODE_STEPS[0].target,
            roundsCompletedToday: prev.counter.roundsCompletedToday + 1,
            prayerMode: {
              active: false,
              stepIndex: 0,
            },
          },
          sessions: loggedSessions,
          dailyTotals: {
            ...prev.dailyTotals,
            [dateKey]: prevDaily + 1,
          },
          totalLifetimeCount: prev.totalLifetimeCount + 1,
          totalTargetsCompleted: prev.totalTargetsCompleted + 1,
        };
      }
    } else {
      nextState = {
        ...prev,
        counter: {
          ...prev.counter,
          count: nextCount,
          roundsCompletedToday: reachedTarget
            ? prev.counter.roundsCompletedToday + 1
            : prev.counter.roundsCompletedToday,
        },
        sessions: reachedTarget
          ? recordSessionIfNeeded(
              { ...prev, counter: { ...prev.counter, count: nextCount } },
              true,
              nextCount
            )
          : prev.sessions,
        dailyTotals: {
          ...prev.dailyTotals,
          [dateKey]: prevDaily + 1,
        },
        totalLifetimeCount: prev.totalLifetimeCount + 1,
        totalTargetsCompleted: reachedTarget
          ? prev.totalTargetsCompleted + 1
          : prev.totalTargetsCompleted,
      };
    }

    stateRef.current = nextState;
    setState(nextState);
  }, []);

  const handleUndo = useCallback(() => {
    setState((prev) => {
      if (prev.counter.count <= 0) return prev;
      const dateKey = getLocalDateKey();
      const prevDaily = prev.dailyTotals[dateKey] || 0;
      const wasAtTarget = prev.counter.count === prev.counter.target;
      return {
        ...prev,
        counter: {
          ...prev.counter,
          count: prev.counter.count - 1,
        },
        dailyTotals: {
          ...prev.dailyTotals,
          [dateKey]: Math.max(0, prevDaily - 1),
        },
        totalLifetimeCount: Math.max(0, prev.totalLifetimeCount - 1),
        totalTargetsCompleted: wasAtTarget
          ? Math.max(0, prev.totalTargetsCompleted - 1)
          : prev.totalTargetsCompleted,
      };
    });
  }, []);

  const handleReset = useCallback(() => {
    setState((prev) => {
      const shouldLogPartial =
        prev.counter.count > 0 && prev.counter.count < prev.counter.target;
      const nextSessions = shouldLogPartial
        ? recordSessionIfNeeded(prev, false)
        : prev.sessions;
      return {
        ...prev,
        counter: {
          ...prev.counter,
          count: 0,
        },
        sessions: nextSessions,
      };
    });
  }, []);

  const handleNewRound = useCallback(() => {
    setState((prev) => ({
      ...prev,
      counter: {
        ...prev.counter,
        count: 0,
      },
    }));
  }, []);

  const handleChangeTarget = useCallback((newTarget: number) => {
    setState((prev) => ({
      ...prev,
      counter: {
        ...prev.counter,
        target: newTarget,
      },
    }));
  }, []);

  const handleSelectDhikr = useCallback((dhikrId: string) => {
    setState((prev) => {
      const found = prev.dhikrs.find((d) => d.id === dhikrId);
      if (!found) return prev;
      const nextSessions =
        prev.counter.count > 0 && prev.counter.count < prev.counter.target
          ? recordSessionIfNeeded(prev, false)
          : prev.sessions;
      return {
        ...prev,
        counter: {
          ...prev.counter,
          activeDhikrId: found.id,
          count: 0,
          target: found.recommendedCount || 33,
          prayerMode: { active: false, stepIndex: 0 },
        },
        sessions: nextSessions,
      };
    });
  }, []);

  const handleTogglePrayerMode = useCallback(() => {
    setPrayerCompleteBanner(false);
    setActiveTab('counter');
    setState((prev) => {
      if (prev.counter.prayerMode.active) {
        return {
          ...prev,
          counter: {
            ...prev.counter,
            prayerMode: { active: false, stepIndex: 0 },
          },
        };
      }
      const firstStep = PRAYER_MODE_STEPS[0];
      return {
        ...prev,
        counter: {
          ...prev.counter,
          activeDhikrId: firstStep.dhikrId,
          count: 0,
          target: firstStep.target,
          prayerMode: { active: true, stepIndex: 0 },
        },
      };
    });
  }, []);

  const handleToggleFavouriteDhikr = useCallback((dhikrId: string) => {
    setState((prev) => {
      const exists = prev.favouriteDhikrIds.includes(dhikrId);
      return {
        ...prev,
        favouriteDhikrIds: exists
          ? prev.favouriteDhikrIds.filter((id) => id !== dhikrId)
          : [...prev.favouriteDhikrIds, dhikrId],
      };
    });
  }, []);

  const handleSaveDhikr = useCallback((item: DhikrItem) => {
    setState((prev) => {
      const exists = prev.dhikrs.some((d) => d.id === item.id);
      return {
        ...prev,
        dhikrs: exists
          ? prev.dhikrs.map((d) => (d.id === item.id ? item : d))
          : [item, ...prev.dhikrs],
      };
    });
  }, []);

  const handleDeleteDhikr = useCallback((dhikrId: string) => {
    setState((prev) => {
      const remaining = prev.dhikrs.filter((d) => d.id !== dhikrId);
      const nextActive =
        prev.counter.activeDhikrId === dhikrId && remaining.length > 0
          ? remaining[0].id
          : prev.counter.activeDhikrId;
      return {
        ...prev,
        dhikrs: remaining,
        favouriteDhikrIds: prev.favouriteDhikrIds.filter((id) => id !== dhikrId),
        counter: {
          ...prev.counter,
          activeDhikrId: nextActive,
        },
      };
    });
  }, []);

  const handleToggleFavouriteDua = useCallback((duaId: string) => {
    setState((prev) => {
      const exists = prev.favouriteDuaIds.includes(duaId);
      return {
        ...prev,
        favouriteDuaIds: exists
          ? prev.favouriteDuaIds.filter((id) => id !== duaId)
          : [...prev.favouriteDuaIds, duaId],
      };
    });
  }, []);

  const handleSaveDua = useCallback((dua: DuaItem) => {
    setState((prev) => {
      const exists = prev.duas.some((d) => d.id === dua.id);
      return {
        ...prev,
        duas: exists
          ? prev.duas.map((d) => (d.id === dua.id ? dua : d))
          : [dua, ...prev.duas],
      };
    });
  }, []);

  const handleDeleteDua = useCallback((duaId: string) => {
    setState((prev) => ({
      ...prev,
      duas: prev.duas.filter((d) => d.id !== duaId),
      favouriteDuaIds: prev.favouriteDuaIds.filter((id) => id !== duaId),
    }));
  }, []);

  const handleRestoreDefaultDua = useCallback((duaId: string) => {
    const original = DEFAULT_DUAS.find((d) => d.id === duaId);
    if (!original) return;
    setState((prev) => ({
      ...prev,
      duas: prev.duas.map((d) => (d.id === duaId ? { ...original } : d)),
    }));
  }, []);

  const handleCountDuaInTasbih = useCallback((dua: DuaItem) => {
    const tempDhikrId = `dhikr-from-${dua.id}`;
    const targetCount = dua.recommendedCount || 33;
    setState((prev) => {
      const nextSessions =
        prev.counter.count > 0 && prev.counter.count < prev.counter.target
          ? recordSessionIfNeeded(prev, false)
          : prev.sessions;
      const existing = prev.dhikrs.find((d) => d.id === tempDhikrId);
      const entry: DhikrItem = existing || {
        id: tempDhikrId,
        arabic: dua.arabic,
        transliterationEn: dua.transliterationEn || dua.titleEn,
        transliterationBn: dua.transliterationBn || dua.titleBn,
        meaningEn: dua.translationEn,
        meaningBn: dua.translationBn,
        meaningAr: dua.translationAr,
        recommendedCount: targetCount,
        countVerified: dua.countVerified,
        sourceEn: dua.sourceEn,
        sourceBn: dua.sourceBn,
        sourceAr: dua.sourceAr,
        isCustom: true,
      };
      return {
        ...prev,
        dhikrs: existing ? prev.dhikrs : [entry, ...prev.dhikrs],
        sessions: nextSessions,
        counter: {
          ...prev.counter,
          activeDhikrId: entry.id,
          count: 0,
          target: targetCount,
          prayerMode: { active: false, stepIndex: 0 },
        },
      };
    });
    setActiveTab('counter');
  }, []);

  const handleToggleFavouriteQuran = useCallback((passageId: string) => {
    setState((prev) => {
      const exists = prev.favouriteQuranIds.includes(passageId);
      return {
        ...prev,
        favouriteQuranIds: exists
          ? prev.favouriteQuranIds.filter((id) => id !== passageId)
          : [...prev.favouriteQuranIds, passageId],
      };
    });
  }, []);

  const handleCountQuranPassage = useCallback((passage: QuranPassage) => {
    const tempDhikrId = `dhikr-from-${passage.id}`;
    const targetCount = passage.recommendedCount || 1;
    const combinedArabic = passage.verses
      .map((v) => `${v.arabic} ﴿${v.verseNumber.toLocaleString('ar-EG')}﴾`)
      .join(' ');
    const combinedTranslitEn = passage.verses.map((v) => v.transliterationEn).join(' · ');
    const combinedTranslitBn = passage.verses.map((v) => v.transliterationBn).join(' · ');
    const combinedTransEn = passage.verses.map((v) => v.translationEn).join(' ');
    const combinedTransBn = passage.verses.map((v) => v.translationBn).join(' ');

    setState((prev) => {
      const nextSessions =
        prev.counter.count > 0 && prev.counter.count < prev.counter.target
          ? recordSessionIfNeeded(prev, false)
          : prev.sessions;
      const existing = prev.dhikrs.find((d) => d.id === tempDhikrId);
      const entry: DhikrItem = existing || {
        id: tempDhikrId,
        arabic: combinedArabic,
        transliterationEn: `${passage.titleEn} (${passage.verseRange})`,
        transliterationBn: `${passage.titleBn} (${passage.verseRange})`,
        meaningEn: combinedTransEn || combinedTranslitEn,
        meaningBn: combinedTransBn || combinedTranslitBn,
        meaningAr: `${passage.surahNameAr} (${passage.verseRange})`,
        recommendedCount: targetCount,
        countVerified: true,
        sourceEn: passage.sourceNoteEn,
        sourceBn: passage.sourceNoteBn,
        sourceAr: passage.sourceNoteAr,
        isCustom: true,
      };
      return {
        ...prev,
        dhikrs: existing ? prev.dhikrs : [entry, ...prev.dhikrs],
        sessions: nextSessions,
        counter: {
          ...prev.counter,
          activeDhikrId: entry.id,
          count: 0,
          target: targetCount,
          prayerMode: { active: false, stepIndex: 0 },
        },
      };
    });
    setActiveTab('counter');
  }, []);

  const handleClearHistory = useCallback(() => {
    setState((prev) => ({
      ...prev,
      sessions: [],
    }));
  }, []);

  const handleResetAllData = useCallback(() => {
    const fresh = resetAllStoredState();
    setState(fresh);
    setActiveTab('counter');
    setPrayerCompleteBanner(false);
  }, []);

  const customBg = state.settings.customBgColor;
  const pageBackground =
    customBg ||
    (state.settings.darkMode ? themeTokens.darkBg : themeTokens.lightBg);

  const customBgNeedsDarkText = customBg ? isLightColor(customBg) : !state.settings.darkMode;

  return (
    <div
      style={{ backgroundColor: pageBackground }}
      className={`relative min-h-dvh transition-colors duration-200 ${
        customBgNeedsDarkText ? 'text-slate-900' : 'text-slate-100'
      }`}
    >
      <IslamicPatternBg accentHex={accentHex} />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <HeaderBar
          t={t}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          prayerModeActive={state.counter.prayerMode.active}
          onTogglePrayerMode={handleTogglePrayerMode}
          accentHex={accentHex}
        />

        {!isOnline && (
          <div className="mx-auto mt-3 flex max-w-6xl items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-1.5 text-xs font-medium text-amber-900 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-200">
            <WifiOff className="h-3.5 w-3.5 shrink-0" />
            <span>{t.common.offlineBadge}</span>
          </div>
        )}

        <main className="flex-1">
          {activeTab === 'counter' && (
            <CounterView
              t={t}
              counter={state.counter}
              settings={state.settings}
              activeDhikr={activeDhikr}
              dhikrs={state.dhikrs}
              todayTotal={todayTotal}
              accentHex={accentHex}
              accentSoftBg={accentSoftBg}
              accentTextHex={accentTextHex}
              ringTrackHex={ringTrackHex}
              justCompletedPulse={justCompletedPulse}
              prayerCompleteBanner={prayerCompleteBanner}
              onIncrement={handleIncrement}
              onUndo={handleUndo}
              onReset={handleReset}
              onNewRound={handleNewRound}
              onChangeTarget={handleChangeTarget}
              onSelectDhikr={handleSelectDhikr}
              onToggleWakeLock={() =>
                updateSettings({ wakeLockEnabled: !state.settings.wakeLockEnabled })
              }
              onTogglePrayerMode={handleTogglePrayerMode}
              onDismissPrayerComplete={() => setPrayerCompleteBanner(false)}
              onOpenDhikrLibrary={() => setActiveTab('dhikr')}
            />
          )}

          {activeTab === 'dhikr' && (
            <DhikrLibraryView
              t={t}
              settings={state.settings}
              dhikrs={state.dhikrs}
              favouriteIds={state.favouriteDhikrIds}
              activeDhikrId={state.counter.activeDhikrId}
              accentHex={accentHex}
              onStartCounting={(id) => {
                handleSelectDhikr(id);
                setActiveTab('counter');
              }}
              onToggleFavourite={handleToggleFavouriteDhikr}
              onSaveDhikr={handleSaveDhikr}
              onDeleteDhikr={handleDeleteDhikr}
            />
          )}

          {activeTab === 'duas' && (
            <DuaLibraryView
              t={t}
              settings={state.settings}
              duas={state.duas}
              favouriteDuaIds={state.favouriteDuaIds}
              favouriteQuranIds={state.favouriteQuranIds}
              accentHex={accentHex}
              onToggleFavouriteDua={handleToggleFavouriteDua}
              onToggleFavouriteQuran={handleToggleFavouriteQuran}
              onSaveDua={handleSaveDua}
              onDeleteDua={handleDeleteDua}
              onRestoreDefaultDua={handleRestoreDefaultDua}
              onCountDua={handleCountDuaInTasbih}
              onCountQuranPassage={handleCountQuranPassage}
            />
          )}

          {activeTab === 'stats' && (
            <StatsView
              t={t}
              state={state}
              todayTotal={todayTotal}
              accentHex={accentHex}
              onUpdateDailyGoal={(goal) => updateSettings({ dailyGoal: goal })}
              onClearHistory={handleClearHistory}
              onImportState={(imported) => setState(imported)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              t={t}
              settings={state.settings}
              accentHex={accentHex}
              onUpdateSettings={updateSettings}
              onOpenOnboarding={() => setOnboardingOpen(true)}
              onResetAllData={handleResetAllData}
            />
          )}
        </main>

        <BottomNav
          t={t}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          accentHex={accentHex}
        />
      </div>

      <OnboardingModal
        open={onboardingOpen}
        t={t}
        accentHex={accentHex}
        onComplete={() => {
          setOnboardingOpen(false);
          updateSettings({ hasCompletedOnboarding: true });
        }}
      />
    </div>
  );
}
