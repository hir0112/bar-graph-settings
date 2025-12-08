import React, { memo } from 'react';
import { TextButton } from '../TextButton';

export const OkButton = memo(({ 
  onClick, 
  disabled = false,
  children = 'OK',  // デフォルトテキストは「OK」
  type = 'button',
  ...otherProps
}) => {
  // OKボタン用のカスタムカラー設定
  const okColors = {
    bg: 'bg-green-100', 
    hover: 'hover:bg-green-200',
    active: 'active:bg-green-300', 
    disabled: 'bg-gray-100',
    text: { 
      default: 'text-green-700', 
      disabled: 'text-gray-500' 
    }
  };

  return (
    <TextButton 
      onClick={onClick}
      disabled={disabled}
      colors={okColors}  // グリーン系のカラー設定を適用
      type={type}
      {...otherProps}
    >
      {children}
    </TextButton>
  );
});