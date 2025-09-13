
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FinancialCategory } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface CategoryPieChartProps {
  data: FinancialCategory[];
  title: string;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="font-semibold">{`${data.name}: ${formatCurrency(data.amount)}`}</p>
        </div>
      );
    }
  
    return null;
  };

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data, title }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
        <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="name"
                >
                    {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default CategoryPieChart;
