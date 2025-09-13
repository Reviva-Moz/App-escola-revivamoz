
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
        <div className="bg-white dark:bg-slate-700 p-2 border border-slate-200 dark:border-slate-600 rounded shadow-sm">
          <p className="font-semibold text-slate-800 dark:text-slate-200">{`${data.name}: ${formatCurrency(data.amount)}`}</p>
        </div>
      );
    }
  
    return null;
  };

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data, title }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md dark:shadow-none dark:border dark:border-slate-700 h-full flex flex-col">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">{title}</h3>
        <div className="flex-grow text-sm text-slate-600 dark:text-slate-400">
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