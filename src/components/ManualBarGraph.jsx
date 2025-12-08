import React, {useState, useEffect} from 'react';
import { BarChart, Bar, XAxis, YAxis, ReferenceLine, Tooltip, CartesianGrid, Legend, Cell, ResponsiveContainer, Label, Brush } from 'recharts';
import { convertSingleValue, convertCurrency, convertCurrencyMulti } from '../utils/commonUtils';
import { japaneseTickFormatter } from '../utils/commonUtils';
import { defaultStopColor, popularStopColor } from '../utils/commonUtils';

export const ManualBarGraph = ({ data, height = 500, width, convertValue=false, showLabel='auto', showBrush=true, colorType='default', showXaxisName=true, figWidth=null, settings = {} }) => {
    const [isSmallArea, setIsSmallArea] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    
    useEffect(() => {
        if (!data) return <div></div>;
        if (data.length == 0) return;
        if (width / data[0]?.x.length / data.length < 80 ) {
            setIsSmallArea(true);
        } else {
            setIsSmallArea(false);
        }
    }, [width, data])

    const handleMouseEnter = (_, index) => {
        setActiveIndex(index)
    }

    const handleMouseLeave = () => {
        setActiveIndex(null)
    }

    const convertToChartData = (data) => {
        let modifiedData;
        if (convertValue) { 
            modifiedData = data.map((series, index) => {
                return {
                    x: series.x, // 元データ x
                    x_unit: series.x_unit, // 元データ xの単位 (年度)
                    y: series.y, // 元データ y
                    y_unit: series.y_unit, // 元データ yの単位 (円, %, ...)
                    name: series.name,
                }
            })
        } else {
            modifiedData = data;
        }

        const chartData = modifiedData[0].x.map((xValue, index) => {
            let chartDataPoint = { x: xValue };
            modifiedData.forEach((series, seriesIndex) => {
                chartDataPoint[`y${seriesIndex}`] = series.y[index];
                chartDataPoint[`y${seriesIndex}_name`] = series.name;
                chartDataPoint[`y_unit`] = series.y_unit;
                chartDataPoint[`x_unit`] = series.x_unit;
            });
            return chartDataPoint;
        });
    
        // chartDataとmodifiedDataの両方を返す
        return { chartData, modifiedData };
    };
    
    const uniqueId = React.useMemo(() => `gradient-${Math.random().toString(36).substr(2, 9)}`, []);
    
    const { chartData, modifiedData } = convertToChartData(data);
    let stopColor = []

    if (colorType === 'default') {
        stopColor = defaultStopColor;
    } else if (colorType === 'popular') {
        stopColor = popularStopColor;
    }

    const CustomLabel = ({ x, y, width, value, unit, fontSize=14 }) => {
        const offset = value >= 0 ? -10 : 20;
        if (value === null || value === undefined) return null;
        return (
            <text
              x={x + width / 2}
              y={y + offset} 
              fill="black"
              textAnchor="middle"
            //   fontSize={14}
            fontSize={fontSize} // ユーザーが設定するバーのラベルのフォントサイズを受け入れる設定に変更（デフォルトは14のまま）
            >
              {convertSingleValue(value)}{unit}
            </text>
        );
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip px-3 py-2 border border-gray-300 bg-gray-600 rounded shadow text-white">
                    <div>{`${payload[0].payload.x}${payload[0].payload.x_unit}`}</div>
                    {payload.map((item, index) => {
                        const seriesIndex = parseInt(item.dataKey.replace('y', ''), 10); // Get the y index
                        // const labelColor = stopColor[seriesIndex]?.start || 'rgba(100, 100, 100, 1)';
                        const labelColor = getBarFill(seriesIndex);
                        return (
                            <div key={index} className="flex items-center space-x-2">
                                <svg width="12" height="12" className="flex-shrink-0">
                                    <rect
                                        width="12"
                                        height="12"
                                        fill={labelColor}
                                        rx="2"
                                    />
                                </svg>
                                <div className="flex items-center">
                                    {`${item.name} : ${convertSingleValue(item.value, "", 2)}${item.payload.y_unit}`}
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }
        return null;
    };
    
    const range = (y) => {
        // 配列の配列を1次元にフラット化
        const flattened = y.flat();
    
        const yMax = Math.max(...flattened);
        const yMin = Math.min(...flattened);
        const range = yMax - yMin;
    
        if (yMin > 0) {
            const rangeMax = yMax * 1.1;
            const rangeMin = 0;
            return [rangeMin, rangeMax];
        } else if (yMax < 0) {
            const rangeMax = 0;
            const rangeMin = yMin * 1.1;
            return [rangeMin, rangeMax];
        } else {
            const rangeMax = yMax + range * 0.1;
            const rangeMin = yMin - range * 0.1;
            return [rangeMin, rangeMax];
        }
    };

    // バーの色を決定する関数
    const getBarFill = (seriesIndex) => {
        // ユーザーが色を設定した場合、その色を返す
        if (settings.colors && settings.colors[seriesIndex] !== undefined) {
            return settings.colors[seriesIndex];
        }
        // 未設定の場合、定義済みのグラデーション色を返す
        return `url(#${uniqueId}-${seriesIndex % stopColor.length})`;
    };
    
    return (
        <ResponsiveContainer width={figWidth ? figWidth : "100%"} height={height}>
            <BarChart
                data={chartData}
                // margin={{ top: ((showLabel === 'auto' && !isSmallArea) || showLabel === 'visible') ? 0: 40, right: 30, left: 20, bottom: 40 }}
                margin={{ top: ((showLabel === 'auto' && !isSmallArea) || showLabel === 'visible') ? 60: 100, right: 30, left: 20, bottom: 40 }} // Y軸のラベルの表示位置が凡例アイコンと重複しないようにマージンを調整
                barCategoryGap="20%"
                barGap={5}
            >
                <defs>
                    {stopColor.map((color, index) => (
                        <linearGradient id={`${uniqueId}-${index}`} key={index} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color.start} />
                            <stop offset="95%" stopColor={color.end} />
                        </linearGradient>
                    ))}
                </defs>
                <ReferenceLine y={0} stroke="lightgray" />
                {((showLabel === 'auto' && isSmallArea) || showLabel==='hidden') && <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />}

                <YAxis 
                    tickFormatter={(value) => japaneseTickFormatter(value, modifiedData[0].y_unit)}
                    tickCount={10} // Y軸の目盛りの数
                    domain={range(data.map((dt) => dt.y))}
                    // Y軸の目盛りの表示/非表示
                    tick={((showLabel === 'auto' && isSmallArea) || showLabel === 'hidden' || settings.showYAxis) ? 
                        { 
                        fontSize: settings.yAxisFontSize || 12, 
                        fill: 'grey' 
                        } : 
                        false
                    }
                    axisLine={((showLabel === 'auto' && isSmallArea) || showLabel === 'hidden' || settings.showYAxis)}       // Y軸の線自体の表示/非表示
                    tickLine={((showLabel === 'auto' && isSmallArea) || showLabel === 'hidden' || settings.showYAxis)}       // Y軸の目盛り線の表示/非表示
                    width={((showLabel === 'auto' && isSmallArea) || showLabel === 'hidden' || settings.showYAxis) ? 70 : 0} // Y軸の幅
                    hide={!((showLabel === 'auto' && isSmallArea) || showLabel === 'hidden' || settings.showYAxis)}          // Y軸全体の表示/非表示
                >
                    {/* Y軸のラベルの表示/非表示 */}
                    {(((showLabel === 'auto' && isSmallArea) || showLabel === 'hidden') || 
                    (settings.showYAxisLabel && settings.showYAxis)) && (
                        <Label
                            value={modifiedData[0].y_unit}
                            position="top"
                            offset={20}
                            style={{ 
                                textAnchor: 'middle', 
                                fill: 'grey',
                            }}
                        />
                    )}
                </YAxis>

                <XAxis
                    dataKey="x"
                    // X軸の目盛りの表示/非表示
                    tick={(settings.showXAxis === undefined || settings.showXAxis) ? 
                        { 
                        fontSize: settings.xAxisFontSize || 12,
                        fill: 'grey' 
                        } : 
                        false
                    }
                    // X軸の目盛り線の表示/非表示
                    tickLine={(settings.showXAxis === undefined || settings.showXAxis)}
                >
                    {/* X軸のラベルの表示/非表示 */}
                    {((settings.showXAxisLabel === undefined || settings.showXAxisLabel) && showXaxisName) && (
                        <Label
                            value={data[0].x_unit}
                            position="bottom"
                            offset={30}
                            style={{ textAnchor: 'middle', fill: 'grey' }}
                        />
                    )}
                </XAxis>

                <CartesianGrid 
                    strokeDasharray="3 3" 
                    horizontal={settings.showYAxisGrid === true}
                    vertical={settings.showXAxisGrid === true} 
                />

                <Tooltip
                    content={<CustomTooltip />}
                    cursor={false} 
                />

                {/* 凡例の表示/非表示 */}
                {(settings.legend === undefined || settings.legend) && (
                    <Legend 
                        verticalAlign="top" 
                        align="left" 
                        wrapperStyle={{ top: 0, display: "flex", flexWrap: "wrap" }}
                        formatter={(value) => <span className="text-black">{value}</span>} // バーの色を変更しても凡例の色は黒から変更されないようにここで指定
                    />
                )}

                {modifiedData.map((series, seriesIndex) => (
                    <Bar
                        key={seriesIndex}
                        dataKey={`y${seriesIndex}`}
                        fill={getBarFill(seriesIndex)} // バーの色の決定
                        name={series['name']}
                        radius={[1, 1, 0, 0]}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        barSize={settings.barSize !== undefined ? settings.barSize : 40} // バーの太さのデフォルト値の設定
                        label={
                            // バーのラベルの表示/非表示
                            (((!isSmallArea && showLabel==='auto') || showLabel==='visible') && 
                            (settings.showLabel !== false)) 
                                ? (props) => {
                                    const { x, y, width, value } = props;
                                    return (
                                        <CustomLabel 
                                            x={x} 
                                            y={y} 
                                            width={width} 
                                            value={value} 
                                            unit={series.y_unit} 
                                            fontSize={settings.labelFontSize || 14} // バーのラベルのフォントサイズの変更
                                        />
                                    );
                                } 
                            : null
                        }
                    >
                        {series.x.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                opacity={activeIndex === null || index === activeIndex ? 1 : 0.3}
                            /> 
                        ))}
                    </Bar>
                ))}

                {showBrush && <Brush dataKey="name" height={15} stroke="lightgrey" />}
            </BarChart>
        </ResponsiveContainer>
    );
};