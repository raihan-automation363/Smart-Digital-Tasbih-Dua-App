import React from 'react';
import { Sparkles } from 'lucide-react';
import { TranslationDict } from '../i18n/translations';
import { TabRoute } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderBarProps {
  t: TranslationDict;
  activeTab: TabRoute;
  onSelectTab: (tab: TabRoute) => void;
  prayerModeActive: boolean;
  onTogglePrayerMode: () => void;
  accentHex: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  t,
  activeTab,
  onSelectTab,
  prayerModeActive,
  onTogglePrayerMode,
  accentHex,
}) => {
  const navItems: { id: TabRoute; label: string }[] = [
    { id: 'counter', label: t.nav.counter },
    { id: 'dhikr', label: t.nav.dhikr },
    { id: 'duas', label: t.nav.duas },
    { id: 'stats', label: t.nav.stats },
    { id: 'settings', label: t.nav.settings },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[#C89B3C]/25 bg-white/85 backdrop-blur-md dark:border-[#C89B3C]/20 dark:bg-slate-950/85">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 md:h-16 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('counter')}
          className="inline-flex items-center gap-2 rounded-lg px-1 text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-slate-100"
        >
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rotate-45 rounded-[2px] border border-[#C89B3C]"
            style={{ backgroundColor: accentHex }}
          />
          <span>{t.appName}</span>
        </button>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                style={isActive ? { color: accentHex, borderColor: accentHex } : undefined}
                className={`border-b-2 py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Contextual Action */}
        <div className="flex items-center gap-2 shrink-0">
          <PWAInstallButton t={t} accentHex={accentHex} compact />
          <button
            type="button"
            onClick={onTogglePrayerMode}
            style={
              prayerModeActive
                ? { backgroundColor: accentHex, color: '#ffffff', borderColor: accentHex }
                : undefined
            }
            className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              prayerModeActive
                ? 'shadow-sm'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>{t.counter.prayerModeShort}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
