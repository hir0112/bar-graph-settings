import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { convertCurrency } from '../utils/commonUtils';

export const DataSettings = memo(({ 
  data = [],
  customStyles = {
    table: "border-collapse text-[10px] border border-gray-300 rounded-lg overflow-hidden",
    header: "bg-gray-100",
    headerCell: "border-b border-gray-300 p-2 font-bold text-[10px] text-center text-gray-700",
    row: (index) => index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
    cell: "border-b border-gray-200 p-1.5",
    noData: "text-center p-4 text-gray-600 border border-gray-300 rounded"
  }
}) => {
  const [headers, setHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);

  // ヘッダー行の生成処理
  const processHeaders = useCallback((graphData) => {
    if (!graphData?.[0]) return [];
    
    const firstSeries = graphData[0];
    const xHeader = `${firstSeries.x_name || 'X軸'}${firstSeries.x_unit ? `（${firstSeries.x_unit}）` : ''}`;
    
    return [xHeader, ...graphData.map((series, index) => {
      const { unit } = convertCurrency(series.y);
      return `${series.name || `y${index}`}（${unit}${series.y_unit || ''}）`;
    })];
  }, []);

  // テーブルデータの変換処理
  const processTableData = useCallback((graphData, headers) => {
    if (!graphData?.[0]?.x?.length) return [];
    
    const dataPoints = graphData[0].x.length;
    // 単位変換情報の事前計算
    const unitMappings = graphData.map(series => {
      const { unit, divValue } = convertCurrency(series.y);
      return { unitPrefix: unit, divValue, originalUnit: series.y_unit };
    });

    return Array(dataPoints).fill().map((_, rowIndex) => {
      const row = {
        [headers[0]]: `${graphData[0].x[rowIndex]}`
      };

      // 各系列のデータを行に追加
      graphData.forEach((series, seriesIndex) => {
        const { divValue } = unitMappings[seriesIndex];
        const headerWithUnit = headers[seriesIndex + 1];
        const value = series.y?.[rowIndex];

        row[headerWithUnit] = formatCellValue(value, divValue);
      });

      return row;
    });
  }, []);

  // セル値のフォーマット処理
  const formatCellValue = useCallback((value, divValue) => {
    if (value === '-' || value === undefined) return '-';
    return divValue ? (value / divValue).toFixed(2) : value.toLocaleString();
  }, []);

  // データ変更時のテーブル再構築
  useEffect(() => {
    if (!data?.length) {
      setHeaders([]);
      setTableData([]);
      return;
    }

    try {
      const newHeaders = processHeaders(data);
      const newTableData = processTableData(data, newHeaders);
      
      setHeaders(newHeaders);
      setTableData(newTableData);
    } catch (error) {
      console.error('データ処理エラー:', error);
      setHeaders([]);
      setTableData([]);
    }
  }, [data, processHeaders, processTableData]);

  // カラム幅の動的計算
  const getColumnWidth = useCallback((index, columnCount) => {
    if (columnCount > 4) {
      return index < 4 ? "w-1/4" : "w-1/4";
    }
    const widthMap = {
      2: "w-1/2",
      3: "w-1/3",
      4: "w-1/4"
    };
    return widthMap[columnCount] || "";
  }, []);

  // ヘッダーテキストの整形
  const formatHeader = useCallback((header) => {
    const match = header.match(/^(.+?)（(.+?)）$/);
    if (!match) return header;

    return (
      <>
        <span className="inline">{match[1]}</span>
        <span className="whitespace-nowrap">（{match[2]}）</span>
      </>
    );
  }, []);

  const columnCount = useMemo(() => headers.length, [headers]);

  return (
    <div className={`h-full`}>
      <div className="h-full overflow-auto">
        {tableData.length > 0 ? (
          <div className={columnCount > 4 ? "overflow-x-auto" : ""}>
            <table className={customStyles.table}>
              <thead>
                <tr className={customStyles.header}>
                  {headers.map((header, index) => (
                    <th 
                      key={index} 
                      className={`${getColumnWidth(index, columnCount)} ${customStyles.headerCell} ${index >= 4 ? 'sticky left-0' : ''}`}
                      scope="col"
                    >
                      {formatHeader(header)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex} 
                    className={customStyles.row(rowIndex)}
                  >
                    {headers.map((header, cellIndex) => {
                      const cellValue = row[header];
                      const isNumber = cellIndex > 0;
                      
                      return (
                        <td 
                          key={cellIndex} 
                          className={`${getColumnWidth(cellIndex, columnCount)} ${customStyles.cell} ${isNumber ? 'text-right' : 'text-left'}`}
                        >
                          {cellValue}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={customStyles.noData}>
            データがありません
          </div>
        )}
      </div>
    </div>
  );
});