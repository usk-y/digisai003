import { FontFamily, TextTarget } from '../types';

export interface FontOption {
  family: FontFamily;
  name: string;
  sample: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { family: 'Noto Sans JP', name: '標準ゴシック', sample: '見やすく自然な定番書体' },
  { family: 'M PLUS Rounded 1c', name: '丸ゴシック', sample: '親しみやすく優しい丸み' },
  { family: 'RocknRoll One', name: '特太インパクト', sample: '目立つ力強いポップ文字' },
  { family: 'Dela Gothic One', name: '極太デラゴシック', sample: '超重量級のド迫力ゴシック' },
  { family: 'Shippori Mincho', name: 'しっぽり明朝', sample: '高級感と品格の上質明朝' },
  { family: 'Zen Maru Gothic', name: 'ゼン丸ゴシック', sample: 'すっきり端正な現代風丸文字' },
  { family: 'Kaisei Decol', name: '解星デコール', sample: '華やかでおしゃれなモダン文字' },
  { family: 'Zen Antique', name: 'アンティーク明朝', sample: 'クラシックでレトロな佇まい' },
  { family: 'Klee One', name: 'クレー教科書体', sample: '手書きの温もりと凛とした美しさ' },
  { family: 'Yuji Boku', name: '力強い毛筆書体', sample: '墨の濃淡が映える和の筆文字' },
  { family: 'Reggae One', name: 'レゲエ・躍動', sample: 'リズム感あふれる元気な書体' },
  { family: 'Potta One', name: 'ポッタ・ぷっくり', sample: 'ぷっくり愛嬌のある太文字' },
  { family: 'Stick', name: 'スティック直線', sample: '幾何学的でクールな直線美' },
  { family: 'Yomogi', name: 'よもぎ手書き', sample: 'ナチュラルで軽快な手書き風' },
  { family: 'DotGothic16', name: 'レトロドット', sample: '80年代ゲーム風のドット文字' },
];

export const TARGET_NAME_MAP: Record<TextTarget, string> = {
  all: '看板全体',
  headline: '大見出し',
  subheadline: 'サブ説明文',
  shopName: '店舗名',
  categoryBadge: '種類・営業時間',
  menu: 'メニュー商品',
  footer: '足元の文字',
};
