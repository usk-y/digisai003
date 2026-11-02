import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SignageSlide, TextTarget, FontFamily } from '../types';
import { SignageDisplay } from './SignageDisplay';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Type, 
  Check, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface PreviewPanelProps {
  currentSlide: SignageSlide;
  slidesCount: number;
  currentSlideIndex: number;
  onSelectSlideIndex: (index: number) => void;
  replayKey: number;
  onReplayAnimation: () => void;
  selectedTextTarget: TextTarget;
  onSelectTextTarget: (target: TextTarget) => void;
  onApplyQuickFont: (fontFamily: FontFamily) => void;
  isMobileLandscape?: boolean;
}

import { FONT_OPTIONS as fontOptions, TARGET_NAME_MAP as targetNameMap } from '../data/fonts';

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  currentSlide,
  slidesCount,
  currentSlideIndex,
  onSelectSlideIndex,
  replayKey,
  onReplayAnimation,
  selectedTextTarget,
  onSelectTextTarget,
  onApplyQuickFont,
  isMobileLandscape = false,
}) => {
  const displayContainerRef = useRef<HTMLDivElement>(null);

  // スケールモード: 'auto'（見切れなし自動フィット）または 'manual'（手動調整）
  const [scaleMode, setScaleMode] = useState<'auto' | 'manual'>('auto');
  const [autoScale, setAutoScale] = useState<number>(0.55);
  const [manualScale, setManualScale] = useState<number>(0.55);

  // スマホ横画面時のフォントパネル折りたたみ状態
  const [isFontBarOpen, setIsFontBarOpen] = useState<boolean>(!isMobileLandscape);

  // コンテナサイズに応じた 9:16 自動フィットスケールの計算（上下左右見切れゼロ保証）
  const calculateFitScale = useCallback(() => {
    if (!displayContainerRef.current) return;
    const { clientWidth, clientHeight } = displayContainerRef.current;
    
    // コンテナの内側安全マージン（ネオングロー・太枠線・シャドウ・下部ページネーション操作部のはみ出しを確実に防止）
    const paddingX = isMobileLandscape ? 16 : 28;
    const paddingY = slidesCount > 1 
      ? (isMobileLandscape ? 40 : 64) 
      : (isMobileLandscape ? 20 : 36);

    const availableWidth = Math.max(80, clientWidth - paddingX);
    const availableHeight = Math.max(100, clientHeight - paddingY);

    const isLandscape = currentSlide.aspect === '16:9' || currentSlide.aspect === 'horizontal';
    const baseW = isLandscape ? 960 : 540;
    const baseH = isLandscape ? 540 : 960;

    // 基準キャンバスに対する縦横の収容比率
    const scaleByW = availableWidth / baseW;
    const scaleByH = availableHeight / baseH;
    
    // コンテナ全体に収まる最小比率を適用
    const fit = Math.min(scaleByW, scaleByH);
    const clampedFit = Math.max(0.1, Math.min(fit, 1.5)); // 0.1 ～ 1.5倍の範囲に制限
    
    setAutoScale(clampedFit);
    if (scaleMode === 'auto') {
      setManualScale(clampedFit);
    }
  }, [isMobileLandscape, scaleMode, slidesCount, currentSlide.aspect]);

  useEffect(() => {
    calculateFitScale();

    if (!displayContainerRef.current) return;
    const observer = new ResizeObserver(() => {
      calculateFitScale();
    });
    observer.observe(displayContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [calculateFitScale]);

  // 横画面切替時にフォントバーの開閉を自動連動
  useEffect(() => {
    if (isMobileLandscape) {
      setIsFontBarOpen(false);
    } else {
      setIsFontBarOpen(true);
    }
  }, [isMobileLandscape]);

  const activeScale = scaleMode === 'auto' ? autoScale : manualScale;

  const handleZoomIn = () => {
    setScaleMode('manual');
    setManualScale((s) => Math.min(1.0, Number((s + 0.05).toFixed(2))));
  };

  const handleZoomOut = () => {
    setScaleMode('manual');
    setManualScale((s) => Math.max(0.15, Number((s - 0.05).toFixed(2))));
  };

  const handleResetToAuto = () => {
    setScaleMode('auto');
    calculateFitScale();
  };

  return (
    <div className="w-full h-full flex flex-col items-center min-h-0 overflow-hidden gap-1.5 bg-white">
      {/* プレビュー上部ヘッダー操作バー */}
      <div className={`w-full bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-xs shrink-0 ${
        isMobileLandscape ? 'px-2 py-1' : 'px-2.5 py-1.5'
      }`}>
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-black text-slate-800 flex items-center gap-1 truncate">
            <Eye className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">看板プレビュー ({currentSlideIndex + 1}/{slidesCount})</span>
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-md shrink-0 border border-slate-200 hidden sm:inline">
            {Math.round(activeScale * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* 書体変更トグル */}
          <button
            onClick={() => setIsFontBarOpen((v) => !v)}
            title="書体パネルの表示切替"
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition-all cursor-pointer ${
              isFontBarOpen
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Type className="w-3 h-3 text-blue-600" />
            <span className="hidden sm:inline">書体変更</span>
            {isFontBarOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* 自動フィット（9:16 見切れゼロ）ボタン */}
          <button
            onClick={handleResetToAuto}
            title="画面ピッタリに全体表示（見切れ防止）"
            className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer ${
              scaleMode === 'auto'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Maximize className="w-3 h-3" />
            <span>自動フィット</span>
          </button>

          {/* 縮小 */}
          <button
            onClick={handleZoomOut}
            title="縮小"
            className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* 拡大 */}
          <button
            onClick={handleZoomIn}
            title="拡大"
            className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 看板文字クリック連動：フォント変更バー（折りたたみ可能） */}
      {isFontBarOpen && (
        <div className="w-full mb-1 bg-white border border-blue-200 rounded-xl p-1.5 shadow-xs shrink-0 transition-all">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Type className="w-3 h-3 text-blue-600 shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-700">
                選択中: <strong className="text-blue-700">{targetNameMap[selectedTextTarget]}</strong> の書体
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5">
            {fontOptions.map((f) => {
              const currentFont =
                selectedTextTarget === 'all'
                  ? currentSlide.fontFamily
                  : currentSlide.fontOverrides?.[selectedTextTarget as keyof typeof currentSlide.fontOverrides] || currentSlide.fontFamily;
              const isSelected = currentFont === f.family;
              return (
                <button
                  key={f.family}
                  onClick={() => onApplyQuickFont(f.family)}
                  className={`px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold shrink-0 transition-all cursor-pointer flex items-center gap-0.5 border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  style={{ fontFamily: `'${f.family}', sans-serif` }}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  <span>{f.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 
        プレビュー表示エリア：
        9:16 の縦型看板がコンテナの幅と高さの中に「絶対に見切れない（Auto Fit）」ようにスケーリングして中央配置
      */}
      <div
        ref={displayContainerRef}
        className="w-full flex-1 min-h-0 bg-slate-100/70 rounded-2xl sm:rounded-3xl border border-slate-200 flex flex-col items-center justify-center overflow-hidden shadow-inner relative p-2"
      >
        <div 
          key={`${currentSlide.id}-${replayKey}`}
          className="flex items-center justify-center transition-transform duration-100 ease-out"
        >
          <SignageDisplay
            slide={currentSlide}
            scale={activeScale}
            interactive={true}
            selectedTextTarget={selectedTextTarget}
            onSelectTextTarget={onSelectTextTarget}
          />
        </div>

        {/* スライド切替（複数スライド時） */}
        {slidesCount > 1 && (
          <div className="absolute bottom-2.5 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-slate-300 shadow-lg z-20">
            <button
              onClick={() => {
                onSelectSlideIndex((currentSlideIndex - 1 + slidesCount) % slidesCount);
                onReplayAnimation();
              }}
              className="p-0.5 text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
              title="前の看板"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold text-slate-900">
              {currentSlideIndex + 1} / {slidesCount}
            </span>
            <button
              onClick={() => {
                onSelectSlideIndex((currentSlideIndex + 1) % slidesCount);
                onReplayAnimation();
              }}
              className="p-0.5 text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
              title="次の看板"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
