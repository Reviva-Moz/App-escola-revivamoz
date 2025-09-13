import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ label, id, children, required, className, ...props }) => {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={id} className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-300">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <select 
        id={id} 
        name={id} 
        required={required} 
        className={`p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:ring-reviva-green-light focus:border-reviva-green-light bg-white ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};
