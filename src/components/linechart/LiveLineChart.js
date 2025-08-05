import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@emotion/react';

const LiveLineChart = ({ meterData }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const [data, setData] = useState([]);

    useEffect(() => {
        if (meterData?.KWH !== undefined) {
            const newPoint = {
            time: new Date().toISOString(),
            value: meterData.KWH,
            };
            setData(prev => [...prev.slice(-49), newPoint]); // keep last 50 points
        }
    }, [meterData]);

    const option = {
        backgroundColor: isDarkMode ? "#1e1e1e" : "#e5ecf6",
        grid: {
          left: '5%',
          right: '5%',
          bottom: '15%',
          top: '17%',
        },
        tooltip: { 
            trigger: "axis",
            axisPointer: { 
              type: "cross",
            }
        },
        xAxis: {
            type: 'time',
            boundaryGap: false,
            nameTextStyle: {
                fontSize: 13, // Font size for axis title
                fontWeight: "bold",
                color: isDarkMode ? '#aaa' : '#333',
            },
            axisLine: {
                onZero: false, // Prevents aligning with Y=0
                lineStyle: {
                  color: "#999" // Set color for Y-axis line
                }
            },
        },
        yAxis: {
            type: 'value',
            name: 'Energy(kWh)',
            nameTextStyle: {
                fontSize: 13, // Font size for axis title
                fontWeight: "bold",
                color: isDarkMode ? '#aaa' : '#333',
            },
            axisLabel: {
                color: isDarkMode ? "#aaa" : "#666" // Set color for Y-axis labels
            },
            axisLine: {
                show: true, // Show the line
                lineStyle: {
                  color: "#999" // Set color for Y-axis line
                }
            },
            splitLine: {
                show: true,  // Ensure grid lines are visible
                lineStyle: {
                  color: "#ccc", // Change this to any color (e.g., red)
                  width: 1,  // Adjust line thickness
                  type: "solid", // Options: 'solid', 'dashed', 'dotted'
                },
            },
        },
        series: [
            {
                name: 'Energy(kWh)',
                type: 'line',
                showSymbol: true,
                data: data.map(point => [point.time, point.value]),
                lineStyle: {
                    color: '#5470C6',
                    width: 2,
                },
                symbol: "circle",
                symbolSize: 5,
                silent: true,
                emphasis: {
                    focus: "none" // Removes the hover effect (no highlighting)
                }
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
};

export default LiveLineChart;
