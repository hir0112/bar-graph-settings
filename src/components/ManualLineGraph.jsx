import React, {useState, useEffect, useCallback} from 'react';
import { LineChart, Line, XAxis, YAxis, ReferenceLine, Cell, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, Brush } from 'recharts';
import { convertSingleValue, convertCurrency, convertCurrencyMulti } from '../utils/commonUtils';
import { defaultStopColor, popularStopColor } from '../utils/commonUtils';

export const ManualLineGraph = ({ data, height = 500, width, convertValue=false, showLabel='auto', showBrush=true, colorType='default', showXaxisName=true, figWidth=null, settings = {} }) => {
    const [isSmallArea, setIsSmallArea] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
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
            const dataForConvert = data.map((series) => {
                return series.y;
            })
            const convertedData = convertCurrencyMulti(dataForConvert)
            modifiedData = data.map((series, index) => {
                return {
                    x: series.x,
                    x_unit: series.x_unit,
                    y: series.y,
                    y_unit: series.y_unit,
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

    const  { chartData, modifiedData } = convertToChartData(data);
        
    let stopColor = []

    if (colorType === 'default') {
        stopColor = defaultStopColor;
    } else if (colorType === 'popular') {
        stopColor = popularStopColor;
    }

    const CustomLabel = ({ x, y, width, value, unit, fontSize=12, markerSize=8 }) => {
        if (value === null || value === undefined) return null;
        // const offset = value >= 0 ? -10 : 20;
        const offset = value >= 0 ? -(markerSize + 6) : (markerSize + fontSize); // マーカーサイズに応じてオフセットを調整
        return (
            <text
                x={x}
                y={y + offset}
                fill="black"
                textAnchor="middle"
                fontSize={fontSize}
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
                        const seriesIndex = parseInt(item.dataKey.replace('y', ''), 10);  // yのインデックスを取得
                        // const labelColor = stopColor[seriesIndex]?.start || 'rgba(100, 100, 100, 0.7)';
                        const labelColor = getLineColor(seriesIndex);
                        return (
                            <div key={index} className="flex items-center space-x-2">
                                <svg width="12" height="12" className="flex-shrink-0">
                                    <circle
                                        cx="6" // Circle center X
                                        cy="6" // Circle center Y
                                        r="6" // Circle radius
                                        fill={labelColor}
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

    const renderCustomLegend = () => (
        <div className="flex flex-wrap gap-4 pb-[20px]">
            {modifiedData.map((series, index) => (
                <div 
                    key={index} 
                    className="flex items-center" 
                    // style={{ color: stopColor[index % stopColor.length].start }}
                >
                    <div className="mr-2 flex items-center">
                        <svg width="10" height="10">
                            <line
                                x1="0" y1="5" x2="10" y2="5"
                                // stroke={stopColor[index % stopColor.length].start}
                                stroke={getLineColor(index)}
                                strokeWidth="2"
                            />
                        </svg>
                    </div>
                    <div className="text-gray-600">{series.name}</div>
                </div>
            ))}
        </div>
    );
    
    const japaneseTickFormatter = (value, unit) => {
        if (Math.abs(value) >= 1e12) {
            return (value / 1e12).toFixed(1) + "兆" + unit; // 1兆 = 10^12
        } else if (Math.abs(value) >= 1e8) {
            return (value / 1e8).toFixed(1) + "億" + unit; // 1億 = 10^8
        }
        return value.toString() + unit; // 1億未満はそのまま表示
    };
    
    
    const range = (y) => {
        const yMax = Math.max(...y);
        const yMin = Math.min(...y);
        const range = yMax - yMin
        if (yMin > 0) {
            const rangeMax = yMax * 1.2
            const rangeMin = 0;
            return [rangeMin, rangeMax]
        } else if (yMax < 0) {
            const rangeMax = 0
            const rangeMin = yMin * 1.2;
            return [rangeMin, rangeMax]
        } else {
            const rangeMax = yMax + range * 0.1
            const rangeMin = yMin - range * 0.1
            return [rangeMin, rangeMax]
        }
    }

    // ラインの色を取得する関数
    const getLineColor = useCallback((seriesIndex) => {
        // ユーザーが色を設定した場合、その色を返す
        if (settings.colors && settings.colors[seriesIndex] !== undefined) {
            return settings.colors[seriesIndex];
        }
        return stopColor[seriesIndex % stopColor.length].end; // 未設定の場合はデフォルト色
    }, [settings, stopColor]);
    
    // マーカーの色を取得する関数
    const getDotFill = useCallback((seriesIndex) => {
        // ユーザーが色を設定した場合、その色を返す
        if (settings.colors && settings.colors[seriesIndex] !== undefined) {
            return settings.colors[seriesIndex];
        }
        return stopColor[seriesIndex % stopColor.length].start; // 未設定の場合はデフォルト色
    }, [settings, stopColor]);

    return (
        <ResponsiveContainer width={figWidth ? figWidth : "100%"} height={height}>
            <LineChart
                data={chartData}
                // margin={{ top: showAxisY ? 40 : 20, right: 30, left: 30, bottom: 40 }}
                margin={{ top: ((showLabel === 'auto' && !isSmallArea) || showLabel === 'visible') ? 60: 100, right: 40, left: 40, bottom: 40 }}
            >
                <defs>
                    {stopColor.map((color, index) => (
                        <linearGradient id={`gradient${index}`} key={index} x1="0" y1="0" x2="0" y2="1">
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
                    tickMargin={35}
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
                    width={((showLabel === 'auto' && isSmallArea) || showLabel === 'hidden' || settings.showYAxis) ? 90 : 0} // Y軸の幅
                    hide={!((showLabel === 'auto' && isSmallArea) || showLabel === 'hidden' || settings.showYAxis)}          // Y軸全体の表示/非表示
                >
                    {/* Y軸のラベルの表示/非表示 */}
                    {(((showLabel === 'auto' && isSmallArea) || showLabel === 'hidden') || 
                    (settings.showYAxisLabel && settings.showYAxis)) && (
                        <Label
                            value={modifiedData[0].y_unit}
                            position="top"
                            offset={30}
                            style={{ 
                                textAnchor: 'middle', 
                                fill: 'grey',
                            }}
                        />
                    )}
                </YAxis>

                <XAxis
                    dataKey="x"
                    tickMargin={15}
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
                            offset={40}
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
                        content={renderCustomLegend}
                        verticalAlign="top" 
                        align="left" 
                        wrapperStyle={{ top: 0, display: "flex", flexWrap: "wrap" }}
                        formatter={(value) => <span className="text-black">{value}</span>} // バーの色を変更しても凡例の色は黒から変更されないようにここで指定
                    />
                )}

                {modifiedData.map((series, seriesIndex) => (
                    <Line
                        key={seriesIndex}
                        dataKey={`y${seriesIndex}`}
                        // fill={`url(#gradient${seriesIndex % stopColor.length})`}
                        // stroke={stopColor[seriesIndex]['end']}
                        stroke={getLineColor(seriesIndex)}
                        // dot={{ r: 8, fill: stopColor[seriesIndex]['start'] }}
                        dot={{ 
                            r: settings.lineSize !== undefined ? settings.lineSize : 8,
                            // fill: stopColor[seriesIndex]['start']
                            fill: getDotFill(seriesIndex)
                        }}
                        strokeWidth={2}
                        name={series['name']}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        label={
                            // ラインのラベルの表示/非表示
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
                                            fontSize={settings.labelFontSize || 14} // ラインのラベルのフォントサイズの変更
                                            markerSize={settings.lineSize !== undefined ? settings.lineSize : 8}
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
                    </Line>
                ))}

                {showBrush && <Brush dataKey="name" height={15} stroke="lightgrey" y={height - 40}/>}
            </LineChart>
        </ResponsiveContainer>
    );
};

// export default ManualLineGraph;
