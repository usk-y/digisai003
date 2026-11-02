import React, { useState } from 'react';
import { SignageSlide, MenuItem, AppError } from '../types';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  Image as ImageIcon, 
  Loader2, 
  Copy, 
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import { validateAndOptimizeImage } from '../utils/imageOptimizer';
import { ErrorAlertModal } from './ErrorAlertModal';
import { handleImageError } from '../utils/imageFallback';
import {
  calculateAutoMenuItemNamePt,
  calculateAutoMenuItemDescPt,
  calculateAutoMenuItemPricePt,
  DEFAULT_PRICE_BG_COLOR,
} from '../utils/typography';

interface Step7ItemsProps {
  slide: SignageSlide;
  onChange: (updates: Partial<SignageSlide>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const PointSizeControl: React.FC<{
  label?: string;
  value?: number;
  autoPt: number;
  min?: number;
  max?: number;
  presets: number[];
  onChange: (pt: number | undefined) => void;
}> = ({ label = 'サイズ', value, autoPt, min = 10, max = 50, presets, onChange }) => {
  const isAuto = value === undefined || value === null || value <= 0;
  const currentPt = isAuto ? autoPt : value;

  return (
    <div className="inline-flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-xl border border-slate-700 shrink-0">
      <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{label}:</span>

      {/* 自動ボタン */}
      <button
        type="button"
        onClick={() => onChange(undefined)}
        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
          isAuto
            ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
            : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-700/80'
        }`}
        title={`商品数に応じて最適化（現在: ${autoPt}pt）`}
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
            className={`w-6 text-center text-[10.5px] font-bold ${
              isAuto ? 'text-amber-400' : 'text-amber-300'
            } bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            title={isAuto ? `自動算出中 (${autoPt}pt)` : '手動指定中'}
          />
          <span className="text-[8.5px] text-slate-400 font-mono select-none">pt</span>
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
              className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer ${
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

export const Step7Items: React.FC<Step7ItemsProps> = ({
  slide,
  onChange,
  onNext,
  onPrev,
}) => {
  // エラーモーダル用ステート（理由と解決方法を明示）
  const [errorInfo, setErrorInfo] = useState<AppError | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const isVertical = slide.writingMode === 'vertical';
  const autoItemNamePt = calculateAutoMenuItemNamePt(slide.menuItems.length, isVertical);
  const autoItemDescPt = calculateAutoMenuItemDescPt(slide.menuItems.length, isVertical);
  const autoItemPricePt = calculateAutoMenuItemPricePt(slide.menuItems.length, isVertical);

  // メニュー商品リスト最大6品
  const MAX_MENU_ITEMS = 6;

  // メニューアイテム追加
  const handleAddItem = () => {
    if (slide.menuItems.length >= MAX_MENU_ITEMS) {
      setErrorInfo({
        title: 'メニュー登録数の上限到達',
        reason: '画面レイアウトの視認性を保つため、メニュー商品は最大6品までに制限されています。',
        solution: '不要なメニュー商品を削除するか、看板スライドを新規追加して別画面に分けて掲載してください。',
      });
      return;
    }

    const tagColors = [
      '#ef4444', // red
      '#3b82f6', // blue
      '#10b981', // green
      '#a855f7', // purple
      '#ec4899', // pink
      '#eab308', // yellow
    ];
    
    const color = tagColors[slide.menuItems.length % tagColors.length];

    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: `商品 ${slide.menuItems.length + 1}`,
      price: '¥500',
      description: 'こだわり素材を使用した特製メニュー',
      tag: 'おすすめ',
      tagColor: color,
      priceBgColor: DEFAULT_PRICE_BG_COLOR,
    };
    onChange({
      menuItems: [...slide.menuItems, newItem],
    });
  };

  // メニュー商品のコピー（複製）
  const handleDuplicateItem = (itemToCopy: MenuItem, index: number) => {
    if (slide.menuItems.length >= MAX_MENU_ITEMS) {
      setErrorInfo({
        title: 'メニュー登録数の上限到達',
        reason: '画面レイアウトの視認性を保つため、メニュー商品は最大6品までに制限されています。',
        solution: '不要なメニュー商品を削除してから再度商品をコピーしてください。',
      });
      return;
    }

    const newItem: MenuItem = {
      ...itemToCopy,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: (itemToCopy.name.length <= 13 ? `${itemToCopy.name} コピー` : itemToCopy.name).slice(0, 17),
    };

    const newItems = [...slide.menuItems];
    newItems.splice(index + 1, 0, newItem);
    onChange({ menuItems: newItems });
  };

  const handleUpdateItem = (id: string, updates: Partial<MenuItem>) => {
    const cleanUpdates = { ...updates };
    if (typeof cleanUpdates.name === 'string') {
      cleanUpdates.name = cleanUpdates.name.slice(0, 17);
    }
    if (typeof cleanUpdates.description === 'string') {
      cleanUpdates.description = cleanUpdates.description.slice(0, 38);
    }
    const updated = slide.menuItems.map((item) =>
      item.id === id ? { ...item, ...cleanUpdates } : item
    );
    onChange({ menuItems: updated });
  };

  const handleDeleteItem = (id: string) => {
    const updated = slide.menuItems.filter((item) => item.id !== id);
    onChange({ menuItems: updated });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...slide.menuItems];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    onChange({ menuItems: newItems });
  };

  const handleMoveDown = (index: number) => {
    if (index === slide.menuItems.length - 1) return;
    const newItems = [...slide.menuItems];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    onChange({ menuItems: newItems });
  };

  // メニュー商品の画像アップロードハンドラー
  const handleItemImageUpload = async (id: string, file: File) => {
    setIsProcessing(`item-${id}`);
    try {
      const result = await validateAndOptimizeImage(file, {
        maxDimension: 800,
        quality: 0.85,
      });

      if (!result.success || !result.dataUrl) {
        setErrorInfo(
          result.error || {
            title: '商品画像のアップロードに失敗しました',
            reason: '画像の読み込みまたは最適化処理中にエラーが発生しました。',
            solution: '別の画像ファイルを選択するか、画像URLを直接入力してください。',
          }
        );
        return;
      }

      handleUpdateItem(id, { imageUrl: result.dataUrl });
    } catch (err: unknown) {
      setErrorInfo({
        title: '予期せぬ画像処理エラー',
        reason: '画像データを読み取る際にブラウザ内部でエラーが発生しました。',
        solution: 'ブラウザを再読み込みするか、画像のファイルサイズを小さくしてお試しください。',
        details: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 画面上部ヘッダー */}
      <div className="pb-2.5 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-amber-400" />
          <span>７ 商品</span>
        </h2>
        <button
          onClick={onNext}
          className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-full text-[10px] shadow-lg shadow-amber-500/20 transition-all flex items-center gap-0.5 cursor-pointer"
        >
          <span>次へ</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* メニュー商品リスト（画像アップロード対応・最大6品） */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-850 p-4 rounded-2xl border border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-black text-slate-200">商品リスト（最大6品）</h3>
              <span className="text-xs text-amber-400 font-bold">
                ({slide.menuItems.length}/6品)
              </span>
            </div>
            {/* ポイント数設定 */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <PointSizeControl
                label="商品名Pt"
                value={slide.menuItemNamePt}
                autoPt={autoItemNamePt}
                min={10}
                max={30}
                presets={[10, 14, 18, 22, 26, 30]}
                onChange={(pt) => onChange({ menuItemNamePt: pt })}
              />
              <PointSizeControl
                label="紹介文Pt"
                value={slide.menuItemDescPt}
                autoPt={autoItemDescPt}
                min={10}
                max={30}
                presets={[10, 14, 18, 22, 26, 30]}
                onChange={(pt) => onChange({ menuItemDescPt: pt })}
              />
              <PointSizeControl
                label="価格Pt"
                value={slide.menuItemPricePt}
                autoPt={autoItemPricePt}
                min={10}
                max={30}
                presets={[10, 14, 18, 22, 26, 30]}
                onChange={(pt) => onChange({ menuItemPricePt: pt })}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
            <button
              onClick={handleAddItem}
              disabled={slide.menuItems.length >= MAX_MENU_ITEMS}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                slide.menuItems.length >= MAX_MENU_ITEMS
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/20 active:scale-95'
              }`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              商品を追加 {slide.menuItems.length >= MAX_MENU_ITEMS ? `(上限${MAX_MENU_ITEMS}品)` : ''}
            </button>
          </div>
        </div>

        {slide.menuItems.length === 0 ? (
          <div className="p-8 bg-slate-850 border border-dashed border-slate-750 rounded-2xl text-center space-y-3">
            <p className="text-xs text-slate-400">商品がまだ登録されていません</p>
            <button
              onClick={handleAddItem}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              1品目を追加する
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {slide.menuItems.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border bg-slate-850 border-slate-800 space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-mono font-black shadow-sm">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      商品 {idx + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={slide.menuItems.length >= MAX_MENU_ITEMS}
                      onClick={() => handleDuplicateItem(item, idx)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-750 disabled:opacity-30 cursor-pointer flex items-center gap-1 text-[11px] font-bold border border-slate-700 transition-colors"
                      title={slide.menuItems.length >= MAX_MENU_ITEMS ? `最大${MAX_MENU_ITEMS}品のためコピーできません` : 'この商品をコピー'}
                    >
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                      <span>コピー</span>
                    </button>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveUp(idx)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer border border-slate-750"
                      title="上へ"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === slide.menuItems.length - 1}
                      onClick={() => handleMoveDown(idx)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer border border-slate-750"
                      title="下へ"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/30 ml-1 cursor-pointer"
                      title="削除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 画像設定 */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {item.imageUrl ? (
                        <div className="w-12 h-12 rounded-xl bg-slate-950 border border-amber-400/60 flex items-center justify-center overflow-hidden shrink-0 shadow-sm p-0.5">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            onError={handleImageError}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-950 text-slate-500 border border-slate-800 flex items-center justify-center shrink-0">
                          <ImageIcon className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                      <div>
                        <span className="text-[11px] font-bold text-slate-300 block">商品画像</span>
                        <span className="text-[9.5px] text-slate-500">正方形写真推奨</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                      <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-100 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-700 active:scale-95 transition-all">
                        {isProcessing === `item-${item.id}` ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                            <span>最適化中...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 text-amber-400" />
                            <span>画像を添付</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isProcessing === `item-${item.id}`}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleItemImageUpload(item.id, file);
                            e.target.value = '';
                          }}
                        />
                      </label>

                      {item.imageUrl && (
                        <button
                          type="button"
                          onClick={() => handleUpdateItem(item.id, { imageUrl: undefined })}
                          className="px-2.5 py-1.5 text-rose-300 hover:text-rose-200 bg-rose-500/20 hover:bg-rose-500/30 text-xs font-bold rounded-lg border border-rose-500/30 cursor-pointer transition-colors"
                        >
                          添付解除
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={item.imageUrl || ''}
                      onChange={(e) => handleUpdateItem(item.id, { imageUrl: e.target.value })}
                      placeholder="画像URLを直接入力（例: https://example.com/item.jpg）"
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-750 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* タグ名 ＆ タグカラー */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.tag || ''}
                    onChange={(e) => handleUpdateItem(item.id, { tag: e.target.value })}
                    placeholder="タグ名（例: おすすめ / NEW / 限定）"
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-750 rounded-lg text-xs text-slate-100 font-bold focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
                  />
                  <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-750 shrink-0">
                    <span className="text-[10px] text-slate-400 font-bold">タグ色:</span>
                    <input
                      type="color"
                      value={item.tagColor || '#ef4444'}
                      onChange={(e) => handleUpdateItem(item.id, { tagColor: e.target.value })}
                      className="w-7 h-7 rounded cursor-pointer border border-slate-700 bg-transparent shrink-0"
                      title="タグの色を変更"
                    />
                  </div>
                </div>

                {/* 商品名（最大17文字） */}
                <div>
                  <input
                    type="text"
                    maxLength={17}
                    value={item.name}
                    onChange={(e) => handleUpdateItem(item.id, { name: e.target.value.slice(0, 17) })}
                    placeholder="商品名（最大17文字）"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-750 rounded-lg text-xs sm:text-sm text-slate-100 font-bold focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
                  />
                </div>

                {/* 商品の説明文（最大38文字） */}
                <div>
                  <textarea
                    value={item.description || ''}
                    onChange={(e) => handleUpdateItem(item.id, { description: e.target.value.slice(0, 38) })}
                    rows={2}
                    placeholder="商品の説明文を入力（最大38文字）"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-750 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
                  />
                </div>

                {/* 価格 ＆ 価格背景色 */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex-1 min-w-[160px]">
                    <input
                      type="text"
                      value={item.price}
                      onChange={(e) => handleUpdateItem(item.id, { price: e.target.value })}
                      placeholder="価格や状態を入力（例：¥500 / 売り切れ など）"
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-750 rounded-lg text-xs text-slate-100 font-black focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-750 shrink-0">
                    <span className="text-[10px] text-slate-400 font-bold">価格背景:</span>
                    <input
                      type="color"
                      value={item.priceBgColor && item.priceBgColor !== 'transparent' ? item.priceBgColor : '#ffffff'}
                      onChange={(e) => handleUpdateItem(item.id, { priceBgColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer border border-slate-700 bg-transparent shrink-0"
                      title="金額の背景色を変更"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateItem(item.id, { priceBgColor: 'transparent' })}
                      className={`text-[9.5px] px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                        !item.priceBgColor || item.priceBgColor === 'transparent'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                          : 'text-slate-400 hover:text-amber-400 border-slate-700'
                      }`}
                      title="標準の透明背景に戻す"
                    >
                      透明
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 足元の文字＆QRコード */}
      <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          足元の文字案内 & QRコード
        </h3>

        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">
            足元の文字告知（営業時間・Wi-Fi・備考など）
          </label>
          <textarea
            value={slide.footerNote}
            onChange={(e) => onChange({ footerNote: e.target.value })}
            rows={2}
            placeholder="例: テイクアウトOK！店内Wi-Fi完備&#10;営業時間 10:00〜21:00"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
          />
        </div>

        {/* QRコード設定 */}
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">店頭QRコード表示</span>
            <button
              onClick={() => onChange({ showQrCode: !slide.showQrCode })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                slide.showQrCode
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${slide.showQrCode ? 'bg-white' : 'bg-slate-500'}`} />
              {slide.showQrCode ? 'ON' : 'OFF'}
            </button>
          </div>

          {slide.showQrCode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">リンク先URL</label>
                <input
                  type="text"
                  value={slide.qrCodeUrl}
                  onChange={(e) => onChange({ qrCodeUrl: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label className="text-[10px] text-slate-400 block font-bold">
                    QRコード下の文字
                  </label>
                  <span className="text-[10px] text-amber-400">※Enterキーで改行可能</span>
                </div>
                <textarea
                  value={slide.qrCodeLabel}
                  onChange={(e) => onChange({ qrCodeLabel: e.target.value })}
                  rows={2}
                  placeholder="モバイルオーダー&#10;公式LINEなど"
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-500 whitespace-pre-line placeholder:text-slate-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 画面下部ナビゲーションボタン */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onPrev}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-xl text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
        >
          ← ６ コピー に戻る
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          ８ 文字の動き へ進む →
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
