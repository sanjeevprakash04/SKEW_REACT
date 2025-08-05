import ReactECharts from 'echarts-for-react';
import { useEffect, useState } from 'react';
import axios from "axios";
import { useTheme } from '@emotion/react';

const Bar30days = () => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const [dailyKwhData, setDailyKwhData] = useState([]);

    useEffect(() => {
        const fetchBarGraphData = async () => {
          try {
            const response = await axios.post("http://127.0.0.1:8000/bar-graph-30days", {
              headers: { "Content-Type": "application/json" },
            });

            const rawData = response.data;

            const kwhMap = {};

            rawData.forEach((item) => {
              if (item.Name === "KWH") {
                const date = item.TimeStamp.split("T")[0]; // YYYY-MM-DD
                if (!kwhMap[date]) {
                  kwhMap[date] = [];
                }
                kwhMap[date].push({ ts: new Date(item.TimeStamp), val: item.Value });
              }
            });

            const calculatedData = Object.entries(kwhMap)
              .map(([date, readings]) => {
                readings.sort((a, b) => a.ts - b.ts);
                const kwh = readings[readings.length - 1].val - readings[0].val;
                return { date, value: kwh };
              })
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(-30); // last 30 days

            console.log("Data:", calculatedData);
            setDailyKwhData(calculatedData);
          } catch (error) {
            alert("Error fetching data");
          }
        };

        fetchBarGraphData();
    }, []);

    const option = {
        title: {
          text: 'Last 30 days (kWh)',
          left: 'left',
          textStyle: { fontSize: 16, fontWeight: 'bold', color: isDarkMode ? '#aaa' : '#333' }
        },
        tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
        },
        grid: {
          left: '3%', right: '2%', bottom: '3%', top: '20%', containLabel: true
        },
        xAxis: {
            type: 'category',
            data: dailyKwhData.map(item => item.date),
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
            data: dailyKwhData.map(item => item.value.toFixed(2)),
            itemStyle: { color: '#1E88E5' },
        }],
    };

    return <ReactECharts option={option} style={{ height: "100%", width: '100%' }} />;
};

export default Bar30days;
