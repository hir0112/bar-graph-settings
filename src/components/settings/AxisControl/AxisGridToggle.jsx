import React, { memo } from 'react';

export const AxisGridToggle = memo(({ 
  checked, 
  onChange, 
  label = "罫線の表示",
  disabled = false,
  id,
  colors = {
    active: 'bg-gray-700',
    inactive: 'bg-gray-300',
    thumb: 'bg-white',
    text: 'text-gray-700',
    disabledText: 'text-gray-400'
  },
  size = {
    track: { width: 'w-9', height: 'h-5' },
    thumb: { width: 'w-4', height: 'h-4' }
  }
}) => {
  // ユニークなトグルIDを生成（指定がない場合はランダム生成）
  const toggleId = id || `grid-toggle-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="flex items-center justify-between">
      {/* ラベル表示部分 */}
      <div>
        <label 
          htmlFor={toggleId}
          className={`text-[11px] py-1 ${disabled ? colors.disabledText : colors.text}`}
        >
          {label}
        </label>
      </div>
      
      {/* トグルスイッチ本体 */}
      <label
        className={`relative inline-flex items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        htmlFor={toggleId}
      >
        <input
          id={toggleId}
          type="checkbox"
          className="hidden"
          checked={checked}
          onChange={disabled ? undefined : onChange}
          disabled={disabled}
        />
        <div 
          className={`${size.track.width} ${size.track.height} rounded-full peer transition-colors duration-200 
          ${checked ? colors.active : colors.inactive} ${disabled ? 'opacity-60' : ''}`}
        >
          <div 
            className={`absolute ${size.thumb.width} ${size.thumb.height} ${colors.thumb} rounded-full top-0.5 left-0.5 
            transition-all duration-200 ease-in-out ${checked ? 'translate-x-4' : ''}`}
          ></div>
        </div>
      </label>
    </div>
  );
});