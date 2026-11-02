import React, { useRef, useEffect, useState } from 'react';
import { StepNumber } from '../types';
import { 
  Play, 
  Pause, 
  Save, 
  Check, 
  Loader2, 
  MonitorPlay, 
  Undo2, 
  Redo2, 
  ChevronDown,
  Layers,
  Plus,
  Trash2
} from 'lucide-react';

interface StepNavigationProps {
  currentStepNumber: StepNumber;
  totalSteps?: number;
  onSelectStepNumber: (step: StepNumber) => void;
  onOpenFullscreen: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSaveOverwrite?: () => void;
  isSaving?: boolean;
  isSaved?: boolean;
  currentSlideIndex: number;
  slidesCount: number;
  isFolderReady?: boolean;
  onSelectSlideIndex: (index: number) => void;
  onAddSlide?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onDeleteSlide: (index: number) => void;
  onDuplicateSlide: (index: number) => void;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStepNumber,
  totalSteps = 16,
  onSelectStepNumber,
  onOpenFullscreen,
  isPlaying,
  onTogglePlay,
  onSaveOverwrite,
  isSaving = false,
  isSaved = false,
  currentSlideIndex,
  slidesCount,
  isFolderReady = true,
  onSelectSlideIndex,
  onAddSlide,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onDeleteSlide,
  onDuplicateSlide,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);
  const [showSlidePicker, setShowSlidePicker] = useState(false);
  const [deleteTargetIdx, setDeleteTargetIdx] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 外側クリックで看板選択ポップアップを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSlidePicker(false);
      }
    };
    if (showSlidePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSlidePicker]);

  // ステップが切り替わったときに、アクティブな数字ボタンが中央に来るように自動スライド（スクロール）
  useEffect(() => {
    if (activeBtnRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const element = activeBtnRef.current;
      const containerWidth = container.offsetWidth;
      const elementLeft = element.offsetLeft;
      const elementWidth = element.offsetWidth;

      container.scrollTo({
        left: elementLeft - containerWidth / 2 + elementWidth / 2,
        behavior: 'smooth',
      });
    }
  }, [currentStepNumber]);

  const stepNumbers = Array.from({ length: totalSteps }, (_, i) => (i + 1) as StepNumber);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-2 sm:px-4 py-2 shrink-0 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
        {/* 
          左側：看板の枚数選択ボタン（ユーザー指示：左上の「看板」のボタンからも○枚目を選べるように）
        */}
        <div className="relative shrink-0" ref={dropdownRef}>
          {!isFolderReady || slidesCount === 0 ? (
            <div
              className="bg-slate-100 border border-slate-300 text-slate-400 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 cursor-not-allowed opacity-60"
              title="看板を作成または選択してください"
            >
              <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-slate-500 whitespace-nowrap">
                看板未選択
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowSlidePicker((prev) => !prev)}
              className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 text-blue-950 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
              title="看板の切り替え（クリックして看板を選択）"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="text-xs sm:text-sm font-black text-blue-950 whitespace-nowrap">
                看板 {currentSlideIndex + 1}/{slidesCount}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-blue-600 transition-transform ${showSlidePicker ? 'rotate-180' : ''}`} />
            </button>
          )}

          {/* 看板選択ドロップダウンメニュー */}
          {isFolderReady && slidesCount > 0 && showSlidePicker && (
            <div className="absolute top-full left-0 mt-1.5 w-56 bg-white border-2 border-blue-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="text-[11px] font-black text-slate-500 px-2 py-1 mb-1 border-b border-slate-100">
                編集する看板を選択：
              </div>
              <div className="max-h-56 overflow-y-auto space-y-1">
                {Array.from({ length: slidesCount }).map((_, idx) => {
                  const isCurrent = idx === currentSlideIndex;
                  return (
                    <div
                      key={idx}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        onSelectSlideIndex(idx);
                        setShowSlidePicker(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-left font-black text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-50 text-slate-800 hover:bg-blue-50 hover:text-blue-900'
                      }`}
                    >
                      <span>看板 {idx + 1}/{slidesCount}</span>
                      <div className="flex items-center gap-2">
                        {isCurrent && <Check className="w-4 h-4 stroke-[3]" />}
                        <button type="button" onClick={(e) => { e.stopPropagation(); onDuplicateSlide(idx); }} className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded hover:bg-white/40">複製</button>
                        {slidesCount > 1 && (
                          <button 
                            type="button" 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setDeleteTargetIdx(idx); 
                            }} 
                            className="text-[10px] bg-red-500/20 px-1.5 py-0.5 rounded hover:bg-red-500/40 text-red-600 font-bold"
                          >
                            削除
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {onAddSlide && slidesCount < 10 && (
                <div className="mt-1.5 pt-1.5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      onAddSlide();
                      setShowSlidePicker(false);
                    }}
                    className="w-full py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-black text-xs rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>新しい看板を追加</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 
          ユーザー指示：一番上の場所に常にredo/undo矢印が表示されるように
        */}
        <div className="flex items-center gap-1 shrink-0 bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="元に戻す (Undo)"
            className="p-1 sm:p-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            title="やり直す (Redo)"
            className="p-1 sm:p-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* 
          中央：ただの数字（1, 2, 3... 14）の横スライドナビゲーション
          スマホでスルスル横にスライド（スクロール）可能
        */}
        <div className="flex-1 min-w-0 relative">
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-1 px-1 scroll-smooth"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {stepNumbers.map((num) => {
              const isActive = currentStepNumber === num;
              const isPast = num < currentStepNumber;
              const isDisabled = !isFolderReady && num > 1;

              return (
                <button
                  key={num}
                  ref={isActive ? activeBtnRef : null}
                  onClick={() => !isDisabled && onSelectStepNumber(num)}
                  disabled={isDisabled}
                  aria-label={`ステップ ${num}`}
                  title={isDisabled ? 'まず看板の名前を入力して作成してください' : `ステップ ${num} へ移動`}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-base shrink-0 transition-all shadow-xs ${
                    isDisabled
                      ? 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed opacity-40'
                      : isActive
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 border-2 border-blue-700 scale-105 shadow-md cursor-pointer'
                      : isPast
                      ? 'bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-800 border border-slate-300 cursor-pointer'
                      : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200 cursor-pointer'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>

        {/* 右側：保存状態 ＆ 全画面再生ボタン */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onSaveOverwrite}
            className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl font-bold flex items-center gap-1 text-xs border transition-all cursor-pointer ${
              isSaving
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : isSaved
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="看板の保存"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600 shrink-0" />
                <span className="hidden md:inline">保存中</span>
              </>
            ) : isSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3] shrink-0" />
                <span className="hidden md:inline text-emerald-700">保存済</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="hidden md:inline">保存</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenFullscreen}
            disabled={!isFolderReady || slidesCount === 0}
            className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 font-black text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-sm transition-all ${
              !isFolderReady || slidesCount === 0
                ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-50 shadow-none'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white cursor-pointer'
            }`}
            title={!isFolderReady || slidesCount === 0 ? '再生する看板がありません' : '全画面でサイネージを再生する'}
          >
            <MonitorPlay className="w-4 h-4 stroke-[2.5]" />
            <span className="whitespace-nowrap hidden sm:inline">再生する</span>
          </button>
        </div>
      </div>

      {/* 看板削除の確認モーダル（iframe環境でも確実に動作） */}
      {deleteTargetIdx !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100"
          onClick={(e) => {
            e.stopPropagation();
            setDeleteTargetIdx(null);
          }}
        >
          <div 
            className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-2xl border border-slate-200 text-center space-y-3 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h4 className="text-base font-black text-slate-900">
              看板 {deleteTargetIdx + 1} を削除しますか？
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              この看板のデータは削除されます。この操作は取り消せません。
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetIdx(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl transition-colors cursor-pointer"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={() => {
                  const idx = deleteTargetIdx;
                  setDeleteTargetIdx(null);
                  setShowSlidePicker(false);
                  onDeleteSlide?.(idx);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
