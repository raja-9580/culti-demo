import React from 'react';

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', ...props }, ref) => {
    const baseStyles =
      'font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg';

    const variantStyles = {
      primary:
        'bg-accent-leaf text-dark-bg hover:bg-accent-sky hover:text-dark-bg transition-all shadow-lg',
      secondary:
        'bg-dark-surface-light text-gray-100 border border-gray-700/50 hover:bg-dark-surface hover:text-gray-100 transition-all',
      ghost: 'text-gray-400 hover:text-accent-leaf hover:bg-dark-surface-light/50 transition-colors',
      danger: 'bg-red-600 text-white hover:bg-red-700 transition-all',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;
