import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

export default function CommissionChart({ data }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      // Format data for the chart
      const formattedData = data.map(item => ({
        name: item.name.substring(0, 10) + (item.name.length > 10 ? '...' : ''),
        commission: item.commission
      }));
      setChartData(formattedData);
    }
  }, [data]);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`$${value}`, 'Commission']}
            labelFormatter={(label) => `Affiliate: ${label}`}
          />
          <Legend />
          <Bar 
            dataKey="commission" 
            fill="#8884d8" 
            name="Commission ($)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-500 text-center mt-2">
        Hover over bars for details
      </p>
    </div>
  );
}