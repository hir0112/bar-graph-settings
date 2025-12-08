import { useCallback } from 'react';
import * as htmlToImage from 'html-to-image';

export const useGraphDownload = ({ 
  filename = 'download.png',
  quality = 1.0,
  pixelRatio = 2,
}) => {
  const handleDownload = useCallback((ref) => {
    if (!ref.current) return;
    
    // コントロール要素を検出
    const controlsElement = ref.current.querySelector('.absolute, [class*="GraphControls"]');
    
    // 元のスタイルを保存
    const originalDisplayStyle = controlsElement ? controlsElement.style.display : null;
    const originalBackground = ref.current.style.background;
    
    // ダウンロード時にコントロールを非表示
    if (controlsElement) {
      controlsElement.style.display = 'none';
    }
    
    // 背景を白に設定
    ref.current.style.background = 'white';
    
    // グラフをPNG画像に変換
    htmlToImage.toPng(ref.current, { 
      quality,
      pixelRatio,
      backgroundColor: 'white'
    })
    .then(function (dataUrl) {
      // 元のスタイルを復元
      if (controlsElement) {
        controlsElement.style.display = originalDisplayStyle || '';
      }
      ref.current.style.background = originalBackground;
      
      // 画像のダウンロード処理
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    })
    .catch(function (error) {
      console.error('画像の生成に失敗しました', error);
      
      // エラー時も元のスタイルを復元
      if (controlsElement) {
        controlsElement.style.display = originalDisplayStyle || '';
      }
      if (ref.current) {
        ref.current.style.background = originalBackground;
      }
    });
  }, [filename]);

  return handleDownload;
};