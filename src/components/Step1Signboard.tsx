import React, { useState, useMemo } from 'react';
import { SignageSlide, SignboardFrame, SignageFolder } from '../types';
import { SIGNAGE_TEMPLATES } from '../data/templates';
import { 
  Check, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Copy, 
  Clock, 
  ChevronLeft,
  Search,
  Palette
} from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';

interface Step1SignboardProps {
  slides: SignageSlide[];
  currentSlideIndex: number;
  onSelectSlideIndex: (index: number) => void;
  onAddSlide: () => void;
  onDeleteSlide: (index: number) => void;
  onDuplicateSlide: (index: number) => void;
  onUpdateSlide: (updates: Partial<SignageSlide>) => void;
  onApplyTemplate: (templateSlide: Partial<SignageSlide>) => void;
  folders: SignageFolder[];
  activeFolderName?: string;
  onBackToFolders: () => void;
  onNext: () => void;
}

export const Step1Signboard: React.FC<Step1SignboardProps> = ({
  slides,
  currentSlideIndex,
  onSelectSlideIndex,
  onAddSlide,
  onDeleteSlide,
  onDuplicateSlide,
  onUpdateSlide,
  onApplyTemplate,
  folders,
  activeFolderName,
  onBackToFolders,
  onNext,
}) => {
  const currentSlide = slides[currentSlideIndex] || slides[0];

  // 業種カテゴリーフィルター
  const [selectedCategory, setSelectedCategory] = useState<string>('all');



  const filteredTemplates = useMemo(() => {
    return SIGNAGE_TEMPLATES.filter((tmpl) => {
      // カテゴリマッチ
      let matchCat = true;
      if (selectedCategory === 'food') {
        matchCat = ['カフェ・喫茶', '居酒屋・バル', '飲食・麺類', 'ベーカリー'].includes(tmpl.category);
      } else if (selectedCategory === 'beauty') {
        matchCat = ['サロン・エステ'].includes(tmpl.category);
      } else if (selectedCategory === 'medical') {
        matchCat = ['クリニック・医療', 'ヘルスケア'].includes(tmpl.category);
      } else if (selectedCategory === 'retail') {
        matchCat = ['アパレル・小売り'].includes(tmpl.category);
      } else if (selectedCategory === 'leisure') {
        matchCat = ['スポーツ・ジム', 'ホテル・観光'].includes(tmpl.category);
      } else if (selectedCategory === 'service') {
        matchCat = ['暮らし・サービス', '教育・スクール'].includes(tmpl.category);
      } else if (selectedCategory === 'other') {
        matchCat = ['その他'].includes(tmpl.category);
      }

      return matchCat;
    });
  }, [selectedCategory]);

  // ユーザーリクエスト：5/10/15/20/25/30/40/50/60秒
  const durationPresets = [5, 10, 15, 20, 25, 30, 40, 50, 60];



  return (
    <div className="space-y-6">
      {/* 画面ヘッダー */}
      <div className="pb-1 border-b border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToFolders}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer bg-indigo-950/60 hover:bg-indigo-950 px-2.5 py-1 rounded-full border border-indigo-500/30 transition-colors shadow-xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>← 看板フォルダ一覧 ({folders.length}/20)</span>
          </button>
          {activeFolderName && (
            <span className="text-xs text-slate-300 font-bold bg-slate-850 px-2.5 py-1 rounded-xl border border-slate-800 leading-snug">
              編集中：<br />
              <strong className="text-amber-400">{activeFolderName}</strong>
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" />
            <span>２ デザイン選択画面</span>
          </h2>
          <button
            onClick={onNext}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-full text-[10px] shadow-lg shadow-amber-500/20 transition-all flex items-center gap-0.5 cursor-pointer"
          >
            <span>次へ</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 縦書き・横書き切替 */}
      <div className="flex items-center justify-between p-3 bg-slate-850 rounded-2xl border border-slate-800 shadow-md">
        <div>
          <span className="text-xs font-black text-slate-100">文字の書き方</span>
        </div>
        <div className="inline-flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-700 shrink-0">
          {(
            [
              { val: 'horizontal', label: '横書き' },
              { val: 'vertical', label: '縦書き' },
            ] as const
          ).map((opt) => {
            const isSelected = (currentSlide.writingMode || 'horizontal') === opt.val;
            return (
              <button
                key={opt.val}
                type="button"
                onClick={() => onUpdateSlide({ writingMode: opt.val })}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-black shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 看板スライド選択（1枚目・2枚目〜最大10枚まで追加可能） */}
      <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-200">
              看板スライド（{slides.length}/10枚）
            </span>
          </div>

          <button
            onClick={onAddSlide}
            disabled={slides.length >= 10}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
              slides.length >= 10
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer shadow-sm'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>看板を追加 {slides.length >= 10 ? '(上限10枚)' : ''}</span>
          </button>
        </div>

        {/* 1枚目・2枚目...タブボタン（2段表示に変更） */}
        <div className="flex flex-wrap items-center gap-1.5 pb-1">
          {slides.map((s, idx) => {
            const isSelected = currentSlideIndex === idx;
            return (
              <div
                key={s.id || idx}
                onClick={() => onSelectSlideIndex(idx)}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 shrink-0 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white'
                }`}
              >
                <span className="text-xs sm:text-sm font-black whitespace-nowrap">
                  {idx + 1}/{slides.length} ({s.duration}秒)
                </span>

                {isSelected && (
                  <div className="flex items-center gap-1 ml-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onDuplicateSlide(idx)}
                      disabled={slides.length >= 10}
                      title="この看板を複製"
                      className="p-0.5 text-slate-950 hover:opacity-75 disabled:opacity-30 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    {slides.length > 1 && (
                      <button
                        onClick={() => onDeleteSlide(idx)}
                        title="この看板を削除"
                        className="p-0.5 text-slate-950 hover:text-rose-700 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 現在選択中の看板の表示秒数設定（任意入力 ＆ クイック切替対応） */}
      <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            看板 {currentSlideIndex + 1}/{slides.length} の表示秒数:{' '}
            <strong className="text-amber-400 text-sm font-black">
              {currentSlide.duration || 10}秒間
            </strong>
          </span>
        </div>

        {/* 任意秒数入力 ＆ プリセット */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
          {/* 任意数値直接入力 */}
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-750">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onUpdateSlide({ duration: Math.max(1, (currentSlide.duration || 10) - 1) })}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-black text-sm flex items-center justify-center cursor-pointer border border-slate-700"
                title="1秒減らす"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                max={600}
                value={currentSlide.duration || 10}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val > 0) {
                    onUpdateSlide({ duration: Math.min(600, val) });
                  }
                }}
                className="w-16 px-1.5 py-1 bg-slate-950 border border-slate-700 rounded-lg text-center font-black text-amber-400 text-xs focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => onUpdateSlide({ duration: Math.min(600, (currentSlide.duration || 10) + 1) })}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-black text-sm flex items-center justify-center cursor-pointer border border-slate-700"
                title="1秒増やす"
              >
                +
              </button>
            </div>
          </div>

          {/* クイック選択プリセットボタン */}
          <div className="flex-1 flex flex-wrap items-center gap-1.5 sm:justify-end">
            <span className="text-[10px] text-slate-400 font-bold hidden sm:inline mr-1">クイック設定:</span>
            {durationPresets.map((sec) => {
              const isSelected = currentSlide.duration === sec;
              return (
                <button
                  key={sec}
                  type="button"
                  onClick={() => onUpdateSlide({ duration: sec })}
                  className={`px-2.5 py-1.5 rounded-lg border text-center transition-all cursor-pointer font-bold text-xs ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white'
                  }`}
                >
                  {sec}秒
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-2.5">

        {/* 業種カテゴリフィルタータブ */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', name: `すべて (${SIGNAGE_TEMPLATES.length})` },
            { id: 'food', name: '飲食・カフェ' },
            { id: 'beauty', name: '美容・サロン' },
            { id: 'medical', name: '医療・健康' },
            { id: 'retail', name: 'ショップ・小売り' },
            { id: 'leisure', name: '娯楽・宿泊・スポーツ' },
            { id: 'service', name: '暮らし・学び' },
            { id: 'other', name: 'ブランク・その他' },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700/80'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>



        {/* 40業種テンプレートグリッド */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 max-h-[460px] overflow-y-auto p-1 scrollbar-thin">
          {filteredTemplates.map((tmpl) => {
            const isCurrent = currentSlide.shopName === tmpl.slide.shopName && currentSlide.headline === tmpl.slide.headline;
            return (
              <button
                key={tmpl.id}
                onClick={() => onApplyTemplate(tmpl.slide)}
                className={`p-2.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between group cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-500/40 shadow-lg scale-[1.02]'
                    : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-750 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="mb-1.5">
                    <span className="text-[11px] font-black text-slate-100">
                      {tmpl.name}
                    </span>
                  </div>

                  <div
                    className="w-full aspect-[16/10] rounded-xl mb-1.5 p-1.5 flex flex-col justify-between border shadow-inner overflow-hidden relative"
                    style={{
                      backgroundColor: tmpl.slide.bgColor || '#1e293b',
                      color: tmpl.slide.textColor || '#ffffff',
                      borderColor: `${tmpl.slide.textColor || '#ffffff'}25`,
                      fontFamily: `'${tmpl.slide.fontFamily || 'Noto Sans JP'}', sans-serif`,
                    }}
                  >
                    <div className="text-[7px] font-bold opacity-80 truncate text-center">
                      {tmpl.slide.shopName}
                    </div>
                    {tmpl.slide.subheadlineImages?.[0] ? (
                      <div className="w-full h-8 my-auto rounded-md overflow-hidden bg-black/40 border border-white/15 flex items-center justify-center shrink-0">
                        <img
                          src={tmpl.slide.subheadlineImages[0]}
                          alt={tmpl.name}
                          referrerPolicy="no-referrer"
                          onError={handleImageError}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="text-[9px] font-black leading-tight line-clamp-1 my-auto text-center">
                        {tmpl.slide.headline}
                      </div>
                    )}
                    <div
                      className="text-[7px] font-bold truncate text-center"
                      style={{ color: tmpl.slide.accentColor }}
                    >
                      {tmpl.slide.headline}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold pt-1 border-t border-slate-700/60">
                  <span className={isCurrent ? 'text-amber-400 flex items-center gap-1 font-black' : 'text-slate-400'}>
                    {isCurrent ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3]" /> 適用中
                      </>
                    ) : (
                      '選ぶ'
                    )}
                  </span>
                  <ArrowRight className={`w-3 h-3 ${isCurrent ? 'text-amber-400' : 'text-slate-500'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>




      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={onBackToFolders}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-xl text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
        >
          ← １ フォルダ に戻る
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>３ 背景を選ぶ へ進む</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
