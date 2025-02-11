import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 1200 },
  { name: "Apr", value: 200 },
  { name: "May", value: 600 },
  { name: "Jun", value: 700 },
  { name: "Jul", value: 400 },
  { name: "Aug", value: 900 },
  { name: "Sep", value: 500 },
  { name: "Oct", value: 1500 },
  { name: "Nov", value: 600 },
  { name: "Dec", value: 800 },
];

const BarChartComp = () => {
  return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#103782" barSize={100} />
          </BarChart>
        </ResponsiveContainer>
  );
};

export default BarChartComp;
