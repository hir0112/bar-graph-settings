import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { SketchPicker } from 'react-color';
import { defaultStopColor, popularStopColor } from '../../../utils/commonUtils';

export const ColorPicker = memo(({ 
  colors = {}, 
  onChange,
  data = [],
  disabled = false,
  colorType = 'default', // カラータイプは 'default' を指定
}) => {
  // カラーピッカーの表示状態を管理
  const [activeIndex, setActiveIndex] = useState(null);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  
  const pickerRef = useRef(null);
  const seriesButtonsRef = useRef([]);

  // カラータイプに基づいて色の配列を選択
  const stopColor = useMemo(() => {
    return colorType === 'popular' ? popularStopColor : defaultStopColor;
  }, [colorType]);

  // デフォルトカラーの配列を生成
  const defaultColors = useMemo(() => {
    return stopColor.map(color => color.end);
  }, [stopColor]);
  
  // データからシリーズ名を抽出
  const seriesNames = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }
    return data.map((series, index) => 
      series.name || `y${index}`
    );
  }, [data]);
  
  const PICKER_DIMENSIONS = useMemo(() => ({
    width: 250,
    height: 220,
  }), []);

  // カラーピッカーの位置を計算（画面からはみ出さないように調整）
  const positionPicker = useCallback((element) => {
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    
    const pickerWidth = PICKER_DIMENSIONS.width;
    const pickerHeight = PICKER_DIMENSIONS.height;
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    let top = rect.bottom + window.scrollY + 5;
    let left = rect.left + window.scrollX;
    
    if (left + pickerWidth > windowWidth) {
      left = windowWidth - pickerWidth - 30;
    }

    if (top + pickerHeight > windowHeight) {
      top = rect.top + window.scrollY - pickerHeight - 150;
    }
    
    setPickerPosition({ top, left });
  }, []);
  
  // ウィンドウサイズ変更時やキー入力時のイベントハンドラ
  useEffect(() => {
    const handleResize = () => {
      setActiveIndex(null);
    };
    
    const handleKeyDown = (e) => {
      if (activeIndex && (e.key === 'Enter')) {
        setActiveIndex(null);
      }
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex]);
  
  // ピッカー外クリック時に閉じる処理
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isSeriesButton = seriesButtonsRef.current.some(btn => 
        btn && btn.contains(e.target)
      );
      
      if (!isSeriesButton && pickerRef.current && !pickerRef.current.contains(e.target)) {
        setActiveIndex(null);
      }
    };

    if (activeIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [activeIndex]);

  // シリーズボタンクリック時の処理
  const handleSeriesClick = useCallback((index, e) => {
    if (disabled) return;
    
    e.stopPropagation();
    
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
      positionPicker(e.currentTarget);
    }
  }, [activeIndex, positionPicker, disabled]);
  
  // 現在の色を取得（設定済みまたはデフォルト）
  const getCurrentColor = (index) => 
    colors?.[index] || defaultColors[index % defaultColors.length];
  
  // 色変更時のコールバック
  const handleColorChange = useCallback((color, index) => {
    if (disabled || !onChange) return;
    
    const rgbaColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
    
    const newColors = { ...colors };
    newColors[index] = rgbaColor;
    
    onChange(newColors);
  }, [colors, onChange, disabled]);

  return (
    <div className={`space-y-2 ${disabled ? 'opacity-60' : ''}`}>
      <div className="flex flex-wrap gap-2">
        {seriesNames.map((name, index) => (
          <button
            key={index}
            ref={el => seriesButtonsRef.current[index] = el}
            className={`series-button flex items-center gap-1.5 px-2 py-1 text-xs rounded 
              transition-all duration-200 ease-in-out
              ${!disabled ? 'hover:bg-gray-200 hover:shadow-sm' : ''}
              ${activeIndex === index 
                ? 'bg-gray-200 font-medium shadow-sm' 
                : 'bg-gray-100'}
              ${disabled ? 'cursor-not-allowed' : ''}`}
            onClick={(e) => handleSeriesClick(index, e)}
            disabled={disabled || index >= seriesNames.length}
          >
            <div 
              className="w-4 h-4 rounded-full border border-gray-300 transition-all duration-200" 
              style={{ 
                backgroundColor: getCurrentColor(index),
                boxShadow: activeIndex === index ? '0 0 0 1px rgba(0,0,0,0.1)' : 'none'
              }}
            />
            {name}
          </button>
        ))}
      </div>
      
      {/* カラーピッカーの表示 */}
      {activeIndex !== null && !disabled && (
        <div 
          ref={pickerRef}
          style={{
            position: 'fixed',
            zIndex: 1000,
            top: pickerPosition.top,
            left: pickerPosition.left
          }}
        >
          <SketchPicker
            color={colors[activeIndex] || defaultColors[activeIndex % defaultColors.length]}
            onChange={(color) => handleColorChange(color, activeIndex)}
            disableAlpha={false}
            presetColors={defaultColors}
            width={`${PICKER_DIMENSIONS.width}px`}
            height={`${PICKER_DIMENSIONS.height}px`}
          />
        </div>
      )}
    </div>
  );
});