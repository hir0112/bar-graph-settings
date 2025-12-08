import React, { useState, useCallback, memo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export const CollapsibleSection = memo(({ 
  title, 
  defaultOpen,
  children,
  id,
  onToggle,
  disabled = false,
  iconSize = 16,
  animate = true,
  icons = {
    open: ChevronDown,
    closed: ChevronRight
  }
}) => {
  // 開閉状態の管理
  const [isOpen, setIsOpen] = useState(defaultOpen);
  // セクションIDの生成（指定がない場合はランダム生成）
  const sectionId = id || `section-${Math.random().toString(36).substring(2, 9)}`;
  const contentId = `${sectionId}-content`;
  
  // 開閉状態の切り替え処理
  const handleToggle = useCallback(() => {
    if (disabled) return;
    
    const newState = !isOpen;
    setIsOpen(newState);
    
    // 親コンポーネントに状態変更を通知
    if (onToggle) {
      onToggle(newState);
    }
  }, [isOpen, onToggle, disabled]);

  // 現在の状態に応じたアイコンの選択
  const IconComponent = isOpen ? icons.open : icons.closed;

  return (
    <section className={`mb-2`}>
      {/* セクションヘッダー部分 */}
      <div
        id={sectionId}
        className={`flex items-center justify-between cursor-pointer bg-gray-100 px-2 py-1 rounded-t-md border border-gray-200 
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
        onClick={handleToggle}
      >
        <h4 className="font-medium text-gray-700 text-sm">
          {title}
        </h4>
        <div className={`text-gray-500`}>
          <IconComponent size={iconSize} />
        </div>
      </div>
      
      {/* コンテンツ部分（開閉状態に応じて表示/非表示） */}
      <div 
        id={contentId}
        className={`overflow-hidden transition-all duration-100 ${!isOpen && !animate ? 'hidden' : ''}`}
        style={{ 
          maxHeight: isOpen ? '1000px' : '0',
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          // アニメーション設定（animate=falseの場合は無効化）
          transition: animate ? 'max-height 0.2s ease-in-out, opacity 0.2s ease-in-out, visibility 0.2s ease-in-out' : 'none'
        }}
      >
        <div className={`border border-t-0 border-gray-200 rounded-b-md px-2 py-1 bg-gray-50`}>
          {children}
        </div>
      </div>
    </section>
  );
});