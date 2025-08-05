import React, { useState, useEffect } from "react";
import { ResponsiveContainer } from "recharts";
import ReactECharts from "echarts-for-react";

const BarChartComp = ({data}) => {
  const [aggregatedData, setAggregatedData] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const groupedData = data.reduce((acc, curr) => {
      const date = new Date(curr.TimeStamp).toISOString().split("T")[0]; // Extract date part

      if (!acc[date]) {
        acc[date] = 1; // If first entry for the date, set value
      } else {
        acc[date] += 1; // If date exists, sum values
      }

      return acc;
    }, {});

    // Convert Timestamp to Unix timestamp
    const formattedData = Object.keys(groupedData).map((date) => [
      new Date(date).getTime(), // Convert date string to timestamp
      groupedData[date], // Total value for that date
    ]);

    setAggregatedData(formattedData);
  }, [data]);

  if (aggregatedData.length === 0) {
    return <p style={{ textAlign: "center", padding: "20px" }}>No data available</p>;
  }

  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      top: '15%',
      right: "15%",
    },
    xAxis: {
      type: "category",
      name: "Timestamp",
      data: aggregatedData.map((d) => new Date(d[0]).toISOString().split("T")[0]),
      axisLabel: {
        rotate: 0,
      },
      axisTick: {
        alignWithLabel: true,
      },
      boundaryGap: true,
    },
    yAxis: {
      type: "value",
      name: "Count",
    },
    series: [
      {
        name: "Value",
        type: "bar",
        data: aggregatedData.map((d) => d[1]), // Bar heights
        itemStyle: {
          color: "#005da2", // Change bar color
        },
        barWidth: "30%", // Bar width
      },
    ],
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReactECharts option={options} style={{ height:"calc(50vh - 80px)", width: "100%" }} />
    </ResponsiveContainer>
  );
};

export default BarChartComp;
