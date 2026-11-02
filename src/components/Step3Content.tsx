import React from 'react';
import { SignageSlide, FontFamily, TextTarget } from '../types';
import { Type, Check, ArrowRight } from 'lucide-react';
import { FONT_OPTIONS } from '../data/fonts';

interface Step3ContentProps {
  slide: SignageSlide;
  onChange: (updates: Partial<SignageSlide>) => void;
  onNext: () => void;
  onPrev: () => void;
  selectedTextTarget?: TextTarget;
  onSelectTextTarget?: (target: TextTarget) => void;
  onApplyQuickFont?: (fontFamily: FontFamily) => void;
}

export const Step3Content: React.FC<Step3ContentProps> = ({
  slide,
  onChange,
  onNext,
  onPrev,
  onApplyQuickFont,
}) => {
  const handleSelectFont = (fontFamily: FontFamily) => {
    if (onApplyQuickFont) {
      onApplyQuickFont(fontFamily);
    } else {
      onChange({ fontFamily });
    }
  };

  const activeFontFamily = slide.fontFamily || 'Noto Sans JP';

  return (
    <div className="space-y-6">
      <div className="pb-2.5 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
          <Type className="w-5 h-5 text-amber-400" />
          <span>４ 書体</span>
        </h2>
        <button
          onClick={onNext}
          className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-full text-[10px] shadow-lg shadow-amber-500/20 transition-all flex items-center gap-0.5 cursor-pointer"
        >
          <span>次へ</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* ユーザー指示：テキストの書体を１５種類にして「手書きポップ」を削除 ＆ 「文字と画像」のページの一番上に移動 */}
      <div className="bg-slate-850 p-4 rounded-2xl border border-amber-500/40 shadow-xl space-y-3">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Type className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
              <span>テキストの書体</span>
            </h3>
          </div>
        </div>

        {/* 15種類の書体グリッド */}
        <div className="grid grid-cols-3 gap-2 pt-0.5">
          {FONT_OPTIONS.map((f) => {
            const isSelected = activeFontFamily === f.family;
            return (
              <button
                key={f.family}
                type="button"
                onClick={() => handleSelectFont(f.family)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-center min-h-[46px] relative ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-500/50 shadow-md'
                    : 'bg-slate-900 border-slate-750 text-slate-300 hover:bg-slate-800 hover:border-slate-650'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-3 h-3 text-amber-400 stroke-[3]" />
                  </div>
                )}
                <div
                  className="text-xs font-bold text-slate-100 break-words leading-snug pr-5"
                  style={{ fontFamily: `'${f.family}', sans-serif` }}
                >
                  {f.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 基本テキスト情報 */}
      <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-4">
        <div className="bg-slate-900/90 p-4 rounded-2xl">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            基本設定
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-750">
              <div>
                <span className="text-xs font-bold text-slate-200 block">文字の基本色</span>
                <span className="text-[10px] text-slate-400">見出し・メニューの本文色</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={slide.textColor}
                  onChange={(e) => onChange({ textColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-600 bg-transparent"
                />
                <span className="text-xs font-mono text-slate-300 uppercase">{slide.textColor}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-750">
              <div>
                <span className="text-xs font-bold text-slate-200 block">アクセントカラー</span>
                <span className="text-[10px] text-slate-400">価格・バッジ・注目強調色</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={slide.accentColor}
                  onChange={(e) => onChange({ accentColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-600 bg-transparent"
                />
                <span className="text-xs font-mono text-slate-300 uppercase">{slide.accentColor}</span>
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
          ← ３ 背景 に戻る
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          ５ 店舗名・ブランド名 へ進む →
        </button>
      </div>
    </div>
  );
};
