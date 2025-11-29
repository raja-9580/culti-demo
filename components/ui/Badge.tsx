import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'info' | 'danger' | 'neutral';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant = 'neutral', className = '', ...props }, ref) => {
    const variantStyles = {
      success: 'bg-green-900/40 text-green-300 border border-green-800/50 rounded-full',
      warning: 'bg-amber-900/40 text-amber-300 border border-amber-800/50 rounded-full',
      info: 'bg-cyan-900/40 text-cyan-300 border border-cyan-800/50 rounded-full',
      danger: 'bg-red-900/40 text-red-300 border border-red-800/50 rounded-full',
      neutral: 'bg-gray-800/40 text-gray-400 border border-gray-700/50 rounded-full',
    };

    return (
      <div
        ref={ref}
        className={`inline-block px-3 py-1 text-xs font-medium ${variantStyles[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
