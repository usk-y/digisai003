import { AppError } from '../types';
import heic2any from 'heic2any';

export interface OptimizeImageOptions {
  maxDimension?: number; // 長辺の最大ピクセル数（デフォルト1200）
  quality?: number; // JPEG圧縮品質 0〜1（デフォルト0.85）
  maxSizeBytes?: number; // 許容ファイルサイズ上限（デフォルト25MB）
}

export interface OptimizeImageResult {
  success: boolean;
  dataUrl?: string;
  error?: AppError;
  originalSizeMB?: number;
  optimizedSizeKB?: number;
}

/**
 * 画像ファイルを検証し、ブラウザの保存領域（LocalStorage）やメモリに負担をかけないよう
 * 適切なサイズに自動リサイズ・圧縮するオプティマイザー
 * 
 * ユーザー指示：
 * 1. 大きい画像がアップロードできないので、原因とエラー表示を出す
 * 2. 何かのエラーの場合は、理由と解決方法を明示
 */
export async function validateAndOptimizeImage(
  file: File,
  options: OptimizeImageOptions = {}
): Promise<OptimizeImageResult> {
  const {
    maxDimension = 1200,
    quality = 0.85,
    maxSizeBytes = 50 * 1024 * 1024, // 50MB
  } = options;

  const originalSizeMB = Number((file.size / (1024 * 1024)).toFixed(2));

  // 1. ファイルタイプの検証
  const validTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'image/bmp',
  ];

  // iPhone HEIC/HEIF の変換
  const isHeic = 
    file.name.toLowerCase().endsWith('.heic') || 
    file.name.toLowerCase().endsWith('.heif') ||
    file.type === 'image/heic' ||
    file.type === 'image/heif';

  if (isHeic) {
    try {
      const conversionResult = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.8,
      });
      const blob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
      file = new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' });
    } catch (e) {
      return {
        success: false,
        originalSizeMB,
        error: {
          title: 'HEIC画像変換エラー',
          reason: 'HEIC形式の画像をJPEGに変換できませんでした。',
          solution: '別の画像をお試しください。',
          details: String(e),
        },
      };
    }
  }

  if (file.type && !validTypes.includes(file.type) && !file.type.startsWith('image/')) {
    return {
      success: false,
      originalSizeMB,
      error: {
        title: '非対応のファイル形式',
        reason: `選択されたファイル形式（${file.type || '拡張子不明'}）は画像として認識できません。`,
        solution: 'JPEG（.jpg, .jpeg）、PNG（.png）、WebP（.webp）、またはGIF形式の画像ファイルをご使用ください。',
        details: `ファイル名: ${file.name}`,
      },
    };
  }

  // 2. 超過サイズの検知（50MB超過）
  if (file.size > maxSizeBytes) {
    return {
      success: false,
      originalSizeMB,
      error: {
        title: 'ファイルサイズ超過エラー',
        reason: `画像サイズが ${originalSizeMB}MB あり、最大上限（50MB）を超えています。`,
        solution: '50MB以下の画像ファイルをご使用ください。',
        details: `検出サイズ: ${originalSizeMB}MB / 最大上限: 50MB`,
      },
    };
  }

  // SVGファイルの場合は変換不要でそのままDataURL化
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          success: true,
          dataUrl: e.target?.result as string,
          originalSizeMB,
        });
      };
      reader.onerror = () => {
        resolve({
          success: false,
          originalSizeMB,
          error: {
            title: 'SVG画像の読み込み失敗',
            reason: 'SVGベクター画像の読み込み中にファイルアクセスエラーが発生しました。',
            solution: 'PNGまたはJPEG形式の画像に書き出してから再度アップロードしてください。',
          },
        });
      };
      reader.readAsDataURL(file);
    });
  }

  // 3. Canvasによる画像デコード＆自動縮小・圧縮処理
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width === 0 || height === 0) {
          resolve({
            success: false,
            originalSizeMB,
            error: {
              title: '画像の解像度取得エラー',
              reason: '画像の幅・高さを正常に読み取ることができませんでした。ファイルが破損している可能性があります。',
              solution: '別の画像ファイルを選択するか、画像を再保存してお試しください。',
            },
          });
          return;
        }

        // アスペクト比を維持して最大長辺にリサイズ
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            success: false,
            originalSizeMB,
            error: {
              title: '画像変換エンジンの起動エラー',
              reason: 'お使いのブラウザで2Dグラフィック描画機能（Canvas）を初期化できませんでした。',
              solution: 'ブラウザのメモリが不足している可能性があります。他のタブを閉じるか、ブラウザを再起動してください。',
            },
          });
          return;
        }

        // PNGで透明度がある場合はPNGで出力、それ以外は高圧縮JPEGで出力
        const isPng = file.type === 'image/png';
        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl: string;
        if (isPng) {
          dataUrl = canvas.toDataURL('image/png');
          // PNGのデータが1.5MBを超える場合はJPEGで高圧縮化
          if (dataUrl.length > 2 * 1024 * 1024) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
        } else {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        const optimizedSizeKB = Math.round((dataUrl.length * 3) / 4 / 1024);

        resolve({
          success: true,
          dataUrl,
          originalSizeMB,
          optimizedSizeKB,
        });
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        resolve({
          success: false,
          originalSizeMB,
          error: {
            title: '画像圧縮・最適化処理のエラー',
            reason: `画像の最適化処理中にエラーが発生しました: ${errorMsg}`,
            solution: '画像URLを直接入力するか、別の画像ファイルを選択してください。',
          },
        });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        success: false,
        originalSizeMB,
        error: {
          title: '画像読み込みエラー',
          reason: 'ブラウザでこの画像をデコードできませんでした。画像が破損しているか、ブラウザ非対応のカラープロファイル（CMYK等）の可能性があります。',
          solution: '画像をRGBカラーで保存し直すか、スクリーンショットを撮影した画像をアップロードしてください。',
          details: `ファイル名: ${file.name} / サイズ: ${originalSizeMB}MB`,
        },
      });
    };

    img.src = objectUrl;
  });
}
