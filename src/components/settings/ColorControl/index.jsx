import React, { memo, useCallback, useMemo } from 'react';
import { ColorPicker } from './ColorPicker';
import { CollapsibleSection } from '../../commons/CollapsibleSection';

export const ColorControl = memo(({
  settings = {},
  onSettingChange,
  data,
  defaultOpen,
  title,
  disabled,
  settingKey,
  defaultColors = {}
}) => {
  // 設定から色情報を取得（設定がない場合はデフォルト値を使用）
  const colors = useMemo(() => {
    return settings[settingKey] || defaultColors;
  }, [settings, settingKey, defaultColors]);

  // 色変更時のコールバック処理
  const handleColorChange = useCallback((newColors) => {
    if (onSettingChange) {
      onSettingChange(settingKey, newColors);
    }
  }, [onSettingChange, settingKey]);

  return (
    <div>
      <CollapsibleSection
        title={<div className="flex items-center h-7 text-xs font-bold text-gray-700">{title}</div>}
        defaultOpen={defaultOpen}
        disabled={disabled}
      >
        <div className="py-1">
          {/* カラーピッカーコンポーネント */}
          <ColorPicker
            colors={colors}
            onChange={handleColorChange}
            data={data}
            disabled={disabled}
          />
        </div>
      </CollapsibleSection>
    </div>
  );
});