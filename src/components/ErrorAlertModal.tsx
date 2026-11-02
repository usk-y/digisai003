import React from 'react';
import { AlertTriangle, X, CheckCircle, Info, Lightbulb } from 'lucide-react';
import { AppError } from '../types';

interface ErrorAlertModalProps {
  error: AppError | null;
  onClose: () => void;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * ユーザー指示：
 * 1. 大きい画像がアップロードできないので、原因とエラー表示を出す
 * 2. 何かのエラーの場合は、理由と解決方法を明示
 */
export const ErrorAlertModal: React.FC<ErrorAlertModalProps> = ({
  error,
  onClose,
  actionButton,
}) => {
  if (!error) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border-2 border-rose-500/70 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="alertdialog"
        aria-labelledby="error-title"
        aria-describedby="error-reason"
      >
        {/* ヘッダー */}
        <div className="bg-rose-500/15 border-b border-rose-500/30 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-rose-400">
            <div className="p-1.5 bg-rose-500/20 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <h3 id="error-title" className="font-black text-sm sm:text-base text-rose-200">
              {error.title || 'エラーが発生しました'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 本文：原因と解決方法を明示 */}
        <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          {/* 原因セクション */}
          <div className="bg-rose-950/40 border border-rose-900/60 rounded-2xl p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 font-black text-rose-300">
              <Info className="w-4 h-4 shrink-0 text-rose-400" />
              <span>【エラーの原因】</span>
            </div>
            <p id="error-reason" className="text-slate-200 leading-relaxed pl-5 whitespace-pre-line font-medium">
              {error.reason}
            </p>
          </div>

          {/* 解決方法セクション */}
          <div className="bg-amber-950/40 border border-amber-900/60 rounded-2xl p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 font-black text-amber-300">
              <Lightbulb className="w-4 h-4 shrink-0 text-amber-400" />
              <span>【解決方法・対処手順】</span>
            </div>
            <div className="text-amber-100 leading-relaxed pl-5 whitespace-pre-line font-medium">
              {error.solution}
            </div>
          </div>

          {/* 補足・詳細情報 */}
          {error.details && (
            <div className="px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-[11px] text-slate-400 font-mono break-all">
              詳細: {error.details}
            </div>
          )}
        </div>

        {/* フッター操作ボタン */}
        <div className="bg-slate-950 px-5 py-3.5 border-t border-slate-800 flex items-center justify-end gap-2.5">
          {actionButton && (
            <button
              onClick={() => {
                actionButton.onClick();
                onClose();
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-all cursor-pointer"
            >
              {actionButton.label}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
          >
            確認して閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
