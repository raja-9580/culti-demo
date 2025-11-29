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
        'border border-accent-leaf/40 text-accent-leaf hover:bg-accent-leaf/10 hover:border-accent-leaf/60 transition-all shadow-none',
      secondary:
        'bg-dark-surface-light text-gray-100 border border-gray-700/30 hover:bg-dark-surface hover:text-gray-100 transition-all shadow-none',
      ghost: 'text-gray-400 hover:text-accent-leaf hover:bg-dark-surface-light/20 transition-colors',
      danger: 'bg-red-600/20 text-red-300 border border-red-600/40 hover:bg-red-600/30 transition-all shadow-none',
    };

    const sizeStyles = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
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
