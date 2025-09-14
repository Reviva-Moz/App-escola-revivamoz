import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <h1 className="text-2xl font-bold text-reviva-green dark:text-reviva-green-light py-4">
        Escola Reviva
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-300 -mt-2 tracking-tight">
        SGE - Sistema de Gestão Escolar
      </p>
    </div>
  );
};

export default Logo;
