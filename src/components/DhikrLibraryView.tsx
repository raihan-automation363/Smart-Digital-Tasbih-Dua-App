import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Edit3,
  Heart,
  Play,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { TranslationDict } from '../i18n/translations';
import { AppSettings, DhikrItem } from '../types';
import { ConfirmModal } from './ConfirmModal';

interface DhikrLibraryViewProps {
  t: TranslationDict;
  settings: AppSettings;
  dhikrs: DhikrItem[];
  favouriteIds: string[];
  activeDhikrId: string;
  accentHex: string;
  onStartCounting: (dhikrId: string) => void;
  onToggleFavourite: (dhikrId: string) => void;
  onSaveDhikr: (item: DhikrItem) => void;
  onDeleteDhikr: (dhikrId: string) => void;
}

export const DhikrLibraryView: React.FC<DhikrLibraryViewProps> = ({
  t,
  settings,
  dhikrs,
  favouriteIds,
  activeDhikrId,
  accentHex,
  onStartCounting,
  onToggleFavourite,
  onSaveDhikr,
  onDeleteDhikr,
}) => {
  const [query, setQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'favourites'>('all');
  const [editingItem, setEditingItem] = useState<DhikrItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form states
  const [arabic, setArabic] = useState('');
  const [translitEn, setTranslitEn] = useState('');
  const [translitBn, setTranslitBn] = useState('');
  const [meaningEn, setMeaningEn] = useState('');
  const [meaningBn, setMeaningBn] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [recommendedCount, setRecommendedCount] = useState('33');

  const openAddModal = () => {
    setEditingItem(null);
    setArabic('');
    setTranslitEn('');
    setTranslitBn('');
    setMeaningEn('');
    setMeaningBn('');
    setSourceText('');
    setRecommendedCount('33');
    setIsAdding(true);
  };

  const openEditModal = (item: DhikrItem) => {
    setEditingItem(item);
    setArabic(item.arabic);
    setTranslitEn(item.transliterationEn);
    setTranslitBn(item.transliterationBn);
    setMeaningEn(item.meaningEn);
    setMeaningBn(item.meaningBn);
    setSourceText(
      settings.language === 'bn'
        ? item.sourceBn
        : settings.language === 'ar'
        ? item.sourceAr
        : item.sourceEn
    );
    setRecommendedCount(String(item.recommendedCount));
    setIsAdding(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!arabic.trim() && !translitEn.trim()) return;
    const countNum = Math.max(1, parseInt(recommendedCount, 10) || 33);
    const id = editingItem ? editingItem.id : `dhikr-custom-${Date.now()}`;
    const newItem: DhikrItem = {
      id,
      arabic: arabic.trim() || translitEn.trim(),
      transliterationEn: translitEn.trim() || arabic.trim(),
      transliterationBn: translitBn.trim() || translitEn.trim() || arabic.trim(),
      meaningEn: meaningEn.trim() || '-',
      meaningBn: meaningBn.trim() || meaningEn.trim() || '-',
      meaningAr: editingItem?.meaningAr,
      recommendedCount: countNum,
      countVerified: editingItem ? editingItem.countVerified : false,
      sourceEn: sourceText.trim() || 'Custom user entry',
      sourceBn: sourceText.trim() || 'ব্যবহারকারীর নিজস্ব এন্ট্রি',
      sourceAr: sourceText.trim() || 'ذكر مخصص',
      isCustom: editingItem ? editingItem.isCustom : true,
      isEdited: editingItem ? true : false,
    };
    onSaveDhikr(newItem);
    setIsAdding(false);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dhikrs.filter((item) => {
      if (filterMode === 'favourites' && !favouriteIds.includes(item.id)) {
        return false;
      }
      if (!q) return true;
      return (
        item.arabic.toLowerCase().includes(q) ||
        item.transliterationEn.toLowerCase().includes(q) ||
        item.transliterationBn.toLowerCase().includes(q) ||
        item.meaningEn.toLowerCase().includes(q) ||
        item.meaningBn.toLowerCase().includes(q) ||
        item.sourceEn.toLowerCase().includes(q)
      );
    });
  }, [dhikrs, favouriteIds, filterMode, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 pb-24 sm:px-6 md:py-8 md:pb-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t.dhikr.title}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t.dhikr.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          style={{ backgroundColor: accentHex }}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          <span>{t.dhikr.addCustom}</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.dhikr.searchPlaceholder}
            className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white ps-10 pe-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            style={filterMode === 'all' ? { backgroundColor: accentHex, color: '#fff' } : undefined}
            className="min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors dark:text-slate-300"
          >
            {t.common.all} ({dhikrs.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('favourites')}
            style={
              filterMode === 'favourites'
                ? { backgroundColor: accentHex, color: '#fff' }
                : undefined
            }
            className="min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors dark:text-slate-300"
          >
            {t.common.favourites} ({dhikrs.filter((d) => favouriteIds.includes(d.id)).length})
          </button>
        </div>
      </div>

      {/* Dhikr Cards Grid */}
      {filtered.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          {t.common.noResults}
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((item) => {
            const isFav = favouriteIds.includes(item.id);
            const isActive = item.id === activeDhikrId;
            const source =
              settings.language === 'bn'
                ? item.sourceBn
                : settings.language === 'ar'
                ? item.sourceAr
                : item.sourceEn;
            const meaning =
              settings.language === 'bn'
                ? item.meaningBn
                : settings.language === 'ar'
                ? item.meaningAr || item.meaningEn
                : item.meaningEn;

            return (
              <article
                key={item.id}
                style={isActive ? { borderColor: accentHex } : undefined}
                className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900/90"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono-num font-semibold text-slate-800 dark:text-slate-200">
                        {t.dhikr.recommended}: {item.recommendedCount} {t.dhikr.times}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {item.countVerified
                          ? t.common.verifiedSource
                          : t.common.customRecommendation}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onToggleFavourite(item.id)}
                        aria-label={t.common.favourites}
                        className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            isFav ? 'fill-rose-500 text-rose-500' : ''
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        aria-label={t.common.edit}
                        className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      {item.isCustom && (
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(item.id)}
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
                    className="font-arabic mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100"
                  >
                    {item.arabic}
                  </p>

                  {settings.language !== 'ar' && (
                    <div className="mt-2 space-y-0.5">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {settings.language === 'bn'
                          ? item.transliterationBn
                          : item.transliterationEn}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {settings.language === 'bn'
                          ? item.transliterationEn
                          : item.transliterationBn}
                      </p>
                    </div>
                  )}

                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {meaning}
                  </p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {source}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  {isActive ? (
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold"
                      style={{ color: accentHex }}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {t.nav.counter}
                    </span>
                  ) : (
                    <span />
                  )}

                  <button
                    type="button"
                    onClick={() => onStartCounting(item.id)}
                    style={{ backgroundColor: accentHex }}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white transition-transform active:scale-[0.98]"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>{t.dhikr.startCounting}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Add / Edit Dhikr Modal */}
      {isAdding && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {editingItem ? t.dhikr.editDhikr : t.dhikr.addCustom}
              </h2>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  {t.dhikr.arabicLabel}
                </label>
                <input
                  type="text"
                  dir="rtl"
                  required
                  value={arabic}
                  onChange={(e) => setArabic(e.target.value)}
                  className="font-arabic mt-1 min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-lg text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t.dhikr.translitEnLabel}
                  </label>
                  <input
                    type="text"
                    value={translitEn}
                    onChange={(e) => setTranslitEn(e.target.value)}
                    className="mt-1 min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t.dhikr.translitBnLabel}
                  </label>
                  <input
                    type="text"
                    value={translitBn}
                    onChange={(e) => setTranslitBn(e.target.value)}
                    className="mt-1 min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  {t.dhikr.meaningEnLabel}
                </label>
                <input
                  type="text"
                  value={meaningEn}
                  onChange={(e) => setMeaningEn(e.target.value)}
                  className="mt-1 min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  {t.dhikr.meaningBnLabel}
                </label>
                <input
                  type="text"
                  value={meaningBn}
                  onChange={(e) => setMeaningBn(e.target.value)}
                  className="mt-1 min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t.dhikr.countLabel}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100000}
                    value={recommendedCount}
                    onChange={(e) => setRecommendedCount(e.target.value)}
                    className="font-mono-num mt-1 min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t.dhikr.sourceLabel}
                  </label>
                  <input
                    type="text"
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    className="mt-1 min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
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
        title={t.dhikr.confirmDeleteTitle}
        message={t.dhikr.confirmDeleteMessage}
        confirmLabel={t.common.delete}
        cancelLabel={t.common.cancel}
        destructive
        onConfirm={() => {
          if (deleteTargetId) onDeleteDhikr(deleteTargetId);
          setDeleteTargetId(null);
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
