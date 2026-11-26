import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Heart,
  Play,
} from 'lucide-react';
import { TranslationDict } from '../i18n/translations';
import { AppSettings, FontSizeLevel, QuranPassage } from '../types';

interface QuranPassageDetailViewProps {
  t: TranslationDict;
  settings: AppSettings;
  passage: QuranPassage;
  allPassages: QuranPassage[];
  isFavourite: boolean;
  accentHex: string;
  onBack: () => void;
  onSelectPassage: (passageId: string) => void;
  onToggleFavourite: (passageId: string) => void;
  onCountPassage: (passage: QuranPassage) => void;
}

const ARABIC_SCALE: Record<FontSizeLevel, string> = {
  small: 'text-2xl sm:text-3xl',
  medium: 'text-[28px] sm:text-4xl',
  large: 'text-3xl sm:text-[42px]',
  xlarge: 'text-4xl sm:text-5xl',
};

const TEXT_SCALE: Record<FontSizeLevel, string> = {
  small: 'text-xs sm:text-sm',
  medium: 'text-sm sm:text-base',
  large: 'text-base sm:text-lg',
  xlarge: 'text-lg sm:text-xl',
};

const FONT_LEVELS: FontSizeLevel[] = ['small', 'medium', 'large', 'xlarge'];

const GOLD_HEX = '#C89B3C';

export const QuranPassageDetailView: React.FC<QuranPassageDetailViewProps> = ({
  t,
  settings,
  passage,
  allPassages,
  isFavourite,
  accentHex,
  onBack,
  onSelectPassage,
  onToggleFavourite,
  onCountPassage,
}) => {
  const [localFontSize, setLocalFontSize] = useState<FontSizeLevel>(settings.fontSize);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [activeVerseIdx, setActiveVerseIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const verseRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    setActiveVerseIdx(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [passage.id]);

  const currentPassageIndex = allPassages.findIndex((p) => p.id === passage.id);
  const prevPassage = currentPassageIndex > 0 ? allPassages[currentPassageIndex - 1] : null;
  const nextPassage =
    currentPassageIndex >= 0 && currentPassageIndex < allPassages.length - 1
      ? allPassages[currentPassageIndex + 1]
      : null;

  const isRtl = settings.language === 'ar';

  const surahName =
    settings.language === 'bn'
      ? passage.surahNameBn
      : settings.language === 'ar'
      ? passage.surahNameAr
      : passage.surahNameEn;

  const passageTitle =
    settings.language === 'bn'
      ? passage.titleBn
      : settings.language === 'ar'
      ? passage.titleAr
      : passage.titleEn;

  const sourceNote =
    settings.language === 'bn'
      ? passage.sourceNoteBn
      : settings.language === 'ar'
      ? passage.sourceNoteAr
      : passage.sourceNoteEn;

  const jumpToVerse = (idx: number) => {
    const clamped = Math.max(0, Math.min(passage.verses.length - 1, idx));
    setActiveVerseIdx(clamped);
    const el = verseRefs.current[clamped];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCopyAll = async () => {
    const body = passage.verses
      .map(
        (v) =>
          `(${passage.surahNumber}:${v.verseNumber})\n${v.arabic}\n${v.transliterationBn}\n${v.translationBn}\n${v.translationEn}`
      )
      .join('\n\n');
    const text = `${passageTitle} — ${surahName} (${passage.verseRange})\n\n${body}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked
    }
  };

  const adjustFont = (delta: -1 | 1) => {
    const idx = FONT_LEVELS.indexOf(localFontSize);
    const nextIdx = Math.max(0, Math.min(FONT_LEVELS.length - 1, idx + delta));
    setLocalFontSize(FONT_LEVELS[nextIdx]);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-5 pb-24 sm:px-6 md:py-8 md:pb-12">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          <span>{t.quranDuas.backToList}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleFavourite(passage.id)}
            aria-label={t.common.favourites}
            className="inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <Heart className={`h-4 w-4 ${isFavourite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleCopyAll}
            className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? t.common.copied : t.common.copy}</span>
          </button>

          <button
            type="button"
            onClick={() => onCountPassage(passage)}
            style={{ backgroundColor: accentHex }}
            className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-transform active:scale-[0.98]"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>{t.quranDuas.countInTasbih}</span>
          </button>
        </div>
      </div>

      {/* Mushaf Header Banner */}
      <section
        className="mt-5 rounded-3xl border bg-white/95 p-5 shadow-sm sm:p-7 dark:bg-slate-900/95"
        style={{
          borderColor: settings.darkMode ? 'rgba(200, 155, 60, 0.35)' : 'rgba(200, 155, 60, 0.45)',
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <div className="inline-flex items-center gap-2">
            <BookOpen className="h-4 w-4" style={{ color: GOLD_HEX }} />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {surahName}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num font-semibold" style={{ color: accentHex }}>
              {passage.verseRange}
            </span>
          </div>
          <span className="font-mono-num">
            {passage.verses.length} {t.quranDuas.versesCount}
          </span>
        </div>

        <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-50">
          {passageTitle}
        </h1>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {sourceNote}
        </p>

        {/* Reading Controls Toolbar */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => adjustFont(-1)}
              disabled={localFontSize === 'small'}
              className="min-h-[38px] rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => adjustFont(1)}
              disabled={localFontSize === 'xlarge'}
              className="min-h-[38px] rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              A+
            </button>

            <button
              type="button"
              onClick={() => setShowTransliteration((v) => !v)}
              style={
                showTransliteration
                  ? { borderColor: accentHex, color: accentHex }
                  : undefined
              }
              className="min-h-[38px] rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {t.quranDuas.showTransliteration}
            </button>
          </div>

          {/* Verse Jump Navigation when multiple verses exist */}
          {passage.verses.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => jumpToVerse(activeVerseIdx - 1)}
                disabled={activeVerseIdx === 0}
                className="min-h-[36px] rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-35 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {t.quranDuas.previousVerse}
              </button>
              {passage.verses.map((v, idx) => (
                <button
                  key={v.verseNumber}
                  type="button"
                  onClick={() => jumpToVerse(idx)}
                  style={
                    activeVerseIdx === idx
                      ? { backgroundColor: accentHex, borderColor: accentHex, color: '#fff' }
                      : undefined
                  }
                  className="font-mono-num min-h-[36px] min-w-[36px] rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {v.verseNumber}
                </button>
              ))}
              <button
                type="button"
                onClick={() => jumpToVerse(activeVerseIdx + 1)}
                disabled={activeVerseIdx === passage.verses.length - 1}
                className="min-h-[36px] rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-35 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {t.quranDuas.nextVerse}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Verse-by-Verse Reading Cards */}
      <div className="mt-5 space-y-4">
        {passage.verses.map((verse, idx) => {
          const isHighlighted = passage.verses.length > 1 && activeVerseIdx === idx;
          return (
            <article
              key={verse.verseNumber}
              ref={(el) => {
                verseRefs.current[idx] = el;
              }}
              onClick={() => setActiveVerseIdx(idx)}
              style={
                isHighlighted
                  ? {
                      borderColor: GOLD_HEX,
                    }
                  : undefined
              }
              className="rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm transition-colors sm:p-7 dark:border-slate-800 dark:bg-slate-900/90"
            >
              {/* Verse Number Reference Row */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono-num text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {passage.surahNumber}:{verse.verseNumber}
                </span>
                <span
                  className="font-arabic inline-flex h-8 min-w-[32px] items-center justify-center rounded-full border px-2.5 text-sm font-bold"
                  style={{
                    borderColor: GOLD_HEX,
                    color: settings.darkMode ? '#F2D77E' : '#8A6318',
                  }}
                >
                  ﴿{verse.verseNumber.toLocaleString('ar-EG')}﴾
                </span>
              </div>

              {/* Complete Arabic Text */}
              <p
                dir="rtl"
                lang="ar"
                className={`font-arabic mt-4 font-bold leading-[2.2] text-slate-900 dark:text-slate-50 ${ARABIC_SCALE[localFontSize]}`}
              >
                {verse.arabic}
              </p>

              {/* Transliteration */}
              {showTransliteration && settings.language !== 'ar' && (
                <div className="mt-4 rounded-2xl bg-slate-50/80 p-3.5 dark:bg-slate-950/60">
                  <p className={`font-bangla leading-relaxed text-slate-700 dark:text-slate-200 ${TEXT_SCALE[localFontSize]}`}>
                    {settings.language === 'bn' ? verse.transliterationBn : verse.transliterationEn}
                  </p>
                  {settings.language === 'bn' && (
                    <p className="mt-1 text-xs italic text-slate-500 dark:text-slate-400">
                      {verse.transliterationEn}
                    </p>
                  )}
                </div>
              )}

              {/* Bangla & English Translations */}
              <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
                <p className={`font-bangla leading-relaxed text-slate-800 dark:text-slate-100 ${TEXT_SCALE[localFontSize]}`}>
                  {verse.translationBn}
                </p>
                <p className={`leading-relaxed text-slate-600 dark:text-slate-400 ${TEXT_SCALE[localFontSize]}`}>
                  {verse.translationEn}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {/* Previous / Next Passage Footer Navigation */}
      <nav
        aria-label="Passage navigation"
        className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {prevPassage ? (
          <button
            type="button"
            onClick={() => onSelectPassage(prevPassage.id)}
            className="flex min-h-[56px] items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-start transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            {isRtl ? (
              <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
            ) : (
              <ChevronLeft className="h-5 w-5 shrink-0 text-slate-400" />
            )}
            <div className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {t.quranDuas.previousPassage}
              </span>
              <span className="block truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {settings.language === 'bn'
                  ? prevPassage.titleBn
                  : settings.language === 'ar'
                  ? prevPassage.titleAr
                  : prevPassage.titleEn}
              </span>
            </div>
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}

        {nextPassage && (
          <button
            type="button"
            onClick={() => onSelectPassage(nextPassage.id)}
            className="flex min-h-[56px] items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-start transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <div className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {t.quranDuas.nextPassage}
              </span>
              <span className="block truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {settings.language === 'bn'
                  ? nextPassage.titleBn
                  : settings.language === 'ar'
                  ? nextPassage.titleAr
                  : nextPassage.titleEn}
              </span>
            </div>
            {isRtl ? (
              <ChevronLeft className="h-5 w-5 shrink-0 text-slate-400" />
            ) : (
              <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
            )}
          </button>
        )}
      </nav>
    </div>
  );
};
