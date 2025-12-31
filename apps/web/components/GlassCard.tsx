import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'light' | 'dark';
  hover3d?: boolean;
}

export default function GlassCard({
  children,
  className = '',
  variant = 'light',
  hover3d = false
}: GlassCardProps) {
  const baseClasses = variant === 'light' ? 'glass' : 'glass-dark';
  const hoverClasses = hover3d
    ? 'hover:scale-105 hover:-translate-y-2 transition-all duration-300'
    : 'transition-all duration-300';

  return (
    <div className={`${baseClasses} rounded-xl p-6 ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}
