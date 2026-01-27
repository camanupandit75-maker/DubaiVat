import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-[#1B4B7F] text-white hover:bg-[#153d6b] active:bg-[#0f2f51] disabled:bg-gray-300',
    secondary: 'border-2 border-[#1B4B7F] text-[#1B4B7F] hover:bg-[#1B4B7F] hover:text-white active:bg-[#153d6b] disabled:border-gray-300 disabled:text-gray-300',
    tertiary: 'text-[#1B4B7F] hover:bg-blue-50 active:bg-blue-100 disabled:text-gray-300',
    danger: 'bg-[#EF4444] text-white hover:bg-red-600 active:bg-red-700 disabled:bg-gray-300'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'cursor-not-allowed' : ''}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
