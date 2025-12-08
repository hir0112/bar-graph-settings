import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { ManualBarGraph } from './ManualBarGraph';
import { ManualLineGraph } from './ManualLineGraph';
import { DataSettings } from './DataSettings';
import { GraphSettings } from './GraphSettings';
import { DownloadButton } from './commons/buttons/DownloadButton';
import { OkButton } from './commons/buttons/OkButton';
import { CancelButton } from './commons/buttons/CancelButton';
import { useGraphDownload } from '../hooks/useGraphDownload';

// モーダルのスタイル設定
const MODAL_STYLE = {
  width: 'w-[97.5%]',
  height: 'h-[95%]',
  zIndex: 'z-[1000]'
};

// パネルのレイアウト比率
const LAYOUT_RATIO = {
  leftPanel: 'w-1/5',
  centerPanel: 'w-3/5',
  rightPanel: 'w-1/5'
};

export const Widget = ({
  data = [],
  initialSettings = {},
  onApply,
  onCancel,
  downloadFilename = 'download.png',
  modalStyle = MODAL_STYLE,
  layoutRatio = LAYOUT_RATIO,
  previewGraphComponent: PreviewGraphComponent,
}) => {
  // グラフ設定の状態管理
  const [graphSettings, setGraphSettings] = useState(initialSettings);
  // データが表示可能かどうかの判定
  const isGraphReady = Boolean(data && data.length > 0);

  const currentGraphType = useMemo(() => {
    if (PreviewGraphComponent === ManualBarGraph) {
      return 'bar';
    } else if (PreviewGraphComponent === ManualLineGraph) {
      return 'line';
    }
    return null;
  }, [PreviewGraphComponent]);

  // 設定変更時のハンドラー
  const handleSettingChange = useCallback((key, value) => {
    setGraphSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // 設定適用時のハンドラー
  const handleApplySettings = useCallback(() => {
    if (onApply) {
      onApply(graphSettings);
    }
  }, [onApply, graphSettings]);

  // キャンセル時のハンドラー
  const handleClose = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  // グラフ要素への参照
  const modalGraphRef = useRef(null);
  
  // グラフダウンロード機能のフック
  const downloadModalGraph = useGraphDownload({ 
    filename: downloadFilename,
  });
  
  // ダウンロードボタンクリック時のハンドラー
  const handleModalDownload = useCallback(() => {
    if (modalGraphRef.current) {
      downloadModalGraph(modalGraphRef);
    }
  }, [downloadModalGraph]);

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${modalStyle.zIndex} overflow-hidden`}>
      <div className={`bg-white ${modalStyle.width} ${modalStyle.height} rounded-lg shadow-md flex flex-col overflow-hidden`}>

        <div className="flex flex-1 overflow-hidden">
          {/* 左パネル */}
          <div className={`${layoutRatio.leftPanel} p-4 pt-6 border-r border-gray-200 overflow-y-auto`}>
            <DataSettings
              data={data}
            />
          </div>
          
          {/* 中央パネル */}
          <div className={`${layoutRatio.centerPanel} p-4 pt-6 flex flex-col items-center overflow-y-auto`}>
            <div className="self-end mb-4">
              <DownloadButton 
                onClick={handleModalDownload} 
                disabled={!isGraphReady}
              />
            </div>
            <div ref={modalGraphRef} className="w-full flex-1 flex flex-col items-center justify-center">
              {isGraphReady && PreviewGraphComponent ? (
                <PreviewGraphComponent
                  data={data}
                  settings={graphSettings}
                />
              ) : (
                <div className="text-gray-500">表示するデータがありません</div>
              )}
            </div>
          </div>
          
          {/* 右パネル */}
          <div className={`${layoutRatio.rightPanel} p-4 pt-6 border-l border-gray-200 overflow-y-auto flex flex-col`}>
            <GraphSettings
              settings={graphSettings}
              onSettingChange={handleSettingChange}
              data={data}
              currentGraphType={currentGraphType}
            />
            {/* 操作ボタン */}
            <div className="flex justify-center items-center gap-x-2 mt-auto pb-4">
              <OkButton onClick={handleApplySettings} />
              <CancelButton onClick={handleClose} />
            </div>
          </div>
       </div>
      </div>
    </div>
  );
};