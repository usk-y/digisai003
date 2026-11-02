import React, { useState, useEffect } from 'react';
import { 
  SignageSlide, 
  StepNumber, 
  SignageFolder, 
  FontFamily,
  FRAME_OPTIONS,
  MenuItem,
  AppError
} from '../types';
import { WIZARD_STEPS } from '../data/wizardSteps';
import { SIGNAGE_TEMPLATES } from '../data/templates';
import { FONT_OPTIONS } from '../data/fonts';
import {
  calculateAutoHeadlinePt,
  calculateAutoSubheadlinePt,
  calculateAutoMenuItemNamePt,
  calculateAutoMenuItemDescPt,
  calculateAutoMenuItemPricePt,
} from '../utils/typography';
import { getRecentColors, addRecentColor } from '../utils/recentColors';
import { validateAndOptimizeImage } from '../utils/imageOptimizer';
import { 
  Check, 
  Plus, 
  Trash2, 
  Copy, 
  Upload, 
  Video,
  Image as ImageIcon,
  Type, 
  FolderPlus, 
  FolderOpen, 
  MonitorPlay,
  Film,
  Sparkles,
  Grid,
  QrCode,
  Palette,
  Pipette
} from 'lucide-react';

// ポイント数変更コンポーネント（スマホ半角数字入力 ＆ −/＋で1ptずつ変更・最大38pt）
export const PtStepper: React.FC<{
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  label?: string;
}> = ({ value, onChange, min = 8, max = 38, label }) => {
  const currentVal = Math.min(max, Math.max(min, value || min));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw === '') {
      onChange(min);
      return;
    }
    const num = parseInt(raw, 10);
    if (!isNaN(num)) {
      onChange(Math.min(max, Math.max(min, num)));
    }
  };

  return (
    <div className="flex items-center gap-1.5 shrink-0 select-none">
      {label && <span className="text-xs font-bold text-slate-700">{label}</span>}
      <button
        type="button"
        onClick={() => onChange(Math.max(min, currentVal - 1))}
        disabled={currentVal <= min}
        className="w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 active:scale-90 disabled:opacity-30 text-slate-900 font-black text-sm flex items-center justify-center cursor-pointer transition-all shrink-0"
        title="-1pt"
      >
        −
      </button>
      <div className="flex items-center gap-1">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={currentVal}
          onChange={handleInputChange}
          className="w-12 h-7 px-1 bg-white border border-blue-500 rounded-lg text-center font-black text-xs text-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <span className="text-xs font-bold text-slate-600">pt</span>
      </div>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, currentVal + 1))}
        disabled={currentVal >= max}
        className="w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 active:scale-90 disabled:opacity-30 text-slate-900 font-black text-sm flex items-center justify-center cursor-pointer transition-all shrink-0"
        title="+1pt"
      >
        ＋
      </button>
    </div>
  );
};

// テキスト個別カラーピッカー
export const TextColorPickerRow: React.FC<{
  label: string;
  targetKey: keyof NonNullable<SignageSlide['textColorOverrides']>;
  currentSlide: SignageSlide;
  onUpdateSlide: (updates: Partial<SignageSlide>) => void;
}> = ({ label, targetKey, currentSlide, onUpdateSlide }) => {
  const overrides = currentSlide.textColorOverrides || {};
  const currentColor = overrides[targetKey];
  const [recentColors, setRecentColors] = useState<string[]>(getRecentColors);

  useEffect(() => {
    const handleSync = () => {
      setRecentColors(getRecentColors());
    };
    window.addEventListener('recent_colors_updated', handleSync);
    return () => window.removeEventListener('recent_colors_updated', handleSync);
  }, []);

  const handleColorChange = (color: string | undefined) => {
    if (color) {
      addRecentColor(color);
    }
    const newOverrides = { ...overrides, [targetKey]: color };
    if (!color) {
      delete newOverrides[targetKey];
    }
    onUpdateSlide({ textColorOverrides: newOverrides });
  };

  const PRESET_COLORS = [
    { color: '#ffffff', name: '白' },
    { color: '#0f172a', name: '黒' },
    { color: '#ef4444', name: '赤' },
    { color: '#2563eb', name: '青' },
    { color: '#16a34a', name: '緑' },
    { color: '#d97706', name: '金/黄' },
    { color: '#9333ea', name: '紫' },
    { color: '#ea580c', name: '橙' },
  ];

  return (
    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-slate-700">{label}：</span>
        {currentColor && (
          <button
            type="button"
            onClick={() => handleColorChange(undefined)}
            className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
          >
            デフォルトに戻す
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => handleColorChange(undefined)}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
            !currentColor
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
          }`}
        >
          自動（背景の基本色）
        </button>

        {PRESET_COLORS.map((p) => {
          const isSelected = currentColor?.toLowerCase() === p.color.toLowerCase();
          return (
            <button
              key={p.color}
              type="button"
              onClick={() => handleColorChange(p.color)}
              className={`w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center cursor-pointer transition-transform ${
                isSelected ? 'scale-125 ring-2 ring-blue-500 shadow-xs' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: p.color }}
              title={p.name}
            >
              {isSelected && (
                <Check className={`w-3.5 h-3.5 ${p.color === '#ffffff' ? 'text-slate-900' : 'text-white'} stroke-[3]`} />
              )}
            </button>
          );
        })}

        <label className="relative w-7 h-7 rounded-full overflow-hidden cursor-pointer border border-slate-300 flex items-center justify-center bg-white hover:bg-slate-100" title="自由な色を選択">
          <Palette className="w-3.5 h-3.5 text-slate-700" />
          <input
            type="color"
            value={currentColor || '#000000'}
            onChange={(e) => handleColorChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>
      </div>

      {recentColors.length > 0 && (
        <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-500 shrink-0">最近使った色：</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {recentColors.map((c) => {
              const isSelected = currentColor?.toLowerCase() === c.toLowerCase();
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleColorChange(c)}
                  className={`w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center cursor-pointer transition-transform ${
                    isSelected ? 'scale-125 ring-2 ring-blue-500 shadow-xs' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                  title={`最近使った色: ${c}`}
                >
                  {isSelected && (
                    <Check className={`w-3 h-3 ${c.toLowerCase() === '#ffffff' ? 'text-slate-900' : 'text-white'} stroke-[3]`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// 商品タグ最大6色のパレット
export const TAG_COLORS_6 = [
  { bg: '#ef4444', text: '#ffffff', name: 'レッド' },
  { bg: '#2563eb', text: '#ffffff', name: 'ブルー' },
  { bg: '#16a34a', text: '#ffffff', name: 'グリーン' },
  { bg: '#d97706', text: '#ffffff', name: 'アンバー' },
  { bg: '#9333ea', text: '#ffffff', name: 'パープル' },
  { bg: '#ea580c', text: '#ffffff', name: 'オレンジ' },
];

interface SignageWizardProps {
  currentStepNumber: StepNumber;
  currentSlide: SignageSlide;
  currentSlideIndex: number;
  slides: SignageSlide[];
  folders: SignageFolder[];
  activeFolderId: string | null;
  activeFolderName?: string;
  onUpdateSlide: (updates: Partial<SignageSlide>) => void;
  onApplyTemplate: (templateSlide: Partial<SignageSlide>) => void;
  onAddSlide: () => void;
  onDeleteSlide: (index: number) => void;
  onDuplicateSlide: (index: number) => void;
  onSelectSlideIndex: (index: number) => void;
  onCreateFolder: (name: string, templateSlide?: Partial<SignageSlide>) => void;
  onDeleteFolder: (folderId: string) => void;
  onDuplicateFolder: (folderId: string) => void;
  onOpenFolder: (folder: SignageFolder) => void;
  onOpenFullscreen: () => void;
  onGoToStep: (stepNumber: StepNumber) => void;
  onError: (error: AppError) => void;
}

export const SignageWizard: React.FC<SignageWizardProps> = ({
  currentStepNumber,
  currentSlide,
  currentSlideIndex,
  slides,
  folders,
  activeFolderId,
  activeFolderName,
  onUpdateSlide,
  onApplyTemplate,
  onAddSlide,
  onDeleteSlide,
  onDuplicateSlide,
  onSelectSlideIndex,
  onCreateFolder,
  onDeleteFolder,
  onDuplicateFolder,
  onOpenFolder,
  onOpenFullscreen,
  onGoToStep,
  onError,
}) => {
  const stepInfo = WIZARD_STEPS.find((s) => s.step === currentStepNumber) || WIZARD_STEPS[0];

  // 自動フォントサイズ計算（表示されているpt数と実際の描画pt数を100%完全一致させる）
  const isVertical = currentSlide.writingMode === 'vertical';
  const isLandscape = currentSlide.aspect === '16:9' || currentSlide.aspect === 'horizontal';
  const visibleCount = (currentSlide.menuItems || []).slice(0, 6).length;

  const autoHeadlinePt = calculateAutoHeadlinePt(
    currentSlide.headline || '',
    isVertical,
    currentSlide.headlineSize
  );

  const autoSubheadlinePt = calculateAutoSubheadlinePt(
    currentSlide.subheadline || '',
    isVertical,
    currentSlide.subheadlineSize
  );

  const baseAutoItemNamePt = calculateAutoMenuItemNamePt(visibleCount, isVertical);
  const baseAutoItemDescPt = calculateAutoMenuItemDescPt(visibleCount, isVertical);
  const baseAutoItemPricePt = calculateAutoMenuItemPricePt(visibleCount, isVertical);

  const autoItemNamePt = isLandscape
    ? visibleCount <= 2 ? baseAutoItemNamePt + 6 : visibleCount <= 4 ? baseAutoItemNamePt + 4 : baseAutoItemNamePt + 2
    : visibleCount <= 3 ? baseAutoItemNamePt + 2 : baseAutoItemNamePt;

  const autoItemDescPt = isLandscape
    ? visibleCount <= 2 ? baseAutoItemDescPt + 4 : visibleCount <= 4 ? baseAutoItemDescPt + 2 : baseAutoItemDescPt + 1
    : visibleCount <= 3 ? baseAutoItemDescPt + 2 : baseAutoItemDescPt;

  const autoItemPricePt = isLandscape
    ? visibleCount <= 2 ? baseAutoItemPricePt + 6 : visibleCount <= 4 ? baseAutoItemPricePt + 4 : baseAutoItemPricePt + 2
    : visibleCount <= 3 ? baseAutoItemPricePt + 2 : baseAutoItemPricePt;

  // フォルダ新規作成フォーム
  const [newFolderName, setNewFolderName] = useState('');

  // フォルダ削除確認モーダル用
  const [folderToDelete, setFolderToDelete] = useState<SignageFolder | null>(null);

  // 看板スライド削除確認モーダル用（iframe環境でも確実に動作）
  const [slideToDelete, setSlideToDelete] = useState<number | null>(null);

  // テンプレートカテゴリーフィルター
  const [templateCategory, setTemplateCategory] = useState<string>('all');

  // 数字手入力ハンドラヘルパー（全角数字を半角数字に変換、上限・下限適用）
  const parseNumericInput = (raw: string, minVal: number, maxVal: number, defaultVal: number): number => {
    const normalized = raw
      .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      .replace(/[^0-9]/g, '');
    if (normalized === '') return defaultVal;
    const num = parseInt(normalized, 10);
    if (isNaN(num)) return defaultVal;
    return Math.min(maxVal, Math.max(minVal, num));
  };

  // QRコード画像アップロードハンドラ
  const handleQrImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const res = await validateAndOptimizeImage(file, { maxDimension: 600, quality: 0.85 });
      if (res.success && res.dataUrl) {
        onUpdateSlide({
          qrCustomImageUrl: res.dataUrl,
          showQrCode: true,
        });
      } else if (res.error) {
        onError(res.error);
      }
      e.target.value = '';
    }
  };

  // 店舗ロゴ画像アップロードハンドラ
  const handleShopLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const res = await validateAndOptimizeImage(file, { maxDimension: 400, quality: 0.85 });
      if (res.success && res.dataUrl) {
        onUpdateSlide({
          shopLogoUrl: res.dataUrl,
        });
      } else if (res.error) {
        onError(res.error);
      }
      e.target.value = '';
    }
  };

  // メイン写真アップロードハンドラ
  const handleBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const res = await validateAndOptimizeImage(file, { maxDimension: 1200, quality: 0.85 });
      if (res.success && res.dataUrl) {
        onUpdateSlide({
          subheadlineImages: [res.dataUrl],
          subheadlineImageUrl: res.dataUrl,
        });
      } else if (res.error) {
        onError(res.error);
      }
      e.target.value = '';
    }
  };

  // 背景画像・映像の添付（複数拡張子対応、映像はループ、500MB以下、エラー表示）
  const handleBgMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 500MB (524,288,000 bytes) 上限チェック
    const maxSizeBytes = 500 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      onError({
        title: 'ファイルサイズ上限エラー',
        reason: `選択されたファイルのサイズ（${(file.size / (1024 * 1024)).toFixed(1)}MB）が、上限の500MBを超えています。`,
        solution: '500MB以下の画像または動画ファイルを選択してください。動画の場合は解像度やビットレートを下げると容量を抑えられます。',
      });
      e.target.value = '';
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const validImageExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'bmp', 'heic'];
    const validVideoExts = ['mp4', 'webm', 'mov', 'ogg', 'm4v'];

    if (validVideoExts.includes(ext) || file.type.startsWith('video/')) {
      const videoUrl = URL.createObjectURL(file);
      onUpdateSlide({
        bgType: 'video',
        bgVideoUrl: videoUrl,
        bgCustomImage: undefined,
      });
      e.target.value = '';
    } else if (validImageExts.includes(ext) || file.type.startsWith('image/')) {
      const res = await validateAndOptimizeImage(file, { maxDimension: 1600, quality: 0.85 });
      if (res.success && res.dataUrl) {
        onUpdateSlide({
          bgType: 'image',
          bgCustomImage: res.dataUrl,
          bgVideoUrl: undefined,
        });
      } else if (res.error) {
        onError(res.error);
      }
      e.target.value = '';
    } else {
      onError({
        title: '非対応のファイル形式です',
        reason: `「.${ext}」形式のファイルは背景として登録できません。`,
        solution: '画像（JPG, PNG, WEBP, GIF, SVG, BMP, HEIC）または動画（MP4, WEBM, MOV）を選択してください。',
      });
      e.target.value = '';
    }
  };

  // 商品画像アップロードハンドラ
  const handleItemImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const res = await validateAndOptimizeImage(file, { maxDimension: 600, quality: 0.82 });
      if (res.success && res.dataUrl) {
        const newItems = [...(currentSlide.menuItems || [])];
        if (newItems[index]) {
          newItems[index] = { ...newItems[index], imageUrl: res.dataUrl };
          onUpdateSlide({ menuItems: newItems });
        }
      } else if (res.error) {
        onError(res.error);
      }
      e.target.value = '';
    }
  };

  // 背景の色20種類（文字を全て完全に映すため改行・wrap対応、16〜20番も完全安定）
  const bgColors20 = [
    { name: '1. 純白ホワイト', bg: '#ffffff', text: '#0f172a', accent: '#2563eb' },
    { name: '2. アイボリー', bg: '#fdfbf7', text: '#1c1917', accent: '#d97706' },
    { name: '3. 生成りベージュ', bg: '#fef3c7', text: '#78350f', accent: '#b45309' },
    { name: '4. サクラピンク', bg: '#fff1f2', text: '#881337', accent: '#e11d48' },
    { name: '5. ペールミント', bg: '#f0fdf4', text: '#064e3b', accent: '#059669' },
    { name: '6. スカイブルー', bg: '#f0f9ff', text: '#0c4a6e', accent: '#0284c7' },
    { name: '7. レモンパステル', bg: '#fefce8', text: '#713f12', accent: '#ca8a04' },
    { name: '8. ラベンダー', bg: '#faf5ff', text: '#581c87', accent: '#9333ea' },
    { name: '9. シックブラック', bg: '#0f172a', text: '#ffffff', accent: '#f59e0b' },
    { name: '10. ディープネイビー', bg: '#1e3a8a', text: '#ffffff', accent: '#60a5fa' },
    { name: '11. チャコールグレー', bg: '#334155', text: '#ffffff', accent: '#38bdf8' },
    { name: '12. 情熱レッド', bg: '#991b1b', text: '#ffffff', accent: '#fde047' },
    { name: '13. ワインレッド', bg: '#881337', text: '#ffffff', accent: '#fbcfe8' },
    { name: '14. 深緑フォレスト', bg: '#064e3b', text: '#ffffff', accent: '#a7f3d0' },
    { name: '15. サンセットオレンジ', bg: '#c2410c', text: '#ffffff', accent: '#fef08a' },
    { name: '16. 黄金アンバーゴールド', bg: '#d97706', text: '#ffffff', accent: '#fef08a' },
    { name: '17. 高級大理石マーブル', bg: '#e2e8f0', text: '#0f172a', accent: '#0284c7' },
    { name: '18. ウォールナット木目', bg: '#3e1f07', text: '#fef3c7', accent: '#f59e0b' },
    { name: '19. ナチュラル木目', bg: '#78350f', text: '#fef3c7', accent: '#fbbf24' },
    { name: '20. コンクリート調スレート', bg: '#475569', text: '#ffffff', accent: '#38bdf8' },
  ];

  // 背景パターン（復活！）
  const patternOptions = [
    { id: 'none', name: '模様なし（無地）' },
    { id: 'dots', name: 'ドット（水玉柄）' },
    { id: 'grid', name: '方眼グリッド' },
    { id: 'stripes', name: '斜めストライプ' },
    { id: 'wood', name: '木目テクスチャ' },
  ];

  // 文字アニメーション候補（10種類に拡充）
  const textAnimOptions = [
    { id: 'none', name: '1. 動かさない（静止）', desc: '一番見やすく読みやすい標準の表示です' },
    { id: 'slideUp', name: '2. 下からスライド登場', desc: '文字が下から上品に浮き上がります' },
    { id: 'slideLeft', name: '3. 左からスライド登場', desc: '画面の左からスッと流れるように表示されます' },
    { id: 'slideRight', name: '4. 右からスライド登場', desc: '画面の右からスッと流れるように表示されます' },
    { id: 'bounce', name: '5. ポンと弾んで登場', desc: '文字が軽快に弾んで元気な印象を与えます' },
    { id: 'zoomIn', name: '6. ズーム拡大して登場', desc: '遠くから手前に向かってダイナミックに大きくなります' },
    { id: 'pulse', name: '7. ドキドキ拡大縮小（パルス）', desc: '鼓動のようにゆっくり大きくなったり小さくなったりします' },
    { id: 'shake', name: '8. 左右に揺れて注目（シェイク）', desc: '左右にブルッと震えてパッと視線を集めます' },
    { id: 'flip', name: '9. くるっと回転（フリップ）', desc: '立体的に回転しながらかっこよく現れます' },
    { id: 'neonFlicker', name: '10. ネオン風キラキラ点滅', desc: '夜のネオン看板のように光がキラキラ瞬きます' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 pb-20">
      {/* 
        全ページ統一の見出しタイトル
      */}
      <div className="bg-white border-2 border-blue-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs text-center space-y-1.5">
        <div className="inline-flex items-center justify-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs sm:text-sm font-black border border-blue-200">
          <span>ページ {currentStepNumber}</span>
          <span>/</span>
          <span>16</span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
          {stepInfo.title}
        </h2>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs">
        {/* ========================================================= */}
        {/* ステップ 1: 看板を作ってください */}
        {/* ========================================================= */}
        {currentStepNumber === 1 && (
          <div className="space-y-6">
            <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-5 space-y-3">
              <label className="block text-sm sm:text-base font-black text-slate-900">
                看板の名前を入力：
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="例：春のランチ看板、セール看板、お店の案内など"
                  className="flex-1 px-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
                <button
                  type="button"
                  onClick={() => {
                    const name = newFolderName.trim() || `看板 ${folders.length + 1}`;
                    onCreateFolder(name);
                    setNewFolderName('');
                    onGoToStep(2);
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-base rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  <FolderPlus className="w-5 h-5 stroke-[2.5]" />
                  <span>新しく作る</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base font-black text-slate-900">
                  または、作ってある看板を選ぶ（全{folders.length}件）：
                </span>
              </div>

              {folders.length === 0 ? (
                <div className="text-center py-8 text-slate-500 font-bold text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  まだ作られた看板がありません。上の「新しく作る」ボタンを押してください。
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {folders.map((folder, index) => {
                    const isSelected = folder.id === activeFolderId;
                    return (
                      <div
                        key={folder.id}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 text-left ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-600 shadow-sm ring-2 ring-blue-300'
                            : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          onClick={() => {
                            onOpenFolder(folder);
                            onGoToStep(2);
                          }}
                          className="cursor-pointer flex items-center gap-3"
                        >
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <FolderOpen className="w-6 h-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-500">看板 {index + 1}</div>
                            <div className="text-base font-black text-slate-900 truncate">
                              {folder.name}
                            </div>
                            <div className="text-xs text-slate-500 font-medium">
                              スライド {folder.slides.length}枚 | 更新: {folder.updatedAt}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              onOpenFolder(folder);
                              onGoToStep(2);
                            }}
                            className={`flex-1 py-1.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700'
                            }`}
                          >
                            {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                            <span>{isSelected ? 'これを選択中' : 'この看板を開く'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onDuplicateFolder(folder.id)}
                            title="この看板を複製（コピー）する"
                            className="p-1.5 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">複製</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setFolderToDelete(folder)}
                            title="この看板を削除する"
                            className="p-1.5 bg-slate-100 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">削除</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {folderToDelete && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border-2 border-slate-200">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                      <Trash2 className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">
                      ファイルを削除しますか？
                    </h3>
                    <p className="text-xs text-slate-500">
                      「{folderToDelete.name}」を削除します。この操作は元に戻せません。
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setFolderToDelete(null)}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      キャンセル
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteFolder(folderToDelete.id);
                        setFolderToDelete(null);
                      }}
                      className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                    >
                      削除する
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* ステップ 2: 看板の見本（デザイン）を選んでください */}
        {/* ========================================================= */}
        {currentStepNumber === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', name: 'すべて' },
                { id: 'food', name: 'カフェ・飲食' },
                { id: 'izakaya', name: '居酒屋・和食' },
                { id: 'retail', name: 'セール・特売' },
                { id: 'beauty', name: '美容・サロン' },
                { id: 'medical', name: '病院・健康' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setTemplateCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer border ${
                    templateCategory === cat.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-h-[500px] overflow-y-auto p-1">
              {SIGNAGE_TEMPLATES.filter((tmpl) => {
                if (templateCategory === 'all') return true;
                if (templateCategory === 'food') return tmpl.category.includes('カフェ') || tmpl.category.includes('飲食');
                if (templateCategory === 'izakaya') return tmpl.category.includes('居酒屋') || tmpl.category.includes('麺');
                if (templateCategory === 'retail') return tmpl.category.includes('アパレル') || tmpl.category.includes('セール');
                if (templateCategory === 'beauty') return tmpl.category.includes('サロン');
                if (templateCategory === 'medical') return tmpl.category.includes('医療') || tmpl.category.includes('ヘルスケア');
                return true;
              }).map((tmpl) => {
                const isSelected = currentSlide.headline === tmpl.slide.headline && currentSlide.shopName === tmpl.slide.shopName;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => onApplyTemplate(tmpl.slide)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-300 shadow-md'
                        : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-black text-slate-900 truncate">
                          {tmpl.name}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      {(() => {
                        const bg = (tmpl.slide.bgColor || '').toLowerCase();
                        const grad = tmpl.slide.bgGradient || '';
                        const lightBgs = ['#ffffff', '#fffbeb', '#faf5ff', '#f0fdf4', '#fdfbf7', '#f8fafc', '#fefce8', '#fff7ed', '#eff6ff', '#f1f5f9', '#fef08a'];
                        const isLight = lightBgs.includes(bg) || grad.includes('#fdf') || grad.includes('#fce') || grad.includes('#ffffff');
                        const cardTextColor = isLight && (!tmpl.slide.textColor || tmpl.slide.textColor === '#ffffff') ? '#0f172a' : (tmpl.slide.textColor || '#ffffff');

                        return (
                          <div
                            className={`w-full aspect-[16/10] rounded-xl p-2.5 flex flex-col justify-between border shadow-inner overflow-hidden text-center relative ${
                              isLight ? 'border-slate-300' : 'border-slate-700/40'
                            }`}
                            style={{
                              backgroundColor: tmpl.slide.bgColor || (tmpl.slide.bgType === 'gradient' ? '#14532d' : '#1e293b'),
                              backgroundImage: tmpl.slide.bgGradient || undefined,
                              color: cardTextColor,
                              fontFamily: `'${tmpl.slide.fontFamily || 'Noto Sans JP'}', sans-serif`,
                            }}
                          >
                            <div className="text-[10px] font-bold opacity-85 truncate">
                              {tmpl.slide.shopName}
                            </div>
                            <div className="text-xs font-black line-clamp-2 my-auto leading-tight drop-shadow-xs">
                              {tmpl.slide.headline}
                            </div>
                            <div className="text-[9px] font-bold opacity-80 truncate">
                              {tmpl.slide.subheadline || 'おすすめ'}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="text-center pt-1 border-t border-slate-100">
                      <span className={`text-xs font-black ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
                        {isSelected ? '✓ この見本を適用中' : 'この見本にする'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ステップ 3: 画面の向き（縦画面・横画面）と文字の向きを選んでください */}
        {/* ========================================================= */}
        {currentStepNumber === 3 && (
          <div className="space-y-7 max-w-2xl mx-auto">
            {/* 1. 画面の向き（縦画面 9:16 vs 横画面 16:9） */}
            <div className="space-y-3">
              <span className="block text-base sm:text-lg font-black text-slate-900">
                1. 看板の画面の向き（縦画面・横画面）を選んでください：
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => onUpdateSlide({ aspect: '9:16' })}
                  className={`p-5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                    (!currentSlide.aspect || currentSlide.aspect === '9:16' || currentSlide.aspect === 'vertical')
                      ? 'bg-blue-50/80 border-blue-600 ring-4 ring-blue-100 shadow-md scale-[1.01]'
                      : 'bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-10 h-16 rounded-lg bg-blue-100 border-2 border-blue-400 flex items-center justify-center text-xs font-black text-blue-800 shadow-inner">
                    9:16
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      縦画面
                    </h3>
                  </div>
                  {(!currentSlide.aspect || currentSlide.aspect === '9:16' || currentSlide.aspect === 'vertical') && (
                    <span className="px-3.5 py-1 bg-blue-600 text-white font-black text-xs rounded-full flex items-center gap-1 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      選ばれています
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateSlide({ aspect: '16:9' })}
                  className={`p-5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                    currentSlide.aspect === '16:9' || currentSlide.aspect === 'horizontal'
                      ? 'bg-blue-50/80 border-blue-600 ring-4 ring-blue-100 shadow-md scale-[1.01]'
                      : 'bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-16 h-10 rounded-lg bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-xs font-black text-amber-800 shadow-inner">
                    16:9
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      横画面
                    </h3>
                  </div>
                  {(currentSlide.aspect === '16:9' || currentSlide.aspect === 'horizontal') && (
                    <span className="px-3.5 py-1 bg-blue-600 text-white font-black text-xs rounded-full flex items-center gap-1 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      選ばれています
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* 2. 文字の向き（横書き vs 縦書き） */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <span className="block text-base sm:text-lg font-black text-slate-900">
                2. 看板に書く文字の向きを選んでください：
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => onUpdateSlide({ writingMode: 'horizontal' })}
                  className={`p-5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                    (currentSlide.writingMode || 'horizontal') === 'horizontal'
                      ? 'bg-blue-50/80 border-blue-600 ring-4 ring-blue-100 shadow-md scale-[1.01]'
                      : 'bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-black">
                    横
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      横書き
                    </h3>
                  </div>
                  {(currentSlide.writingMode || 'horizontal') === 'horizontal' && (
                    <span className="px-3.5 py-1 bg-blue-600 text-white font-black text-xs rounded-full flex items-center gap-1 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      選ばれています
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateSlide({ writingMode: 'vertical' })}
                  className={`p-5 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                    currentSlide.writingMode === 'vertical'
                      ? 'bg-blue-50/80 border-blue-600 ring-4 ring-blue-100 shadow-md scale-[1.01]'
                      : 'bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl font-black">
                    縦
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      縦書き
                    </h3>
                  </div>
                  {currentSlide.writingMode === 'vertical' && (
                    <span className="px-3.5 py-1 bg-blue-600 text-white font-black text-xs rounded-full flex items-center gap-1 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      選ばれています
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ステップ 4: 看板の枠（フレーム）を選んでください */}
        {/* ========================================================= */}
        {currentStepNumber === 4 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {FRAME_OPTIONS.map((frame) => {
                const isSelected = currentSlide.frame === frame.id;
                return (
                  <button
                    key={frame.id}
                    onClick={() => onUpdateSlide({ frame: frame.id })}
                    className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-400 shadow-md scale-[1.02]'
                        : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className="w-12 h-16 rounded-lg border-4 shadow-xs flex items-center justify-center bg-slate-100 text-[9px] font-bold text-slate-400"
                      style={{ borderColor: frame.color }}
                    >
                      枠
                    </div>
                    <div className="text-xs font-black text-slate-900 break-words leading-tight w-full">
                      {frame.name}
                    </div>
                    <div>
                      {isSelected ? (
                        <span className="px-2 py-0.5 bg-blue-600 text-white font-black text-[10px] rounded-full flex items-center gap-0.5">
                          <Check className="w-3 h-3 stroke-[3]" /> 選択中
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">これにする</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ステップ 5: 看板の背景（色・柄・写真・映像）を選んでください */}
        {/* ========================================================= */}
        {currentStepNumber === 5 && (
          <div className="space-y-6">
            {/* 1. 写真または映像のアップロード添付（全体像が映るように表示） */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                  <Film className="w-5 h-5 text-blue-600" />
                  <span>背景に写真や動画を添付する（最大500MBまで・全体像が表示されます）：</span>
                </span>
                {(currentSlide.bgCustomImage || currentSlide.bgVideoUrl) && (
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateSlide({
                        bgType: 'solid',
                        bgCustomImage: undefined,
                        bgVideoUrl: undefined,
                      });
                    }}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                  >
                    添付を解除して色に戻す
                  </button>
                )}
              </div>

              {currentSlide.bgType === 'video' && currentSlide.bgVideoUrl ? (
                <div className="p-3 bg-blue-100/60 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-black text-blue-900 flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-600" />
                    動画が背景として設定されています（全体像が映り、自動ループ再生されます）
                  </span>
                </div>
              ) : currentSlide.bgType === 'image' && currentSlide.bgCustomImage ? (
                <div className="p-3 bg-blue-100/60 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-black text-blue-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    画像が背景として設定されています（全体像が綺麗に収まります）
                  </span>
                </div>
              ) : null}

              <label className="p-4 rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-600 bg-white hover:bg-blue-50/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 text-center">
                <Upload className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-black text-slate-900">
                  写真または動画ファイルを選択（500MB以下）
                </span>
                <span className="text-xs text-slate-500">
                  画像（JPG, PNG, WEBP, GIF等）／動画（MP4, WEBM, MOV等）に対応
                </span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleBgMediaUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* 背景画像・動画が選択されている場合のロック警告表示 */}
            {Boolean(currentSlide.bgCustomImage || currentSlide.bgVideoUrl) && (
              <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-950">
                <div className="text-xs sm:text-sm font-black leading-relaxed">
                  ※ 背景に写真や動画が設定されているため、模様や色は選べません。色や模様を変更したい場合は、「添付を解除して色に戻す」を押してください。
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSlide({
                      bgType: 'solid',
                      bgCustomImage: undefined,
                      bgVideoUrl: undefined,
                    });
                  }}
                  className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-700 border-2 border-rose-300 rounded-xl text-xs font-black transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  添付を解除して色に戻す
                </button>
              </div>
            )}

            {/* 2. 背景の模様（パターン） */}
            <div className="space-y-2.5">
              <span className="block text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                <Grid className="w-4 h-4 text-blue-600" />
                <span>背景の模様（パターン）：</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {patternOptions.map((pat) => {
                  const isSelected = (currentSlide.bgPattern || 'none') === pat.id;
                  return (
                    <button
                      key={pat.id}
                      type="button"
                      onClick={() => onUpdateSlide({ bgPattern: pat.id })}
                      className={`py-2 px-3 rounded-xl border-2 font-black text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {pat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. 背景の色（20種類・安定色） ＋ 自由色ピッカー */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-sm sm:text-base font-black text-slate-900">
                  背景色を選ぶ：
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl cursor-pointer flex items-center gap-1.5 text-xs font-bold text-slate-800 transition-colors shadow-2xs">
                    <Palette className="w-4 h-4 text-blue-600" />
                    <span>お好みの自由色を選択</span>
                    <input
                      type="color"
                      value={currentSlide.bgColor?.startsWith('#') ? currentSlide.bgColor : '#ffffff'}
                      onChange={(e) => {
                        const color = e.target.value;
                        addRecentColor(color);
                        onUpdateSlide({
                          bgType: 'solid',
                          bgColor: color,
                          bgGradient: undefined,
                          bgCustomImage: undefined,
                          bgVideoUrl: undefined,
                        });
                      }}
                      className="w-0 h-0 opacity-0"
                    />
                  </label>

                  {/* ピックアップ色（アクセント色・強調色） */}
                  <label className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl cursor-pointer flex items-center gap-1.5 text-xs font-bold text-slate-800 transition-colors shadow-2xs" title="ピックアップ色（アクセント色・強調色）を変更">
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-slate-400 shrink-0 shadow-2xs"
                      style={{ backgroundColor: currentSlide.accentColor || '#f59e0b' }}
                    />
                    <span>ピックアップ色</span>
                    <input
                      type="color"
                      value={currentSlide.accentColor?.startsWith('#') ? currentSlide.accentColor : '#f59e0b'}
                      onChange={(e) => {
                        const color = e.target.value;
                        addRecentColor(color);
                        onUpdateSlide({
                          accentColor: color,
                        });
                      }}
                      className="w-0 h-0 opacity-0"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-[440px] overflow-y-auto p-1">
                {bgColors20.map((preset, idx) => {
                  const isSelected = currentSlide.bgColor === preset.bg && currentSlide.bgType === 'solid' && !currentSlide.bgCustomImage && !currentSlide.bgVideoUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        addRecentColor(preset.bg);
                        onUpdateSlide({
                          bgType: 'solid',
                          bgColor: preset.bg,
                          textColor: preset.text,
                          accentColor: preset.accent,
                          bgGradient: undefined,
                          bgCustomImage: undefined,
                          bgVideoUrl: undefined,
                        });
                      }}
                      className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'border-blue-600 ring-2 ring-blue-300 shadow-md bg-blue-50/70'
                          : 'border-slate-200 hover:border-slate-400 bg-white'
                      }`}
                    >
                      <div
                        className="w-9 h-9 rounded-lg border border-slate-300 shadow-inner shrink-0"
                        style={{ backgroundColor: preset.bg }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-black text-slate-900 leading-tight whitespace-normal break-words">
                          {preset.name}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600 stroke-[3] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ステップ 6: お店のお名前を入力してください */}
        {/* ========================================================= */}
        {currentStepNumber === 6 && (
          <div className="space-y-6 max-w-xl mx-auto">
            {/* 店舗名 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-base font-black text-slate-900">
                  店舗名・会社名（空欄でもOK）：
                </label>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  ※Enterキーで改行可能
                </span>
              </div>
              <textarea
                rows={2}
                value={currentSlide.shopName || ''}
                onChange={(e) => onUpdateSlide({ shopName: e.target.value })}
                placeholder="例：喫茶 あおぞら、佐藤整体院、〇〇商店"
                className="w-full px-5 py-3.5 bg-white border-2 border-slate-300 rounded-2xl text-lg font-black text-slate-900 focus:outline-none focus:border-blue-600 shadow-xs whitespace-pre-line resize-y"
              />

              {/* 店舗名の文字色（文字入力の直下） */}
              <TextColorPickerRow
                label="店舗名の文字色"
                targetKey="shopName"
                currentSlide={currentSlide}
                onUpdateSlide={onUpdateSlide}
              />

              {/* 店舗ロゴ画像など（文字の左側に表示） */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <span className="block text-xs font-black text-slate-700">店舗ロゴ画像など（文字の左側に表示）：</span>
                {currentSlide.shopLogoUrl ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={currentSlide.shopLogoUrl}
                      alt="店舗ロゴ"
                      className="w-10 h-10 object-contain rounded-lg border border-slate-300 bg-white p-0.5"
                    />
                    <button
                      type="button"
                      onClick={() => onUpdateSlide({ shopLogoUrl: undefined })}
                      className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      ロゴ画像を外す
                    </button>
                  </div>
                ) : (
                  <label className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 cursor-pointer flex items-center justify-center gap-1.5 w-fit">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>店舗ロゴ画像を選択</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleShopLogoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* 店舗名のポイント数手入力 ＆ −/＋ボタン */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <span className="text-xs font-black text-slate-700">店舗名の文字サイズ（最大38pt）：</span>
                <PtStepper
                  value={currentSlide.shopNamePt || 22}
                  onChange={(val) => onUpdateSlide({ shopNamePt: val })}
                  min={8}
                  max={38}
                />
              </div>

              {/* 並び位置 */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <span className="block text-xs font-black text-slate-700">文字の並び位置：</span>
                <div className="grid grid-cols-3 gap-2">
                  {(() => {
                    const isLandscape = currentSlide.aspect === '16:9' || currentSlide.aspect === 'horizontal';
                    const alignOptions = [
                      {
                        val: 'left',
                        label: isLandscape ? '左寄せ' : currentSlide.writingMode === 'vertical' ? '上寄せ' : '左寄せ',
                      },
                      { val: 'center', label: '真ん中' },
                      {
                        val: 'right',
                        label: isLandscape ? '下寄せ' : currentSlide.writingMode === 'vertical' ? '下寄せ' : '右寄せ',
                      },
                    ];
                    return alignOptions.map((a) => (
                      <button
                        key={a.val}
                        type="button"
                        onClick={() => onUpdateSlide({ shopNameAlign: a.val as any })}
                        className={`py-1.5 rounded-lg font-bold text-xs border transition-all cursor-pointer ${
                          (currentSlide.shopNameAlign || 'center') === a.val
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {a.label}
                      </button>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ステップ 7: お店の種類・営業時間などを入力してください */}
        {/* ========================================================= */}
        {currentStepNumber === 7 && (
          <div className="space-y-6 max-w-xl mx-auto">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-base font-black text-slate-900">
                  お店の種類・営業時間など（空欄でもOK）：
                </label>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  ※Enterキーで改行可能
                </span>
              </div>
              <textarea
                rows={2}
                value={currentSlide.categoryBadge || ''}
                onChange={(e) => onUpdateSlide({ categoryBadge: e.target.value })}
                placeholder="例：お店の種類・営業時間など"
                className="w-full px-5 py-3 bg-white border-2 border-slate-300 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:text-xs focus:outline-none focus:border-blue-600 shadow-xs whitespace-pre-line resize-y"
              />

              {/* お店の種類・営業時間の文字色（文字入力の直下） */}
              <TextColorPickerRow
                label="お店の種類・営業時間の文字色"
                targetKey="categoryBadge"
                currentSlide={currentSlide}
                onUpdateSlide={onUpdateSlide}
              />

              {/* お店の種類・営業時間のポイント数手入力 ＆ −/＋ボタン */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <span className="text-xs font-black text-slate-700">文字サイズ（最大20pt）：</span>
                <PtStepper
                  value={currentSlide.categoryBadgePt || 13}
                  onChange={(val) => onUpdateSlide({ categoryBadgePt: val })}
                  min={8}
                  max={20}
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ステップ 8: 一番目立たせたい文字（タイトル）を入力してください */}
        {/* ========================================================= */}
        {currentStepNumber === 8 && (
          <div className="space-y-6 max-w-xl mx-auto">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-base font-black text-slate-900">
                  メインのタイトル文字：
                </label>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  ※Enterキーで自由に改行できます
                </span>
              </div>
              <textarea
                rows={3}
                value={currentSlide.headline || ''}
                onChange={(e) => onUpdateSlide({ headline: e.target.value })}
                placeholder="例：本日のおすすめ品！&#10;春の特売セール開催中"
                className="w-full px-5 py-4 bg-white border-2 border-slate-300 rounded-2xl text-lg sm:text-xl font-black text-slate-900 focus:outline-none focus:border-blue-600 shadow-xs resize-y"
              />

              {/* タイトルの文字色（文字入力の直下） */}
              <TextColorPickerRow
                label="タイトルの文字色"
                targetKey="headline"
                currentSlide={currentSlide}
                onUpdateSlide={onUpdateSlide}
              />
            </div>

            {/* タイトルのポイント数手入力 ＆ −/＋ボタン */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-800">
                  タイトルの文字サイズ：
                </span>
                <PtStepper
                  value={currentSlide.headlinePt || autoHeadlinePt}
                  onChange={(val) => onUpdateSlide({ headlinePt: val })}
                  min={8}
                  max={52}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { label: '標準', pt: 28 },
                  { label: '大きめ', pt: 34 },
                  { label: '特大', pt: 38 },
                ].map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => onUpdateSlide({ headlinePt: s.pt })}
                    className={`py-2 rounded-xl font-black text-xs border transition-all cursor-pointer ${
                      (currentSlide.headlinePt || autoHeadlinePt) === s.pt
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="block text-sm font-black text-slate-800">
                文字の並び位置：
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(() => {
                  const isLandscape = currentSlide.aspect === '16:9' || currentSlide.aspect === 'horizontal';
                  const alignOptions = [
                    {
                      val: 'left',
                      label: isLandscape ? '左寄せ' : currentSlide.writingMode === 'vertical' ? '上寄せ' : '左寄せ',
                    },
                    { val: 'center', label: '真ん中' },
                    {
                      val: 'right',
                      label: isLandscape ? '下寄せ' : currentSlide.writingMode === 'vertical' ? '下寄せ' : '右寄せ',
                    },
                  ];
                  return alignOptions.map((a) => (
                    <button
                      key={a.val}
                      type="button"
                      onClick={() => onUpdateSlide({ headlineAlign: a.val as any })}
                      className={`py-2 rounded-xl font-bold text-xs sm:text-sm border transition-all cursor-pointer ${
                        (currentSlide.headlineAlign || 'center') === a.val
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {a.label}
                    </button>
                  ));
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ステップ 9: 説明やキャッチフレーズを入力してください */}
        {/* ========================================================= */}
        {currentStepNumber === 9 && (
          <div className="space-y-6 max-w-xl mx-auto">
            <div className="space-y-2">
              <label className="block text-base font-black text-slate-900 mb-1">
                説明やキャッチフレーズ（空欄でもOK）：
              </label>
              <textarea
                rows={3}
                value={currentSlide.subheadline || ''}
                onChange={(e) => onUpdateSlide({ subheadline: e.target.value })}
                placeholder="例：毎朝市場から直送の新鮮な海の幸をお届けします。17時まで限定。"
                className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-2xl text-base font-bold text-slate-900 focus:outline-none focus:border-blue-600 shadow-xs"
              />

              {/* 説明文の文字色（文字入力の直下） */}
              <TextColorPickerRow
                label="説明文の文字色"
                targetKey="subheadline"
                currentSlide={currentSlide}
                onUpdateSlide={onUpdateSlide}
              />
            </div>

            {/* 説明文のポイント数手入力 ＆ −/＋ボタン */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-800">
                  説明文の文字サイズ（最大38pt）：
                </span>
                <PtStepper
                  value={currentSlide.subheadlinePt || autoSubheadlinePt}
                  onChange={(val) => onUpdateSlide({ subheadlinePt: val })}
                  min={8}
                  max={38}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { label: '標準', pt: 14 },
                  { label: '大きめ', pt: 18 },
                  { label: '特大', pt: 24 },
                ].map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => onUpdateSlide({ subheadlinePt: s.pt })}
                    className={`py-2 rounded-xl font-black text-xs border transition-all cursor-pointer ${
                      (currentSlide.subheadlinePt || autoSubheadlinePt) === s.pt
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => onUpdateSlide({ subheadline: '' })}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors cursor-pointer"
              >
                文字を消して空欄にする
              </button>
              <span className="text-xs text-slate-500 font-medium">
                ※空欄でも看板として綺麗に表示されます
              </span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ステップ 10: 看板に載せる写真・画像を選んでください */}
        {/* ========================================================= */}
        {currentStepNumber === 10 && (
          <div className="space-y-6 max-w-xl mx-auto">
            {currentSlide.subheadlineImages?.[0] ? (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-3">
                <span className="block text-sm font-bold text-slate-600">
                  現在設定されている写真（全体像が映るように表示されます）：
                </span>
                <div className="w-56 h-56 mx-auto rounded-xl overflow-hidden border-2 border-slate-300 shadow-sm bg-white flex items-center justify-center p-2">
                  <img
                    src={currentSlide.subheadlineImages[0]}
                    alt="看板写真"
                    className="w-full h-full object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateSlide({ subheadlineImages: [], subheadlineImageUrl: '' })}
                  className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-black transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>この写真を削除する</span>
                </button>
              </div>
            ) : (
              /* ユーザー指示：（文字だけの看板もすっきりしていて人気です）という言葉の削除 */
              <div className="p-4 bg-slate-50 rounded-2xl text-center text-slate-600 font-bold text-sm border border-dashed border-slate-300">
                現在写真は入っていません
              </div>
            )}

            {/* ユーザー指示：「お手本写真から選ぶ」機能の削除 → スマホ・PCからの選択のみに一本化 */}
            <div>
              <label className="p-6 rounded-2xl border-2 border-blue-200 hover:border-blue-600 bg-blue-50/50 hover:bg-blue-50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-center">
                <Upload className="w-8 h-8 text-blue-600" />
                <span className="text-base sm:text-lg font-black text-slate-900">
                  写真を選択する
                </span>
                <span className="text-xs text-slate-500">
                  全体像が切れることなく看板に綺麗に収まります
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ステップ 11: おすすめ商品やメニューを入れてください */}
        {/* ========================================================= */}
        {currentStepNumber === 11 && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-slate-700">
                商品リスト（最大6品・現在 {(currentSlide.menuItems || []).length}品）：
              </span>
              {(currentSlide.menuItems || []).length < 6 && (
                <button
                  type="button"
                  onClick={() => {
                    const currentItems = currentSlide.menuItems || [];
                    const nextIdx = currentItems.length;
                    // ユーザー指示：商品のタグは商品を増やすたびに色を変えて（最大６色）
                    const defaultColor = TAG_COLORS_6[nextIdx % TAG_COLORS_6.length].bg;

                    onUpdateSlide({
                      menuItems: [
                        ...currentItems,
                        { 
                          id: `item-${Date.now()}`, 
                          name: '', 
                          price: '', 
                          tag: 'おすすめ', 
                          tagColor: defaultColor,
                          highlightBadge: 'なし',
                          featured: false,
                          namePt: 22,
                          pricePt: 24 
                        }
                      ]
                    });
                  }}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>商品を追加する</span>
                </button>
              )}
            </div>

            {/* メニュー商品の文字色（全体・文字入力の直下） */}
            <TextColorPickerRow
              label="メニュー商品の文字色（全体）"
              targetKey="menu"
              currentSlide={currentSlide}
              onUpdateSlide={onUpdateSlide}
            />

            {/* 商品名・説明文・「値段など」の文字サイズ（一括変更） */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center justify-between gap-2.5 flex-1">
                <span className="text-xs sm:text-sm font-black text-slate-800">
                  商品名：
                </span>
                <PtStepper
                  value={currentSlide.menuItemNamePt || autoItemNamePt}
                  onChange={(val) => {
                    const newItems = (currentSlide.menuItems || []).map((it) => ({
                      ...it,
                      namePt: val,
                    }));
                    onUpdateSlide({
                      menuItemNamePt: val,
                      menuItems: newItems,
                    });
                  }}
                  min={8}
                  max={38}
                />
              </div>

              <div className="h-px md:h-8 bg-slate-200 md:w-px" />

              <div className="flex items-center justify-between gap-2.5 flex-1">
                <span className="text-xs sm:text-sm font-black text-slate-800">
                  説明文：
                </span>
                <PtStepper
                  value={currentSlide.menuItemDescPt || autoItemDescPt}
                  onChange={(val) => {
                    const newItems = (currentSlide.menuItems || []).map((it) => ({
                      ...it,
                      descPt: val,
                    }));
                    onUpdateSlide({
                      menuItemDescPt: val,
                      menuItems: newItems,
                    });
                  }}
                  min={8}
                  max={38}
                />
              </div>

              <div className="h-px md:h-8 bg-slate-200 md:w-px" />

              <div className="flex items-center justify-between gap-2.5 flex-1">
                <span className="text-xs sm:text-sm font-black text-slate-800">
                  値段など：
                </span>
                <PtStepper
                  value={currentSlide.menuItemPricePt || autoItemPricePt}
                  onChange={(val) => {
                    const newItems = (currentSlide.menuItems || []).map((it) => ({
                      ...it,
                      pricePt: val,
                    }));
                    onUpdateSlide({
                      menuItemPricePt: val,
                      menuItems: newItems,
                    });
                  }}
                  min={8}
                  max={38}
                />
              </div>
            </div>

            <div className="space-y-4">
              {(currentSlide.menuItems || []).map((item, idx) => {
                const assignedColor = item.tagColor || TAG_COLORS_6[idx % TAG_COLORS_6.length].bg;
                const isFeatured = item.featured || item.highlightBadge === 'おすすめ';

                return (
                  <div key={item.id || idx} className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 space-y-3 relative">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-black text-sm text-slate-800 flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                          {idx + 1}
                        </span>
                        <span>商品 {idx + 1}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if ((currentSlide.menuItems || []).length >= 6) {
                              onError({
                                title: '商品登録数の上限',
                                reason: '画面内に見やすく収めるため、1画面に登録できる商品は最大6品までとなります。',
                                solution: '不要な商品を削除するか、新しい看板スライドを作成して追加してください。',
                              });
                              return;
                            }
                            const copiedItem: MenuItem = {
                              ...item,
                              id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                            };
                            const newItems = [...(currentSlide.menuItems || [])];
                            newItems.splice(idx + 1, 0, copiedItem);
                            onUpdateSlide({ menuItems: newItems });
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors border border-blue-200"
                          title="この商品をコピーして複製追加"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>この商品をコピーする</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const newItems = (currentSlide.menuItems || []).filter((_, i) => i !== idx);
                            onUpdateSlide({ menuItems: newItems });
                          }}
                          className="text-xs text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors border border-rose-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>削除</span>
                        </button>
                      </div>
                    </div>

                    {/* 商品名 ＆ 価格 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* 商品名 */}
                      <div className="sm:col-span-2 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-black text-slate-800">商品名：</label>
                          <span className="text-[10px] text-blue-600 font-bold">※Enterで改行可能</span>
                        </div>
                        <textarea
                          rows={2}
                          value={item.name}
                          onChange={(e) => {
                            const newItems = [...(currentSlide.menuItems || [])];
                            newItems[idx] = { ...newItems[idx], name: e.target.value };
                            onUpdateSlide({ menuItems: newItems });
                          }}
                          placeholder="例: 特製ブレンド珈琲、日替わり定食"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-black text-slate-900 focus:outline-none focus:border-blue-600 whitespace-pre-line resize-y"
                        />
                      </div>

                      {/* 値段など */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-black text-slate-800">値段など：</label>
                        <input
                          type="text"
                          value={item.price}
                          onChange={(e) => {
                            const newItems = [...(currentSlide.menuItems || [])];
                            newItems[idx] = { ...newItems[idx], price: e.target.value };
                            onUpdateSlide({ menuItems: newItems });
                          }}
                          placeholder="例: 550円"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-black text-slate-900 focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>

                    {/* 商品の説明文 */}
                    <div className="space-y-1.5 pt-1">
                      <label className="block text-xs font-black text-slate-800">商品の説明文（キャッチコピーやこだわりなど）：</label>
                      <textarea
                        rows={2}
                        value={item.description || ''}
                        onChange={(e) => {
                          const newItems = [...(currentSlide.menuItems || [])];
                          newItems[idx] = { ...newItems[idx], description: e.target.value };
                          onUpdateSlide({ menuItems: newItems });
                        }}
                        placeholder="例: 深煎り豆を丁寧にハンドドリップした贅沢な一杯"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    {/* 商品画像（全体像が映るように表示） */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-bold text-slate-600">商品画像：</span>
                      {item.imageUrl ? (
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-12 rounded-lg border border-slate-300 bg-white flex items-center justify-center overflow-hidden p-0.5">
                            <img
                              src={item.imageUrl}
                              alt="商品写真"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = [...(currentSlide.menuItems || [])];
                              newItems[idx] = { ...newItems[idx], imageUrl: undefined };
                              onUpdateSlide({ menuItems: newItems });
                            }}
                            className="text-[11px] text-rose-600 font-bold hover:underline cursor-pointer"
                          >
                            画像を外す
                          </button>
                        </div>
                      ) : (
                        <label className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5 text-blue-600" />
                          <span>写真を添付</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleItemImageUpload(idx, e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* おすすめ枠の選択 */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                      <span className="block text-xs font-black text-slate-800">
                        おすすめ枠の選択（金枠とバッジが付きます）：
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
                        {[
                          { id: 'なし', label: '枠なし' },
                          { id: 'おすすめ', label: 'おすすめ' },
                          { id: '１番人気', label: '１番人気' },
                          { id: '話題の品', label: '話題の品' },
                          { id: '限定品', label: '限定品' },
                          { id: 'イチオシ', label: 'イチオシ' },
                          { id: '新商品', label: '新商品' },
                        ].map((badge) => {
                          const currentBadge = item.highlightBadge || (item.featured ? 'おすすめ' : 'なし');
                          const isSelected = currentBadge === badge.id;
                          return (
                            <button
                              key={badge.id}
                              type="button"
                              onClick={() => {
                                const newItems = [...(currentSlide.menuItems || [])];
                                newItems[idx] = {
                                  ...newItems[idx],
                                  highlightBadge: badge.id,
                                  featured: badge.id !== 'なし',
                                };
                                onUpdateSlide({ menuItems: newItems });
                              }}
                              className={`py-1.5 px-2 rounded-lg text-xs font-black transition-all cursor-pointer text-center ${
                                isSelected
                                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-xs'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                              }`}
                            >
                              {badge.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 商品のタグ文字 ＆ タグの色変更 */}
                    <div className="pt-1 space-y-1.5">
                      <label className="block text-xs font-black text-slate-800">
                        タグ文字 ＆ タグの色変更：
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={item.tag || ''}
                          onChange={(e) => {
                            const newItems = [...(currentSlide.menuItems || [])];
                            newItems[idx] = { ...newItems[idx], tag: e.target.value };
                            onUpdateSlide({ menuItems: newItems });
                          }}
                          placeholder="例: おすすめ、人気No.1、限定"
                          className="w-48 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                        />

                        {/* タグカラーパレット ＆ カスタム色選択 */}
                        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-300">
                          {[
                            '#ef4444', // 赤
                            '#2563eb', // 青
                            '#16a34a', // 緑
                            '#d97706', // 琥珀/オレンジ
                            '#9333ea', // 紫
                            '#ea580c', // 朱色
                            '#ec4899', // ピンク
                            '#0d9488', // ティール
                            '#1e293b', // チャコール
                          ].map((c) => {
                            const isSel = (item.tagColor || assignedColor) === c;
                            return (
                              <button
                                key={c}
                                type="button"
                                onClick={() => {
                                  const newItems = [...(currentSlide.menuItems || [])];
                                  newItems[idx] = { ...newItems[idx], tagColor: c };
                                  onUpdateSlide({ menuItems: newItems });
                                }}
                                className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${
                                  isSel ? 'scale-125 ring-2 ring-blue-500 shadow-xs' : 'hover:scale-110'
                                }`}
                                style={{ backgroundColor: c }}
                              />
                            );
                          })}
                          <label className="relative w-6 h-6 rounded-full overflow-hidden cursor-pointer border border-slate-300 flex items-center justify-center bg-slate-100 hover:bg-slate-200" title="自由な色を選択">
                            <Palette className="w-3.5 h-3.5 text-slate-700" />
                            <input
                              type="color"
                              value={item.tagColor || assignedColor}
                              onChange={(e) => {
                                const newItems = [...(currentSlide.menuItems || [])];
                                newItems[idx] = { ...newItems[idx], tagColor: e.target.value };
                                onUpdateSlide({ menuItems: newItems });
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {(currentSlide.menuItems || []).length === 0 && (
              <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
                <span className="text-sm font-bold text-slate-600 block">
                  商品・メニューは登録されていません
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSlide({
                      menuItems: [
                        { id: `item-${Date.now()}`, name: '', price: '', tag: 'おすすめ', tagColor: TAG_COLORS_6[0].bg, highlightBadge: 'なし', featured: false, namePt: 22, pricePt: 24 }
                      ]
                    });
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>商品を1つ登録してみる</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* ステップ 12: 看板の足元の文字とQRコードを入れてください */}
        {/* ========================================================= */}
        {currentStepNumber === 12 && (
          <div className="space-y-6 max-w-xl mx-auto">
            {/* 1. 足元の文字テキスト */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-base font-black text-slate-900">
                  足元の文字（営業時間・定休日・案内など）：
                </label>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  ※Enterキーで改行可能
                </span>
              </div>
              <textarea
                rows={3}
                value={currentSlide.footerNote || ''}
                onChange={(e) => onUpdateSlide({ footerNote: e.target.value })}
                placeholder="例：営業時間 10:00〜21:00 / 毎週水曜定休&#10;テイクアウトも大歓迎！お気軽にお立ち寄りください"
                className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 whitespace-pre-line resize-y"
              />

              {/* 足元の文字色（文字入力の直下） */}
              <TextColorPickerRow
                label="足元文字の文字色"
                targetKey="footer"
                currentSlide={currentSlide}
                onUpdateSlide={onUpdateSlide}
              />

              {/* 文字サイズpt ＆ −/＋ボタン */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <span className="text-xs font-black text-slate-700">足元の文字サイズ（最大38pt）：</span>
                <PtStepper
                  value={currentSlide.footerNotePt || 13}
                  onChange={(val) => onUpdateSlide({ footerNotePt: val })}
                  min={8}
                  max={38}
                />
              </div>
            </div>

            {/* 2. 店頭QRコードの表示 */}
            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-black text-slate-900 block flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-blue-600" />
                    <span>店頭QRコードを右下に表示する：</span>
                  </span>
                  <span className="text-xs text-slate-500">
                    スマホで読み取れるQRコードを自動生成して表示します
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateSlide({ showQrCode: !currentSlide.showQrCode })}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    currentSlide.showQrCode
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {currentSlide.showQrCode ? '表示 ON' : '非表示 OFF'}
                </button>
              </div>

              {currentSlide.showQrCode && (
                <div className="space-y-3.5 pt-3 border-t border-slate-200">
                  {/* QR画像を直接添付（手持ちのQRコード画像をアップロード） */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                        <span>QR画像を添付（お手元のQRコード画像を直接アップロード）：</span>
                      </span>
                      {currentSlide.qrCustomImageUrl && (
                        <button
                          type="button"
                          onClick={() => onUpdateSlide({ qrCustomImageUrl: undefined })}
                          className="text-[11px] text-rose-600 font-bold hover:underline cursor-pointer"
                        >
                          画像を外す
                        </button>
                      )}
                    </div>
                    {currentSlide.qrCustomImageUrl ? (
                      <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <img
                          src={currentSlide.qrCustomImageUrl}
                          alt="添付QRコード"
                          className="w-12 h-12 object-contain rounded-lg border border-slate-300 bg-white p-0.5"
                        />
                        <div className="text-xs text-slate-600 space-y-0.5">
                          <div className="font-bold text-slate-900">添付QRコード適用中</div>
                          <div className="text-[11px] text-slate-500">この画像が看板の右下にそのまま表示されます</div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 cursor-pointer flex items-center justify-center gap-1.5 w-fit">
                          <Upload className="w-4 h-4 text-blue-600" />
                          <span>QR画像をアップロード</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleQrImageUpload}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[11px] text-slate-400 block">
                          ※LINEやPayPay、インスタグラム等のQR画像・スクショをそのまま使えます
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      または、リンク先URLからQRコードを自動生成：
                    </label>
                    <input
                      type="text"
                      value={currentSlide.qrCodeUrl || ''}
                      onChange={(e) => onUpdateSlide({ qrCodeUrl: e.target.value })}
                      placeholder="例：https://example.com"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        QRコードの横に添える説明文字：
                      </label>
                      <span className="text-[10px] text-blue-600 font-bold">※Enterで改行可能</span>
                    </div>
                    <textarea
                      rows={2}
                      value={currentSlide.qrCodeLabel || ''}
                      onChange={(e) => onUpdateSlide({ qrCodeLabel: e.target.value })}
                      placeholder="例：LINE友達追加&#10;クーポン配布中"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 whitespace-pre-line resize-y"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ステップ 13: 文字の書体（フォント）を選んでください */}
        {/* ========================================================= */}
        {currentStepNumber === 13 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {FONT_OPTIONS.map((f) => {
                const isSelected = currentSlide.fontFamily === f.family;
                return (
                  <button
                    key={f.family}
                    onClick={() => onUpdateSlide({ fontFamily: f.family as FontFamily })}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-300 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">
                        {f.sample}
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    <div
                      className="text-lg sm:text-xl font-black text-slate-900 py-1"
                      style={{ fontFamily: `'${f.family}', sans-serif` }}
                    >
                      {f.name}
                    </div>

                    <div
                      className="text-xs text-slate-600 truncate border-t border-slate-100 pt-1.5"
                      style={{ fontFamily: `'${f.family}', sans-serif` }}
                    >
                      あいうえお 日本語見本
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ステップ 14: 文字の動く効果を選んでください */}
        {/* ========================================================= */}
        {currentStepNumber === 14 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {textAnimOptions.map((opt) => {
                const isSelected = (currentSlide.textAnimation || 'none') === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onUpdateSlide({ textAnimation: opt.id as any })}
                    className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-300 shadow-md'
                        : 'bg-white border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Type className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-base font-black text-slate-900 mb-1">
                        {opt.name}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-600 font-medium">
                        {opt.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="px-2.5 py-1 bg-blue-600 text-white font-black text-xs rounded-full shrink-0">
                        選択中
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ステップ 15: この看板を表示する秒数を選んでください */}
        {/* ========================================================= */}
        {currentStepNumber === 15 && (
          <div className="space-y-6 max-w-xl mx-auto text-center">
            <div className="p-6 bg-blue-50/80 rounded-2xl border-2 border-blue-200 space-y-3">
              <span className="text-sm font-bold text-blue-700 block">現在の設定時間（スマホの半角数字で999秒まで手入力できます）：</span>
              <div className="flex items-center justify-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={currentSlide.duration || 10}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const normalized = raw
                      .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
                      .replace(/[^0-9]/g, '');
                    if (normalized === '') {
                      onUpdateSlide({ duration: 1 });
                    } else {
                      const val = parseInt(normalized, 10);
                      if (!isNaN(val)) {
                        onUpdateSlide({ duration: Math.min(999, Math.max(1, val)) });
                      }
                    }
                  }}
                  className="w-36 px-3 py-2 bg-white border-2 border-blue-500 rounded-2xl text-center text-4xl sm:text-5xl font-black text-blue-950 font-mono shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-2xl font-black text-blue-950">秒間</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="block text-sm font-black text-slate-800 text-left">
                ワンタップで選ぶ：
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                {[5, 10, 15, 20, 30, 45, 60, 90, 120].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => onUpdateSlide({ duration: sec })}
                    className={`py-2.5 rounded-xl font-black text-sm sm:text-base border transition-all cursor-pointer ${
                      (currentSlide.duration || 10) === sec
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {sec}秒
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onUpdateSlide({ duration: Math.max(1, (currentSlide.duration || 10) - 1) })}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black rounded-xl text-sm border border-slate-300 transition-colors cursor-pointer"
              >
                - 1秒減らす
              </button>
              <button
                type="button"
                onClick={() => onUpdateSlide({ duration: Math.min(999, (currentSlide.duration || 10) + 1) })}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black rounded-xl text-sm border border-slate-300 transition-colors cursor-pointer"
              >
                + 1秒増やす
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ステップ 16: 看板が完成しました！新しい看板を追加しますか？ */}
        {/* ========================================================= */}
        {currentStepNumber === 16 && (
          <div className="space-y-6 max-w-xl mx-auto text-center">
            <div className="p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-200 space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-950">
                看板 {currentSlideIndex + 1}/{slides.length} が完成しました！
              </h3>
              <p className="text-sm sm:text-base text-emerald-800 font-medium">
                現在のフォルダには、合計 {slides.length}枚 の画面が保存されています。
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onAddSlide();
                  onGoToStep(2);
                }}
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-lg sm:text-xl rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-3"
              >
                <Plus className="w-6 h-6 stroke-[3]" />
                <span>新しい看板を追加</span>
              </button>

              <button
                type="button"
                onClick={onOpenFullscreen}
                className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-lg sm:text-xl rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-3"
              >
                <MonitorPlay className="w-6 h-6 stroke-[2.5]" />
                <span>いいえ、全画面で今すぐ再生する</span>
              </button>
            </div>

            {slides.length > 1 && (
              <div className="mt-8 pt-6 border-t border-slate-200 text-left space-y-3">
                <h4 className="text-sm font-black text-slate-800">
                  作成した看板の一覧（全{slides.length}枚）：
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {slides.map((s, idx) => (
                    <div
                      key={s.id || idx}
                      onClick={() => onSelectSlideIndex(idx)}
                      className={`p-3 rounded-xl border-2 transition-all cursor-pointer text-center relative ${
                        currentSlideIndex === idx
                          ? 'bg-blue-50 border-blue-600 font-black'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-500">看板 {idx + 1}/{slides.length} ({s.duration}秒)</div>
                      <div className="text-sm font-black text-slate-900 truncate">
                        {s.headline || '無題の看板'}
                      </div>
                      <div className="flex justify-center gap-2 mt-2">
                        <button type="button" onClick={(e) => { e.stopPropagation(); onDuplicateSlide(idx); }} className="text-xs text-blue-600 hover:underline cursor-pointer">コピー</button>
                        {slides.length > 1 && (
                          <button 
                            type="button" 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setSlideToDelete(idx); 
                            }} 
                            className="text-xs text-red-600 hover:underline cursor-pointer"
                          >
                            削除
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 看板スライド削除確認モーダル（iframe環境でも確実に動作） */}
      {slideToDelete !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100"
          onClick={() => setSlideToDelete(null)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-black text-slate-900">
                看板 {slideToDelete + 1} を削除しますか？
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                この看板のデータは削除されます。この操作は取り消せません。
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSlideToDelete(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl transition-colors cursor-pointer"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={() => {
                  const idx = slideToDelete;
                  setSlideToDelete(null);
                  onDeleteSlide(idx);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
