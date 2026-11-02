/**
 * 看板サイネージのフォントサイズ自動計算ユーティリティ
 * ユーザー指示:
 * 1. メインキャッチコピーとサブコピーの文字数が増えたときは自動でフォントを小さくして収まるように
 * 2. メインキャッチコピーは最大52ptまで、サブコピーは最大26ptまで
 * 3. ptを自動にして表示されるpt数と実際のpt数が100%一致するように共通計算
 */

export function calculateAutoHeadlinePt(
  text: string,
  isVertical: boolean,
  size: 'small' | 'medium' | 'large' = 'medium'
): number {
  const clean = (text || '').replace(/\r/g, '').trim();
  const len = clean.replace(/\s+/g, ' ').length;
  const lines = clean.split('\n').filter((l) => l.trim().length > 0);
  const lineCount = Math.max(1, lines.length);
  const maxLineLen = lines.reduce((max, l) => Math.max(max, l.length), len);

  let pt = 46;

  if (isVertical) {
    if (len > 35 || maxLineLen > 22 || lineCount >= 4) {
      pt = 20;
    } else if (len > 25 || maxLineLen > 16 || lineCount >= 3) {
      pt = 24;
    } else if (len > 18 || maxLineLen > 12) {
      pt = 30;
    } else if (len > 12 || maxLineLen > 9) {
      pt = 38;
    } else if (len > 6) {
      pt = 46;
    } else {
      pt = 52;
    }
  } else {
    if (len > 35 || lineCount >= 4) {
      pt = 24;
    } else if (len > 25 || lineCount >= 3) {
      pt = 30;
    } else if (len > 16) {
      pt = 36;
    } else if (len > 10) {
      pt = 44;
    } else {
      pt = 50;
    }
  }

  // 小・中・大の微調整
  if (size === 'large') pt += 4;
  if (size === 'small') pt -= 4;

  // 上限52pt、下限14pt
  return Math.min(52, Math.max(14, pt));
}

export function calculateAutoSubheadlinePt(
  text: string,
  isVertical: boolean,
  size: 'small' | 'medium' | 'large' = 'medium'
): number {
  const clean = (text || '').replace(/\r/g, '').trim();
  const len = clean.replace(/\s+/g, ' ').length;
  const lines = clean.split('\n').filter((l) => l.trim().length > 0);
  const lineCount = Math.max(1, lines.length);
  const maxLineLen = lines.reduce((max, l) => Math.max(max, l.length), len);

  let pt = 18;

  if (isVertical) {
    if (len > 50 || maxLineLen > 28 || lineCount >= 4) {
      pt = 11;
    } else if (len > 35 || maxLineLen > 20 || lineCount >= 3) {
      pt = 13;
    } else if (len > 22 || maxLineLen > 14) {
      pt = 16;
    } else if (len > 12) {
      pt = 20;
    } else {
      pt = 24;
    }
  } else {
    if (len > 55 || lineCount >= 4) {
      pt = 13;
    } else if (len > 35 || lineCount >= 3) {
      pt = 16;
    } else if (len > 20) {
      pt = 19;
    } else {
      pt = 22;
    }
  }

  if (size === 'large') pt += 2;
  if (size === 'small') pt -= 2;

  // 上限30pt、下限10pt
  return Math.min(30, Math.max(10, pt));
}

export const DEFAULT_PRICE_BG_COLOR = 'transparent'; // 透明（デフォルト価格背景色）

export function calculateAutoMenuItemNamePt(count: number, isVertical: boolean): number {
  if (isVertical) {
    if (count <= 1) return 22;
    if (count === 2) return 17;
    if (count === 3) return 13;
    if (count === 4) return 10.5;
    return 9.5; // 5〜6品（3列x2行のグリッドで枠内に美しく収まるサイズ）
  }
  // 横書き
  if (count <= 1) return 26;
  if (count === 2) return 20;
  if (count === 3) return 16;
  if (count === 4) return 13;
  return 11; // 5〜6品
}

export function calculateAutoMenuItemDescPt(count: number, isVertical: boolean): number {
  if (isVertical) {
    if (count <= 1) return 18;
    if (count === 2) return 14;
    if (count === 3) return 11;
    if (count === 4) return 9.5;
    return 8.5; // 5〜6品
  }
  // 横書き
  if (count <= 1) return 18;
  if (count === 2) return 15;
  if (count === 3) return 13;
  if (count === 4) return 11;
  return 10; // 5〜6品
}

export function calculateAutoMenuItemPricePt(count: number, isVertical: boolean): number {
  if (isVertical) {
    if (count <= 1) return 18;
    if (count === 2) return 15;
    if (count === 3) return 13;
    if (count === 4) return 11;
    return 10; // 5〜6品
  }
  // 横書き
  if (count <= 1) return 24;
  if (count === 2) return 20;
  if (count === 3) return 16;
  if (count === 4) return 14;
  return 12; // 5〜6品
}

export const DEFAULT_TAG_COLORS = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#10b981', // green
  '#a855f7', // purple
  '#ec4899', // pink
  '#eab308', // yellow (黄)
];

export function ensureDiverseTagColors(items: { tagColor?: string; [key: string]: any }[]): any[] {
  return items.map((item, index) => ({
    ...item,
    tagColor: item.tagColor && items.filter((o, idx) => idx !== index && o.tagColor === item.tagColor).length === 0
      ? item.tagColor
      : DEFAULT_TAG_COLORS[index % DEFAULT_TAG_COLORS.length],
  }));
}

