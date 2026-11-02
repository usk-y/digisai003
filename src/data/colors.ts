import { ColorCategory } from '../types';

export const COLOR_CATEGORIES: ColorCategory[] = [
  {
    id: 'white-light',
    name: 'ホワイト＆ライト系',
    colors: [
      { name: 'ピュアホワイト', value: '#ffffff', textColor: '#0f172a', accentColor: '#0284c7', isWhite: true },
      { name: 'スノーホワイト', value: '#f8fafc', textColor: '#0f172a', accentColor: '#2563eb', isWhite: true },
      { name: 'ウォームアイボリー', value: '#fefce8', textColor: '#451a03', accentColor: '#d97706', isWhite: true },
      { name: 'シルククリーム', value: '#fffbeb', textColor: '#451a03', accentColor: '#b45309', isWhite: true },
      { name: 'サクラホワイト', value: '#fff1f2', textColor: '#881337', accentColor: '#e11d48', isWhite: true },
      { name: 'ミントホワイト', value: '#f0fdf4', textColor: '#14532d', accentColor: '#16a34a', isWhite: true },
      { name: 'ラベンダーホワイト', value: '#faf5ff', textColor: '#581c87', accentColor: '#9333ea', isWhite: true },
      { name: 'パールグレー', value: '#f1f5f9', textColor: '#0f172a', accentColor: '#475569', isWhite: true },
    ]
  },
  {
    id: 'pastel',
    name: 'パステルカラー',
    colors: [
      { name: 'パステルピンク', value: '#fbcfe8', textColor: '#831843', accentColor: '#db2777', isPastel: true },
      { name: 'ベビーブルー', value: '#bae6fd', textColor: '#0c4a6e', accentColor: '#0284c7', isPastel: true },
      { name: 'マカロンミント', value: '#a7f3d0', textColor: '#064e3b', accentColor: '#059669', isPastel: true },
      { name: 'レモンシフォン', value: '#fef08a', textColor: '#713f12', accentColor: '#ca8a04', isPastel: true },
      { name: 'ミルキーラベンダー', value: '#ddd6fe', textColor: '#4c1d95', accentColor: '#7c3aed', isPastel: true },
      { name: 'ピーチシャーベット', value: '#fed7aa', textColor: '#7c2d12', accentColor: '#ea580c', isPastel: true },
      { name: 'ペールアクア', value: '#a5f3fc', textColor: '#164e63', accentColor: '#0891b2', isPastel: true },
      { name: 'サニーアプリコット', value: '#fde68a', textColor: '#78350f', accentColor: '#d97706', isPastel: true },
    ]
  },
  {
    id: 'warm',
    name: '暖色・エナジー系',
    colors: [
      { name: '情熱レッド', value: '#dc2626', textColor: '#ffffff', accentColor: '#fef08a' },
      { name: 'ビタミンオレンジ', value: '#ea580c', textColor: '#ffffff', accentColor: '#fef08a' },
      { name: 'サンシャインイエロー', value: '#eab308', textColor: '#451a03', accentColor: '#dc2626' },
      { name: 'ホットチェリー', value: '#e11d48', textColor: '#ffffff', accentColor: '#fbcfe8' },
      { name: 'フレイムクリムゾン', value: '#991b1b', textColor: '#ffffff', accentColor: '#fde047' },
      { name: 'ディープコーラル', value: '#f43f5e', textColor: '#ffffff', accentColor: '#fed7aa' },
    ]
  },
  {
    id: 'cool',
    name: '寒色・クール＆信頼系',
    colors: [
      { name: 'ロイヤルブルー', value: '#2563eb', textColor: '#ffffff', accentColor: '#67e8f9' },
      { name: 'スカイブルー', value: '#0284c7', textColor: '#ffffff', accentColor: '#fde047' },
      { name: 'サイバーシアン', value: '#0891b2', textColor: '#ffffff', accentColor: '#fef08a' },
      { name: 'ナイトオーシャン', value: '#1e3a8a', textColor: '#ffffff', accentColor: '#38bdf8' },
      { name: 'ミッドナイトインディゴ', value: '#312e81', textColor: '#ffffff', accentColor: '#a78bfa' },
      { name: 'アイスブルー', value: '#0369a1', textColor: '#ffffff', accentColor: '#7dd3fc' },
    ]
  },
  {
    id: 'natural',
    name: 'アース＆ボタニカル系',
    colors: [
      { name: 'フォレストグリーン', value: '#15803d', textColor: '#ffffff', accentColor: '#fef08a' },
      { name: '抹茶グリーン', value: '#3f6212', textColor: '#ffffff', accentColor: '#fef08a' },
      { name: 'エメラルドディープ', value: '#065f46', textColor: '#ffffff', accentColor: '#6ee7b7' },
      { name: 'カフェモカ', value: '#78350f', textColor: '#ffffff', accentColor: '#fde68a' },
      { name: 'ウッドウォルナット', value: '#451a03', textColor: '#ffffff', accentColor: '#fcd34d' },
      { name: 'オリーブモス', value: '#4d7c0f', textColor: '#ffffff', accentColor: '#bef264' },
    ]
  },
  {
    id: 'dark',
    name: 'シック＆ダーク・高級感',
    colors: [
      { name: '漆黒ブラック', value: '#090d16', textColor: '#ffffff', accentColor: '#f59e0b' },
      { name: 'チャコールスレート', value: '#1e293b', textColor: '#ffffff', accentColor: '#38bdf8' },
      { name: 'ベルベットパープル', value: '#581c87', textColor: '#ffffff', accentColor: '#f472b6' },
      { name: 'ワインボルドー', value: '#4c0519', textColor: '#ffffff', accentColor: '#fbbf24' },
      { name: 'ダークエスプレッソ', value: '#24140e', textColor: '#ffffff', accentColor: '#d97706' },
      { name: 'ガンメタルスモーク', value: '#334155', textColor: '#ffffff', accentColor: '#e2e8f0' },
    ]
  }
];

export const GRADIENT_PRESETS = [
  {
    name: 'サンセットゴールド',
    value: 'linear-gradient(135deg, #f97316 0%, #dc2626 50%, #991b1b 100%)',
    textColor: '#ffffff',
    accentColor: '#fef08a'
  },
  {
    name: 'オーロラネオン',
    value: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
    textColor: '#ffffff',
    accentColor: '#fde047'
  },
  {
    name: 'シトラスフレッシュ',
    value: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    textColor: '#ffffff',
    accentColor: '#fef08a'
  },
  {
    name: 'パステルマカロン',
    value: 'linear-gradient(135deg, #fbcfe8 0%, #fed7aa 50%, #fef08a 100%)',
    textColor: '#701a75',
    accentColor: '#be185d'
  },
  {
    name: 'シルキーパールホワイト',
    value: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%)',
    textColor: '#0f172a',
    accentColor: '#0284c7'
  },
  {
    name: 'ミッドナイトラグジュアリー',
    value: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)',
    textColor: '#ffffff',
    accentColor: '#f59e0b'
  },
  {
    name: '桜サクラブロッサム',
    value: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)',
    textColor: '#831843',
    accentColor: '#db2777'
  },
  {
    name: 'ミントブリーズ',
    value: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
    textColor: '#14532d',
    accentColor: '#15803d'
  },
  {
    name: 'サイバーパンク',
    value: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #06b6d4 100%)',
    textColor: '#ffffff',
    accentColor: '#38bdf8'
  },
  {
    name: 'ロイヤルゴールド',
    value: 'linear-gradient(135deg, #18120c 0%, #451a03 50%, #78350f 100%)',
    textColor: '#ffffff',
    accentColor: '#fbbf24'
  },
  {
    name: 'オーシャンウェーブ',
    value: 'linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #38bdf8 100%)',
    textColor: '#ffffff',
    accentColor: '#fef08a'
  },
  {
    name: 'ラベンダーミスト',
    value: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)',
    textColor: '#581c87',
    accentColor: '#9333ea'
  },
  {
    name: 'フレイムアンバー',
    value: 'linear-gradient(135deg, #b91c1c 0%, #ea580c 50%, #f59e0b 100%)',
    textColor: '#ffffff',
    accentColor: '#fef08a'
  },
  {
    name: 'モカカプチーノ',
    value: 'linear-gradient(135deg, #fefce8 0%, #fed7aa 50%, #d97706 100%)',
    textColor: '#451a03',
    accentColor: '#9a3412'
  },
  {
    name: 'コズミックマゼンタ',
    value: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #be185d 100%)',
    textColor: '#ffffff',
    accentColor: '#f472b6'
  },
  {
    name: 'エメラルドフォレスト',
    value: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)',
    textColor: '#ffffff',
    accentColor: '#6ee7b7'
  },
  {
    name: 'ピーチソルベ',
    value: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
    textColor: '#9a3412',
    accentColor: '#ea580c'
  },
  {
    name: 'ディープパープルナイト',
    value: 'linear-gradient(135deg, #2e1065 0%, #3b0764 50%, #581c87 100%)',
    textColor: '#ffffff',
    accentColor: '#e879f9'
  },
  {
    name: 'ネオングローブルー',
    value: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #0369a1 100%)',
    textColor: '#ffffff',
    accentColor: '#38bdf8'
  },
  {
    name: 'トロピカルマンゴー',
    value: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 50%, #facc15 100%)',
    textColor: '#451a03',
    accentColor: '#dc2626'
  },
  {
    name: 'ローズゴールド',
    value: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%)',
    textColor: '#881337',
    accentColor: '#e11d48'
  },
  {
    name: 'ダークスレートプレミアム',
    value: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    textColor: '#ffffff',
    accentColor: '#38bdf8'
  },
  {
    name: 'ベルベットルビー',
    value: 'linear-gradient(135deg, #450a0a 0%, #881337 50%, #9f1239 100%)',
    textColor: '#ffffff',
    accentColor: '#fde047'
  },
  {
    name: 'アイスアクアフロー',
    value: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 50%, #a5f3fc 100%)',
    textColor: '#164e63',
    accentColor: '#0284c7'
  },
  {
    name: 'オリーブアース',
    value: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)',
    textColor: '#ffffff',
    accentColor: '#a3e635'
  },
  {
    name: 'トワイライトバイオレット',
    value: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
    textColor: '#ffffff',
    accentColor: '#a5b4fc'
  },
  {
    name: 'ハニーレモネード',
    value: 'linear-gradient(135deg, #fefce8 0%, #fef08a 50%, #fde047 100%)',
    textColor: '#713f12',
    accentColor: '#ca8a04'
  },
  {
    name: 'ボルドーワイン',
    value: 'linear-gradient(135deg, #2b0c14 0%, #4c0519 50%, #831843 100%)',
    textColor: '#ffffff',
    accentColor: '#facc15'
  },
  {
    name: 'モダンチタングレー',
    value: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)',
    textColor: '#ffffff',
    accentColor: '#f59e0b'
  },
  {
    name: 'プリズムオーラ',
    value: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0284c7 100%)',
    textColor: '#ffffff',
    accentColor: '#67e8f9'
  }
];
