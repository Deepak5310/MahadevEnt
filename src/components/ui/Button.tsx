import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'emerald' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className,
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-98';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs font-semibold gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white focus:ring-indigo-500 shadow-indigo-900/20 border border-indigo-400/20',
    emerald:
      'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white focus:ring-emerald-500 shadow-emerald-900/20 border border-emerald-400/20',
    purple:
      'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white focus:ring-purple-500 shadow-purple-900/20 border border-purple-400/20',
    secondary:
      'bg-slate-800 hover:bg-slate-700 text-slate-200 focus:ring-slate-500 border border-slate-700/60',
    outline:
      'bg-transparent hover:bg-slate-800/60 text-slate-300 border border-slate-700 focus:ring-slate-500',
    danger:
      'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white focus:ring-rose-500 border border-rose-400/20',
    ghost:
      'bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-transparent shadow-none',
  };

  return (
    <button
      className={clsx(baseClasses, sizeClasses[size], variantClasses[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon ? icon : null}
      {children}
    </button>
  );
};
