import React, { useState, useMemo } from 'react';
import { INDUSTRY_IMAGE_PRESETS, IndustryImagePreset } from '../data/industryImages';
import { X, Search, Sparkles, Check, Image as ImageIcon } from 'lucide-react';

interface IndustryImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string, title?: string) => void;
  targetType: 'banner' | 'item';
  itemIndex?: number;
}

export const IndustryImagePickerModal: React.FC<IndustryImagePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  targetType,
  itemIndex,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPresets = useMemo(() => {
    return INDUSTRY_IMAGE_PRESETS.filter((preset) => {
      const matchCat =
        selectedCategory === 'all' || preset.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        preset.industry.toLowerCase().includes(q) ||
        preset.bannerTitle.toLowerCase().includes(q) ||
        preset.itemImages.some((it) => it.title.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-750 w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* ヘッダー */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
                40業種のプリセット画像から選ぶ
                <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  {targetType === 'banner' ? '看板画像に設定' : `商品${(itemIndex ?? 0) + 1}の画像に設定`}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                高画質・商用利用可能な業種別おすすめ写真からワンクリックで適用できます
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 検索＆カテゴリタブ */}
        <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-900/90 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="業種やキーワードで検索（例: カフェ、焼肉、エステ、花屋...）"
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-750 rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'すべて (40業種)' },
              { id: 'food', label: '飲食・カフェ・和食' },
              { id: 'beauty', label: '美容・サロン・エステ' },
              { id: 'medical', label: '医療・整体・健康' },
              { id: 'service', label: '教育・サービス・修理' },
              { id: 'retail', label: '小売・アパレル・生花' },
              { id: 'lifestyle', label: 'ホテル・ジム・趣味' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 画像グリッド */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 scrollbar-thin">
          {filteredPresets.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm font-bold">該当する業種が見つかりませんでした</p>
              <p className="text-xs text-slate-500 mt-1">別のキーワードでお試しください</p>
            </div>
          ) : (
            filteredPresets.map((preset) => (
              <div
                key={preset.id}
                className="bg-slate-850 border border-slate-800 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-750/70 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <h4 className="text-sm font-black text-slate-100">{preset.industry}</h4>
                    <span className="text-[11px] text-slate-400">({preset.bannerTitle})</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* 看板向きメイン写真 */}
                  <div className="group relative rounded-xl overflow-hidden border border-slate-750 bg-black aspect-video flex flex-col justify-end">
                    <img
                      src={preset.bannerImage}
                      alt={preset.bannerTitle}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                    <div className="relative p-2 z-10 flex flex-col justify-between h-full">
                      <span className="self-start text-[9px] font-black bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded shadow">
                        メイン・看板用
                      </span>
                      <div>
                        <p className="text-[10px] font-bold text-white truncate drop-shadow">
                          {preset.bannerTitle}
                        </p>
                        <button
                          onClick={() => {
                            onSelectImage(preset.bannerImage, preset.bannerTitle);
                            onClose();
                          }}
                          className="mt-1.5 w-full py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-[10px] font-black transition-all cursor-pointer shadow flex items-center justify-center gap-1 active:scale-95"
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                          この画像を使う
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 商品向け写真リスト */}
                  {preset.itemImages.map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative rounded-xl overflow-hidden border border-slate-750 bg-black aspect-video flex flex-col justify-end"
                    >
                      <img
                        src={item.url}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                      <div className="relative p-2 z-10 flex flex-col justify-between h-full">
                        <span className="self-start text-[9px] font-bold bg-slate-900/80 text-slate-200 border border-white/20 px-1.5 py-0.5 rounded shadow">
                          商品・メニュー
                        </span>
                        <div>
                          <p className="text-[10px] font-bold text-white truncate drop-shadow">
                            {item.title}
                          </p>
                          <button
                            onClick={() => {
                              onSelectImage(item.url, item.title);
                              onClose();
                            }}
                            className="mt-1.5 w-full py-1 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 rounded-lg text-[10px] font-black transition-all cursor-pointer shadow flex items-center justify-center gap-1 border border-slate-700 active:scale-95"
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                            この画像を使う
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* フッター */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-850 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            全40業種・120点以上の厳選高画質フォトをいつでも自由にお使いいただけます
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-700"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
