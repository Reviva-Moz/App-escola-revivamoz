import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  details?: string;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, details, colorClass }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md dark:shadow-none dark:border dark:border-slate-700 flex items-center transition-transform transform hover:scale-105">
      <div className={`rounded-lg p-3 mr-4 ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        {details && <p className="text-xs text-slate-400 dark:text-slate-500">{details}</p>}
      </div>
    </div>
  );
};

export default StatCard;
