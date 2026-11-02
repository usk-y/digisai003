import React, { useState } from 'react';
import { SignageSlide, AppError } from '../types';
import { Upload, Trash2, Image as ImageIcon, Loader2, ArrowRight, FileText } from 'lucide-react';
import { validateAndOptimizeImage } from '../utils/imageOptimizer';
import { ErrorAlertModal } from './ErrorAlertModal';
import { handleImageError } from '../utils/imageFallback';
import {
  calculateAutoHeadlinePt,
  calculateAutoSubheadlinePt,
} from '../utils/typography';

interface Step6CopyProps {
  slide: SignageSlide;
  onChange: (updates: Partial<SignageSlide>) => void;
  onNext: () => void;
  onPrev: () => void;
}

// ユーザー指示「メインキャッチコピー・サブコピーのポイント数を任意で変更できるように」
const PointSizeControl: React.FC<{
  label?: string;
  value?: number;
  autoPt: number;
  min?: number;
  max?: number;
  presets: number[];
  onChange: (pt: number | undefined) => void;
}> = ({ label = 'サイズ', value, autoPt, min = 10, max = 80, presets, onChange }) => {
  const isAuto = value === undefined || value === null || value <= 0;
  const currentPt = isAuto ? autoPt : value;

  return (
    <div className="inline-flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-xl border border-slate-700 shrink-0">
      <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{label}:</span>

      {/* 自動ボタン */}
      <button
        type="button"
        onClick={() => onChange(undefined)}
        className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
          isAuto
            ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
            : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-700/80'
        }`}
        title={`文字数・行数から自動でフォントサイズを縮小最適化（現在: ${autoPt}pt）`}
      >
        自動
      </button>

      {/* 任意数値の入力 ＆ [-][+]ステッパー */}
      <div className="flex items-center bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
        <button
          type="button"
          onClick={() => {
            const base = isAuto ? autoPt : value!;
            const next = Math.max(min, base - 1);
            onChange(next);
          }}
          className="px-1.5 py-0.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-amber-400 active:scale-95 cursor-pointer font-bold select-none"
          title="1pt小さく"
        >
          -
        </button>
        <div className="flex items-center px-1">
          <input
            type="number"
            min={min}
            max={max}
            value={currentPt}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '') {
                onChange(undefined);
                return;
              }
              const num = parseInt(val, 10);
              if (!isNaN(num)) {
                onChange(Math.min(max, Math.max(min, num)));
              }
            }}
            className={`w-7 text-center text-[11px] font-bold ${
              isAuto ? 'text-amber-400' : 'text-amber-300'
            } bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            title={isAuto ? `自動算出中 (${autoPt}pt)` : '手動指定中'}
          />
          <span className="text-[9px] text-slate-400 font-mono select-none">pt</span>
        </div>
        <button
          type="button"
          onClick={() => {
            const base = isAuto ? autoPt : value!;
            const next = Math.min(max, base + 1);
            onChange(next);
          }}
          className="px-1.5 py-0.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-amber-400 active:scale-95 cursor-pointer font-bold select-none"
          title="1pt大きく"
        >
          +
        </button>
      </div>

      {/* クイック選択プリセット */}
      <div className="hidden sm:flex items-center gap-1">
        {presets.map((pt) => {
          const isSelected = !isAuto && currentPt === pt;
          return (
            <button
              key={pt}
              type="button"
              onClick={() => onChange(pt)}
              className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
              }`}
            >
              {pt}pt
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ユーザー指示：左揃え・中央揃え・右揃え（縦書き時は上中下揃え）の選択機能
const TextAlignControl: React.FC<{
  value?: 'left' | 'center' | 'right';
  onChange: (val: 'left' | 'center' | 'right') => void;
  isVertical?: boolean;
}> = ({ value = 'center', onChange, isVertical = false }) => (
  <div className="inline-flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-700 shrink-0">
    {(
      [
        { val: 'left', label: isVertical ? '上寄せ' : '左寄せ' },
        { val: 'center', label: '真ん中' },
        { val: 'right', label: isVertical ? '下寄せ' : '右寄せ' },
      ] as const
    ).map((opt) => {
      const isSelected = (value || 'center') === opt.val;
      return (
        <button
          key={opt.val}
          type="button"
          onClick={() => onChange(opt.val)}
          className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
            isSelected
              ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
          title={isVertical ? `${opt.label}揃え` : `${opt.label}揃え`}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);

export const Step6Copy: React.FC<Step6CopyProps> = ({
  slide,
  onChange,
  onNext,
  onPrev,
}) => {
  const [errorInfo, setErrorInfo] = useState<AppError | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // 縦書き判定 & リアルタイムフォントサイズ自動計算（プレビューと連動）
  const isVertical = slide.writingMode === 'vertical';
  const autoHeadlinePt = calculateAutoHeadlinePt(slide.headline || '', isVertical, slide.headlineSize);
  const autoSubheadlinePt = calculateAutoSubheadlinePt(slide.subheadline || '', isVertical, slide.subheadlineSize);

  const currentImg = slide.subheadlineImageUrl || (slide.subheadlineImages && slide.subheadlineImages[0]) || '';

  const handleUpdateSingleImage = (url: string) => {
    onChange({
      subheadlineImageUrl: url || undefined,
      subheadlineImages: url ? [url] : [],
    });
  };

  return (
    <div className="space-y-6">
      {/* 画面上部ヘッダー */}
      <div className="pb-2.5 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-400" />
          <span>６ コピー</span>
        </h2>
        <button
          onClick={onNext}
          className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-full text-[10px] shadow-lg shadow-amber-500/20 transition-all flex items-center gap-0.5 cursor-pointer"
        >
          <span>次へ</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* コピー入力設定カード */}
      <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-4">
        {/* メインキャッチコピー（大見出し）＆ 任意ポイント数指定 ＆ 配置変更 */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-300">
                メインキャッチコピー（大見出し）
              </label>
            </div>
            <div className="flex items-center gap-1.5">
              <TextAlignControl
                value={slide.headlineAlign}
                onChange={(val) => onChange({ headlineAlign: val })}
                isVertical={isVertical}
              />
              <PointSizeControl
                label="文字Pt"
                value={slide.headlinePt}
                autoPt={autoHeadlinePt}
                min={12}
                max={52}
                presets={[24, 32, 40, 48, 52]}
                onChange={(pt) => onChange({ headlinePt: pt })}
              />
            </div>
          </div>
          <textarea
            value={slide.headline}
            onChange={(e) => onChange({ headline: e.target.value })}
            rows={2}
            placeholder="メインキャッチコピー（最大52pt・自動調整または任意指定）"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-100 focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
          />
        </div>

        {/* サブコピー・説明文 ＆ 任意ポイント数指定 ＆ 配置変更 */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-300">
                サブコピー・説明文
              </label>
            </div>
            <div className="flex items-center gap-1.5">
              <TextAlignControl
                value={slide.subheadlineAlign}
                onChange={(val) => onChange({ subheadlineAlign: val })}
                isVertical={isVertical}
              />
              <PointSizeControl
                label="文字Pt"
                value={slide.subheadlinePt}
                autoPt={autoSubheadlinePt}
                min={10}
                max={26}
                presets={[12, 16, 20, 24, 26]}
                onChange={(pt) => onChange({ subheadlinePt: pt })}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <textarea
              value={slide.subheadline}
              onChange={(e) => onChange({ subheadline: e.target.value })}
              rows={2}
              placeholder="サブコピー・説明文（最大26pt・自動調整または任意指定）"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500 mb-3 placeholder:text-slate-500"
            />

            {/* 参考画像アップロード＆プレビュー */}
            <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-200">
                    参考画像
                  </label>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {currentImg ? (
                      <div className="w-24 h-14 rounded-lg bg-transparent border border-slate-700/60 p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        <img
                          src={currentImg}
                          alt="参考画像プレビュー"
                          referrerPolicy="no-referrer"
                          onError={handleImageError}
                          className="w-auto h-auto max-w-full max-h-full object-contain rounded"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-14 rounded-lg bg-slate-900 text-slate-500 border border-slate-800 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-100 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer border border-slate-700 active:scale-95">
                      {isProcessing === 'subheadlineImage-0' ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                          <span>処理中...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>画像を添付</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isProcessing === 'subheadlineImage-0'}
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setIsProcessing('subheadlineImage-0');
                            try {
                              const result = await validateAndOptimizeImage(file, {
                                maxDimension: 1200,
                                quality: 0.88,
                              });
                              if (!result.success || !result.dataUrl) {
                                setErrorInfo(
                                  result.error || {
                                    title: '画像のアップロードに失敗しました',
                                    reason: '画像の読み込みまたは最適化処理中にエラーが発生しました。',
                                    solution: '別の画像ファイルを選択するか、画像URLを直接入力してください。',
                                  }
                                );
                                return;
                              }
                              handleUpdateSingleImage(result.dataUrl);
                            } catch (err: unknown) {
                              setErrorInfo({
                                title: '予期せぬ画像処理エラー',
                                reason: '画像データを読み取る際にエラーが発生しました。',
                                solution: '別の画像をお試しください。',
                                details: err instanceof Error ? err.message : String(err),
                              });
                            } finally {
                              setIsProcessing(null);
                            }
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>

                    {currentImg && (
                      <button
                        type="button"
                        onClick={() => handleUpdateSingleImage('')}
                        className="px-2 py-1.5 text-rose-400 hover:text-rose-300 text-xs font-bold rounded-lg border border-rose-500/30 hover:bg-rose-500/10 cursor-pointer"
                        title="画像を削除"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 画面下部ナビゲーションボタン */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onPrev}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-xl text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
        >
          ← ５ 店舗名・ブランド名 に戻る
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          ７ 商品 へ進む →
        </button>
      </div>

      {/* エラー表示モーダル（理由と解決方法を明示） */}
      <ErrorAlertModal
        error={errorInfo}
        onClose={() => setErrorInfo(null)}
      />
    </div>
  );
};
