import React from 'react';
import { AxisControl } from './settings/AxisControl';
import { LegendControl } from './settings/LegendControl';
import { LabelControl } from './settings/LabelControl';
import { SizeControl } from './settings/SizeControl';
import { ColorControl } from './settings/ColorControl';

export const GraphSettings = ({ 
  settings, 
  onSettingChange, 
  data,
  title = "グラフ設定",
  // 各コントロールの表示/非表示を制御
  controls = {
    xAxis: true,
    yAxis: true,
    legend: true,
    label: true,
    size: true,
    color: true,
  },
  currentGraphType,
  // 各コントロールのラベル名
  controlLabels = {
    xAxis: "X軸",
    yAxis: "Y軸",
    legend: "凡例",
    label: currentGraphType === 'bar' ? "バーのラベル" : "マーカーのラベル",
    size: currentGraphType === 'bar' ? "バーの太さ" : "マーカーの大きさ",
    color: currentGraphType === 'bar' ? "バーの色" : "ラインの色",
  },
  // 各コントロールの初期開閉状態を設定
  defaultOpenState = {
    xAxis: true,
    yAxis: true,
    legend: false,
    label: false,
    size: false,
    color: false,
  },
}) => {
  // タイトル要素を生成する関数
  const getTitleElement = (text) => (
    <div className="flex items-center h-7 text-xs font-bold text-gray-700">
      {text}
    </div>
  );

  // グラフタイプに基づいて表示するコントロールをフィルタリング
  const availableControls = React.useMemo(() => {
    if (currentGraphType === 'bar') {
      return { 
        xAxis: true,
        yAxis: true,
        legend: true,
        label: true,
        size: true,
        color: true,
      };
    } else if (currentGraphType === 'line') {
      return { 
        xAxis: true,
        yAxis: true,
        legend: true,
        label: true,
        size: true,
        color: true,
      };
    }
    return null;
  }, [currentGraphType]);

  return (
    <div className={"pb-6"}>
      {/* タイトルの表示 */}
      {title && <h3 className="text-sm font-bold mb-4 text-gray-700">{title}</h3>}
      
      {/* X軸の設定 */}
      {controls.xAxis && availableControls.xAxis && (
        <AxisControl 
          axisName={getTitleElement(controlLabels.xAxis)}
          settings={settings}
          onSettingChange={onSettingChange}
          prefix="X"
          defaultOpen={defaultOpenState.xAxis}
        />
      )}
      
      {/* Y軸の設定 */}
      {controls.yAxis && availableControls.yAxis && (
        <AxisControl 
          axisName={getTitleElement(controlLabels.yAxis)}
          settings={settings}
          onSettingChange={onSettingChange}
          prefix="Y"
          defaultOpen={defaultOpenState.yAxis}
        />
      )}
      
      {/* 凡例の設定 */}
      {controls.legend && availableControls.legend && (
        <LegendControl
          settings={settings}
          onSettingChange={onSettingChange}
          defaultOpen={defaultOpenState.legend}
        />
      )}
      
      {/* ラベルの設定 */}
      {controls.label && availableControls.label && (
        <LabelControl
          settings={settings}
          onSettingChange={onSettingChange}
          defaultOpen={defaultOpenState.label}
          title={controlLabels.label}
        />
      )}
    
      {/* サイズの設定 */}
      {controls.size && availableControls.size && (
        <SizeControl
          settings={settings}
          onSettingChange={onSettingChange}
          defaultOpen={defaultOpenState.size}
          title={controlLabels.size}
          settingKey={currentGraphType === 'bar' ? 'barSize' : 'lineSize'}
          defaultValue={currentGraphType === 'bar' ? 40 : 8}
          min={currentGraphType === 'bar' ? 1 : 2}
          max={currentGraphType === 'bar' ? 80 : 14}
          minLabel={currentGraphType === 'bar' ? "細" : "小"}
          maxLabel={currentGraphType === 'bar' ? "太" : "大"}
        />
      )}
      
      {/* 色の設定 */}
      {controls.color && availableControls.color && (
        <ColorControl
          settings={settings}
          onSettingChange={onSettingChange}
          data={data}
          defaultOpen={defaultOpenState.color}
          title={controlLabels.color}
          settingKey="colors"
        />
      )}
    </div>
  );
};    