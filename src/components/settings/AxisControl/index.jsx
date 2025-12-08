import React, { useCallback, useMemo } from 'react';
import { AxisDisplayToggle } from './AxisDisplayToggle';
import { AxisLabelToggle } from './AxisLabelToggle';
import { AxisSizeSlider } from './AxisSizeSlider';
import { AxisGridToggle } from './AxisGridToggle';
import { CollapsibleSection } from '../../commons/CollapsibleSection';

export const AxisControl = ({ 
  axisName, 
  settings,
  onSettingChange,
  prefix,
  defaultOpen,
  disabled,
  controls = {
    display: true,
    size: true,
    label: true,
    grid: true
  },
  // 設定キーのマッピング定義
  keyMapping = {
    display: (prefix) => `show${prefix}Axis`,
    size: (prefix) => `${prefix.toLowerCase()}AxisFontSize`,
    label: (prefix) => `show${prefix}AxisLabel`,
    grid: (prefix) => `show${prefix}AxisGrid`
  },
  defaultValues = {
    size: 12
  }
}) => {
  // 指定された設定値を取得する関数
  const getSetting = useCallback((type) => {
    const key = keyMapping[type](prefix);
    return settings[key] !== undefined ? settings[key] : defaultValues[type];
  }, [settings, prefix, keyMapping, defaultValues]);

  // 設定変更を親コンポーネントに伝達する関数
  const handleSettingChange = useCallback((type, value) => {
    const key = keyMapping[type](prefix);
    onSettingChange(key, value);
  }, [onSettingChange, prefix, keyMapping]);

  // 軸を制御するコンポーネント
  const axisControls = useMemo(() => (
    <>
      {controls.display && (
        <AxisDisplayToggle 
          checked={getSetting('display')}
          onChange={(e) => handleSettingChange('display', e.target.checked)}
        />
      )}

      {controls.size && (
        <AxisSizeSlider 
          value={getSetting('size')}
          onChange={(e) => handleSettingChange('size', Number(e.target.value))}
          disabled={disabled || !getSetting('display')}
        />
      )}

      {controls.label && (
        <AxisLabelToggle 
          checked={getSetting('label')}
          onChange={(e) => handleSettingChange('label', e.target.checked)}
        />
      )}
      
      {controls.grid && (
        <AxisGridToggle 
          checked={getSetting('grid')}
          onChange={(e) => handleSettingChange('grid', e.target.checked)}
        />
      )}
    </>
  ), [controls, getSetting, handleSettingChange]);

  return (
    <CollapsibleSection title={axisName} defaultOpen={defaultOpen}>
      {axisControls}
    </CollapsibleSection>
  );
};