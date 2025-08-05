import ReactECharts from 'echarts-for-react';
import { useEffect, useState } from 'react';
import axios from "axios";
import { useTheme } from '@emotion/react';

const Bar12months = () => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const [monthlyKwhData, setMonthlyKwhData] = useState([]);

    useEffect(() => {
        const fetchMonthlyData = async () => {
            try {
                const response = await axios.post("http://127.0.0.1:8000/bar-graph-12months", {
                    headers: { "Content-Type": "application/json" },
                });

                const rawData = response.data;

                const monthlyMap = {};

                rawData.forEach(item => {
                    if (item.Name === "KWH") {
                        const date = new Date(item.TimeStamp);
                        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`; // e.g., "2025-4"

                        if (!monthlyMap[monthKey]) {
                            monthlyMap[monthKey] = [];
                        }
                        monthlyMap[monthKey].push({ ts: date, val: item.Value });
                    }
                });

                const calculatedData = Object.entries(monthlyMap)
                    .map(([monthKey, readings]) => {
                        readings.sort((a, b) => a.ts - b.ts);
                        const startVal = readings[0].val;
                        const endVal = readings[readings.length - 1].val;
                        const kwh = endVal - startVal;

                        const dateObj = new Date(readings[0].ts);
                        const label = dateObj.toLocaleString('default', { month: 'short', year: 'numeric' });

                        return { month: label, value: kwh };
                    })
                    .sort((a, b) => new Date(`1 ${a.month}`) - new Date(`1 ${b.month}`))
                    .slice(-12); // last 12 months

                setMonthlyKwhData(calculatedData);
            } catch (err) {
                console.error("Error fetching monthly KWH data", err);
            }
        };

        fetchMonthlyData();
    }, []);

    const option = {
        title: {
            text: 'Last 12 months (kWh)',
            left: 'left',
            textStyle: { fontSize: 16, fontWeight: 'bold', color: isDarkMode ? '#aaa' : '#333' }
        },
        tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
        },
        grid: {
            left: '3%', right: '2%', bottom: '2%', top: '20%', containLabel: true
        },
        xAxis: {
            type: 'category',
            data: monthlyKwhData.map(item => item.month),
            axisLabel: { rotate: 80 },
            axisTick: { alignWithLabel: true },
            boundaryGap: true,
        },
        yAxis: {
            type: 'value',
            nameTextStyle: {
                color: isDarkMode ? '#aaa' : '#333',
            },
        },
        series: [{
            name: 'Energy(kWh)',
            type: 'bar',
            data: monthlyKwhData.map(item => item.value.toFixed(2)),
            itemStyle: { color: '#1E88E5' },
        }],
    };

    return <ReactECharts option={option} style={{ height: "100%", width: '100%' }} />;
};

export default Bar12months;
