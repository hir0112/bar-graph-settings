import React, { memo } from 'react';

export const SizeSlider = memo(({ 
  value,
  onChange,
  disabled = false,
  min,
  max,
  step = 1,
  minLabel,
  maxLabel,
  id,
  colors = {
    track: "bg-gray-200",
    thumb: "accent-gray-700",
    text: "text-gray-500",
    disabled: "text-gray-400"
  }
}) => {
  // スライダーの一意なIDを生成（指定がない場合はランダム生成）
  const sliderId = id || `bar-width-slider-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="space-y-1">      
      {/* グラフの大きさの調整用スライダー */}
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
      
      {/* 最小値・最大値のラベル表示 */}
      <div className={`flex justify-between ${colors.text}`}>
        <span className={`text-[10px] ${disabled ? colors.disabled : ''}`}>{minLabel}</span>
        <span className={`text-[10px] ${disabled ? colors.disabled : ''}`}>{maxLabel}</span>
      </div>
    </div>
  );
});