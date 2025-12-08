import React, { memo, useCallback, useMemo } from 'react';
import { LabelToggle } from './LabelToggle';
import { LabelSizeSlider } from './LabelSizeSlider';
import { CollapsibleSection } from '../../commons/CollapsibleSection';

export const LabelControl = memo(({ 
  settings = {},
  onSettingChange,
  defaultOpen,
  title,
  disabled,
  keyMapping = {
    toggle: 'showLabel',
    size: 'labelFontSize'
  },
  defaultValues = {
    toggle: true,
    size: 14
  }
}) => {
  // ラベル表示状態の取得（設定がない場合はデフォルト値を使用）
  const showLabels = useMemo(() => {
    return settings[keyMapping.toggle] !== undefined 
      ? settings[keyMapping.toggle] 
      : defaultValues.toggle;
  }, [settings, keyMapping.toggle, defaultValues.toggle]);

  // フォントサイズの取得（設定がない場合はデフォルト値を使用）
  const fontSize = useMemo(() => {
    return settings[keyMapping.size] !== undefined 
      ? settings[keyMapping.size] 
      : defaultValues.size;
  }, [settings, keyMapping.size, defaultValues.size]);

  // ラベル表示切替ハンドラー
  const handleToggleChange = useCallback((e) => {
    if (onSettingChange) {
      onSettingChange(keyMapping.toggle, e.target.checked);
    }
  }, [onSettingChange, keyMapping.toggle]);

  // フォントサイズ変更ハンドラー
  const handleSizeChange = useCallback((e) => {
    if (onSettingChange) {
      onSettingChange(keyMapping.size, Number(e.target.value));
    }
  }, [onSettingChange, keyMapping.size]);

  return (
    <div>
      <CollapsibleSection 
        title={<div className="flex items-center h-7 text-xs font-bold text-gray-700">{title}</div>}
        defaultOpen={defaultOpen}
        disabled={disabled}
      >
        {/* ラベル表示切替トグル */}
        <LabelToggle
          checked={showLabels}
          onChange={handleToggleChange}
          disabled={disabled}
        />
        {/* ラベルサイズ調整スライダー（ラベル非表示時は無効化） */}
        <LabelSizeSlider
          value={fontSize}
          onChange={handleSizeChange}
          disabled={disabled || !showLabels}
        />
      </CollapsibleSection>
    </div>
  );
});