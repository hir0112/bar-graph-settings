import React, { memo } from 'react';

export const AxisSizeSlider = memo(({ 
  value,
  onChange,
  min = 8,
  max = 16,
  step = 1,
  disabled = false,
  label = "軸のサイズ",
  minLabel = "小",
  maxLabel = "大",
  id,
  colors = {
    track: "bg-gray-200",
    thumb: "accent-gray-700",
    text: "text-gray-700",
    disabled: "text-gray-400",
    disabledText: "text-gray-400"
  },
}) => {
  // ユニークなスライダーIDを生成（指定がない場合はランダム生成）
  const sliderId = id || `size-slider-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`space-y-1`}>
      {/* スライダーのラベル表示部分 */}
      <div className="flex justify-between items-center">
        <label 
          htmlFor={sliderId}
          className={`text-[11px] py-1 ${disabled ? colors.disabledText : colors.text}`}
        >
          {label}
        </label>
      </div>
      
      {/* スライダー本体 */}
      <input 
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={disabled ? undefined : onChange}
        disabled={disabled}
        className={`w-full h-1.5 ${colors.track} rounded-lg appearance-none cursor-pointer ${colors.thumb} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
      
      {/* スライダーの最小値と最大値のラベル表示 */}
      <div className={`flex justify-between ${colors.text}`}>
        <span className={`text-[10px] ${disabled ? colors.disabled : ''}`}>{minLabel}</span>
        <span className={`text-[10px] ${disabled ? colors.disabled : ''}`}>{maxLabel}</span>
      </div>
    </div>
  );
});