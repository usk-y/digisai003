export type SignboardAspect = '9:16' | '16:9' | 'vertical' | 'horizontal';

export type SignboardFrame = 
  | 'modern-black' 
  | 'frameless' 
  | 'aluminum-silver' 
  | 'natural-wood' 
  | 'gold-luxury' 
  | 'neon-border'
  | 'pure-white'
  | 'charcoal-dark'
  | 'bronze-antique'
  | 'champagne-gold'
  | 'rose-gold'
  | 'navy-blue'
  | 'deep-emerald'
  | 'wine-burgundy'
  | 'pastel-pink'
  | 'pastel-mint'
  | 'pastel-yellow'
  | 'dark-walnut'
  | 'matte-gray'
  | 'copper-orange';

export type BackgroundType = 'solid' | 'gradient' | 'pattern' | 'image' | 'video';

export type BackgroundAnimation = 'none' | string;

export type TextAnimation = 
  | 'none'
  | 'slideUp'
  | 'slideLeft'
  | 'slideRight'
  | 'bounce'
  | 'zoomIn'
  | 'pulse'
  | 'shake'
  | 'flip'
  | 'neonFlicker'
  | 'sway';

export type TextAnimationSpeed = 'slow' | 'normal' | 'fast';

export type FontFamily = 
  | 'Noto Sans JP'
  | 'M PLUS Rounded 1c'
  | 'RocknRoll One'
  | 'Dela Gothic One'
  | 'Shippori Mincho'
  | 'Zen Maru Gothic'
  | 'Kaisei Decol'
  | 'Zen Antique'
  | 'Klee One'
  | 'Yuji Boku'
  | 'Reggae One'
  | 'Potta One'
  | 'Stick'
  | 'Yomogi'
  | 'DotGothic16';

export type TextTarget = 'headline' | 'subheadline' | 'shopName' | 'categoryBadge' | 'menu' | 'footer' | 'all';

export interface MenuItem {
  id: string;
  name: string;
  price: string;
  description?: string;
  tag?: string;
  tagColor?: string;
  priceBgColor?: string;
  imageUrl?: string;
  featured?: boolean;
  highlightBadge?: string; // おすすめ枠：'おすすめ' | '人気No.1' | 'イチオシ' | '限定' | 'なし'
  namePt?: number;
  descPt?: number;
  pricePt?: number;
}

export interface SignageSlide {
  id: string;
  name: string;
  duration: number;
  aspect: SignboardAspect;
  frame: SignboardFrame;
  bgType: BackgroundType;
  bgColor: string;
  bgGradient: string;
  bgPattern: string;
  bgCustomImage?: string;
  bgVideoUrl?: string;
  bgAnimation?: BackgroundAnimation;
  bgAnimationSpeed?: 'slow' | 'normal' | 'fast';
  textColor: string;
  accentColor: string;
  shopName: string;
  shopNameSize?: 'small' | 'medium' | 'large';
  shopNamePt?: number;
  shopLogoUrl?: string;
  categoryBadge: string;
  categoryBadgePt?: number;
  headline: string;
  headlineSize?: 'small' | 'medium' | 'large';
  headlinePt?: number;
  subheadline: string;
  subheadlineSize?: 'small' | 'medium' | 'large';
  subheadlinePt?: number;
  subheadlineImageUrl?: string;
  subheadlineImages?: string[];
  menuItems: MenuItem[];
  menuItemNamePt?: number;
  menuItemDescPt?: number;
  menuItemPricePt?: number;
  footerNote: string;
  footerNotePt?: number;
  showQrCode: boolean;
  qrCodeUrl: string;
  qrCodeLabel: string;
  qrCustomImageUrl?: string;
  fontFamily: FontFamily;
  fontOverrides?: {
    headline?: FontFamily;
    subheadline?: FontFamily;
    shopName?: FontFamily;
    categoryBadge?: FontFamily;
    menu?: FontFamily;
    footer?: FontFamily;
  };
  textColorOverrides?: {
    headline?: string;
    subheadline?: string;
    shopName?: string;
    categoryBadge?: string;
    menu?: string;
    footer?: string;
  };
  textAnimation: TextAnimation;
  textAnimationSpeed?: TextAnimationSpeed;
  headlineAlign?: 'left' | 'center' | 'right';
  subheadlineAlign?: 'left' | 'center' | 'right';
  shopNameAlign?: 'left' | 'center' | 'right';
  layoutStyle: 'center-bold' | 'split-menu' | 'card-grid' | 'poster-hero';
  writingMode?: 'horizontal' | 'vertical';
}

export interface SignageFolder {
  id: string;
  name: string;
  slides: SignageSlide[];
  updatedAt: string;
}

export type StepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;

export type StepKey = 
  | 'step1_folders'      // 1: 看板
  | 'step2_template'     // 2: 見本（デザイン）
  | 'step3_writing_mode' // 3: 画面の向き（縦横）＆文字の向き（縦横）
  | 'step4_frame'        // 4: 看板の枠（フレーム20種）
  | 'step5_background'   // 5: 看板の背景（色20種、パターン、画像、映像500MB以下）
  | 'step6_shopname'     // 6: お店のお名前
  | 'step7_category_badge' // 7: お店のカテゴリータグ
  | 'step8_title'        // 8: 一番目立たせたい文字（タイトル・改行対応・pt手入力）
  | 'step9_subtitle'     // 9: 説明やキャッチフレーズ（pt手入力）
  | 'step10_image'       // 10: 看板に載せる写真・画像
  | 'step11_menu'        // 11: おすすめ商品やメニュー（おすすめ枠複数・品名価格直下pt・タグ最大6色）
  | 'step12_footer'      // 12: 看板の足元の文字とQRコード
  | 'step13_font'        // 13: 文字の書体（フォント）
  | 'step14_text_anim'   // 14: 文字の動く効果（10種類）
  | 'step15_duration'    // 15: 表示する秒数（手入力対応）
  | 'step16_finish';     // 16: 看板の完成 ＆ 2枚目の作成確認

export interface WizardStepInfo {
  step: StepNumber;
  key: StepKey;
  title: string;       // 「○○を選んでください」「○○を作ってください」のみ！
}

export const FRAME_OPTIONS: { id: SignboardFrame; name: string; color: string }[] = [
  { id: 'modern-black', name: '1. モダンブラック', color: '#0f172a' },
  { id: 'frameless', name: '2. フレームレス（枠なし）', color: '#64748b' },
  { id: 'aluminum-silver', name: '3. アルミシルバー', color: '#cbd5e1' },
  { id: 'pure-white', name: '4. ピュアホワイト', color: '#e2e8f0' },
  { id: 'natural-wood', name: '5. ナチュラルウッド', color: '#b45309' },
  { id: 'dark-walnut', name: '6. ダークウォールナット', color: '#451a03' },
  { id: 'gold-luxury', name: '7. リッチゴールド', color: '#f59e0b' },
  { id: 'champagne-gold', name: '8. シャンパンゴールド', color: '#fde047' },
  { id: 'bronze-antique', name: '9. アンティークブロンズ', color: '#92400e' },
  { id: 'copper-orange', name: '10. コッパー銅', color: '#ea580c' },
  { id: 'rose-gold', name: '11. ローズゴールド', color: '#fb7185' },
  { id: 'charcoal-dark', name: '12. チャコールグレー', color: '#334155' },
  { id: 'matte-gray', name: '13. マットグレー', color: '#94a3b8' },
  { id: 'navy-blue', name: '14. ディープネイビー', color: '#1e3a8a' },
  { id: 'neon-border', name: '15. サイバーネオン', color: '#06b6d4' },
  { id: 'deep-emerald', name: '16. エメラルドグリーン', color: '#047857' },
  { id: 'wine-burgundy', name: '17. ワインバーガンディ', color: '#881337' },
  { id: 'pastel-pink', name: '18. パステルピンク', color: '#f472b6' },
  { id: 'pastel-mint', name: '19. パステルミント', color: '#34d399' },
  { id: 'pastel-yellow', name: '20. パステルイエロー', color: '#facc15' },
];

export interface ColorCategory {
  id: string;
  name: string;
  description?: string;
  colors: {
    name: string;
    value: string;
    textColor: string;
    accentColor: string;
    isPastel?: boolean;
    isWhite?: boolean;
  }[];
}

// ユーザー指示「何かのエラーの場合は、理由と解決方法を明示」
export interface AppError {
  title: string;
  reason: string;
  solution: string;
  details?: string;
}
