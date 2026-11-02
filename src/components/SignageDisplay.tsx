import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'qrcode';
import { SignageSlide, TextTarget } from '../types';
import { Sparkles, Type, QrCode, ImageIcon } from 'lucide-react';
import {
  calculateAutoHeadlinePt,
  calculateAutoSubheadlinePt,
  calculateAutoMenuItemNamePt,
  calculateAutoMenuItemDescPt,
  calculateAutoMenuItemPricePt,
} from '../utils/typography';
import { handleImageError } from '../utils/imageFallback';

interface SignageDisplayProps {
  slide: SignageSlide;
  scale?: number;
  interactive?: boolean;
  isFullscreen?: boolean;
  selectedTextTarget?: TextTarget;
  onSelectTextTarget?: (target: TextTarget) => void;
}

export const SignageDisplay: React.FC<SignageDisplayProps> = ({
  slide,
  scale = 1,
  isFullscreen = false,
  selectedTextTarget,
  onSelectTextTarget,
}) => {
  const [qrImgError, setQrImgError] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // オフライン対応：端末内で高速にSVG/DataURLを直接生成（外部サーバー依存・通信切断バグを完全解消）
  useEffect(() => {
    let isMounted = true;
    if (slide.showQrCode && slide.qrCodeUrl) {
      QRCode.toDataURL(slide.qrCodeUrl, {
        margin: 1,
        width: 140,
        color: { dark: '#000000', light: '#ffffff' },
      })
        .then((url) => {
          if (isMounted) {
            setQrDataUrl(url);
            setQrImgError(false);
          }
        })
        .catch(() => {
          if (isMounted) setQrImgError(true);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [slide.showQrCode, slide.qrCodeUrl]);

  // フレームクラス（20種類対応）
  const getFrameClasses = () => {
    if (isFullscreen) return 'rounded-none border-0 shadow-none';
    switch (slide.frame) {
      case 'modern-black':
        return 'border-[14px] border-slate-900 rounded-3xl shadow-2xl ring-1 ring-slate-800';
      case 'frameless':
        return 'border-0 rounded-2xl shadow-2xl';
      case 'aluminum-silver':
        return 'border-[16px] border-slate-300 rounded-2xl shadow-2xl ring-2 ring-slate-400 bg-slate-200';
      case 'pure-white':
        return 'border-[16px] border-slate-100 rounded-2xl shadow-2xl ring-2 ring-slate-300 bg-white';
      case 'natural-wood':
        return 'border-[18px] border-[#854d0e] rounded-2xl shadow-2xl ring-2 ring-[#713f12] bg-[#a16207]';
      case 'dark-walnut':
        return 'border-[18px] border-[#3e1f07] rounded-2xl shadow-2xl ring-2 ring-[#291404] bg-[#532909]';
      case 'gold-luxury':
        return 'border-[16px] border-amber-400 rounded-2xl shadow-2xl ring-2 ring-amber-500 bg-amber-200';
      case 'champagne-gold':
        return 'border-[16px] border-[#fde047] rounded-2xl shadow-2xl ring-2 ring-amber-300 bg-[#fef08a]';
      case 'bronze-antique':
        return 'border-[16px] border-[#92400e] rounded-2xl shadow-2xl ring-2 ring-[#78350f] bg-[#b45309]';
      case 'copper-orange':
        return 'border-[16px] border-[#ea580c] rounded-2xl shadow-2xl ring-2 ring-[#c2410c] bg-[#fb923c]';
      case 'rose-gold':
        return 'border-[16px] border-[#fb7185] rounded-2xl shadow-2xl ring-2 ring-[#f43f5e] bg-[#fecdd3]';
      case 'charcoal-dark':
        return 'border-[16px] border-[#334155] rounded-2xl shadow-2xl ring-2 ring-[#1e293b] bg-[#475569]';
      case 'matte-gray':
        return 'border-[16px] border-[#94a3b8] rounded-2xl shadow-2xl ring-2 ring-[#64748b] bg-[#cbd5e1]';
      case 'navy-blue':
        return 'border-[16px] border-[#1e3a8a] rounded-2xl shadow-2xl ring-2 ring-[#172554] bg-[#2563eb]';
      case 'neon-border':
        return 'border-[8px] border-cyan-400 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.8)]';
      case 'deep-emerald':
        return 'border-[16px] border-[#047857] rounded-2xl shadow-2xl ring-2 ring-[#065f46] bg-[#059669]';
      case 'wine-burgundy':
        return 'border-[16px] border-[#881337] rounded-2xl shadow-2xl ring-2 ring-[#4c0519] bg-[#9f1239]';
      case 'pastel-pink':
        return 'border-[16px] border-[#f472b6] rounded-2xl shadow-2xl ring-2 ring-[#ec4899] bg-[#fbcfe8]';
      case 'pastel-mint':
        return 'border-[16px] border-[#34d399] rounded-2xl shadow-2xl ring-2 ring-[#10b981] bg-[#a7f3d0]';
      case 'pastel-yellow':
        return 'border-[16px] border-[#facc15] rounded-2xl shadow-2xl ring-2 ring-[#eab308] bg-[#fef08a]';
      default:
        return 'border-[14px] border-slate-900 rounded-3xl shadow-2xl';
    }
  };

  // 各パーツのフォント取得ヘルパー（特太インパクトは高視認性のRocknRoll Oneを適用）
  const getTargetFont = (target: TextTarget): string => {
    const override = slide.fontOverrides?.[target as keyof typeof slide.fontOverrides];
    const family = override || slide.fontFamily || 'Noto Sans JP';
    return `'${family}', sans-serif`;
  };

  // 背景が白っぽいかどうかの自動判定（白背景での文字不可視化を完全防止）
  const isLightBg = (() => {
    if (slide.bgType === 'video') return false;
    const bg = (slide.bgColor || '').toLowerCase();
    const grad = (slide.bgGradient || '').toLowerCase();
    const lightBgs = ['#ffffff', '#fffbeb', '#faf5ff', '#f0fdf4', '#fdfbf7', '#f8fafc', '#fefce8', '#fff7ed', '#eff6ff', '#f1f5f9', '#fef08a'];
    if (lightBgs.includes(bg)) return true;
    if (slide.bgType === 'gradient' && (grad.includes('#fdf') || grad.includes('#fce') || grad.includes('#ffffff'))) return true;
    if (bg.startsWith('#') && bg.length === 7) {
      const r = parseInt(bg.slice(1, 3), 16);
      const g = parseInt(bg.slice(3, 5), 16);
      const b = parseInt(bg.slice(5, 7), 16);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        return (r * 299 + g * 587 + b * 114) / 1000 > 175;
      }
    }
    return false;
  })();

  // 各パーツの文字色取得ヘルパー（白っぽい背景の場合は確実に高コントラストな濃い色を適用）
  const getTargetTextColor = (target: keyof NonNullable<SignageSlide['textColorOverrides']>, defaultColor?: string): string => {
    const override = slide.textColorOverrides?.[target];
    if (override) return override;
    if (defaultColor) return defaultColor;
    if (slide.textColor) {
      // 背景が白っぽく、指定色が白系の場合は見えなくなるため濃いチャコールに自動補正
      if (isLightBg && (slide.textColor.toLowerCase() === '#ffffff' || slide.textColor.toLowerCase() === '#fff' || slide.textColor.toLowerCase() === '#f8fafc')) {
        return '#0f172a';
      }
      return slide.textColor;
    }
    return isLightBg ? '#0f172a' : '#ffffff';
  };

  // 背景スタイル（画像は全体像が映るようにcontain）
  const getBackgroundStyle = (): React.CSSProperties => {
    if (slide.bgType === 'video' && slide.bgVideoUrl) {
      return { backgroundColor: '#000000' };
    }
    if (slide.bgType === 'image' && slide.bgCustomImage) {
      const isGrad = slide.bgColor?.startsWith('linear-gradient');
      return {
        backgroundImage: `url("${slide.bgCustomImage}")`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundColor: isGrad ? '#0f172a' : (slide.bgColor || '#ffffff'),
      };
    }
    if (slide.bgType === 'gradient' || (slide.bgColor?.startsWith('linear-gradient') && slide.bgType !== 'solid')) {
      const grad = slide.bgGradient || (slide.bgColor?.startsWith('linear-gradient') ? slide.bgColor : undefined) || 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)';
      return { backgroundImage: grad };
    }
    return { backgroundColor: slide.bgColor || '#ffffff' };
  };

  const getPatternClass = () => {
    if (slide.bgPattern === 'dots') return 'pattern-dots';
    if (slide.bgPattern === 'grid') return 'pattern-grid';
    if (slide.bgPattern === 'stripes') return 'pattern-stripes';
    if (slide.bgPattern === 'wood') return 'pattern-wood';
    return '';
  };

  // テキストアニメーション用 Motion バリアント（デフォルト速度：標準）
  const getTextAnimationVariants = () => {
    const speed = slide.textAnimationSpeed || 'normal';
    const mult = speed === 'slow' ? 6.0 : speed === 'fast' ? 1.0 : 3.0;

    switch (slide.textAnimation) {
      case 'slideUp':
        return {
          initial: { opacity: 0, y: 100 },
          animate: { opacity: 1, y: 0, transition: { duration: 1.5 * mult, ease: 'easeOut' as const } },
        };
      case 'slideLeft':
        return {
          initial: { opacity: 0, x: -100 },
          animate: { opacity: 1, x: 0, transition: { duration: 1.5 * mult, ease: 'easeOut' as const } },
        };
      case 'slideRight':
        return {
          initial: { opacity: 0, x: 100 },
          animate: { opacity: 1, x: 0, transition: { duration: 1.5 * mult, ease: 'easeOut' as const } },
        };
      case 'bounce':
        return {
          initial: { opacity: 0, scale: 0.3, y: -80 },
          animate: {
            opacity: 1,
            scale: [0.3, 1.2, 0.95, 1],
            y: 0,
            transition: { duration: 0.8 * mult, times: [0, 0.5, 0.8, 1] },
          },
        };
      case 'zoomIn':
        return {
          initial: { opacity: 0, scale: 0.2 },
          animate: { opacity: 1, scale: 1, transition: { duration: 0.7 * mult, ease: 'easeOut' as const } },
        };
      case 'pulse':
        return {
          initial: { scale: 1 },
          animate: {
            scale: [1, 1.1, 1, 1.14, 1],
            transition: { repeat: Infinity, duration: 2.2 * mult, ease: 'easeInOut' as const },
          },
        };
      case 'shake':
        return {
          initial: { x: 0 },
          animate: {
            x: [0, -10, 10, -8, 8, -4, 4, 0],
            transition: { repeat: Infinity, duration: 2.6 * mult, repeatDelay: 1.2 * mult },
          },
        };
      case 'flip':
        return {
          initial: { opacity: 0, rotateX: 90 },
          animate: { opacity: 1, rotateX: 0, transition: { duration: 0.8 * mult, ease: 'easeOut' as const } },
        };
      case 'neonFlicker':
        return {
          initial: { opacity: 1 },
          animate: {
            opacity: [1, 0.15, 1, 0.05, 1, 0.4, 1],
            transition: { repeat: Infinity, duration: 2.6 * mult, repeatDelay: 0.8 * mult },
          },
        };
      case 'sway':
        return {
          initial: { rotate: 0 },
          animate: {
            rotate: [-5, 5, -5],
            transition: { repeat: Infinity, duration: 3.2 * mult, ease: 'easeInOut' as const },
          },
        };
      default:
        return {
          initial: { opacity: 1 },
          animate: { opacity: 1 },
        };
    }
  };


  // テキストクリック時の選択枠スタイルヘルパー
  const getSelectableClass = (target: TextTarget) => {
    if (isFullscreen || !onSelectTextTarget) return '';
    const isSelected = selectedTextTarget === target;
    return `cursor-pointer transition-all rounded-xl relative group ${
      isSelected
        ? 'ring-2 ring-amber-400 bg-amber-400/15 shadow-[0_0_15px_rgba(251,191,36,0.35)]'
        : 'hover:ring-1 hover:ring-amber-400/60 hover:bg-white/5'
    }`;
  };



  // 店舗名のフォントサイズ選択（小・中・大）
  const getShopNameSizeClass = () => {
    switch (slide.shopNameSize) {
      case 'small':
        return 'text-[18px]';
      case 'large':
        return 'text-[28px]';
      case 'medium':
      default:
        return 'text-[22px]';
    }
  };

  // ユーザー指示「添付の部分、文字数が多くなったら改行して形を縦長に自動変更」
  const badgeText = slide.categoryBadge || '';
  const isBadgeTall = badgeText.length > 9 || badgeText.includes('\n');

  // メニュー商品数（最大6品）に応じた動的レイアウト設定
  const itemCount = slide.menuItems?.length || 0;
  const isDenseMenu = itemCount >= 5;
  const isMediumMenu = itemCount === 4;

  const isVertical = slide.writingMode === 'vertical';
  const rawItems = slide.menuItems || [];
  const visibleItems = rawItems.slice(0, 6);
  const visibleCount = visibleItems.length;

  // ユーザー指示「文字類は全て、自分でポイント数を入力出来るように」
  const effectiveHeadlinePt =
    slide.headlinePt && slide.headlinePt > 0
      ? slide.headlinePt
      : calculateAutoHeadlinePt(slide.headline || '', isVertical, slide.headlineSize);

  const effectiveSubheadlinePt =
    slide.subheadlinePt && slide.subheadlinePt > 0
      ? slide.subheadlinePt
      : calculateAutoSubheadlinePt(slide.subheadline || '', isVertical, slide.subheadlineSize);

  const autoItemNamePt = calculateAutoMenuItemNamePt(visibleCount, isVertical);
  const autoItemDescPt = calculateAutoMenuItemDescPt(visibleCount, isVertical);
  const autoItemPricePt = calculateAutoMenuItemPricePt(visibleCount, isVertical);

  const effectiveItemNamePt =
    slide.menuItemNamePt && slide.menuItemNamePt > 0
      ? slide.menuItemNamePt
      : autoItemNamePt;

  const effectiveItemDescPt =
    slide.menuItemDescPt && slide.menuItemDescPt > 0
      ? slide.menuItemDescPt
      : autoItemDescPt;

  const effectiveItemPricePt =
    slide.menuItemPricePt && slide.menuItemPricePt > 0
      ? slide.menuItemPricePt
      : autoItemPricePt;

  const isLandscape = slide.aspect === '16:9' || slide.aspect === 'horizontal';
  const baseWidth = isLandscape ? 960 : 540;
  const baseHeight = isLandscape ? 540 : 960;

  return (
    /* 外側コンテナ：スケール後の正確なピクセル専有サイズを確保 */
    <div
      className="relative flex items-center justify-center select-none"
      style={{
        width: `${baseWidth * scale}px`,
        height: `${baseHeight * scale}px`,
      }}
    >
      {/* 基準キャンバス本体 (9:16は540x960、16:9は960x540) */}
      <div
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          fontFamily: `'${slide.fontFamily}', sans-serif`,
        }}
        className={`absolute top-0 left-0 overflow-hidden flex flex-col ${getFrameClasses()}`}
      >
        {/* 背景動画レイヤー（全体像が映るようにcontain） */}
        {slide.bgType === 'video' && slide.bgVideoUrl && (
          <div className="absolute inset-0 z-0 bg-black flex items-center justify-center">
            <video
              src={slide.bgVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              onError={(e) => {
                const parent = e.currentTarget.parentElement;
                if (parent) parent.style.display = 'none';
              }}
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>
        )}

        {/* 背景色・グラデーション・画像レイヤー */}
        {slide.bgType !== 'video' && (
          <div
            className="absolute inset-0 z-0 transition-colors duration-500"
            style={getBackgroundStyle()}
          />
        )}

        {/* パターン模様オーバーレイ */}
        {slide.bgPattern && slide.bgPattern !== 'none' && slide.bgType !== 'video' && (
          <div
            className={`absolute inset-0 z-0 pointer-events-none ${getPatternClass()}`}
          />
        )}

        {/* コンテンツエリア */}
        <div
          className={`relative z-10 flex-1 flex flex-col justify-between ${
            isLandscape ? 'px-3.5 pt-2 pb-0.5 gap-1.5' : 'p-4 gap-2'
          } overflow-hidden h-full min-h-0`}
          style={{ color: isLightBg && (slide.textColor === '#ffffff' || !slide.textColor) ? '#0f172a' : (slide.textColor || '#ffffff') }}
        >
          {/* 
            ヘッダー部：
            ユーザー指示：
            1. 店舗名・ブランド名とお店の種類・営業時間などは左右表示
            2. 各項目でテキストは中央揃え＆改行対応
            3. 店舗名・ブランド名のフォントの大きさを選べるように＆画像を添付できるように（お店のロゴ）
            4. お店の種類・営業時間などは文字数が多くなったら改行して形を縦長に自動変更
          */}
          <div
            className={`shrink-0 flex items-center gap-3 border-b ${
              isLandscape ? 'pb-1 mb-0.5' : 'pb-3 mb-2.5'
            } w-full ${
              !slide.categoryBadge
                ? slide.shopNameAlign === 'right'
                  ? 'justify-end'
                  : slide.shopNameAlign === 'center'
                  ? 'justify-center'
                  : 'justify-start'
                : 'justify-between'
            }`}
            style={{ borderColor: isLightBg ? 'rgba(15,23,42,0.18)' : `${slide.textColor || '#ffffff'}25` }}
          >
            {/* 店舗名・ブランド名 ＆ お店のロゴ（左揃え・中央揃え・右揃え独立設定対応） */}
            <div
              onClick={() => onSelectTextTarget?.('shopName')}
              className={`flex items-center gap-2.5 p-1 ${
                slide.shopNameAlign === 'right'
                  ? 'justify-end text-right'
                  : slide.shopNameAlign === 'center'
                  ? 'justify-center text-center'
                  : 'justify-start text-left'
              } ${slide.categoryBadge ? 'flex-1' : ''} ${getSelectableClass('shopName')}`}
              style={{
                fontFamily: getTargetFont('shopName'),
                justifyContent:
                  slide.shopNameAlign === 'right'
                    ? 'flex-end'
                    : slide.shopNameAlign === 'center'
                    ? 'center'
                    : 'flex-start',
              }}
              title="クリックして店舗名の書体を変更"
            >
              {/* お店のロゴ画像（透明背景でベゼルなし縮小表示） */}
              {slide.shopLogoUrl ? (
                <div className="w-[64px] h-[64px] rounded-lg bg-transparent flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src={slide.shopLogoUrl}
                    alt="Logo"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : null}

              <span
                className={`font-bold tracking-wider opacity-95 whitespace-pre-line leading-tight ${
                  isLandscape ? 'max-w-[650px]' : 'max-w-[340px]'
                } ${
                  slide.shopNameAlign === 'right'
                    ? 'text-right'
                    : slide.shopNameAlign === 'center'
                    ? 'text-center'
                    : 'text-left'
                } ${slide.shopNamePt ? '' : getShopNameSizeClass()}`}
                style={{ 
                  textAlign: slide.shopNameAlign || 'left',
                  fontSize: slide.shopNamePt ? `${slide.shopNamePt}px` : undefined,
                  color: getTargetTextColor('shopName'),
                }}
              >
                {slide.shopName || ''}
              </span>

              {selectedTextTarget === 'shopName' && (
                <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded ml-1 shrink-0">
                  選択中
                </span>
              )}
            </div>

            {/* お店の種類・営業時間など（右上ラベル配置） */}
            {slide.categoryBadge && (
              <div
                onClick={() => onSelectTextTarget?.('categoryBadge')}
                className={`p-1 shrink-0 flex items-center justify-center text-center ${getSelectableClass('categoryBadge')}`}
                style={{ fontFamily: getTargetFont('categoryBadge') }}
                title="クリックしてお店の種類・営業時間の書体を変更"
              >
                <div
                  className={`font-black tracking-wider shadow-sm uppercase text-center flex items-center justify-center transition-all ${
                    isBadgeTall
                      ? 'rounded-2xl px-3.5 py-2 leading-tight max-w-[150px] whitespace-pre-line break-words text-[12px]'
                      : 'rounded-full px-4 py-1.5 leading-snug whitespace-pre-line text-[13px]'
                  }`}
                  style={{
                    backgroundColor: slide.accentColor || '#fbbf24',
                    fontSize: slide.categoryBadgePt ? `${slide.categoryBadgePt}px` : undefined,
                    color: slide.textColorOverrides?.categoryBadge || (
                      (() => {
                        const acc = (slide.accentColor || '#fbbf24').toLowerCase();
                        const lightAccents = ['#fef08a', '#fde047', '#facc15', '#fbbf24', '#ffffff', '#fed7aa', '#fef9c3', '#ecfccb', '#d9f99d'];
                        if (lightAccents.includes(acc)) return '#0f172a';
                        return '#ffffff';
                      })()
                    ),
                  }}
                >
                  <span className="text-center whitespace-pre-line">{slide.categoryBadge}</span>
                </div>
              </div>
            )}
          </div>

          {/* 縦書き時と横書き時のレイアウト分岐 */}
          {slide.writingMode === 'vertical' ? (
            <div className="flex-1 flex flex-row items-stretch justify-between gap-3 min-h-0 h-full py-0.5 overflow-hidden">
              {/* 1. 商品エリア */}
              <div className={`${isLandscape ? 'w-[70%] min-w-0' : 'w-[50%] min-w-0'} flex flex-col justify-between gap-2 min-h-0 h-full`}>
                {visibleCount > 0 && (
                  <div
                    onClick={() => onSelectTextTarget?.('menu')}
                    className={`flex-1 ${
                      isLandscape
                        ? visibleCount === 1
                          ? 'flex justify-center items-stretch'
                          : visibleCount === 2
                          ? 'grid grid-cols-2 grid-rows-1'
                          : visibleCount === 3
                          ? 'grid grid-cols-3 grid-rows-1'
                          : visibleCount === 4
                          ? 'grid grid-cols-4 grid-rows-1'
                          : visibleCount === 5
                          ? 'grid grid-cols-5 grid-rows-1'
                          : 'grid grid-cols-6 grid-rows-1'
                        : visibleCount === 1
                        ? 'flex justify-center items-stretch'
                        : visibleCount === 2
                        ? 'grid grid-cols-2 grid-rows-1'
                        : visibleCount === 3
                        ? 'grid grid-cols-3 grid-rows-1'
                        : 'grid grid-cols-3 grid-rows-2'
                    } gap-2 min-h-0 pt-5 pb-1 px-1 items-stretch ${getSelectableClass('menu')}`}
                    style={{
                      direction: 'rtl',
                      fontFamily: getTargetFont('menu'),
                    }}
                    title="クリックしてメニュー商品の書体を変更"
                  >
                    {visibleItems.map((item, idx) => {
                      const itemEffectiveNamePt = item.namePt || slide.menuItemNamePt || (
                        isLandscape
                          ? visibleCount <= 2 ? autoItemNamePt + 6 : visibleCount <= 4 ? autoItemNamePt + 4 : autoItemNamePt + 2
                          : visibleCount <= 3 ? autoItemNamePt + 2 : autoItemNamePt
                      );
                      const itemEffectiveDescPt = item.descPt || slide.menuItemDescPt || (
                        isLandscape
                          ? visibleCount <= 2 ? autoItemDescPt + 4 : visibleCount <= 4 ? autoItemDescPt + 2 : autoItemDescPt + 1
                          : visibleCount <= 3 ? autoItemDescPt + 2 : autoItemDescPt
                      );
                      const itemEffectivePricePt = item.pricePt || slide.menuItemPricePt || (
                        isLandscape
                          ? visibleCount <= 2 ? autoItemPricePt + 6 : visibleCount <= 4 ? autoItemPricePt + 4 : autoItemPricePt + 2
                          : visibleCount <= 3 ? autoItemPricePt + 2 : autoItemPricePt
                      );

                      return (
                        <motion.div
                          key={item.id || idx}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.04 + idx * 0.03, duration: 0.15 }}
                          className={`relative rounded-xl border backdrop-blur-sm transition-all flex flex-col items-center justify-between shadow-sm overflow-visible ${
                            isLandscape
                              ? visibleCount === 1
                                ? 'w-full h-full p-4 gap-3'
                                : visibleCount <= 3
                                ? 'w-full h-full p-2.5 sm:p-3 gap-1.5'
                                : 'w-full h-full p-1 sm:p-1.5 gap-0.5'
                              : visibleCount === 1
                              ? 'w-full max-w-[320px] h-full p-4 gap-3 mx-auto'
                              : visibleCount >= 4
                              ? 'p-1 sm:p-1.5 gap-0.5'
                              : 'p-2 sm:p-2.5 gap-1.5'
                          } ${
                            item.featured || (item.highlightBadge && item.highlightBadge !== 'なし')
                              ? 'scale-[1.01] ring-2 ring-amber-400 border-amber-400 bg-amber-400/10 shadow-md'
                              : ''
                          }`}
                          style={{
                            direction: 'ltr',
                            backgroundColor:
                              item.featured || (item.highlightBadge && item.highlightBadge !== 'なし')
                                ? undefined
                                : `${slide.textColor}10`,
                            borderColor:
                              item.featured || (item.highlightBadge && item.highlightBadge !== 'なし')
                                ? '#f59e0b'
                                : `${slide.textColor}25`,
                            boxShadow: item.featured ? `0 0 0 2px #f59e0b` : undefined,
                          }}
                        >
                          {(() => {
                            const badgeText = item.highlightBadge && item.highlightBadge !== 'なし' && item.highlightBadge !== '' ? item.highlightBadge : (item.featured ? 'おすすめ' : '');
                            if (!badgeText) return null;
                            return (
                              <div 
                                className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full shadow-md flex items-center justify-center z-30 leading-none whitespace-nowrap border border-amber-300"
                                style={{ writingMode: 'horizontal-tb', direction: 'ltr' }}
                              >
                                <span className="whitespace-nowrap text-center">{badgeText}</span>
                              </div>
                            );
                          })()}
                          {item.imageUrl && (
                            <div
                              className={`w-full ${
                                isLandscape
                                  ? visibleCount <= 3
                                    ? 'h-[85px] sm:h-[95px]'
                                    : 'h-[62px] sm:h-[68px]'
                                  : visibleCount <= 2
                                  ? 'h-[120px] sm:h-[135px]'
                                  : 'h-[75px] sm:h-[85px]'
                              } bg-transparent flex items-center justify-center overflow-hidden shrink-0 px-1 pt-1 self-center`}
                            >
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                referrerPolicy="no-referrer"
                                onError={handleImageError}
                                className="w-full h-full object-cover rounded-lg drop-shadow-xs"
                              />
                            </div>
                          )}

                          {!isLandscape && item.tag && (
                            <div
                              className="shrink-0 rounded text-white font-bold text-[9px] sm:text-[10px] px-2 py-0.5 shadow-xs tracking-wider flex items-center justify-center whitespace-nowrap leading-none my-1"
                              style={{
                                backgroundColor: item.tagColor || ['#ef4444', '#2563eb', '#16a34a', '#d97706', '#9333ea', '#ea580c'][idx % 6],
                                writingMode: 'horizontal-tb',
                                direction: 'ltr',
                              }}
                            >
                              {item.tag}
                            </div>
                          )}

                          <div className={`flex-1 w-full flex flex-row-reverse items-stretch justify-center ${visibleCount >= 4 ? 'gap-0.5' : 'gap-1.5'} min-h-0 py-0.5 overflow-hidden`}>
                            {isLandscape && item.tag && (
                              <div
                                className={`shrink-0 rounded text-white font-bold ${
                                  visibleCount === 1
                                    ? 'text-[11px] px-2 py-1'
                                    : visibleCount >= 4
                                    ? 'text-[7px] px-0.5 py-0.5'
                                    : 'text-[9px] px-1.5 py-1'
                                } shadow-xs tracking-wider flex items-center justify-center whitespace-nowrap self-start`}
                                style={{
                                  backgroundColor: item.tagColor || ['#ef4444', '#2563eb', '#16a34a', '#d97706', '#9333ea', '#ea580c'][idx % 6],
                                  writingMode: 'vertical-rl',
                                  textOrientation: 'upright',
                                }}
                              >
                                {item.tag}
                              </div>
                            )}

                            <div className="shrink-0 flex items-start self-start h-full max-h-full overflow-hidden">
                              <span
                                className="font-bold break-words leading-tight whitespace-pre-line"
                                style={{
                                  fontSize: `${itemEffectiveNamePt}px`,
                                  color: getTargetTextColor('menu'),
                                  writingMode: 'vertical-rl',
                                  textOrientation: 'upright',
                                  letterSpacing: visibleCount >= 4 ? '0.01em' : '0.04em',
                                  maxHeight: '100%',
                                }}
                              >
                                {item.name || '商品名未入力'}
                              </span>
                            </div>

                            {item.description && (
                              <p
                                className="opacity-80 break-words leading-tight whitespace-pre-line self-start h-full overflow-hidden flex-1 min-w-0"
                                style={{
                                  fontSize: `${itemEffectiveDescPt}px`,
                                  color: getTargetTextColor('menu'),
                                  writingMode: 'vertical-rl',
                                  textOrientation: 'upright',
                                  letterSpacing: visibleCount >= 4 ? '0em' : '0.02em',
                                  maxHeight: '100%',
                                  maxWidth: visibleCount >= 5 ? '38px' : visibleCount === 4 ? '46px' : undefined,
                                }}
                              >
                                {item.description}
                              </p>
                            )}
                          </div>

                          {/* 価格エリア（商品枠の中での中央寄せ） */}
                          <div className="shrink-0 pt-0.5 pb-0.5 w-full flex flex-col items-center justify-center gap-0.5">

                            {item.price && item.price.trim().length > 0 ? (
                              <div
                                className={`rounded-md flex items-center justify-center ${
                                  visibleCount >= 4 ? 'px-1.5 py-0.5' : 'px-2 py-0.5'
                                } ${
                                  item.priceBgColor && item.priceBgColor !== 'transparent'
                                    ? 'border border-slate-300/50 shadow-xs'
                                    : 'border border-transparent'
                                }`}
                                style={{
                                  backgroundColor: item.priceBgColor && item.priceBgColor !== 'transparent' ? item.priceBgColor : 'transparent',
                                }}
                              >
                                <span
                                  className="font-black tracking-tight whitespace-nowrap leading-none flex items-center justify-center -translate-y-[0.5px]"
                                  style={{
                                    fontSize: `${itemEffectivePricePt}px`,
                                    color: slide.accentColor || '#1e293b',
                                  }}
                                >
                                  {item.price}
                                </span>
                              </div>
                            ) : null}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2 & 3. コピー＆画像エリア（横画面は画面右35%、縦画面は画面右25%を占有：右から大見出し、サブコピー、看板画像） */}
              <div
                className={`${isLandscape ? 'w-[32%] min-w-0' : 'w-[50%] min-w-0'} flex flex-row-reverse items-stretch justify-start h-full max-h-full py-0.5 overflow-hidden pr-0 pl-1`}
                style={{
                  gap: isLandscape
                    ? `${Math.max(34, effectiveHeadlinePt * 1.4)}px`
                    : '1.5rem',
                }}
              >
                {/* 大見出し（一番右） */}
                <div
                  onClick={() => onSelectTextTarget?.('headline')}
                  className={`p-0.5 sm:p-1 min-w-fit shrink-0 max-h-full h-full flex flex-col items-center ${
                    slide.headlineAlign === 'left'
                      ? 'justify-start'
                      : slide.headlineAlign === 'right'
                      ? 'justify-end'
                      : 'justify-center'
                  } mr-0 ${getSelectableClass('headline')}`}
                  title="クリックして大見出しの書体を変更"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`v-headline-${slide.id || ''}-${slide.headline || ''}-${slide.subheadline || ''}-${slide.textAnimation || 'none'}-${slide.textAnimationSpeed || 'normal'}`}
                      variants={getTextAnimationVariants()}
                      initial="initial"
                      animate="animate"
                      className="h-full min-w-fit flex flex-col items-center justify-center"
                    >
                      {/* 看板画像：ユーザー指示：タイトル文字を大きくした際に、看板画像も大きくなるように */}
                      {(() => {
                        const verticalBannerImg = slide.subheadlineImageUrl || (slide.subheadlineImages && slide.subheadlineImages[0]);
                        if (!verticalBannerImg) return null;

                        // タイトル文字サイズが大きいほど、看板画像も大きく表示
                        const bannerImgSize = isLandscape
                          ? Math.min(220, Math.max(90, Math.round(effectiveHeadlinePt * 2.6)))
                          : Math.min(160, Math.max(85, Math.round(effectiveHeadlinePt * 2.0)));

                        return (
                          <div
                            style={{ width: `${bannerImgSize}px`, height: `${bannerImgSize}px` }}
                            className="rounded-2xl bg-transparent overflow-hidden flex items-center justify-center shrink-0 mb-2 transition-all duration-200 shadow-md border border-slate-900/10"
                          >
                            <img
                              src={verticalBannerImg}
                              alt="参考画像"
                              referrerPolicy="no-referrer"
                              onError={handleImageError}
                              className="w-full h-full object-cover rounded-2xl drop-shadow-sm"
                            />
                          </div>
                        );
                      })()}

                      <h1
                        className="font-black tracking-tight drop-shadow-sm whitespace-pre-line break-words"
                        style={{
                          fontFamily: getTargetFont('headline'),
                          color: getTargetTextColor('headline'),
                          fontSize: `${effectiveHeadlinePt}px`,
                          lineHeight: isLandscape ? 1.45 : 1.35,
                          maxWidth: '100%',
                          textAlign: slide.headlineAlign === 'left' ? 'start' : slide.headlineAlign === 'right' ? 'end' : 'center',
                          writingMode: 'vertical-rl',
                          textOrientation: 'upright',
                          maxHeight: '100%',
                          textShadow:
                            slide.textAnimation === 'neonFlicker'
                              ? `0 0 16px ${slide.accentColor}, 0 0 32px ${slide.accentColor}`
                              : 'none',
                        }}
                      >
                        {slide.headline || ''}
                      </h1>
                    </motion.div>
                  </AnimatePresence>
                  {selectedTextTarget === 'headline' && (
                    <div className="inline-flex items-center gap-1 text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded-full mt-1 shrink-0 whitespace-nowrap">
                      <Type className="w-3 h-3" /> 見出し変更中
                    </div>
                  )}
                </div>

                {/* サブコピー（大見出しの左） */}
                {slide.subheadline && (
                  <div
                    onClick={() => onSelectTextTarget?.('subheadline')}
                    className={`p-0.5 sm:p-1 min-w-fit shrink-0 max-h-full h-full flex flex-col items-center ${
                      slide.subheadlineAlign === 'left'
                        ? 'justify-start'
                        : slide.subheadlineAlign === 'right'
                        ? 'justify-end'
                        : 'justify-center'
                    } ${getSelectableClass('subheadline')}`}
                    title="クリックして説明文の書体を変更"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`v-sub-${slide.id || ''}-${slide.headline || ''}-${slide.subheadline || ''}-${slide.textAnimation || 'none'}`}
                        variants={getTextAnimationVariants()}
                        initial="initial"
                        animate="animate"
                        className="h-full min-w-fit flex flex-col items-center justify-center"
                      >
                        <p
                          className="font-medium opacity-85 whitespace-pre-line break-words w-full text-center"
                          style={{ 
                            fontFamily: getTargetFont('subheadline'),
                            color: getTargetTextColor('subheadline'),
                            fontSize: `${effectiveSubheadlinePt}px`,
                            lineHeight: 1.35,
                            textAlign: slide.subheadlineAlign === 'left' ? 'start' : slide.subheadlineAlign === 'right' ? 'end' : 'center',
                            writingMode: 'vertical-rl',
                            textOrientation: 'upright',
                            maxHeight: '100%',
                          }}
                        >
                          {slide.subheadline}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          ) : isLandscape ? (
            /* 横画面・横書き時のレイアウト（タイトル・説明は左側、写真は右側、商品は3行2列） */
            <div className="flex-1 flex flex-col justify-between gap-1.5 min-h-0 h-full py-0">
              <div className="flex flex-row items-stretch justify-between gap-3 sm:gap-4 px-1 shrink-0">
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`ls-headline-${slide.id || ''}-${slide.headline || ''}-${slide.textAnimation || 'none'}-${slide.textAnimationSpeed || 'normal'}`}
                      variants={getTextAnimationVariants()}
                      initial="initial"
                      animate="animate"
                      className="w-full flex flex-col justify-center"
                    >
                      <div
                        onClick={() => onSelectTextTarget?.('headline')}
                        className={`p-0.5 ${getSelectableClass('headline')}`}
                        title="クリックして大見出しの書体を変更"
                      >
                        <h1
                          className="font-black tracking-tight drop-shadow-sm whitespace-pre-line break-words"
                          style={{
                            fontFamily: getTargetFont('headline'),
                            color: getTargetTextColor('headline'),
                            fontSize: `${effectiveHeadlinePt}px`,
                            lineHeight: 1.1,
                            maxWidth: '95%',
                            textAlign: slide.headlineAlign || 'left',
                          }}
                        >
                          {slide.headline || ''}
                        </h1>
                      </div>

                      {slide.subheadline && (
                        <div
                          onClick={() => onSelectTextTarget?.('subheadline')}
                          className={`p-0.5 ${getSelectableClass('subheadline')}`}
                          style={{
                            marginTop: `${Math.max(4, Math.min(8, Math.round(effectiveHeadlinePt * 0.18)))}px`,
                          }}
                          title="クリックして説明文の書体を変更"
                        >
                          <p
                            className="font-medium opacity-85 whitespace-pre-line break-words"
                            style={{ 
                              fontFamily: getTargetFont('subheadline'),
                              color: getTargetTextColor('subheadline'),
                              fontSize: `${effectiveSubheadlinePt}px`,
                              lineHeight: 1.25,
                              textAlign: slide.subheadlineAlign || 'left',
                            }}
                          >
                            {slide.subheadline}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* 看板画像：横画面時に空いているスペースいっぱいにレスポンシブ表示 */}
                {(() => {
                  const hBannerImg = slide.subheadlineImageUrl || (slide.subheadlineImages && slide.subheadlineImages[0]);
                  if (!hBannerImg) return null;

                  return (
                    <div className="w-[30%] sm:w-[32%] md:w-[35%] max-w-[460px] min-w-[170px] self-stretch flex items-center justify-end shrink-0 py-0.5">
                      <div className="w-full h-full min-h-[95px] max-h-[190px] rounded-2xl overflow-hidden shadow-md border border-slate-900/10 bg-slate-900/5 flex items-center justify-center">
                        <img
                          src={hBannerImg}
                          alt="参考画像"
                          referrerPolicy="no-referrer"
                          onError={handleImageError}
                          className="w-full h-full object-cover rounded-2xl drop-shadow-sm transition-all duration-200"
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* メニュー商品リスト（横画面・横書き：商品数に応じて縦幅一杯にレスポンシブ可変） */}
              {visibleCount > 0 && (
                <div
                  onClick={() => onSelectTextTarget?.('menu')}
                  className={`grid ${
                    visibleCount === 1
                      ? 'grid-cols-1 grid-rows-1'
                      : visibleCount === 2
                      ? 'grid-cols-2 grid-rows-1'
                      : visibleCount === 3
                      ? 'grid-cols-3 grid-rows-1'
                      : visibleCount === 4
                      ? 'grid-cols-2 grid-rows-2'
                      : visibleCount === 5
                      ? 'grid-cols-3 grid-rows-2'
                      : 'grid-cols-2 grid-rows-3'
                  } gap-2 flex-1 min-h-0 pt-1 pb-0 px-1 items-stretch ${getSelectableClass('menu')}`}
                  style={{ fontFamily: getTargetFont('menu') }}
                  title="クリックしてメニュー商品の書体を変更"
                >
                  {visibleItems.map((item, idx) => {
                    const itemEffectiveNamePt = item.namePt || slide.menuItemNamePt || (visibleCount <= 3 ? autoItemNamePt + 4 : autoItemNamePt);
                    const itemEffectiveDescPt = item.descPt || slide.menuItemDescPt || (visibleCount <= 3 ? autoItemDescPt + 2 : autoItemDescPt);
                    const itemEffectivePricePt = item.pricePt || slide.menuItemPricePt || (visibleCount <= 3 ? autoItemPricePt + 4 : autoItemPricePt);

                    return (
                      <motion.div
                        key={item.id || idx}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.04 + idx * 0.03, duration: 0.15 }}
                        className={`relative rounded-xl border backdrop-blur-sm transition-all flex items-center justify-between shadow-sm p-2.5 gap-2.5 min-h-0 h-full flex-1 overflow-visible ${
                          item.featured || (item.highlightBadge && item.highlightBadge !== 'なし')
                            ? 'scale-[1.01] ring-2 ring-amber-400 border-amber-400 shadow-md bg-amber-400/10'
                            : ''
                        }`}
                        style={{
                          backgroundColor:
                            item.featured || (item.highlightBadge && item.highlightBadge !== 'なし')
                              ? undefined
                              : `${slide.textColor}10`,
                          borderColor:
                            item.featured || (item.highlightBadge && item.highlightBadge !== 'なし')
                              ? '#f59e0b'
                              : `${slide.textColor}25`,
                        }}
                      >
                        {/* おすすめ枠バッジ */}
                        {(() => {
                          const badgeText = item.highlightBadge && item.highlightBadge !== 'なし' && item.highlightBadge !== '' ? item.highlightBadge : (item.featured ? 'おすすめ' : '');
                          if (!badgeText) return null;
                          return (
                            <div 
                              className="absolute -top-2.5 left-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full shadow-md flex items-center justify-center z-20 leading-none whitespace-nowrap border border-amber-300"
                              style={{ writingMode: 'horizontal-tb', direction: 'ltr' }}
                            >
                              <span className="whitespace-nowrap text-center">{badgeText}</span>
                            </div>
                          );
                        })()}

                        {item.imageUrl && (
                          <div
                            className="h-full max-h-full aspect-[4/3] sm:aspect-[16/11] min-w-[70px] max-w-[150px] rounded-xl bg-slate-900/5 flex items-center justify-center overflow-hidden shrink-0 self-stretch my-auto shadow-2xs"
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              onError={handleImageError}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          </div>
                        )}

                        <div className="flex-1 min-w-0 pr-1 flex flex-col justify-center self-center">
                          <span
                            className="font-bold break-words leading-tight whitespace-pre-line"
                            style={{
                              fontSize: `${itemEffectiveNamePt}px`,
                              color: getTargetTextColor('menu'),
                            }}
                          >
                            {item.name}
                          </span>
                          {item.description && (
                            <p
                              className="opacity-80 break-words leading-tight whitespace-pre-line mt-0.5 line-clamp-1"
                              style={{
                                fontSize: `${itemEffectiveDescPt}px`,
                                color: getTargetTextColor('menu'),
                              }}
                            >
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-end justify-center gap-1 shrink-0 self-center">
                          {item.tag && (
                            <span
                              className="text-[10px] font-black px-1.5 py-0.5 rounded text-white shadow-xs shrink-0 whitespace-nowrap tracking-wider flex items-center justify-center leading-none"
                              style={{ 
                                backgroundColor: item.tagColor || ['#ef4444', '#2563eb', '#16a34a', '#d97706', '#9333ea', '#ea580c'][idx % 6] 
                              }}
                            >
                              {item.tag}
                            </span>
                          )}
                          {item.price && item.price.trim().length > 0 ? (
                            <div
                              className="shrink-0 flex items-center justify-center px-2 py-0.5 rounded-lg"
                              style={{
                                backgroundColor:
                                  item.priceBgColor && item.priceBgColor !== 'transparent'
                                    ? item.priceBgColor
                                    : 'transparent',
                              }}
                            >
                              <span
                                className="font-black tracking-tight whitespace-nowrap leading-none flex items-center justify-center"
                                style={{
                                  fontSize: `${itemEffectivePricePt}px`,
                                  color: slide.accentColor,
                                }}
                              >
                                {item.price}
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* 縦画面・横書き時の既存レイアウト */
            <>
              {/* メイン見出し＆サブタイトル */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`h-headline-${slide.id || ''}-${slide.headline || ''}-${slide.textAnimation || 'none'}-${slide.textAnimationSpeed || 'normal'}`}
                  variants={getTextAnimationVariants()}
                  initial="initial"
                  animate="animate"
                  className="text-center py-0.5 my-0 shrink-0"
                >
                  {/* 看板画像 (1個) - 縦画面の時はタイトル文字の上に配置 */}
                  {(() => {
                    const hBannerImg = slide.subheadlineImageUrl || (slide.subheadlineImages && slide.subheadlineImages[0]);
                    if (!hBannerImg) return null;
                    return (
                      <div className="flex items-center justify-center mb-1 mt-0 shrink-0">
                        <div className="w-full max-w-[340px] h-[90px] sm:h-[105px] rounded-2xl bg-transparent overflow-hidden flex items-center justify-center shrink-0">
                          <img
                            src={hBannerImg}
                            alt="参考画像"
                            referrerPolicy="no-referrer"
                            onError={handleImageError}
                            className="w-auto h-auto max-w-full max-h-full object-contain rounded-xl drop-shadow-sm"
                          />
                        </div>
                      </div>
                    );
                  })()}

                  {/* 大見出し */}
                  <div
                    onClick={() => onSelectTextTarget?.('headline')}
                    className={`p-0.5 ${getSelectableClass('headline')}`}
                    title="クリックして大見出しの書体を変更"
                  >
                    <h1
                      className="font-black tracking-tight mb-0.5 drop-shadow-sm whitespace-pre-line break-words"
                      style={{
                        fontFamily: getTargetFont('headline'),
                        color: getTargetTextColor('headline'),
                        fontSize: `${effectiveHeadlinePt}px`,
                        lineHeight: 1.12,
                        textAlign: slide.headlineAlign || 'center',
                        marginLeft: slide.headlineAlign === 'left' ? '0' : 'auto',
                        marginRight: slide.headlineAlign === 'right' ? '0' : 'auto',
                        textShadow:
                          slide.textAnimation === 'neonFlicker'
                            ? `0 0 16px ${slide.accentColor}, 0 0 32px ${slide.accentColor}`
                            : 'none',
                      }}
                    >
                      {slide.headline || ''}
                    </h1>
                    {selectedTextTarget === 'headline' && (
                      <div className="inline-flex items-center gap-1 text-[11px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                        <Type className="w-3 h-3" /> 見出しの書体を変更中
                      </div>
                    )}
                  </div>

                  {/* サブコピー */}
                  {slide.subheadline && (
                    <div
                      onClick={() => onSelectTextTarget?.('subheadline')}
                      className={`p-0.5 mt-0.5 ${getSelectableClass('subheadline')}`}
                      title="クリックして説明文の書体を変更"
                    >
                      <p
                        className="font-medium opacity-85 max-w-[480px] whitespace-pre-line break-words"
                        style={{ 
                          fontFamily: getTargetFont('subheadline'),
                          color: getTargetTextColor('subheadline'),
                          fontSize: `${effectiveSubheadlinePt}px`,
                          lineHeight: 1.2,
                          textAlign: slide.subheadlineAlign || 'center',
                          marginLeft: slide.subheadlineAlign === 'left' ? '0' : 'auto',
                          marginRight: slide.subheadlineAlign === 'right' ? '0' : 'auto',
                        }}
                      >
                        {slide.subheadline}
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* メニュー商品リスト（横書き時：空いているスペースいっぱいに均等配置、1個は大、2個はやや大） */}
              {visibleCount > 0 && (
                <div
                  onClick={() => onSelectTextTarget?.('menu')}
                  className={`py-0.5 px-0.5 rounded-2xl flex-1 flex flex-col ${
                    visibleCount === 2 ? 'justify-between gap-3' : 'justify-between gap-1.5'
                  } min-h-0 h-full`}
                  style={{ fontFamily: getTargetFont('menu') }}
                  title="クリックしてメニュー商品の書体を変更"
                >
                  {visibleItems.map((item, idx) => {
                    const itemEffectiveNamePt = item.namePt || slide.menuItemNamePt || autoItemNamePt;
                    const itemEffectiveDescPt = item.descPt || slide.menuItemDescPt || autoItemDescPt;
                    const itemEffectivePricePt = item.pricePt || slide.menuItemPricePt || autoItemPricePt;

                    return (
                      <motion.div
                        key={item.id || idx}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.04 + idx * 0.03, duration: 0.15 }}
                        className={`relative rounded-xl border backdrop-blur-sm transition-all flex items-center justify-between shadow-sm flex-1 min-h-0 overflow-visible ${
                          visibleCount === 1
                            ? 'py-3 px-4 gap-4 max-h-[320px]'
                            : visibleCount === 2
                            ? 'py-2.5 px-3.5 gap-3'
                            : isDenseMenu
                            ? 'py-1 px-2 gap-1.5'
                            : isMediumMenu
                            ? 'py-1.5 px-2 gap-2'
                            : 'py-2 px-2.5 gap-2.5'
                        } ${
                          item.featured || (item.highlightBadge && item.highlightBadge !== 'なし')
                            ? 'scale-[1.01] ring-2 ring-amber-400 border-amber-400 shadow-md bg-amber-400/10'
                            : ''
                        }`}
                        style={{
                          backgroundColor:
                            item.featured || (item.highlightBadge && item.highlightBadge !== 'なし')
                              ? undefined
                              : `${slide.textColor}10`,
                          borderColor:
                            item.featured || (item.highlightBadge && item.highlightBadge !== 'なし')
                              ? '#f59e0b'
                              : `${slide.textColor}25`,
                        }}
                      >
                        {/* おすすめ枠バッジ（１番人気、おすすめ、話題の品など複数ボタン対応） */}
                        {(() => {
                          const badgeText = item.highlightBadge && item.highlightBadge !== 'なし' && item.highlightBadge !== '' ? item.highlightBadge : (item.featured ? 'おすすめ' : '');
                          if (!badgeText) return null;
                          return (
                            <div 
                              className="absolute -top-2.5 left-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full shadow-md flex items-center justify-center z-20 leading-none whitespace-nowrap border border-amber-300"
                              style={{ writingMode: 'horizontal-tb', direction: 'ltr' }}
                            >
                              <span className="whitespace-nowrap text-center">{badgeText}</span>
                            </div>
                          );
                        })()}

                        {item.imageUrl && (
                          <div
                            className={`rounded-xl bg-transparent flex items-center justify-center overflow-hidden shrink-0 self-center max-h-[95%] ${
                              visibleCount === 1
                                ? 'w-24 h-24 sm:w-28 sm:h-28'
                                : visibleCount === 2
                                ? 'w-18 h-18 sm:w-22 sm:h-22'
                                : isDenseMenu
                                ? 'w-13 h-13 sm:w-15 sm:h-15'
                                : isMediumMenu
                                ? 'w-15 h-15 sm:w-17 sm:h-17'
                                : 'w-16 h-16 sm:w-18 sm:h-18'
                            }`}
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              onError={handleImageError}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          </div>
                        )}

                        <div className="flex-1 min-w-0 pr-1 flex flex-col justify-center self-center">
                          <div className="flex flex-col items-start gap-0.5">
                            <span
                              className="font-bold break-words leading-tight whitespace-pre-line"
                              style={{
                                fontSize: `${itemEffectiveNamePt}px`,
                                color: getTargetTextColor('menu'),
                              }}
                            >
                              {item.name || '商品名未入力'}
                            </span>
                          </div>
                          {item.description && (
                            <p
                              className={`opacity-80 break-words leading-tight whitespace-pre-line mt-0.5 line-clamp-2`}
                              style={{
                                fontSize: `${itemEffectiveDescPt}px`,
                                color: getTargetTextColor('menu'),
                              }}
                            >
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* 右端エリア（タグと価格）：横書き時はタグを値段の上に配置 */}
                        <div className="flex flex-col items-end justify-center gap-1 shrink-0 self-center">
                          {item.tag && (
                            <span
                              className="text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded text-white shadow-xs shrink-0 whitespace-nowrap tracking-wider flex items-center justify-center leading-none"
                              style={{ 
                                backgroundColor: item.tagColor || ['#ef4444', '#2563eb', '#16a34a', '#d97706', '#9333ea', '#ea580c'][idx % 6] 
                              }}
                            >
                              {item.tag}
                            </span>
                          )}
                          {item.price && item.price.trim().length > 0 ? (
                            <div
                              className={`shrink-0 flex items-center justify-center px-2 py-0.5 rounded-lg ${
                                item.priceBgColor && item.priceBgColor !== 'transparent'
                                  ? 'border border-slate-300/40 shadow-xs'
                                  : 'border border-transparent'
                              }`}
                              style={{
                                backgroundColor:
                                  item.priceBgColor && item.priceBgColor !== 'transparent'
                                    ? item.priceBgColor
                                    : 'transparent',
                              }}
                            >
                              <span
                                className="font-black tracking-tight whitespace-nowrap leading-none flex items-center justify-center -translate-y-[0.5px]"
                                style={{
                                  fontSize: `${itemEffectivePricePt}px`,
                                  color: slide.accentColor,
                                }}
                              >
                                {item.price}
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* 足元部：QRコード & 足元の文字 */}
          {(slide.footerNote || slide.showQrCode || slide.qrCustomImageUrl) && (
            <div
              className={`shrink-0 ${
                isLandscape ? 'pt-0 pb-0 mt-0.5' : 'pt-1.5 pb-0.5 mt-auto'
              } border-t flex items-center justify-between gap-2.5 text-xs`}
              style={{ borderColor: `${slide.textColor}25` }}
            >
              {/* 足元の文字 */}
              {slide.footerNote ? (
                <div
                  onClick={() => onSelectTextTarget?.('footer')}
                  className={`flex-1 ${isLandscape ? 'py-0 px-0.5' : 'p-1'} min-w-0 ${getSelectableClass('footer')}`}
                  style={{ fontFamily: getTargetFont('footer') }}
                  title="クリックして足元の文字の書体を変更"
                >
                  <p 
                    className="opacity-80 leading-snug whitespace-pre-line break-words"
                    style={{
                      fontSize: slide.footerNotePt ? `${slide.footerNotePt}px` : isLandscape ? '12px' : '13px',
                      color: getTargetTextColor('footer'),
                    }}
                  >
                    {slide.footerNote}
                  </p>
                  {selectedTextTarget === 'footer' && (
                    <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded inline-block mt-0.5">
                      足元の文字の書体変更中
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex-1" />
              )}

              {/* QRコードカード（添付画像優先 ＆ 完全オフライン対応・外部通信不要） */}
              {(slide.showQrCode || slide.qrCustomImageUrl) && (
                <div className={`flex items-center gap-2 shrink-0 bg-white text-slate-950 ${
                  isLandscape ? 'px-2 py-0.5 rounded-xl max-w-[145px]' : 'p-2 rounded-2xl max-w-[155px]'
                } shadow-md border border-slate-300 z-10`}>
                  {slide.qrCustomImageUrl ? (
                    <img
                      src={slide.qrCustomImageUrl}
                      alt="添付QRコード"
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                      className={`${isLandscape ? 'w-[36px] h-[36px]' : 'w-[48px] h-[48px]'} object-contain rounded-lg shrink-0`}
                    />
                  ) : qrDataUrl && !qrImgError ? (
                    <img
                      src={qrDataUrl}
                      alt="QRコード"
                      referrerPolicy="no-referrer"
                      onError={() => setQrImgError(true)}
                      className={`${isLandscape ? 'w-[36px] h-[36px]' : 'w-[48px] h-[48px]'} object-contain rounded-lg shrink-0`}
                    />
                  ) : (
                    <div className={`${isLandscape ? 'w-[36px] h-[36px]' : 'w-[48px] h-[48px]'} bg-slate-100 flex items-center justify-center rounded-lg shrink-0`}>
                      <QrCode className={`${isLandscape ? 'w-4 h-4' : 'w-6 h-6'} text-slate-800`} />
                    </div>
                  )}
                  <div className="text-[10.5px] font-bold leading-tight min-w-0 flex-1 text-slate-900 break-words whitespace-pre-line">
                    {slide.qrCodeLabel || '読み取り'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
