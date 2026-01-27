import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  success,
  helperText,
  icon,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full px-4 py-2 ${icon ? 'pl-10' : ''} border rounded-lg transition-all duration-200
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' : ''}
            ${success ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200' : ''}
            ${!error && !success ? 'border-gray-300 focus:border-[#1B4B7F] focus:ring-2 focus:ring-blue-200' : ''}
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${className}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {success && (
        <p className="mt-1 text-sm text-green-600">{success}</p>
      )}
      {helperText && !error && !success && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
