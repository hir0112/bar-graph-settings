import React, { memo } from 'react';
import { TextButton } from '../TextButton';

export const CancelButton = memo(({ 
  onClick,
  disabled = false,
  children = 'キャンセル', // デフォルトテキストは「キャンセル」
  type = 'button',
  ...otherProps
}) => {
  // キャンセルボタン用のカラー設定
  const cancelColors = {
    bg: 'bg-[#f5f5f5]',
    hover: 'hover:bg-[#e5e5e5]',
    active: 'active:bg-[#d5d5d5]',
    disabled: 'bg-gray-100',
    text: { 
      default: 'text-gray-700',
      disabled: 'text-gray-400'
    }
  };

  return (
    <TextButton
      onClick={onClick}
      disabled={disabled}
      colors={cancelColors} // グレー系のカラー設定を適用
      type={type}
      {...otherProps}
    >
      {children}
    </TextButton>
  );
});