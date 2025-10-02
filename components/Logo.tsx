import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      <h1 className="text-2xl font-bold text-reviva-green-dark dark:text-reviva-green-light">
        Escola Reviva
      </h1>
      <p className="text-xs text-slate-900 dark:text-white mt-1">
        SiGER
      </p>
    </div>
  );
};

export default Logo;
