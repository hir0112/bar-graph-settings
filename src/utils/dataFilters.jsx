// 本ファイルはローカルテスト用（データのフィルタリング）のため、本番環境に結合不要
// 本番環境へ結合完了後、削除してOK

// -------------------------------------------------------------------
const getYearFromDateString = (dateString) => {
  if (typeof dateString !== 'string' || !dateString.includes('/')) {
    return null;
  }
  const yearPart = parseInt(dateString.split('/')[0], 10);
  return isNaN(yearPart) ? null : yearPart;
};

export const filterDataByYears = (sourceData, years) => {
  if (!Array.isArray(sourceData) || sourceData.length === 0 || !sourceData[0]?.x?.length) {
    return null;
  }

  const lastXValue = sourceData[0].x[sourceData[0].x.length - 1];
  const latestYear = getYearFromDateString(lastXValue);

  if (latestYear === null) {
    console.error("Could not determine the latest year from data.");
    return sourceData;
  }

  const oldestYearToKeep = latestYear - years + 1;

  const filteredData = sourceData.map(series => {
    if (!Array.isArray(series.x) || !Array.isArray(series.y) || series.x.length !== series.y.length) {
      return series;
    }

    const indicesToKeep = [];
    series.x.forEach((dateStr, index) => {
      const year = getYearFromDateString(dateStr);
      if (year !== null && year >= oldestYearToKeep) {
        indicesToKeep.push(index);
      }
    });

    const newX = indicesToKeep.map(index => series.x[index]);
    const newY = indicesToKeep.map(index => series.y[index]);

    return {
      ...series,
      x: newX,
      y: newY,
    };
  });

  return filteredData;
};
// -------------------------------------------------------------------