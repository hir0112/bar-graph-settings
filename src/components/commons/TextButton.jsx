import React, { memo } from 'react';

export const TextButton = memo(({ 
  onClick,
  disabled,
  children,
  type = 'button',
  colors = {
    bg: 'bg-[#f5f5f5]',
    hover: 'hover:bg-[#e5e5e5]',
    active: 'active:bg-[#d5d5d5]',
    disabled: 'bg-gray-100',
    text: {
      default: 'text-gray-700',
      disabled: 'text-gray-400'
    }
  },
  testId,
}) => {
  // ボタンのスタイル定義
  const buttonStyle = `
    px-3 py-2 rounded-md transition-all duration-200 ease-in-out border-none
    text-xs font-semibold
    ${disabled 
      ? `${colors.disabled} cursor-not-allowed opacity-60 ${colors.text.disabled}` 
      : `cursor-pointer ${colors.text.default} ${colors.bg} ${colors.hover} ${colors.active}`
    }
    focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50
  `;

  return (
    <button 
      onClick={disabled ? undefined : onClick} // 無効状態の場合はクリックイベントを無視
      className={buttonStyle}
      disabled={disabled}
      type={type}
      data-testid={testId}
    >
      {children}
    </button>
  );
});