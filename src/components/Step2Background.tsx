import React, { useState, useRef } from 'react';
import { SignageSlide, BackgroundAnimation, AppError, FRAME_OPTIONS } from '../types';
import { COLOR_CATEGORIES, GRADIENT_PRESETS } from '../data/colors';
import { 
  Sparkles, 
  Layers, 
  Upload, 
  Video, 
  Flame, 
  Check, 
  Trash2,
  Link as LinkIcon,
  Loader2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { validateAndOptimizeImage } from '../utils/imageOptimizer';
import { ErrorAlertModal } from './ErrorAlertModal';

interface Step2BackgroundProps {
  slide: SignageSlide;
  onChange: (updates: Partial<SignageSlide>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step2Background: React.FC<Step2BackgroundProps> = ({
  slide,
  onChange,
  onNext,
  onPrev,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('white-light');
  const [errorInfo, setErrorInfo] = useState<AppError | null>(null);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);



  // パターン選択肢
  const patternOptions = [
    { id: 'none', name: 'パターンなし' },
    { id: 'dots', name: '水玉ドット' },
    { id: 'grid', name: '方眼' },
    { id: 'stripes', name: 'ストライプ' },
    { id: 'wood', name: '木目' },
  ];

  // ユーザー指示：背景グラデーションと画像・動画を選択した場合、「背景の模様・テクスチャ」を選択不能に
  const isPatternDisabled = slide.bgType === 'gradient' || slide.bgType === 'image' || slide.bgType === 'video';

  const handleSelectColor = (colorItem: { value: string; textColor: string; accentColor: string }) => {
    onChange({
      bgType: 'solid',
      bgColor: colorItem.value,
      textColor: colorItem.textColor,
      accentColor: colorItem.accentColor,
    });
  };

  const handleSelectGradient = (grad: { value: string; textColor: string; accentColor: string }) => {
    onChange({
      bgType: 'gradient',
      bgGradient: grad.value,
      textColor: grad.textColor,
      accentColor: grad.accentColor,
      bgPattern: 'none',
      bgAnimation: slide.bgAnimation === 'none' ? 'aurora' : slide.bgAnimation,
    });
  };

  // 背景画像・動画アップロードハンドラー（自動リサイズ・圧縮、大容量エラー表示）
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      // 動画サイズ上限チェック（500MB）
      if (file.size > 500 * 1024 * 1024) {
        setErrorInfo({
          title: '動画サイズの上限超過エラー',
          reason: `動画ファイルの容量が ${(file.size / (1024 * 1024)).toFixed(1)}MB あり、最大上限（500MB）を超えています。`,
          solution: '500MB以下のMP4・WebM動画ファイルをご使用ください。',
          details: `ファイル名: ${file.name} / 検出サイズ: ${(file.size / (1024 * 1024)).toFixed(1)}MB`,
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const videoUrl = URL.createObjectURL(file);
      onChange({
        bgType: 'video',
        bgVideoUrl: videoUrl,
        bgPattern: 'none',
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      setIsOptimizing(true);
      try {
        const result = await validateAndOptimizeImage(file, {
          maxDimension: 1440,
          quality: 0.85,
        });

        if (!result.success || !result.dataUrl) {
          setErrorInfo(
            result.error || {
              title: '背景画像のアップロードに失敗しました',
              reason: '画像の読み込みまたは最適化処理中にエラーが発生しました。',
              solution: '別の画像ファイルを選択するか、画像URL指定をご利用ください。',
            }
          );
          return;
        }

        onChange({
          bgType: 'image',
          bgCustomImage: result.dataUrl,
          bgPattern: 'none',
        });
      } catch (err: unknown) {
        setErrorInfo({
          title: '予期せぬ背景画像処理エラー',
          reason: 'ブラウザで画像を最適化する処理中に例外エラーが発生しました。',
          solution: 'ブラウザを再読み込みするか、画像のファイルサイズを小さくしてお試しください。',
          details: err instanceof Error ? err.message : String(err),
        });
      } finally {
        setIsOptimizing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const handleClearMedia = () => {
    onChange({
      bgType: 'solid',
      bgCustomImage: undefined,
      bgVideoUrl: undefined,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-1 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <span>３ 背景を選ぶ</span>
        </h2>
        <button
          onClick={onNext}
          className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-full text-[10px] shadow-lg shadow-amber-500/20 transition-all flex items-center gap-0.5 cursor-pointer"
        >
          <span>次へ</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>


      {/* 独立した写真・動画添付ボタン */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => !isOptimizing && fileInputRef.current?.click()}
          disabled={isOptimizing}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 ${
            slide.bgType === 'image' || slide.bgType === 'video'
              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-900 shadow-amber-500/40'
              : 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-slate-950 ring-2 ring-amber-400/80 shadow-amber-500/30'
          }`}
        >
          {isOptimizing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>画像を最適化中...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 stroke-[3]" />
              <span>写真・動画を添付（端末から選択）</span>
            </>
          )}
        </button>

        {(slide.bgCustomImage || slide.bgVideoUrl) && (
          <button
            type="button"
            onClick={handleClearMedia}
            title="添付メディアを解除"
            className="px-3 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">添付解除</span>
          </button>
        )}
      </div>

      {/* 添付中のメディアプレビュー */}
      {(slide.bgCustomImage || slide.bgVideoUrl) && (
        <div className="p-2.5 bg-slate-900/90 rounded-xl border border-amber-500/30 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {slide.bgType === 'video' ? (
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shrink-0">
                <Video className="w-5 h-5" />
              </div>
            ) : (
              <img
                src={slide.bgCustomImage}
                alt="背景プレビュー"
                className="w-10 h-10 rounded-lg object-cover border border-amber-500/40 shrink-0"
              />
            )}
            <div className="min-w-0">
              <div className="text-xs font-black text-slate-100 truncate">
                {slide.bgType === 'video' ? 'アップロード動画を再生中' : 'アップロード画像を背景に設定中'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            変更する
          </button>
        </div>
      )}

      {/* 非表示のファイルインプット */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        disabled={isOptimizing}
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* カラー／グラデーション切り替えタブ（下の段） */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5 overflow-x-auto">
        <button
          onClick={() => {
            onChange({
              bgType: 'solid',
              bgColor: '#ffffff',
              textColor: '#0f172a',
              accentColor: '#0284c7',
              bgGradient: undefined,
              bgCustomImage: undefined,
              bgVideoUrl: undefined,
            });
            setActiveCategory('white-light');
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            slide.bgType === 'solid'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          単色カラー
        </button>
        <button
          onClick={() => {
            const firstGrad = GRADIENT_PRESETS[0];
            onChange({
              bgType: 'gradient',
              bgGradient: firstGrad.value,
              textColor: firstGrad.textColor,
              accentColor: firstGrad.accentColor,
              bgPattern: 'none',
              bgCustomImage: undefined,
              bgVideoUrl: undefined,
              bgAnimation: slide.bgAnimation === 'none' ? 'aurora' : slide.bgAnimation,
            });
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            slide.bgType === 'gradient'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          グラデーション
        </button>
      </div>

      {/* 単色カラー選択時 */}
      {slide.bgType === 'solid' && (
        <div className="space-y-3.5">
          <div>
            <div className="text-xs font-bold text-slate-300 mb-2">色系統（グループ別）</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COLOR_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-2 rounded-xl text-left border text-xs font-bold transition-all flex flex-col justify-between cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 選択中のカテゴリーのカラーバリエーション */}
          {(() => {
            const currentCat = COLOR_CATEGORIES.find((c) => c.id === activeCategory) || COLOR_CATEGORIES[0];
            return (
              <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-200">
                    {currentCat.name} のカラーバリエーション
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {currentCat.colors.map((c) => {
                    const isSelected = slide.bgColor === c.value && slide.bgType === 'solid';
                    return (
                      <button
                        key={c.value}
                        onClick={() => handleSelectColor(c)}
                        className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'ring-2 ring-amber-400 border-amber-400 shadow-md bg-slate-750'
                            : 'border-slate-750 hover:border-slate-600 bg-slate-800/80'
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-lg border border-slate-600 shadow-inner shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: c.value }}
                        >
                          {isSelected && (
                            <Check
                              className="w-3.5 h-3.5"
                              style={{ color: c.textColor }}
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-200">{c.name}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* グラデーション選択時 */}
      {slide.bgType === 'gradient' && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-300">グラデーションプリセット</div>
          <div className="grid grid-cols-2 gap-2.5">
            {GRADIENT_PRESETS.map((grad) => {
              const isSelected = slide.bgGradient === grad.value && slide.bgType === 'gradient';
              return (
                <button
                  key={grad.name}
                  onClick={() => handleSelectGradient(grad)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-amber-400 border-amber-400 shadow-md bg-slate-700'
                      : 'border-slate-700 hover:border-slate-500 bg-slate-800/80'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-lg shadow-inner border border-white/20 shrink-0 flex items-center justify-center"
                    style={{ background: grad.value }}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-200 truncate">{grad.name}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 画像・動画アップロード＆URL直接指定 */}
      {(slide.bgType === 'image' || slide.bgType === 'video') && (
        <div className="space-y-4">
          <div
            onClick={() => !isOptimizing && fileInputRef.current?.click()}
            className={`border-2 border-dashed p-5 rounded-2xl text-center transition-all ${
              isOptimizing
                ? 'border-amber-400 bg-amber-500/10 cursor-wait'
                : 'border-slate-700 hover:border-amber-400 bg-slate-900/60 cursor-pointer group'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              disabled={isOptimizing}
              onChange={handleFileUpload}
              className="hidden"
            />
            {isOptimizing ? (
              <div className="py-2 space-y-2">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-amber-400" />
                <div className="text-xs font-bold text-amber-300">
                  高解像度画像をサイネージ用に自動リサイズ・最適化中...
                </div>
                <div className="text-[10px] text-slate-400">
                  ブラウザの保存上限に合わせて圧縮しています。少々お待ちください。
                </div>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 mx-auto rounded-full bg-slate-800 group-hover:bg-amber-500/20 text-slate-300 group-hover:text-amber-300 flex items-center justify-center mb-1.5 transition-all">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-200 mb-0.5">
                  クリックして画像または動画を選択
                </div>
              </>
            )}
          </div>

          {(slide.bgCustomImage || slide.bgVideoUrl) && (
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0">
                {slide.bgType === 'video' ? (
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <Video className="w-4 h-4" />
                  </div>
                ) : (
                  <img
                    src={slide.bgCustomImage}
                    alt="背景プレビュー"
                    className="w-9 h-9 rounded-lg object-cover border border-slate-700 shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-200 truncate">
                    {slide.bgType === 'video' ? 'アップロード動画を背景再生中' : 'アップロード画像を背景に設定中'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleClearMedia}
                className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                解除
              </button>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
              カスタム画像URL・動画URLを直接指定
            </label>
            <input
              type="text"
              value={slide.bgCustomImage || slide.bgVideoUrl || ''}
              onChange={(e) => {
                const val = e.target.value;
                const isVid = val.endsWith('.mp4') || val.endsWith('.webm');
                onChange({
                  bgType: isVid ? 'video' : 'image',
                  bgCustomImage: isVid ? undefined : val,
                  bgVideoUrl: isVid ? val : undefined,
                  bgPattern: 'none',
                });
              }}
              placeholder="https://example.com/background.jpg または .mp4"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      )}

      {/* 背景の模様・テクスチャ */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-xs font-bold text-slate-200">背景の模様・テクスチャ</h3>
          {isPatternDisabled && (
            <span className="text-[10px] text-amber-400 font-medium">
              ※単色カラー選択時のみ利用可能
            </span>
          )}
        </div>

        <div className={`grid grid-cols-3 sm:grid-cols-5 gap-2 transition-opacity ${
          isPatternDisabled ? 'opacity-35 pointer-events-none' : 'opacity-100'
        }`}>
          {patternOptions.map((pat) => (
            <button
              key={pat.id}
              disabled={isPatternDisabled}
              onClick={() => onChange({ bgPattern: pat.id })}
              className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                slide.bgPattern === pat.id && !isPatternDisabled
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              {pat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 外枠フレーム */}
      <div className="pt-2">
        <h3 className="text-xs font-bold text-slate-300 mb-2">看板フレーム枠</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {FRAME_OPTIONS.map((f) => {
            const isSelected = slide.frame === f.id;
            return (
              <button
                key={f.id}
                onClick={() => onChange({ frame: f.id })}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 font-bold text-amber-300 shadow-sm'
                    : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: f.color }}
                  />
                  <span className="text-xs">{f.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>





      {/* ステップ移動 */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={onPrev}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs sm:text-sm border border-slate-700 cursor-pointer"
        >
          ← ２ デザイン選択画面 に戻る
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          ４ 書体 へ進む →
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
