import { useState, useEffect, useCallback } from 'react';
import { SignageSlide, AppError, TextTarget, FontFamily } from '../types';
import { SIGNAGE_TEMPLATES } from '../data/templates';
import { ensureDiverseTagColors } from '../utils/typography';
import { repairSlideImages } from '../utils/imageFallback';

const MAX_SLIDES = 10;

export function useSignageEditor(onError: (err: AppError) => void) {
  // 初期スライド
  const [slides, setSlides] = useState<SignageSlide[]>(() => {
    const cafeTmpl = SIGNAGE_TEMPLATES[0].slide;
    const initialSlide: SignageSlide = {
      id: 'slide-1',
      name: 'カフェ・喫茶',
      duration: 10,
      aspect: 'vertical',
      frame: cafeTmpl.frame || 'modern-black',
      bgType: cafeTmpl.bgType || 'solid',
      bgColor: cafeTmpl.bgColor || '#fffbeb',
      bgGradient: cafeTmpl.bgGradient || '',
      bgPattern: cafeTmpl.bgPattern || 'dots',
      bgAnimation: cafeTmpl.bgAnimation || 'none',
      textColor: cafeTmpl.textColor || '#451a03',
      accentColor: cafeTmpl.accentColor || '#d97706',
      shopName: cafeTmpl.shopName || 'CAFE ROAST & BAKE',
      categoryBadge: cafeTmpl.categoryBadge || "TODAY'S SPECIAL",
      writingMode: 'horizontal',
      headline: '至福の自家製カヌレ\n& 深煎り珈琲',
      subheadline: '毎朝店内でじっくり焼き上げる\n外カリ・中モッチリの贅沢スイーツ',
      subheadlineImages: cafeTmpl.subheadlineImages || [],
      menuItems: ensureDiverseTagColors((cafeTmpl.menuItems || []).slice(0, 6)),
      footerNote: 'テイクアウトOK！店内Wi-Fi完備\n営業時間 10:00〜21:00',
      showQrCode: cafeTmpl.showQrCode ?? true,
      qrCodeUrl: cafeTmpl.qrCodeUrl || 'https://example.com/menu',
      qrCodeLabel: cafeTmpl.qrCodeLabel || 'モバイルオーダー',
      fontFamily: cafeTmpl.fontFamily || 'Zen Maru Gothic',
      fontOverrides: {},
      textAnimation: cafeTmpl.textAnimation || 'slideUp',
      textAnimationSpeed: cafeTmpl.textAnimationSpeed || 'normal',
      layoutStyle: 'split-menu',
    };
    return [initialSlide];
  });

  const [history, setHistory] = useState<SignageSlide[][]>([]);
  const [future, setFuture] = useState<SignageSlide[][]>([]);

  const setSlidesWithHistory = useCallback((newSlides: SignageSlide[] | ((prev: SignageSlide[]) => SignageSlide[])) => {
    setSlides((prev) => {
      const nextSlides = typeof newSlides === 'function' ? newSlides(prev) : newSlides;
      if (JSON.stringify(prev) === JSON.stringify(nextSlides)) return prev;
      setHistory((h) => [...h.slice(-20), prev]);
      setFuture([]);
      return nextSlides;
    });
  }, []);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    const newHistory = history.slice(0, history.length - 1);
    setFuture((f) => [slides, ...f]);
    setHistory(newHistory);
    setSlides(previous);
  }, [history, slides]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setHistory((h) => [...h, slides]);
    setFuture(newFuture);
    setSlides(next);
  }, [future, slides]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [replayKey, setReplayKey] = useState<number>(0);
  const [selectedTextTarget, setSelectedTextTarget] = useState<TextTarget>('all');

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const replayAnimation = useCallback(() => {
    setReplayKey((k) => k + 1);
  }, []);

  // スライド更新
  const updateCurrentSlide = useCallback((updates: Partial<SignageSlide>) => {
    setSlidesWithHistory((prev) =>
      prev.map((s, idx) => (idx === currentSlideIndex ? { ...s, ...updates } : s))
    );
  }, [currentSlideIndex, setSlidesWithHistory]);

  // テンプレート適用（現在のwritingModeを保持しつつ、前のテンプレートの背景・模様・色・画像が残らないよう完全リセット）
  const applyTemplate = useCallback((templateSlide: Partial<SignageSlide>) => {
    const existingWritingMode = slides[currentSlideIndex]?.writingMode || 'horizontal';
    const bgType = templateSlide.bgType || 'solid';
    const bgColor = templateSlide.bgColor || (bgType === 'gradient' ? '#14532d' : '#1e293b');
    const bgGradient = templateSlide.bgGradient || '';
    const bgPattern = templateSlide.bgPattern || 'none';

    updateCurrentSlide({
      ...templateSlide,
      aspect: 'vertical',
      writingMode: existingWritingMode,
      bgType,
      bgColor,
      bgGradient,
      bgPattern,
      bgCustomImage: templateSlide.bgCustomImage || undefined,
      bgVideoUrl: templateSlide.bgVideoUrl || undefined,
      qrCustomImageUrl: templateSlide.qrCustomImageUrl || undefined,
      textColor: templateSlide.textColor || '#ffffff',
      accentColor: templateSlide.accentColor || '#fbbf24',
      shopNamePt: templateSlide.shopNamePt,
      headlinePt: templateSlide.headlinePt,
      subheadlinePt: templateSlide.subheadlinePt,
      footerNotePt: templateSlide.footerNotePt,
      shopLogoUrl: templateSlide.shopLogoUrl,
      subheadlineImageUrl: templateSlide.subheadlineImageUrl || templateSlide.subheadlineImages?.[0],
      menuItems: ensureDiverseTagColors((templateSlide.menuItems || []).slice(0, 6)),
      fontOverrides: {},
      textColorOverrides: templateSlide.textColorOverrides || {},
    });
    setReplayKey((k) => k + 1);
  }, [updateCurrentSlide, slides, currentSlideIndex]);

  // スライド追加
  const addSlide = useCallback(() => {
    if (slides.length >= MAX_SLIDES) {
      onError({
        title: '看板スライド枚数の上限到達',
        reason: `1つのフォルダ内で連続ループ再生できる看板枚数の上限（最大${MAX_SLIDES}枚）に達しています。`,
        solution: '不要な看板スライドを削除するか、別の看板フォルダを作成して分けて登録してください。',
      });
      return;
    }
    const newSlide: SignageSlide = {
      ...currentSlide,
      id: `slide-${Date.now()}`,
      name: `${slides.length + 1}枚目`,
      aspect: 'vertical',
      duration: 10,
      headline: '新しいご案内',
      subheadline: '説明文を入力してください',
    };
    setSlidesWithHistory((prev) => [...prev, newSlide]);
    setCurrentSlideIndex(slides.length);
    setReplayKey((k) => k + 1);
  }, [slides.length, currentSlide, onError, setSlidesWithHistory]);

  // スライド削除
  const deleteSlide = useCallback((index: number) => {
    if (slides.length <= 1) {
      onError({
        title: '看板スライドの削除不可',
        reason: 'サイネージを表示するために、少なくとも1枚の看板スライドが必要です。',
        solution: '別の看板スライドを追加してから削除するか、内容を直接編集してください。',
      });
      return;
    }
    const newSlides = slides.filter((_, i) => i !== index);
    setSlidesWithHistory(newSlides);
    if (currentSlideIndex >= newSlides.length) {
      setCurrentSlideIndex(newSlides.length - 1);
    }
    setReplayKey((k) => k + 1);
  }, [slides, currentSlideIndex, onError, setSlidesWithHistory]);

  // スライド複製（参照を切り離すディープコピー）
  const duplicateSlide = useCallback((index: number) => {
    if (slides.length >= MAX_SLIDES) {
      onError({
        title: '看板スライド枚数の上限到達',
        reason: `1つのフォルダ内で連続ループ再生できる看板枚数の上限（最大${MAX_SLIDES}枚）に達しています。`,
        solution: '不要な看板スライドを削除するか、別の看板フォルダを作成して分けて登録してください。',
      });
      return;
    }
    const target = slides[index];
    const duplicated: SignageSlide = {
      ...target,
      id: `slide-${Date.now()}`,
      name: `${target.name || '看板'} (コピー)`,
      aspect: 'vertical',
      menuItems: target.menuItems ? JSON.parse(JSON.stringify(target.menuItems)) : [],
      fontOverrides: target.fontOverrides ? { ...target.fontOverrides } : {},
      textColorOverrides: target.textColorOverrides ? { ...target.textColorOverrides } : {},
    };
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, duplicated);
    setSlidesWithHistory(newSlides);
    setCurrentSlideIndex(index + 1);
    setReplayKey((k) => k + 1);
  }, [slides, onError, setSlidesWithHistory]);

  // クイックフォント適用
  const applyQuickFont = useCallback((fontFamily: FontFamily) => {
    if (selectedTextTarget === 'all') {
      updateCurrentSlide({
        fontFamily,
        fontOverrides: {},
      });
    } else {
      updateCurrentSlide({
        fontOverrides: {
          ...currentSlide.fontOverrides,
          [selectedTextTarget]: fontFamily,
        },
      });
    }
    setReplayKey((k) => k + 1);
  }, [selectedTextTarget, currentSlide.fontOverrides, updateCurrentSlide]);

  // フォルダ切り替え時にスライドを読み込み
  const loadSlides = useCallback((loadedSlides: SignageSlide[]) => {
    const repaired = loadedSlides.map(repairSlideImages);
    setSlides(JSON.parse(JSON.stringify(repaired)));
    setHistory([]);
    setFuture([]);
    setCurrentSlideIndex(0);
    setReplayKey((k) => k + 1);
  }, []);

  // 自動スライドプレビュー再生（秒数ごとにループ）
  useEffect(() => {
    if (!isPlaying) return;
    const duration = (currentSlide.duration || 10) * 1000;
    const timer = setTimeout(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
      setReplayKey((k) => k + 1);
    }, duration);
    return () => clearTimeout(timer);
  }, [isPlaying, currentSlideIndex, currentSlide.duration, slides.length]);

  return {
    slides,
    setSlides,
    currentSlide,
    currentSlideIndex,
    setCurrentSlideIndex,
    isPlaying,
    setIsPlaying,
    replayKey,
    replayAnimation,
    updateCurrentSlide,
    applyTemplate,
    addSlide,
    deleteSlide,
    duplicateSlide,
    selectedTextTarget,
    setSelectedTextTarget,
    applyQuickFont,
    loadSlides,
    undo,
    redo,
    canUndo: history.length > 0,
    canRedo: future.length > 0,
  };
}
