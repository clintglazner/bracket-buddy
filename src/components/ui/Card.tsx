import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlight' | 'dark';
  hover?: boolean;
  onClick?: () => void;
}

const variantClasses = {
  default: 'bg-navy-800 border border-white/10',
  highlight: 'bg-navy-700 border-2 border-accent-red/60 shadow-glow',
  dark: 'bg-navy-900 border border-white/5',
};

export default function Card({
  children,
  className = '',
  variant = 'default',
  hover = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        'rounded-2xl shadow-card p-6',
        'transition-all duration-300',
        variantClasses[variant],
        hover ? 'hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer' : '',
        onClick ? 'cursor-pointer' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
