import React, { useState } from 'react';
import { SignageSlide, AppError } from '../types';
import { Upload, Trash2, Image as ImageIcon, Loader2, ArrowRight, Store } from 'lucide-react';
import { validateAndOptimizeImage } from '../utils/imageOptimizer';
import { ErrorAlertModal } from './ErrorAlertModal';
import { handleImageError } from '../utils/imageFallback';

interface Step5ShopNameProps {
  slide: SignageSlide;
  onChange: (updates: Partial<SignageSlide>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const FontSizeToggle: React.FC<{
  value?: 'small' | 'medium' | 'large';
  onChange: (val: 'small' | 'medium' | 'large') => void;
}> = ({ value = 'medium', onChange }) => (
  <div className="inline-flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-700 shrink-0">
    {(
      [
        { size: 'small', label: '小' },
        { size: 'medium', label: '中' },
        { size: 'large', label: '大' },
      ] as const
    ).map((opt) => {
      const isSelected = (value || 'medium') === opt.size;
      return (
        <button
          key={opt.size}
          type="button"
          onClick={() => onChange(opt.size)}
          className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
            isSelected
              ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);

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
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);

export const Step5ShopName: React.FC<Step5ShopNameProps> = ({
  slide,
  onChange,
  onNext,
  onPrev,
}) => {
  const [errorInfo, setErrorInfo] = useState<AppError | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleLogoUpload = async (file: File) => {
    setIsProcessing('logo');
    try {
      const result = await validateAndOptimizeImage(file, {
        maxDimension: 800,
        quality: 0.85,
      });

      if (!result.success || !result.dataUrl) {
        setErrorInfo(
          result.error || {
            title: '店舗ロゴ画像のアップロードに失敗しました',
            reason: '選択された画像のフォーマットやサイズに問題がある可能性があります。',
            solution: 'PNGまたはJPEG形式の画像（推奨: 5MB以内）をご使用ください。',
          }
        );
        return;
      }

      onChange({ shopLogoUrl: result.dataUrl });
    } catch (err: unknown) {
      setErrorInfo({
        title: '予期せぬロゴ処理エラー',
        reason: 'ロゴ画像データの処理中にエラーが発生しました。',
        solution: '別の画像をお試しいただくか、ファイル形式をご確認ください。',
        details: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-2.5 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
          <Store className="w-5 h-5 text-amber-400" />
          <span>５ 店舗名・ブランド名</span>
        </h2>
        <button
          onClick={onNext}
          className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-full text-[10px] shadow-lg shadow-amber-500/20 transition-all flex items-center gap-0.5 cursor-pointer"
        >
          <span>次へ</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-4">
        {/* 店舗名・ロゴ画像・フォントサイズトグル設定 */}
        <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-750 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-black text-slate-200">
              店舗名・ブランド名 ＆ ロゴ画像
            </label>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <TextAlignControl
                value={slide.shopNameAlign || 'left'}
                onChange={(val) => onChange({ shopNameAlign: val })}
              />
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-bold">文字サイズ:</span>
                <FontSizeToggle
                  value={slide.shopNameSize}
                  onChange={(val) => onChange({ shopNameSize: val })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
            <div className="sm:col-span-7">
              <textarea
                value={slide.shopName}
                onChange={(e) => onChange({ shopName: e.target.value })}
                rows={2}
                placeholder="例: CAFE ROAST&#10;& BAKE"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-500 leading-snug"
              />
            </div>

            <div className="sm:col-span-5 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                {slide.shopLogoUrl ? (
                  <div className="w-9 h-9 rounded-lg bg-black border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={slide.shopLogoUrl}
                      alt="Logo"
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-slate-950 text-slate-500 border border-slate-700 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                )}

                <label className="px-3.5 py-2 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-amber-500/20 active:scale-95 shrink-0">
                  {isProcessing === 'logo' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                      <span>最適化中...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>ロゴ画像を添付</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isProcessing === 'logo'}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoUpload(file);
                      e.target.value = '';
                    }}
                  />
                </label>

                {slide.shopLogoUrl && (
                  <button
                    type="button"
                    onClick={() => onChange({ shopLogoUrl: undefined })}
                    className="px-2 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl border border-rose-500/30 cursor-pointer text-xs font-bold"
                    title="ロゴ画像を削除"
                  >
                    <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                    解除
                  </button>
                )}
              </div>
              <p className="text-[10px] text-amber-400/90 font-medium">
                ※正方形の画像をアップロードしてください。それ以外の形は縮小されます
              </p>
            </div>
          </div>
        </div>

        {/* カテゴリータグの編集 */}
        <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-750 space-y-3">
          <label className="text-xs font-black text-slate-200">
            カテゴリータグ
          </label>
          <textarea
            value={slide.categoryBadge || ''}
            onChange={(e) => onChange({ categoryBadge: e.target.value })}
            rows={2}
            placeholder="例: TODAY'S SPECIAL"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-500 leading-snug"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onPrev}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-xl text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
        >
          ← ４ 書体 に戻る
        </button>

        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          ６ コピー へ進む →
        </button>
      </div>

      <ErrorAlertModal
        error={errorInfo}
        onClose={() => setErrorInfo(null)}
      />
    </div>
  );
};
