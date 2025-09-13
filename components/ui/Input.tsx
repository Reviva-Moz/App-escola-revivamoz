
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
}

export const Input: React.FC<InputProps> = ({ label, id, className = '', type = 'text', required, ...props }) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label htmlFor={id} className="mb-1 text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={id}
        required={required}
        className={`p-2 border border-gray-300 rounded-lg focus:ring-reviva-green-light focus:border-reviva-green-light ${className}`}
        {...props}
      />
    </div>
  );
};
