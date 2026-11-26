import React from 'react';
import { BarChart3, BookHeart, Compass, ListChecks, Settings } from 'lucide-react';
import { TranslationDict } from '../i18n/translations';
import { TabRoute } from '../types';

interface BottomNavProps {
  t: TranslationDict;
  activeTab: TabRoute;
  onSelectTab: (tab: TabRoute) => void;
  accentHex: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  t,
  activeTab,
  onSelectTab,
  accentHex,
}) => {
  const items: { id: TabRoute; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'counter', label: t.nav.counter, icon: Compass },
    { id: 'dhikr', label: t.nav.dhikr, icon: ListChecks },
    { id: 'duas', label: t.nav.duas, icon: BookHeart },
    { id: 'stats', label: t.nav.stats, icon: BarChart3 },
    { id: 'settings', label: t.nav.settings, icon: Settings },
  ];

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 bg-white/92 backdrop-blur-md pb-safe md:hidden dark:border-slate-800/80 dark:bg-slate-950/92"
    >
      <div className="grid h-16 grid-cols-5 items-center">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              style={isActive ? { color: accentHex } : undefined}
              className={`flex min-h-[44px] flex-col items-center justify-center gap-1 px-1 transition-colors ${
                isActive
                  ? 'font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="max-w-full truncate text-[10px] leading-tight sm:text-[11px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
