import React, { useState, useEffect } from 'react';
import { SignageSlide } from '../types';
import { SignageDisplay } from './SignageDisplay';
import { X, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface FullscreenPlayerProps {
  slides: SignageSlide[];
  initialIndex?: number;
  onClose: () => void;
}

export const FullscreenPlayer: React.FC<FullscreenPlayerProps> = ({
  slides,
  initialIndex = 0,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [scale, setScale] = useState(1);

  const currentSlide = slides[currentIndex] || slides[0];
  const slideDuration = ((currentSlide && currentSlide.duration) || 8) * 1000;

  // 初期インデックスが指定されたらリセット
  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [initialIndex]);

  // 画面全体に比率（縦型540x960、横型960x540）を美しくフィットさせるスケール計算
  useEffect(() => {
    const handleResize = () => {
      const isLandscape = currentSlide?.aspect === '16:9' || currentSlide?.aspect === 'horizontal';
      const targetW = isLandscape ? 960 : 540;
      const targetH = isLandscape ? 540 : 960;
      const s = Math.min(window.innerWidth / targetW, window.innerHeight / targetH);
      setScale(s);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentSlide?.aspect]);

  // Escキーで閉じる、左右キーでスライド移動
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
        setProgress(0);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
        setProgress(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, onClose]);

  // スライド切り替えタイマーとプログレスバー
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 50; // 50msごとにプログレス更新
    const step = (intervalTime / slideDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((current) => (current + 1) % slides.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, slideDuration, slides.length]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden cursor-none hover:cursor-default"
      onMouseMove={() => {
        setShowControls(true);
      }}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* 上部プログレスバー（残り秒数の可視化） */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/40 z-50 overflow-hidden">
        <div
          className="h-full bg-amber-400 transition-all duration-75 ease-linear shadow-[0_0_8px_rgba(251,191,36,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 看板フルスクリーン本体（実際のモニター表示とサンプル画面の文字比率が100%完全一致） */}
      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        <SignageDisplay 
          key={`${currentSlide?.id || currentIndex}-${currentIndex}`} 
          slide={currentSlide} 
          scale={scale} 
          isFullscreen={true} 
        />
      </div>

      {/* ホバー時のみ現れるスマートコントローラー */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/80 shadow-2xl transition-opacity duration-300 ${
          showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => {
            setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
            setProgress(0);
          }}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="前のスライド"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
          title={isPaused ? '再生再開' : '一時停止'}
        >
          {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
        </button>

        <button
          onClick={() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
            setProgress(0);
          }}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="次のスライド"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="text-xs font-mono font-bold text-slate-300 px-2 border-l border-slate-700">
          {currentIndex + 1} / {slides.length}
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-slate-800 transition-colors ml-2"
          title="全画面を閉じる (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 右上の閉じるボタン */}
      <button
        onClick={onClose}
        className={`absolute top-4 right-4 z-50 p-2.5 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80 shadow-lg transition-opacity duration-300 ${
          showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        title="全画面を閉じる (Esc)"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
