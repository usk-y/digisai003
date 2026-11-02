import React from 'react';
import { SignageSlide, TextAnimation } from '../types';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

interface Step4TypographyProps {
  slide: SignageSlide;
  onChange: (updates: Partial<SignageSlide>) => void;
  onNext: () => void;
  onPrev: () => void;
  onReplayAnimation: () => void;
}

export const Step4Typography: React.FC<Step4TypographyProps> = ({
  slide,
  onChange,
  onNext,
  onPrev,
  onReplayAnimation,
}) => {
  // ユーザー指示：アニメーション効果・文字のアニメーションははっきり分かるもの10種に変更
  const textAnimationOptions: {
    id: TextAnimation;
    name: string;
  }[] = [
    { id: 'none', name: '静止' },
    { id: 'slideUp', name: '① 下からスライド' },
    { id: 'slideLeft', name: '② 左からスライド' },
    { id: 'slideRight', name: '③ 右からスライド' },
    { id: 'bounce', name: 'バウンス' },
    { id: 'zoomIn', name: '⑤ ズーム' },
    { id: 'pulse', name: '⑥ パルス' },
    { id: 'shake', name: '⑦ シェイク' },
    { id: 'flip', name: '⑧ 3Dフリップ' },
    { id: 'neonFlicker', name: '⑨ ネオン点滅' },
    { id: 'sway', name: '⑩ ゆらゆら' },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-1 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>８ 文字の動き</span>
        </h2>
        <button
          onClick={onNext}
          className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-full text-[10px] shadow-lg shadow-amber-500/20 transition-all flex items-center gap-0.5 cursor-pointer"
        >
          <span>次へ</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* 文字アニメーションの選択（タグなし・シンプル） */}
      <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-slate-100">
              文字のアニメーション（動きの演出）
            </h3>
          </div>
          {/* アニメーション再再生（削除） */}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {textAnimationOptions.map((anim) => {
            const isSelected = slide.textAnimation === anim.id;
            return (
              <button
                key={anim.id}
                onClick={() => {
                  onChange({ textAnimation: anim.id });
                  onReplayAnimation();
                }}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-center cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 text-amber-200 ring-2 ring-amber-500/40 shadow-md'
                    : 'bg-slate-800/80 border-slate-750 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <div className="text-xs font-bold truncate">{anim.name}</div>
                {isSelected && (
                  <div className="mt-2 text-[10px] text-amber-400 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" /> 選択中
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* スピード選択（ゆっくり / 標準 / 速い）※デフォルト: 標準 */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-300">文字アニメーションの速さ</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'slow', label: 'ゆっくり' },
              { id: 'normal', label: '標準' },
              { id: 'fast', label: '速い' },
            ].map((spd) => {
              const currentSpeed = slide.textAnimationSpeed || 'normal';
              const isSelected = currentSpeed === spd.id;
              return (
                <button
                  key={spd.id}
                  onClick={() => {
                    onChange({ textAnimationSpeed: spd.id as any });
                    onReplayAnimation();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md ring-1 ring-amber-400 font-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750 border border-slate-700'
                  }`}
                >
                  {spd.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ステップ移動 */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={onPrev}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs sm:text-sm border border-slate-700 cursor-pointer"
        >
          ← ７ 商品 に戻る
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          ９ 配信 へ進む →
        </button>
      </div>
    </div>
  );
};
