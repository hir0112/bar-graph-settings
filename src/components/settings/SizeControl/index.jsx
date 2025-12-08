import React, { memo, useCallback, useMemo } from 'react';
import { SizeSlider } from './SizeSlider';
import { CollapsibleSection } from '../../commons/CollapsibleSection';

export const SizeControl = memo(({ 
  settings = {},
  onSettingChange,
  defaultOpen,
  title = title,
  disabled,
  settingKey,
  defaultValue,
  min,
  max,
  minLabel,
  maxLabel,
}) => {
  // 設定値またはデフォルト値からバーの太さ/マーカーの大きさを取得
  const graphSize = useMemo(() => {
    return settings[settingKey] !== undefined 
      ? settings[settingKey] 
      : defaultValue;
  }, [settings, settingKey, defaultValue]);

  // スライダー変更時の処理
  const handleChange = useCallback((e) => {
    if (onSettingChange) {
      onSettingChange(settingKey, Number(e.target.value));
    }
  }, [onSettingChange, settingKey]);

  return (
    <div>
      <CollapsibleSection 
        title={<div className="flex items-center h-7 text-xs font-bold text-gray-700">{title}</div>}
        defaultOpen={defaultOpen}
        disabled={disabled}
      >
        {/* グラフの大きさの調整用スライダー */}
        <SizeSlider
          value={graphSize}
          onChange={handleChange}
          disabled={disabled}
          min={min}
          max={max}
          minLabel={minLabel}
          maxLabel={maxLabel}
        />
      </CollapsibleSection>
    </div>
  );
});