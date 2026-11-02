import { SignageSlide } from '../types';

// 画像リンク切れや未設定時に表示する安全なフォールバック画像（SVG Data URI）
export const FALLBACK_IMAGE_DATA_URI = 
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(`
<svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#1e293b"/>
  <rect x="20" y="20" width="360" height="260" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2" stroke-dasharray="8 8"/>
  <g transform="translate(170, 100)" fill="#64748b">
    <path d="M50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10ZM5 50C5 25.1472 25.1472 5 50 5C74.8528 5 95 25.1472 95 50C95 74.8528 74.8528 95 50 95C25.1472 95 5 74.8528 5 50Z"/>
    <path d="M30 65L45 45L55 58L65 48L75 65H30Z"/>
    <circle cx="42" cy="35" r="5"/>
  </g>
  <text x="200" y="205" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="14" font-weight="bold">おすすめ商品</text>
  <text x="200" y="225" text-anchor="middle" fill="#64748b" font-family="sans-serif" font-size="11">IMAGE PREVIEW</text>
</svg>
`.trim());

// 既知の壊れたUnsplash画像URLと有効な代替画像の対応マップ
const BROKEN_URL_MAP: Record<string, string> = {
  'photo-1608270104646-c5c83f9825b7': 'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=400&q=80',
  'photo-1608270192864-15f532a8ec30': 'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=400&q=80',
  'photo-1621996346565-e3d5d6281788': 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=400&q=80',
  'photo-1512290900672-1f486cb45f47': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
  'photo-1486006920555-c77dce18193b': 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=600&q=80',
  'photo-1512290903671-1555513d806a': 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=400&q=80',
  'photo-1520523839898-5071270509a7': 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=400&q=80',
};

export const sanitizeImageUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  for (const [brokenKey, validUrl] of Object.entries(BROKEN_URL_MAP)) {
    if (url.includes(brokenKey)) {
      return validUrl;
    }
  }
  return url;
};

// スライド内の壊れたURLを有効な代替画像へ自動修復する関数
export const repairSlideImages = (slide: SignageSlide): SignageSlide => {
  const updated = { ...slide };

  // リロード後に失効する一時的なblob:動画URLを検知し、安全に無地背景へフォールバック
  if (updated.bgVideoUrl && updated.bgVideoUrl.startsWith('blob:')) {
    updated.bgVideoUrl = undefined;
    if (updated.bgType === 'video') {
      updated.bgType = 'solid';
    }
  }

  if (updated.subheadlineImageUrl) {
    updated.subheadlineImageUrl = sanitizeImageUrl(updated.subheadlineImageUrl);
  }

  if (updated.subheadlineImages && updated.subheadlineImages.length > 0) {
    updated.subheadlineImages = updated.subheadlineImages.map(
      (img) => sanitizeImageUrl(img) || img
    );
  }

  if (updated.menuItems && updated.menuItems.length > 0) {
    updated.menuItems = updated.menuItems.map((item) => ({
      ...item,
      imageUrl: sanitizeImageUrl(item.imageUrl),
    }));
  }

  return updated;
};

// img要素の読み込み失敗時に自動でフォールバック画像へ差し替えるハンドラー
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.currentTarget;
  if (target.src !== FALLBACK_IMAGE_DATA_URI) {
    target.src = FALLBACK_IMAGE_DATA_URI;
  }
};
