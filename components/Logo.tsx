import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`p-6 text-center ${className}`}>
      <h1 className="text-4xl font-bold text-reviva-green-dark dark:text-reviva-green-light">
        Escola Reviva
      </h1>
      <p className="text-sm text-slate-900 dark:text-white mt-1">
        SiGER - Sistema de Gestão Escolar Reviva
      </p>
    </div>
  );
};

export default Logo;