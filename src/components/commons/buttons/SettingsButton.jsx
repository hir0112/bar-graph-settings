import React from 'react';
import { Settings2 } from 'lucide-react';
import { ButtonIcon } from '../IconButton';

export const SettingsButton = ({ 
  onClick, 
  tooltipText = 'グラフ設定', 
  iconSize = 20,
  tooltipPosition = '-translate-x-1/2',
  tooltipBg = 'bg-gray-800',
  tooltipTextColor = 'text-white',
  disabled = false
}) => {
  
  return (
    <div className={`group relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {/* 設定ボタンアイコンの表示 */}
      <ButtonIcon 
        onClick={disabled ? undefined : onClick}
        icon={Settings2}
        size={iconSize}
        disabled={disabled}
        aria-label={tooltipText}
      />
      {/* ホバー時に表示されるツールチップ */}
      <div className={`fixed transform ${tooltipPosition} ${tooltipBg} ${tooltipTextColor} px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap`}>
        {tooltipText}
      </div>
    </div>
  );
};