import React, { memo, useState, useCallback } from 'react';

export const ButtonIcon = memo(({ 
  onClick,
  icon: Icon,
  size = 20,
  disabled = false,
  color = "#555",
  strokeWidth = 1.5,
  colors = {
    bg: 'bg-[#f5f5f5]',
    hover: 'bg-[#e5e5e5]',
    disabled: 'bg-gray-100',
    icon: {
      default: color,
      disabled: '#999'
    }
  },
  children,
}) => {
  // ホバー状態の管理
  const [isHover, setIsHover] = useState(false);

  // マウスエンター時のホバー状態設定
  const handleMouseEnter = useCallback(() => {
    if (!disabled) {
      setIsHover(true);
    }
  }, [disabled]);

  // マウスリーブ時のホバー状態解除
  const handleMouseLeave = useCallback(() => {
    if (!disabled) {
      setIsHover(false);
    }
  }, [disabled]);

  // クリックイベントハンドラ（無効状態では実行しない）
  const handleClick = useCallback((e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  }, [disabled, onClick]);

  return (
    <button 
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        p-2 rounded-md transition-all duration-200 ease-in-out border-none
        ${disabled ? `${colors.disabled} cursor-not-allowed opacity-60` : 'cursor-pointer'}
        ${!disabled && (isHover ? colors.hover : colors.bg)}
        focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50
      `}
      disabled={disabled}
      type="button"
    >
      {/* アイコンコンポーネントの表示 */}
      <Icon 
        size={size} 
        color={disabled ? colors.icon.disabled : colors.icon.default} 
        strokeWidth={strokeWidth}
      />
      {children}
    </button>
  );
});