import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ManualBarGraph } from './ManualBarGraph';
import { ManualLineGraph } from './ManualLineGraph';
import { GraphControls } from './GraphControls';
import { useGraphDownload } from '../hooks/useGraphDownload';
import { loadGraphSettings, saveGraphSettings } from '../utils/storageUtils';
import { Widget } from './Widget';

const DEFAULT_DOWNLOAD_FILENAME = 'download.png';
const EMPTY_DEFAULT_SETTINGS = {
  showXAxis: true,
  showYAxis: false,
  xAxisFontSize: 12,
  yAxisFontSize: 12,
  showXAxisLabel: true,
  showYAxisLabel: false,
  showXAxisGrid: false,
  showYAxisGrid: false,
  showLegend: true,
  showLabel: true,
  labelFontSize: 14,
  size: 40,
};

export const GraphContainer = ({
  graphId,
  initialData,
  defaultSettings = EMPTY_DEFAULT_SETTINGS,
  downloadFilename = DEFAULT_DOWNLOAD_FILENAME,
  onApplySettingsToAll,
}) => {
  const [data, setData] = useState([]);
  const graphRef = useRef(null);
  const [settings, setSettings] = useState(defaultSettings);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // 初期データの設定
  useEffect(() => {
    setData(initialData || []);
  }, [initialData]);

  // 保存済み設定の読み込み
  useEffect(() => {
    const savedSettings = loadGraphSettings(graphId);
    setSettings(savedSettings || defaultSettings);
  }, [graphId, defaultSettings]);

  // 設定モーダルの表示
  const handleSettingsClick = useCallback(() => {
    setShowSettingsModal(true);
  }, []);

  // 設定の適用と保存
  const handleApplySettings = useCallback((newSettings) => {
    setSettings(newSettings);
    if (onApplySettingsToAll) {
      // 全グラフに設定を適用
      onApplySettingsToAll(newSettings);
    } else {
      // 現在のグラフのみに設定を保存
      saveGraphSettings(graphId, newSettings);
    }
    setShowSettingsModal(false);
  }, [graphId, onApplySettingsToAll]);

  const handleCancelSettings = useCallback(() => {
    setShowSettingsModal(false);
  }, []);

  // グラフのダウンロード機能
  const downloadGraph = useGraphDownload({ filename: downloadFilename });
  const handleDownloadClick = useCallback(() => {
    if (graphRef.current) {
      downloadGraph(graphRef);
    }
  }, [downloadGraph]);

  // データに基づいて表示するグラフコンポーネントを決定
  const GraphComponent = useMemo(() => {
    if (!data || data.length === 0) {
      return null;
    }

    // データに存在する一意なgraphTypeを抽出して、Setに格納
    const graphTypes = new Set(data.map(series => series.graphType).filter(Boolean));
    // 一意なgraphTypeが存在しない場合、デフォルトで棒グラフを表示
    if (graphTypes.size === 0) {
      return ManualBarGraph;
    } else if (graphTypes.size === 1) {
      // 一意なgraphTypeが存在する場合、そのgraphTypeに応じたグラフを表示
      const type = graphTypes.values().next().value;
      if (type === 'bar') {
        return ManualBarGraph;
      } else if (type === 'line') {
        return ManualLineGraph;
      }
    }

    return ManualBarGraph;

  }, [data]);

  return (
    <div className="container mx-auto p-4">
      {GraphComponent && data && data.length > 0 ? (
        <div
          ref={graphRef}
          className="relative border border-gray-200 p-4 rounded-md shadow-sm"
        >
          <GraphControls
            onSettingsClick={handleSettingsClick}
            onDownloadClick={handleDownloadClick}
          />
          <GraphComponent
            data={data}
            settings={settings}
          />
        </div>
      ) : (
        <div className="p-4 text-gray-500">表示するデータがありません。</div>
      )}

      {showSettingsModal && (
        <Widget
          data={data}
          initialSettings={settings}
          onApply={handleApplySettings}
          onCancel={handleCancelSettings}
          graphId={graphId}
          downloadFilename={downloadFilename}
          previewGraphComponent={GraphComponent}
        />
      )}
    </div>
  );
};