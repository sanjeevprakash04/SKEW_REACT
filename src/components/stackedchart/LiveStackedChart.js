import React, { useEffect, useRef, useContext } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '@emotion/react';
import { AppContext } from '../../context/AppContext';

const LiveStackedChart = ({ meterData }) => {
    const { maxTHD } = useContext(AppContext);
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const chartRef = useRef(null);

    const labels = [
        'V1',
        'V2',
        'V3',
        'I1',
        'I2',
        'I3'
    ];

    const thdKeys = [
        'THD of Voltage V12 1',
        'THD of Voltage V12 2',
        'THD of Voltage V12 3',
        'THD of Current I1',
        'THD of Current I2',
        'THD of Current I3'
    ];

    // Render ECharts bar chart
    useEffect(() => {
        const chart = echarts.init(chartRef.current);

        const baseValues = thdKeys.map((key) => parseFloat(meterData[key]) || 0);
        const harmonicValues = thdKeys.map((key, index) => {
        const base = baseValues[index];
        const max = maxTHD[key] || 0;
        return Math.max(max - base, 0);
        });

        const option = {
            animation: false,
            title: {
                text: 'THD & Harmonics',
                left: 'left',
                textStyle: { fontSize: 16, fontWeight: 'bold', color: isDarkMode ? '#aaa' : '#333' }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: (params) => {
                const name = params[0].name;
                const base = params[0].value;
                const harmonic = params[1].value;
                const total = base + harmonic;
                return `
                    ${name}<br/>
                    Base THD: ${base.toFixed(2)}%<br/>
                    Harmonics: ${harmonic.toFixed(2)}%<br/>
                    <strong>Total: ${total.toFixed(2)}%</strong>
                `;
                }
            },
            grid: { left: '2%', right: '2%', bottom: '1%', top: '20%', containLabel: true },
            xAxis: {
                type: 'category',
                data: labels,
                axisTick: { alignWithLabel: true },
                nameTextStyle: {
                    color: isDarkMode ? '#aaa' : '#333',
                }
            },
            yAxis: {
                type: 'value',
                max: Math.ceil(Math.max(...Object.values(maxTHD)) + 1),
                axisLabel: { formatter: '{value} %' },
                nameTextStyle: {
                    color: isDarkMode ? '#aaa' : '#333',
                }
            },
            series: [
                {
                name: 'Base THD',
                type: 'bar',
                stack: 'total',
                data: baseValues,
                itemStyle: { color: '#1E88E5' }
                },
                {
                name: 'Harmonics',
                type: 'bar',
                stack: 'total',
                data: harmonicValues,
                itemStyle: { color: '#90CAF9' }
                }
            ]
        };

        chart.setOption(option);
        return () => chart.dispose();
    // eslint-disable-next-line
    }, [meterData, maxTHD, isDarkMode]);

    return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
};

export default LiveStackedChart;
