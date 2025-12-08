import React, { memo, useCallback } from 'react';
import { LegendToggle } from './LegendToggle';
import { CollapsibleSection } from '../../commons/CollapsibleSection';

export const LegendControl = memo(({ 
  settings = {},
  onSettingChange,
  defaultOpen,
  title = "凡例",
  settingKey = 'legend',
  disabled,
}) => {
  // 凡例表示状態の変更ハンドラー
  const handleChange = useCallback((e) => {
    if (onSettingChange) {
      onSettingChange(settingKey, e.target.checked);
    }
  }, [onSettingChange, settingKey]);

  // 凡例の表示状態を取得（未設定の場合はデフォルトでtrue）
  const isLegendVisible = settings[settingKey] !== undefined ? settings[settingKey] : true;

  return (
    <div>
      <CollapsibleSection 
        title={<div className={"flex items-center h-7 text-xs font-bold text-gray-700"}>{title}</div>} 
        defaultOpen={defaultOpen}
      >
        {/* 凡例表示切替トグル */}
        <LegendToggle 
          checked={isLegendVisible}
          onChange={handleChange}
          disabled={disabled}
        />
      </CollapsibleSection>
    </div>
  );
});