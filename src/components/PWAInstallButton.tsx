import React, { useState } from 'react';
import { CheckCircle2, Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { TranslationDict } from '../i18n/translations';

interface PWAInstallButtonProps {
  t: TranslationDict;
  accentHex: string;
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  t,
  accentHex,
  compact = false,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  if (isInstalled) {
    if (compact) return null;
    return (
      <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>{t.settings.installedStatus}</span>
      </div>
    );
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        style={{ backgroundColor: accentHex }}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-white shadow-sm transition-transform active:scale-[0.98] whitespace-nowrap shrink-0 ${
          compact ? 'min-h-[40px] px-3.5 py-1.5 text-xs' : 'min-h-[44px] px-4 py-2.5 text-sm'
        }`}
      >
        <Download className="h-4 w-4 shrink-0" />
        <span>{t.settings.installApp}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSModal(true)}
          className={`inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 whitespace-nowrap shrink-0 ${
            compact ? 'min-h-[40px] px-3 py-1.5 text-xs' : 'min-h-[44px] px-4 py-2.5 text-sm'
          }`}
        >
          <Share className="h-4 w-4 shrink-0" />
          <span>{t.settings.installApp}</span>
        </button>

        {showIOSModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {t.settings.iosGuideTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSModal(false)}
                  className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ol className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                {t.settings.iosGuideSteps.map((step, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="font-mono-num font-semibold text-slate-900 dark:text-slate-100">
                      {i + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="mt-6 min-h-[44px] w-full rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
              >
                {t.common.close}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
