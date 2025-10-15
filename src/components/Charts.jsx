import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const salesData = [
  { name: "Jan", sales: 400 },
  { name: "Feb", sales: 800 },
  { name: "Mar", sales: 600 },
  { name: "Apr", sales: 900 },
  { name: "May", sales: 1200 },
];

const pieData = [
  { name: "Available", value: 80 },
  { name: "Reserved", value: 15 },
  { name: "Returned", value: 5 },
];

const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

const Charts = () => (
  <div className="charts">
    <div className="chart-card">
      <h3>Sales Summary</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={salesData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="#007bff" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="chart-card">
      <h3>Inventory Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default Charts;
