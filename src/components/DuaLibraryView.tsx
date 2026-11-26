import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit3,
  Heart,
  Play,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { DEFAULT_DUAS } from '../data/defaultDuas';
import { DEFAULT_QURAN_PASSAGES } from '../data/defaultQuranPassages';
import { TranslationDict } from '../i18n/translations';
import {
  AppSettings,
  DuaCategory,
  DuaItem,
  QuranPassage,
  QuranPassageGroup,
} from '../types';
import { ConfirmModal } from './ConfirmModal';
import { QuranPassageDetailView } from './QuranPassageDetailView';

const DUA_CATEGORIES: DuaCategory[] = [
  'morning',
  'evening',
  'before_sleep',
  'after_waking',
  'before_eating',
  'after_eating',
  'forgiveness',
  'protection',
  'daily_life',
];

const QURAN_GROUPS: QuranPassageGroup[] = [
  'surah_hashr',
  'ayatul_kursi',
  'baqarah_end',
  'baqarah_duas',
];

const GOLD_HEX = '#C89B3C';

interface DuaLibraryViewProps {
  t: TranslationDict;
  settings: AppSettings;
  duas: DuaItem[];
  favouriteDuaIds: string[];
  favouriteQuranIds: string[];
  accentHex: string;
  onToggleFavouriteDua: (duaId: string) => void;
  onToggleFavouriteQuran: (passageId: string) => void;
  onSaveDua: (dua: DuaItem) => void;
  onDeleteDua: (duaId: string) => void;
  onRestoreDefaultDua: (duaId: string) => void;
  onCountDua: (dua: DuaItem) => void;
  onCountQuranPassage: (passage: QuranPassage) => void;
}

export const DuaLibraryView: React.FC<DuaLibraryViewProps> = ({
  t,
  settings,
  duas,
  favouriteDuaIds,
  favouriteQuranIds,
  accentHex,
  onToggleFavouriteDua,
  onToggleFavouriteQuran,
  onSaveDua,
  onDeleteDua,
  onRestoreDefaultDua,
  onCountDua,
  onCountQuranPassage,
}) => {
  const [sectionTab, setSectionTab] = useState<'quran' | 'duas'>('quran');
  const [selectedPassageId, setSelectedPassageId] = useState<string | null>(null);
  const [quranQuery, setQuranQuery] = useState('');
  const [quranGroupFilter, setQuranGroupFilter] = useState<
    'all' | 'favourites' | QuranPassageGroup
  >('all');

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'favourites' | DuaCategory
  >('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDua, setEditingDua] = useState<DuaItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Dua Form states
  const [category, setCategory] = useState<DuaCategory>('daily_life');
  const [titleEn, setTitleEn] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [arabic, setArabic] = useState('');
  const [translitEn, setTranslitEn] = useState('');
  const [translitBn, setTranslitBn] = useState('');
  const [translationEn, setTranslationEn] = useState('');
  const [translationBn, setTranslationBn] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [notesText, setNotesText] = useState('');

  const selectedPassage = useMemo(
    () => DEFAULT_QURAN_PASSAGES.find((p) => p.id === selectedPassageId) || null,
    [selectedPassageId]
  );

  const filteredQuranPassages = useMemo(() => {
    const q = quranQuery.trim().toLowerCase();
    return DEFAULT_QURAN_PASSAGES.filter((passage) => {
      if (
        quranGroupFilter === 'favourites' &&
        !favouriteQuranIds.includes(passage.id)
      ) {
        return false;
      }
      if (
        quranGroupFilter !== 'all' &&
        quranGroupFilter !== 'favourites' &&
        passage.group !== quranGroupFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        passage.surahNameEn.toLowerCase().includes(q) ||
        passage.surahNameBn.toLowerCase().includes(q) ||
        passage.surahNameAr.toLowerCase().includes(q) ||
        passage.verseRange.toLowerCase().includes(q) ||
        passage.titleEn.toLowerCase().includes(q) ||
        passage.titleBn.toLowerCase().includes(q) ||
        passage.titleAr.toLowerCase().includes(q) ||
        passage.verses.some(
          (v) =>
            v.arabic.toLowerCase().includes(q) ||
            v.translationEn.toLowerCase().includes(q) ||
            v.translationBn.toLowerCase().includes(q) ||
            v.transliterationBn.toLowerCase().includes(q) ||
            v.transliterationEn.toLowerCase().includes(q)
        )
      );
    });
  }, [favouriteQuranIds, quranGroupFilter, quranQuery]);

  const filteredDuas = useMemo(() => {
    const q = query.trim().toLowerCase();
    return duas.filter((dua) => {
      if (selectedCategory === 'favourites' && !favouriteDuaIds.includes(dua.id))
        return false;
      if (
        selectedCategory !== 'all' &&
        selectedCategory !== 'favourites' &&
        dua.category !== selectedCategory
      ) {
        return false;
      }
      if (!q) return true;
      return (
        dua.titleEn.toLowerCase().includes(q) ||
        dua.titleBn.toLowerCase().includes(q) ||
        dua.titleAr.toLowerCase().includes(q) ||
        dua.arabic.toLowerCase().includes(q) ||
        dua.transliterationEn.toLowerCase().includes(q) ||
        dua.transliterationBn.toLowerCase().includes(q) ||
        dua.translationEn.toLowerCase().includes(q) ||
        dua.translationBn.toLowerCase().includes(q) ||
        dua.sourceEn.toLowerCase().includes(q)
      );
    });
  }, [duas, favouriteDuaIds, query, selectedCategory]);

  const builtInIds = useMemo(() => new Set(DEFAULT_DUAS.map((d) => d.id)), []);

  if (sectionTab === 'quran' && selectedPassage) {
    return (
      <QuranPassageDetailView
        t={t}
        settings={settings}
        passage={selectedPassage}
        allPassages={DEFAULT_QURAN_PASSAGES}
        isFavourite={favouriteQuranIds.includes(selectedPassage.id)}
        accentHex={accentHex}
        onBack={() => setSelectedPassageId(null)}
        onSelectPassage={(id) => setSelectedPassageId(id)}
        onToggleFavourite={onToggleFavouriteQuran}
        onCountPassage={onCountQuranPassage}
      />
    );
  }

  const openAdd = () => {
    setEditingDua(null);
    setCategory(
      selectedCategory !== 'all' && selectedCategory !== 'favourites'
        ? selectedCategory
        : 'daily_life'
    );
    setTitleEn('');
    setTitleBn('');
    setTitleAr('');
    setArabic('');
    setTranslitEn('');
    setTranslitBn('');
    setTranslationEn('');
    setTranslationBn('');
    setSourceText('');
    setNotesText('');
    setModalOpen(true);
  };

  const openEdit = (dua: DuaItem) => {
    setEditingDua(dua);
    setCategory(dua.category);
    setTitleEn(dua.titleEn);
    setTitleBn(dua.titleBn);
    setTitleAr(dua.titleAr);
    setArabic(dua.arabic);
    setTranslitEn(dua.transliterationEn);
    setTranslitBn(dua.transliterationBn);
    setTranslationEn(dua.translationEn);
    setTranslationBn(dua.translationBn);
    setSourceText(
      settings.language === 'bn'
        ? dua.sourceBn
        : settings.language === 'ar'
        ? dua.sourceAr
        : dua.sourceEn
    );
    setNotesText(
      (settings.language === 'bn'
        ? dua.notesBn
        : settings.language === 'ar'
        ? dua.notesAr
        : dua.notesEn) || ''
    );
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!arabic.trim() && !translationEn.trim()) return;
    const id = editingDua ? editingDua.id : `dua-custom-${Date.now()}`;
    const saved: DuaItem = {
      id,
      category,
      titleEn: titleEn.trim() || titleBn.trim() || 'Custom Dua',
      titleBn: titleBn.trim() || titleEn.trim() || 'নিজস্ব দুআ',
      titleAr: titleAr.trim() || titleEn.trim() || 'دعاء مخصص',
      arabic: arabic.trim(),
      transliterationEn: translitEn.trim(),
      transliterationBn: translitBn.trim(),
      translationEn: translationEn.trim(),
      translationBn: translationBn.trim(),
      translationAr: editingDua?.translationAr,
      sourceEn: sourceText.trim() || 'Custom user entry',
      sourceBn: sourceText.trim() || 'ব্যবহারকারীর নিজস্ব এন্ট্রি',
      sourceAr: sourceText.trim() || 'إدخال مخصص',
      notesEn: notesText.trim() || undefined,
      notesBn: notesText.trim() || undefined,
      notesAr: notesText.trim() || undefined,
      recommendedCount: editingDua?.recommendedCount,
      countVerified: editingDua ? editingDua.countVerified : false,
      isCustom: editingDua ? editingDua.isCustom : true,
      isEdited: editingDua ? true : false,
    };
    onSaveDua(saved);
    setModalOpen(false);
  };

  const handleCopy = async (dua: DuaItem) => {
    const title =
      settings.language === 'bn'
        ? dua.titleBn
        : settings.language === 'ar'
        ? dua.titleAr
        : dua.titleEn;
    const text = `${title}\n\n${dua.arabic}\n\n${dua.transliterationEn}\n\n${dua.translationEn}\n${dua.translationBn}\n\n[${dua.sourceEn}]`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(dua.id);
      window.setTimeout(() => setCopiedId(null), 1600);
    } catch {
      // Clipboard blocked in restricted iframe
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 pb-24 sm:px-6 md:py-8 md:pb-12">
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t.quranDuas.sectionTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t.quranDuas.sectionSubtitle}
          </p>
        </div>

        {sectionTab === 'duas' && (
          <button
            type="button"
            onClick={openAdd}
            style={{ backgroundColor: accentHex }}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>{t.duas.addCustom}</span>
          </button>
        )}
      </div>

      {/* Primary Section Switcher: Quranic Verses | Important Duas */}
      <div className="mt-5 inline-flex w-full max-w-md rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => setSectionTab('quran')}
          style={
            sectionTab === 'quran'
              ? { backgroundColor: accentHex, color: '#fff' }
              : undefined
          }
          className="flex min-h-[42px] flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition-colors sm:text-sm dark:text-slate-300"
        >
          <BookOpen className="h-4 w-4 shrink-0" />
          <span>{t.quranDuas.tabQuran}</span>
        </button>
        <button
          type="button"
          onClick={() => setSectionTab('duas')}
          style={
            sectionTab === 'duas'
              ? { backgroundColor: accentHex, color: '#fff' }
              : undefined
          }
          className="flex min-h-[42px] flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition-colors sm:text-sm dark:text-slate-300"
        >
          <span>{t.quranDuas.tabDuas}</span>
        </button>
      </div>

      {/* TAB 1: QURANIC VERSES */}
      {sectionTab === 'quran' && (
        <div>
          {/* Search */}
          <div className="relative mt-4">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={quranQuery}
              onChange={(e) => setQuranQuery(e.target.value)}
              placeholder={t.quranDuas.searchPlaceholder}
              className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white ps-10 pe-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Group Filter Tabs */}
          <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setQuranGroupFilter('all')}
              style={
                quranGroupFilter === 'all'
                  ? { backgroundColor: accentHex, color: '#fff', borderColor: accentHex }
                  : undefined
              }
              className="min-h-[40px] rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              {t.common.all} ({DEFAULT_QURAN_PASSAGES.length})
            </button>
            <button
              type="button"
              onClick={() => setQuranGroupFilter('favourites')}
              style={
                quranGroupFilter === 'favourites'
                  ? { backgroundColor: accentHex, color: '#fff', borderColor: accentHex }
                  : undefined
              }
              className="min-h-[40px] rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              {t.common.favourites} ({favouriteQuranIds.length})
            </button>
            {QURAN_GROUPS.map((grp) => (
              <button
                key={grp}
                type="button"
                onClick={() => setQuranGroupFilter(grp)}
                style={
                  quranGroupFilter === grp
                    ? { backgroundColor: accentHex, color: '#fff', borderColor: accentHex }
                    : undefined
                }
                className="min-h-[40px] rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                {t.quranDuas.groups[grp]}
              </button>
            ))}
          </div>

          {/* Quranic Passages Grid */}
          {filteredQuranPassages.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              {t.common.noResults}
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredQuranPassages.map((passage) => {
                const isFav = favouriteQuranIds.includes(passage.id);
                const surahName =
                  settings.language === 'bn'
                    ? passage.surahNameBn
                    : settings.language === 'ar'
                    ? passage.surahNameAr
                    : passage.surahNameEn;
                const title =
                  settings.language === 'bn'
                    ? passage.titleBn
                    : settings.language === 'ar'
                    ? passage.titleAr
                    : passage.titleEn;
                const firstVerse = passage.verses[0];

                return (
                  <article
                    key={passage.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm transition-colors hover:border-[#C89B3C]/60 sm:p-6 dark:border-slate-800 dark:bg-slate-900/90"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {surahName}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span
                              className="font-mono-num font-semibold"
                              style={{ color: accentHex }}
                            >
                              {passage.verseRange}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono-num">
                              {passage.verses.length} {t.quranDuas.versesCount}
                            </span>
                          </div>
                          <h2 className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">
                            {title}
                          </h2>
                        </div>

                        <button
                          type="button"
                          onClick={() => onToggleFavouriteQuran(passage.id)}
                          aria-label={t.common.favourites}
                          className="flex min-h-[40px] min-w-[40px] shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Heart
                            className={`h-4 w-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`}
                          />
                        </button>
                      </div>

                      {/* Complete Arabic Text of All Verses in Passage */}
                      <div className="mt-4 space-y-2 rounded-2xl border border-[#C89B3C]/25 bg-slate-50/75 p-4 dark:border-[#C89B3C]/20 dark:bg-slate-950/60">
                        <p
                          dir="rtl"
                          lang="ar"
                          className="font-arabic text-xl font-bold leading-[2.1] text-slate-900 sm:text-2xl dark:text-slate-50"
                        >
                          {passage.verses.map((v, idx) => (
                            <span key={v.verseNumber}>
                              {v.arabic}{' '}
                              <span
                                className="inline-block text-base font-normal"
                                style={{ color: GOLD_HEX }}
                              >
                                ﴿{v.verseNumber.toLocaleString('ar-EG')}﴾
                              </span>
                              {idx < passage.verses.length - 1 ? ' ' : ''}
                            </span>
                          ))}
                        </p>
                      </div>

                      {/* Preview Translation (Bangla + English) */}
                      <div className="mt-3.5 space-y-1.5">
                        <p className="font-bangla line-clamp-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                          {firstVerse.translationBn}
                        </p>
                        <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          {firstVerse.translationEn}
                        </p>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3.5 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => onCountQuranPassage(passage)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>{t.quranDuas.countInTasbih}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPassageId(passage.id)}
                        style={{ backgroundColor: accentHex }}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-semibold text-white transition-transform active:scale-[0.98]"
                      >
                        <span>{t.quranDuas.readPassage}</span>
                        {settings.language === 'ar' ? (
                          <ChevronLeft className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: IMPORTANT DUAS */}
      {sectionTab === 'duas' && (
        <div>
          {/* Search */}
          <div className="relative mt-4">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.duas.searchPlaceholder}
              className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white ps-10 pe-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Category Filter Bar */}
          <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              style={
                selectedCategory === 'all'
                  ? { backgroundColor: accentHex, color: '#fff', borderColor: accentHex }
                  : undefined
              }
              className="min-h-[40px] rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              {t.common.all}
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('favourites')}
              style={
                selectedCategory === 'favourites'
                  ? { backgroundColor: accentHex, color: '#fff', borderColor: accentHex }
                  : undefined
              }
              className="min-h-[40px] rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              {t.common.favourites}
            </button>
            {DUA_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={
                  selectedCategory === cat
                    ? { backgroundColor: accentHex, color: '#fff', borderColor: accentHex }
                    : undefined
                }
                className="min-h-[40px] rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                {t.duas.categories[cat]}
              </button>
            ))}
          </div>

          {/* Dua List */}
          {filteredDuas.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              {t.common.noResults}
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredDuas.map((dua) => {
                const isFav = favouriteDuaIds.includes(dua.id);
                const title =
                  settings.language === 'bn'
                    ? dua.titleBn
                    : settings.language === 'ar'
                    ? dua.titleAr
                    : dua.titleEn;
                const source =
                  settings.language === 'bn'
                    ? dua.sourceBn
                    : settings.language === 'ar'
                    ? dua.sourceAr
                    : dua.sourceEn;
                const notes =
                  settings.language === 'bn'
                    ? dua.notesBn
                    : settings.language === 'ar'
                    ? dua.notesAr
                    : dua.notesEn;

                return (
                  <article
                    key={dua.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900/90"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {t.duas.categories[dua.category]}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>
                              {dua.countVerified
                                ? t.common.verifiedSource
                                : t.common.customRecommendation}
                            </span>
                          </div>
                          <h2 className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">
                            {title}
                          </h2>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => onToggleFavouriteDua(dua.id)}
                            aria-label={t.common.favourites}
                            className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Heart
                              className={`h-4 w-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`}
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEdit(dua)}
                            aria-label={t.common.edit}
                            className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          {dua.isCustom && (
                            <button
                              type="button"
                              onClick={() => setDeleteTargetId(dua.id)}
                              aria-label={t.common.delete}
                              className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p
                        dir="rtl"
                        lang="ar"
                        className="font-arabic mt-4 text-2xl font-bold leading-loose text-slate-900 dark:text-slate-50"
                      >
                        {dua.arabic}
                      </p>

                      {settings.language !== 'ar' &&
                        (dua.transliterationEn || dua.transliterationBn) && (
                          <p className="mt-3 text-sm font-medium italic leading-relaxed text-slate-700 dark:text-slate-300">
                            {settings.language === 'bn'
                              ? dua.transliterationBn
                              : dua.transliterationEn}
                          </p>
                        )}

                      <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                        {dua.translationBn && (
                          <p className="font-bangla text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                            {dua.translationBn}
                          </p>
                        )}
                        {dua.translationEn && (
                          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            {dua.translationEn}
                          </p>
                        )}
                      </div>

                      <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                        {source}
                      </p>
                      {notes && (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {notes}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(dua)}
                          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          {copiedId === dua.id ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              <span>{t.common.copied}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>{t.common.copy}</span>
                            </>
                          )}
                        </button>

                        {dua.isEdited && builtInIds.has(dua.id) && (
                          <button
                            type="button"
                            onClick={() => onRestoreDefaultDua(dua.id)}
                            className="inline-flex min-h-[40px] items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span>{t.common.restoreDefault}</span>
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onCountDua(dua)}
                        style={{ backgroundColor: accentHex }}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-white transition-transform active:scale-[0.98]"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>{t.duas.countThisDua}</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Dua Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {editingDua ? t.duas.editDua : t.duas.addCustom}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  {t.duas.categoryLabel}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DuaCategory)}
                  className="mt-1 min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  {DUA_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {t.duas.categories[cat]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t.duas.titleEnLabel}
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="mt-1 min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t.duas.titleBnLabel}
                  </label>
                  <input
                    type="text"
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    className="mt-1 min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  {t.duas.arabicLabel}
                </label>
                <textarea
                  rows={2}
                  dir="rtl"
                  required
                  value={arabic}
                  onChange={(e) => setArabic(e.target.value)}
                  className="font-arabic mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-lg text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t.duas.translitEnLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={translitEn}
                    onChange={(e) => setTranslitEn(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t.duas.translitBnLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={translitBn}
                    onChange={(e) => setTranslitBn(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  {t.duas.translationBnLabel}
                </label>
                <textarea
                  rows={2}
                  value={translationBn}
                  onChange={(e) => setTranslationBn(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  {t.duas.translationEnLabel}
                </label>
                <textarea
                  rows={2}
                  value={translationEn}
                  onChange={(e) => setTranslationEn(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  {t.duas.sourceLabel}
                </label>
                <input
                  type="text"
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  className="mt-1 min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  {t.duas.notesLabel}
                </label>
                <input
                  type="text"
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  className="mt-1 min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="min-h-[44px] rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: accentHex }}
                  className="min-h-[44px] rounded-xl px-5 py-2 text-sm font-semibold text-white"
                >
                  {t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTargetId}
        title={t.duas.confirmDeleteTitle}
        message={t.duas.confirmDeleteMessage}
        confirmLabel={t.common.delete}
        cancelLabel={t.common.cancel}
        destructive
        onConfirm={() => {
          if (deleteTargetId) onDeleteDua(deleteTargetId);
          setDeleteTargetId(null);
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
