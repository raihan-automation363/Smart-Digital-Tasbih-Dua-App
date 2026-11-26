import React, { useEffect, useState } from 'react';
import { BookOpen, Check, Compass, ShieldCheck, X } from 'lucide-react';
import { TranslationDict } from '../i18n/translations';

interface OnboardingModalProps {
  open: boolean;
  t: TranslationDict;
  accentHex: string;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  open,
  t,
  accentHex,
  onComplete,
}) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (open) {
      setStep(0);
    }
  }, [open]);

  if (!open) return null;

  const steps = [
    {
      icon: Compass,
      title: t.onboarding.step1Title,
      body: t.onboarding.step1Body,
    },
    {
      icon: BookOpen,
      title: t.onboarding.step2Title,
      body: t.onboarding.step2Body,
    },
    {
      icon: ShieldCheck,
      title: t.onboarding.step3Title,
      body: t.onboarding.step3Body,
    },
  ];

  const current = steps[step];
  const Icon = current.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: idx === step ? '24px' : '8px',
                  backgroundColor: idx === step ? accentHex : '#CBD5E1',
                }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={onComplete}
            className="flex min-h-[40px] items-center gap-1 rounded-xl px-2.5 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <span>{t.onboarding.skip}</span>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex flex-col items-center text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-sm"
            style={{ backgroundColor: accentHex }}
          >
            <Icon className="h-8 w-8" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-slate-100">
            {current.title}
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {current.body}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="min-h-[44px] rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {t.common.back}
            </button>
          ) : (
            <div />
          )}

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              style={{ backgroundColor: accentHex }}
              className="min-h-[44px] rounded-xl px-6 py-2 text-sm font-semibold text-white transition-transform active:scale-[0.98]"
            >
              {t.common.next}
            </button>
          ) : (
            <button
              type="button"
              onClick={onComplete}
              style={{ backgroundColor: accentHex }}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-6 py-2 text-sm font-semibold text-white transition-transform active:scale-[0.98]"
            >
              <Check className="h-4 w-4" />
              <span>{t.onboarding.getStarted}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
