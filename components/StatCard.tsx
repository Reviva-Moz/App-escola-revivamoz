
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
    <div className="bg-white p-5 rounded-xl shadow-md flex items-center transition-transform transform hover:scale-105">
      <div className={`rounded-lg p-3 mr-4 ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {details && <p className="text-xs text-gray-400">{details}</p>}
      </div>
    </div>
  );
};

export default StatCard;
