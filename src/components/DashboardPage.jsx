import React, { useState, useMemo, useCallback } from 'react';
import { GraphContainer } from './GraphContainer';
import fullData from '../sample_data.json';
import { filterDataByYears } from '../utils/dataFilters';
import { saveGraphSettings } from '../utils/storageUtils';

// グラフIDを生成する関数
const generateGraphId = (range) => `graph_${range}`;
// 表示期間の選択肢
const RANGES = ['3Y', '5Y', '10Y', '20Y', 'MAX'];

export const DashboardPage = () => {
  // 選択された表示期間（デフォルトは5年）
  const [selectedRange, setSelectedRange] = useState('5Y');

  // 期間に応じてデータをフィルタリングする関数
  const makeDisplayData = (sourceData, range) => {
    if (!sourceData || sourceData.length === 0) return null;
    switch (range) {
      case '3Y': return filterDataByYears(sourceData, 3);
      case '5Y': return filterDataByYears(sourceData, 5);
      case '10Y': return filterDataByYears(sourceData, 10);
      case '20Y': return filterDataByYears(sourceData, 20);
      case 'MAX': default: return sourceData;
    }
  };

  // 選択された期間に基づいて表示データを生成（メモ化）
  const displayData = useMemo(
    () => makeDisplayData(fullData, selectedRange),
    [selectedRange]
  );

  // 現在のグラフIDを生成（メモ化）
  const currentGraphId = useMemo(
    () => generateGraphId(selectedRange),
    [selectedRange]
  );

  // すべてのグラフに設定を適用する処理
  const handleApplySettingsToAll = useCallback((newSettings) => {
    RANGES.forEach(range => {
      const id = generateGraphId(range);
      saveGraphSettings(id, newSettings);
    });
  }, []);

  return (
    <div className="p-4">
      {/* 期間選択ボタングループ */}
      <div className="mb-4 flex space-x-2">
        {RANGES.map(range => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={`px-3 py-1 rounded ${selectedRange === range ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {range}
          </button>
        ))}
      </div>
      {/* グラフ表示エリア */}
      <div className="mt-6">
        <GraphContainer
          key={currentGraphId}
          graphId={currentGraphId}
          initialData={displayData}
          downloadFilename={`${currentGraphId}.png`}
          onApplySettingsToAll={handleApplySettingsToAll}
        />
      </div>
    </div>
  );
};