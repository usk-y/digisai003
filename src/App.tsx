import React, { useState, useEffect, useRef } from 'react';
import { StepNumber, SignageFolder, AppError, SignageSlide } from './types';
import { WIZARD_STEPS } from './data/wizardSteps';
import { StepNavigation } from './components/StepNavigation';
import { SignageWizard } from './components/SignageWizard';
import { PreviewPanel } from './components/PreviewPanel';
import { FullscreenPlayer } from './components/FullscreenPlayer';
import { ErrorAlertModal } from './components/ErrorAlertModal';
import { useOrientation } from './hooks/useOrientation';
import { useSignageFolders } from './hooks/useSignageFolders';
import { useSignageEditor } from './hooks/useSignageEditor';
import { 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Edit3, 
  MonitorPlay
} from 'lucide-react';

export default function App() {
  // グローバルエラー管理（原因と解決方法を明示）
  const [globalError, setGlobalError] = useState<AppError | null>(null);

  // 画面の向き＆デバイス判定フック
  const { windowWidth } = useOrientation();

  // 現在のステップ番号（WIZARD_STEPSの総数に連動）
  const [currentStepNumber, setCurrentStepNumber] = useState<StepNumber>(1);
  const totalSteps = WIZARD_STEPS.length;

  // 全画面サイネージプレイヤー状態
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [fullscreenSlides, setFullscreenSlides] = useState<SignageSlide[]>([]);

  // スマホ縦画面時専用の切り替えタブ（'edit' | 'preview'）
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');

  // フォルダ管理カスタムフック
  const {
    folders,
    activeFolderId,
    activeFolder,
    setActiveFolderId,
    createFolder,
    deleteFolder,
    duplicateFolder,
    renameFolder,
    saveFolderSlides,
  } = useSignageFolders(setGlobalError);

  // 看板スライド編集カスタムフック
  const {
    slides,
    currentSlide,
    currentSlideIndex,
    setCurrentSlideIndex,
    isPlaying,
    setIsPlaying,
    replayKey,
    replayAnimation,
    updateCurrentSlide,
    applyTemplate,
    addSlide,
    deleteSlide,
    duplicateSlide,
    selectedTextTarget,
    setSelectedTextTarget,
    applyQuickFont,
    loadSlides,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useSignageEditor(setGlobalError);

  // 初回マウント時：選択中フォルダのスライドをエディタに同期ロード
  useEffect(() => {
    if (activeFolder && activeFolder.slides.length > 0) {
      loadSlides(activeFolder.slides);
    }
  }, []);

  // 1つ変えたら自動保存（Auto-save）
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const isInitialMount = useRef(true);
  const lastSavedJsonRef = useRef<string>('');
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const currentJson = JSON.stringify(slides);

    // 初回マウント時はスライドの初期JSONを記録して自動保存をスキップ
    if (isInitialMount.current) {
      isInitialMount.current = false;
      lastSavedJsonRef.current = currentJson;
      return;
    }

    // 内容が変わっていなければ自動保存しない
    if (currentJson === lastSavedJsonRef.current) {
      return;
    }

    if (activeFolderId) {
      setIsSaving(true);
      setIsSaved(false);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);

      const timer = setTimeout(() => {
        saveFolderSlides(activeFolderId, slides);
        lastSavedJsonRef.current = currentJson;
        setIsSaving(false);
        setIsSaved(true);

        savedTimerRef.current = setTimeout(() => {
          setIsSaved(false);
        }, 1200);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [slides, activeFolderId, saveFolderSlides]);

  // 手動上書き保存ハンドラ
  const handleSaveOverwrite = () => {
    if (!activeFolderId) return;
    const success = saveFolderSlides(activeFolderId, slides);
    if (success) {
      lastSavedJsonRef.current = JSON.stringify(slides);
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 1200);
    }
  };

  // 新規フォルダ作成
  const handleCreateFolder = (name: string, templateSlide?: Partial<SignageSlide>) => {
    const result = createFolder(name, templateSlide);
    if (result) {
      lastSavedJsonRef.current = JSON.stringify([result.initialSlide]);
      setIsSaving(false);
      setIsSaved(false);
      loadSlides([result.initialSlide]);
      setCurrentSlideIndex(0);
      setCurrentStepNumber(2);
    }
  };

  // フォルダを開いて編集
  const handleOpenFolder = (folder: SignageFolder) => {
    lastSavedJsonRef.current = JSON.stringify(folder.slides);
    setIsSaving(false);
    setIsSaved(false);
    setActiveFolderId(folder.id);
    loadSlides(folder.slides);
    setCurrentSlideIndex(0);
    setCurrentStepNumber(2);
  };

  // フォルダ削除ハンドラ（アクティブフォルダ削除時は確実にスライドを同期破棄または切り替え）
  const handleDeleteFolder = (folderId: string) => {
    deleteFolder(folderId);
    if (activeFolderId === folderId) {
      const remainingFolders = folders.filter((f) => f.id !== folderId);
      if (remainingFolders.length > 0) {
        const nextFolder = remainingFolders[0];
        setActiveFolderId(nextFolder.id);
        loadSlides(nextFolder.slides);
        setCurrentSlideIndex(0);
        lastSavedJsonRef.current = JSON.stringify(nextFolder.slides);
      } else {
        setActiveFolderId(null);
        loadSlides([]);
        setFullscreenSlides([]);
        setCurrentSlideIndex(0);
        lastSavedJsonRef.current = '';
        setCurrentStepNumber(1);
      }
    }
  };

  // 全画面再生
  const handleOpenFullscreen = () => {
    if (!activeFolderId || slides.length === 0) return;
    setFullscreenSlides(slides);
    setIsFullscreen(true);
  };

  // 前のページへ進む
  const handlePrevStep = () => {
    setCurrentStepNumber((prev) => Math.max(1, prev - 1) as StepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 次のページへ進む
  const handleNextStep = () => {
    if (currentStepNumber === 1 && !activeFolderId) {
      // 看板未作成・未選択時は進めない
      return;
    }
    if (currentStepNumber < totalSteps) {
      setCurrentStepNumber((prev) => (prev + 1) as StepNumber);
    } else {
      // 最終ステップ（14）で「全画面で再生」
      handleOpenFullscreen();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // レスポンシブ幅判定：PCは大画面2ペイン、スマホはタブ切替または縦並び
  const isWideLayout = windowWidth >= 1024;

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 flex flex-col font-sans select-none">
      {/* 
        上部ヘッダー：
        ・左上看板ボタンから○枚目を直接選べるドロップダウン
        ・常に最上部に表示される Undo/Redo 矢印ボタン
        ・ただの数字（1, 2, 3... 14）の横スライドナビゲーション（看板作成前は2〜14番は選択不可）
      */}
      <StepNavigation
        currentStepNumber={currentStepNumber}
        totalSteps={totalSteps}
        onSelectStepNumber={(num) => {
          if (!activeFolderId && num > 1) return;
          setCurrentStepNumber(num);
        }}
        onOpenFullscreen={handleOpenFullscreen}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onSaveOverwrite={handleSaveOverwrite}
        isSaving={isSaving}
        isSaved={isSaved}
        currentSlideIndex={currentSlideIndex}
        slidesCount={slides.length}
        isFolderReady={!!activeFolderId && slides.length > 0}
        onSelectSlideIndex={setCurrentSlideIndex}
        onAddSlide={addSlide}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onDeleteSlide={deleteSlide}
        onDuplicateSlide={duplicateSlide}
      />

      {/* 
        スマホ画面用：項目編集といまの看板プレビューの切り替えバー
      */}
      {!isWideLayout && (
        <div className="bg-slate-50 border-b border-slate-200 px-3 py-1.5 flex items-center justify-center shrink-0">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300 shadow-xs">
            <button
              onClick={() => setMobileTab('edit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                mobileTab === 'edit'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>項目を選ぶ</span>
            </button>
            <button
              onClick={() => setMobileTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                mobileTab === 'preview'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>いまの看板を見る</span>
            </button>
          </div>
        </div>
      )}

      {/* 
        メインコンテンツエリア：
        PCでは左側に「1ページ1項目の選択画面」、右側に「リアルタイムプレビュー」
        スマホでは選択したタブを表示
      */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-5 pb-28 flex gap-6 overflow-hidden">
        {/* 左側：1ページ1項目の選択画面（SignageWizard） */}
        {(isWideLayout || mobileTab === 'edit') && (
          <div className="flex-1 overflow-y-auto pr-1 pb-16">
            <SignageWizard
              currentStepNumber={currentStepNumber}
              currentSlide={currentSlide}
              currentSlideIndex={currentSlideIndex}
              slides={slides}
              folders={folders}
              activeFolderId={activeFolderId}
              activeFolderName={activeFolder?.name}
              onUpdateSlide={updateCurrentSlide}
              onApplyTemplate={applyTemplate}
              onAddSlide={addSlide}
              onDeleteSlide={deleteSlide}
              onDuplicateSlide={duplicateSlide}
              onSelectSlideIndex={setCurrentSlideIndex}
              onCreateFolder={handleCreateFolder}
              onDeleteFolder={handleDeleteFolder}
              onDuplicateFolder={duplicateFolder}
              onOpenFolder={handleOpenFolder}
              onOpenFullscreen={handleOpenFullscreen}
              onGoToStep={(num) => setCurrentStepNumber(num)}
              onError={(err) => setGlobalError(err)}
            />
          </div>
        )}

        {/* 右側：看板プレビュー（PCでは常時、スマホではプレビュータブ時） */}
        {(isWideLayout || mobileTab === 'preview') && (
          <div className={`${isWideLayout ? 'w-[380px] xl:w-[440px]' : 'w-full'} h-full flex flex-col shrink-0`}>
            <div className="sticky top-16 h-[calc(100vh-140px)] flex flex-col">
              {activeFolderId ? (
                <PreviewPanel
                  currentSlide={currentSlide}
                  slidesCount={slides.length}
                  currentSlideIndex={currentSlideIndex}
                  onSelectSlideIndex={setCurrentSlideIndex}
                  replayKey={replayKey}
                  onReplayAnimation={replayAnimation}
                  selectedTextTarget={selectedTextTarget}
                  onSelectTextTarget={setSelectedTextTarget}
                  onApplyQuickFont={applyQuickFont}
                />
              ) : (
                <div className="flex-1 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center">
                    <Eye className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-black text-slate-500">
                    看板が選択されていません
                  </span>
                  <p className="text-xs text-slate-400">
                    左側のフォームから看板を作成または選択すると、ここにプレビューが表示されます。
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 
        最下部固定フッターバー（シニア向け）：
        「ページ ◯ / 14」の大きな表示 ＆ 「← まえへ」「つぎへ →」の大きなボタン
      */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-slate-200 shadow-xl px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* まえへ ボタン */}
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStepNumber === 1}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-black text-sm sm:text-base flex items-center gap-1.5 transition-all cursor-pointer border ${
              currentStepNumber === 1
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-xs active:scale-95'
            }`}
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            <span>まえへ</span>
          </button>

          {/* 中央：大きなページ数表示 */}
          <div className="text-center">
            <span className="text-xs sm:text-sm font-bold text-slate-500 block">
              現在の進み具合
            </span>
            <div className="text-lg sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
              ページ <span className="text-blue-600 text-xl sm:text-3xl">{currentStepNumber}</span> / {totalSteps}
            </div>
          </div>

          {/* つぎへ ボタン */}
          <button
            type="button"
            onClick={handleNextStep}
            disabled={currentStepNumber === 1 && !activeFolderId}
            title={currentStepNumber === 1 && !activeFolderId ? '看板の名前を入力して新しく作成してください' : ''}
            className={`px-5 sm:px-7 py-2.5 sm:py-3 rounded-2xl font-black text-sm sm:text-base flex items-center gap-1.5 transition-all shadow-md active:scale-95 text-white ${
              currentStepNumber === 1 && !activeFolderId
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60 shadow-none'
                : currentStepNumber === totalSteps
                ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            }`}
          >
            <span>
              {currentStepNumber === 1 && !activeFolderId
                ? '看板を作ると進めます'
                : currentStepNumber === totalSteps
                ? '全画面で再生'
                : 'つぎへ'}
            </span>
            {currentStepNumber === totalSteps ? (
              <MonitorPlay className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            )}
          </button>
        </div>
      </footer>

      {/* 全画面サイネージプレイヤー */}
      {isFullscreen && (
        <FullscreenPlayer
          slides={fullscreenSlides.length > 0 ? fullscreenSlides : slides}
          initialIndex={0}
          onClose={() => setIsFullscreen(false)}
        />
      )}

      {/* エラーアラートモーダル */}
      <ErrorAlertModal
        error={globalError}
        onClose={() => setGlobalError(null)}
      />
    </div>
  );
}
