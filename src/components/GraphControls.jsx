import React from 'react';
import { SettingsButton } from './commons/buttons/SettingsButton';
import { DownloadButton } from './commons/buttons/DownloadButton';

// 設定ボタンとダウンロードボタンの表示
export const GraphControls = ({ 
  onSettingsClick, 
  onDownloadClick, 
  showSettings = true, // 設定ボタン表示フラグ
  showDownload = true, // ダウンロードボタン表示フラグ
}) => {
  return (
    <div className="absolute top-3 right-9 flex gap-2.5 z-10">
      {showSettings && <SettingsButton onClick={onSettingsClick} />}
      {showDownload && <DownloadButton onClick={onDownloadClick} />}
    </div>
  );
};