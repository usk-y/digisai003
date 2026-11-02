import React from 'react';
import { SignageSlide } from '../types';
import { 
  Maximize2, 
  Play, 
  Pause, 
  Clock,
  Tv
} from 'lucide-react';

interface Step5DeliveryProps {
  slides: SignageSlide[];
  currentSlideIndex: number;
  onSelectSlideIndex: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onOpenFullscreen: () => void;
  onPrev: () => void;
}

export const Step5Delivery: React.FC<Step5DeliveryProps> = ({
  slides,
  currentSlideIndex,
  onSelectSlideIndex,
  isPlaying,
  onTogglePlay,
  onOpenFullscreen,
  onPrev,
}) => {
  // 全スライドの合計再生時間
  const totalDuration = slides.reduce((acc, s) => acc + (s.duration || 10), 0);

  return (
    <div className="space-y-6">
      {/* イントロ */}
      <div className="pb-1 border-b border-slate-800">
        <h2 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
          <Tv className="w-5 h-5 text-amber-400" />
          <span>９ サイネージ配信</span>
        </h2>
      </div>

      {/* メインアクション：全画面サイネージ起動 */}
      <div className="bg-slate-850 p-6 rounded-2xl border border-emerald-500/40 text-center space-y-4 shadow-xl">
        <div>

          <h3 className="text-lg sm:text-xl font-black text-slate-100">
            全画面でサイネージ配信を開始
          </h3>

        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <button
            onClick={onOpenFullscreen}
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-sm shadow-xl shadow-emerald-500/25 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
          >
            <Maximize2 className="w-4 h-4 text-slate-950" />
            <span>全画面で今すぐ配信開始</span>
          </button>

          <button
            onClick={onTogglePlay}
            className={`px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md animate-pulse'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>自動ループ再生を停止</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>自動ループをテスト再生</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* スライド一覧・ループ再生ステータス */}
      <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-slate-200">
              配信スライド一覧 ({slides.length}枚)
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400">
            1周 合計 {totalDuration}秒
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {slides.map((s, idx) => {
            const isSelected = currentSlideIndex === idx;
            return (
              <div
                key={s.id || idx}
                onClick={() => onSelectSlideIndex(idx)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-500/40 shadow-sm'
                    : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  {/* インデックス番号を削除 */}
                  {/* 時間表示を削除 */}
                </div>
                <div className="text-[11px] text-slate-300 font-bold">
                  {s.headline || s.shopName}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ステップ移動 */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={onPrev}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs sm:text-sm border border-slate-700 cursor-pointer"
        >
          ← ８ 文字の動き に戻る
        </button>
      </div>
    </div>
  );
};
