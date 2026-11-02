import React, { useState } from 'react';
import { SignageFolder, SignageSlide, AppError } from '../types';
import { SIGNAGE_TEMPLATES } from '../data/templates';
import { ErrorAlertModal } from './ErrorAlertModal';
import { 
  FolderPlus, 
  FolderOpen, 
  Play, 
  Trash2, 
  Copy, 
  Edit3, 
  Clock, 
  Layers, 
  Sparkles, 
  Store,
  ChevronRight,
  Tv
} from 'lucide-react';

interface FolderManagerViewProps {
  folders: SignageFolder[];
  onOpenFolder: (folder: SignageFolder) => void;
  onCreateFolder: (name: string, templateSlide?: Partial<SignageSlide>) => void;
  onDeleteFolder: (folderId: string) => void;
  onDuplicateFolder: (folderId: string) => void;
  onRenameFolder: (folderId: string, newName: string) => void;
  onPlayFullscreenFolder: (folder: SignageFolder) => void;
}

export const FolderManagerView: React.FC<FolderManagerViewProps> = ({
  folders,
  onOpenFolder,
  onCreateFolder,
  onDeleteFolder,
  onDuplicateFolder,
  onRenameFolder,
  onPlayFullscreenFolder,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [errorInfo, setErrorInfo] = useState<AppError | null>(null);

  const maxFolders = 20;
  const isFull = folders.length >= maxFolders;

  const handleStartCreate = (defaultName?: string) => {
    if (isFull) {
      setErrorInfo({
        title: '看板フォルダ数の上限到達',
        reason: '保存可能な看板フォルダの上限（最大20フォルダ）に達しています。',
        solution: '不要になった既存のフォルダの「削除」ボタンを押して空き枠を作成してから、新規作成を行ってください。',
      });
      return;
    }
    setFolderName(defaultName || `看板フォルダ ${folders.length + 1}`);
    setShowCreateModal(true);
  };

  const handleConfirmCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFull) {
      setErrorInfo({
        title: '看板フォルダ数の上限到達',
        reason: '看板フォルダの上限（20フォルダ）に達しているため作成できません。',
        solution: '不要なフォルダを削除して空き枠を確保してください。',
      });
      return;
    }
    const name = folderName.trim() || `看板フォルダ ${folders.length + 1}`;
    onCreateFolder(name, SIGNAGE_TEMPLATES[0].slide);
    setShowCreateModal(false);
    setFolderName('');
  };

  const handleStartRename = (folder: SignageFolder) => {
    setEditingFolderId(folder.id);
    setEditNameValue(folder.name);
  };

  const handleSaveRename = (folderId: string) => {
    if (editNameValue.trim()) {
      onRenameFolder(folderId, editNameValue.trim());
    }
    setEditingFolderId(null);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-3 py-3 sm:px-4 sm:py-4 space-y-3">
      {/* 画面ヘッダー（コンパクト設計） */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 px-4 py-2.5 sm:px-5 sm:py-3 shadow-xl backdrop-blur-sm flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <FolderOpen className="w-3.5 h-3.5" />
            <span>看板フォルダ管理 ({folders.length}/20)</span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            {folders.length === 0 ? 'フォルダ未作成' : `残り空き枠: ${20 - folders.length}`}
          </span>
        </div>

        <button
          onClick={() => handleStartCreate()}
          disabled={isFull}
          className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
            isFull
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 active:scale-95'
          }`}
        >
          <FolderPlus className="w-4 h-4 stroke-[2.5]" />
          <span>新規看板フォルダを作成 {isFull ? '(上限20件)' : ''}</span>
        </button>
      </div>

      {/* フォルダ1〜20スロットグリッド（コンパクト設計） */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="text-xs font-bold text-slate-400 flex items-center gap-2">
            <span>フォルダ一覧（全20枠）</span>
            <span className="text-[11px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              {folders.length}/20枠 使用中
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2.5 sm:gap-3">
          {folders.map((folder, index) => {
            const slotNumber = index + 1;
            const firstSlide = folder.slides[0];
            const totalSec = folder.slides.reduce((acc, s) => acc + (s.duration || 10), 0);

            return (
              <div
                key={folder.id}
                className="bg-slate-900/95 rounded-xl border border-slate-800 hover:border-amber-500/70 p-2 sm:p-2.5 flex flex-col justify-between transition-all duration-200 shadow-lg group hover:shadow-amber-500/10 relative overflow-hidden"
              >
                {/* スロット番号バッジ & 更新日 */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-xs border border-amber-300">
                    フォルダ {slotNumber}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono truncate ml-1">
                    {folder.updatedAt}
                  </span>
                </div>

                {/* フォルダ名表示・編集 */}
                <div className="mb-1.5">
                  {editingFolderId === folder.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={editNameValue}
                        onChange={(e) => setEditNameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename(folder.id);
                          if (e.key === 'Escape') setEditingFolderId(null);
                        }}
                        autoFocus
                        className="w-full px-2 py-0.5 bg-slate-950 border border-amber-400 rounded-lg text-xs text-white focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveRename(folder.id)}
                        className="px-2 py-0.5 bg-amber-500 text-slate-950 rounded-lg text-[11px] font-bold shrink-0 cursor-pointer"
                      >
                        保存
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between group/title min-w-0">
                      <h3
                        onClick={() => onOpenFolder(folder)}
                        className="font-black text-xs sm:text-sm text-white truncate cursor-pointer hover:text-amber-400 transition-colors"
                        title={folder.name}
                      >
                        {folder.name}
                      </h3>
                      <button
                        onClick={() => handleStartRename(folder)}
                        className="opacity-0 group-hover/title:opacity-100 p-0.5 text-slate-400 hover:text-white transition-opacity cursor-pointer shrink-0 ml-1"
                        title="名前を変更"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 看板プレビューミニサムネイル（コンパクト比率） */}
                <div
                  onClick={() => onOpenFolder(folder)}
                  className="w-full h-24 sm:h-28 rounded-lg mb-2 p-2 flex flex-col justify-between border shadow-inner cursor-pointer relative overflow-hidden transition-transform group-hover:scale-[1.01]"
                  style={{
                    backgroundColor: firstSlide?.bgColor?.startsWith('linear-gradient') ? undefined : (firstSlide?.bgColor || '#1e293b'),
                    backgroundImage: firstSlide?.bgType === 'image' && firstSlide?.bgCustomImage
                      ? `url(${firstSlide.bgCustomImage})`
                      : firstSlide?.bgColor?.startsWith('linear-gradient')
                      ? firstSlide.bgColor
                      : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: firstSlide?.textColor || '#ffffff',
                    borderColor: `${firstSlide?.textColor || '#ffffff'}30`,
                    fontFamily: `'${firstSlide?.fontFamily || 'Noto Sans JP'}', sans-serif`,
                  }}
                >
                  {/* 店舗名 */}
                  <div
                    className="text-[8px] sm:text-[9px] font-bold opacity-85 truncate"
                    style={{
                      textAlign: firstSlide?.shopNameAlign || 'center',
                    }}
                  >
                    {firstSlide?.shopName || '店舗看板'}
                  </div>

                  {/* 見出し */}
                  <div
                    className="text-[10px] sm:text-[11px] font-black leading-tight line-clamp-2 my-auto text-center"
                    style={{
                      textAlign: firstSlide?.headlineAlign || 'center',
                    }}
                  >
                    {firstSlide?.headline || '看板プレビュー'}
                  </div>

                  {/* スライド枚数と秒数 */}
                  <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-bold pt-0.5 border-t border-white/20">
                    <span className="flex items-center gap-0.5">
                      <Layers className="w-2.5 h-2.5" />
                      {folder.slides.length}枚
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {totalSec}秒
                    </span>
                  </div>
                </div>

                {/* アクションボタングループ（コンパクト1行デザイン） */}
                <div className="flex items-center gap-1 pt-1.5 border-t border-slate-800">
                  <button
                    onClick={() => onOpenFolder(folder)}
                    className="flex-1 py-1 px-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-lg text-[11px] sm:text-xs flex items-center justify-center gap-0.5 transition-all cursor-pointer shadow-xs active:scale-95"
                    title="看板を編集"
                  >
                    <span>編集</span>
                    <ChevronRight className="w-3 h-3 stroke-[2.5]" />
                  </button>

                  <button
                    onClick={() => onPlayFullscreenFolder(folder)}
                    className="py-1 px-1.5 bg-slate-800 hover:bg-slate-750 text-emerald-400 border border-slate-700 hover:border-emerald-500/40 rounded-lg text-[11px] font-bold flex items-center justify-center gap-0.5 cursor-pointer transition-colors"
                    title="サイネージ配信（最初の看板からスタート）"
                  >
                    <Tv className="w-3 h-3" />
                    <span>配信</span>
                  </button>

                  <button
                    onClick={() => onDuplicateFolder(folder.id)}
                    disabled={isFull}
                    className="p-1 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                    title="このフォルダを複製"
                  >
                    <Copy className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => setDeleteTargetId(folder.id)}
                    className="p-1 bg-slate-800 hover:bg-rose-500/20 text-rose-400 border border-slate-700 hover:border-rose-500/50 rounded-lg transition-colors cursor-pointer"
                    title="削除"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}

          {!isFull && (
            <div
              onClick={() => handleStartCreate()}
              className="bg-white/90 hover:bg-white rounded-xl border-2 border-dashed border-slate-300 hover:border-amber-500 p-2 sm:p-3 flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer group min-h-[175px] sm:min-h-[195px] shadow-xs hover:shadow-md"
            >
              <div className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                枠 {folders.length + 1}
              </div>

              <div className="w-9 h-9 rounded-xl bg-amber-500/10 group-hover:bg-amber-500 text-amber-600 group-hover:text-slate-950 flex items-center justify-center transition-all group-hover:scale-110 shadow-xs">
                <FolderPlus className="w-4 h-4 stroke-[2]" />
              </div>

              <div className="text-[11px] font-black text-slate-800 group-hover:text-amber-700 transition-colors">
                ＋ 新規作成
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 新規フォルダ作成モーダル */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">新規看板フォルダを作成</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                閉じる
              </button>
            </div>

            <form onSubmit={handleConfirmCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  フォルダ名
                </label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="例: カフェ春メニュー看板、店頭セール看板など"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  autoFocus
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  作成して編集を開始
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 削除確認ポップアップ (はい・いいえ) */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-black text-slate-100 text-center">
              削除しますか？
            </h3>
            <p className="text-xs text-slate-400 text-center">
              このフォルダデータを削除すると復元できません。本当に削除しますか？
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-xl text-xs border border-slate-700 transition-all cursor-pointer"
              >
                いいえ
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteFolder(deleteTargetId);
                  setDeleteTargetId(null);
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-rose-600/20"
              >
                はい
              </button>
            </div>
          </div>
        </div>
      )}

      {/* エラー表示モーダル（理由と解決方法を明示） */}
      <ErrorAlertModal
        error={errorInfo}
        onClose={() => setErrorInfo(null)}
      />
    </div>
  );
};
