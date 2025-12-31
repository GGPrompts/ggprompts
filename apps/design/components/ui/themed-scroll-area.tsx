'use client';

import { useId, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type ThemedScrollAreaProps = {
  children: React.ReactNode;
  className?: string;
  primaryColor: string;
  orientation?: 'vertical' | 'horizontal' | 'both';
} & React.HTMLAttributes<HTMLDivElement>;

export const ThemedScrollArea = forwardRef<HTMLDivElement, ThemedScrollAreaProps>(
  ({ children, className, primaryColor, orientation = 'vertical', ...props }, ref) => {
    const id = useId();
    const scrollId = `scroll-${id.replace(/:/g, '')}`;

    const scrollbarStyles = `
      #${scrollId}::-webkit-scrollbar {
        width: ${orientation !== 'horizontal' ? '8px' : '0'};
        height: ${orientation !== 'vertical' ? '8px' : '0'};
      }
      #${scrollId}::-webkit-scrollbar-track {
        background: ${primaryColor}15;
        border-radius: 4px;
      }
      #${scrollId}::-webkit-scrollbar-thumb {
        background: ${primaryColor}50;
        border-radius: 4px;
        border: 2px solid transparent;
        background-clip: padding-box;
      }
      #${scrollId}::-webkit-scrollbar-thumb:hover {
        background: ${primaryColor}80;
        border: 2px solid transparent;
        background-clip: padding-box;
      }
      #${scrollId}::-webkit-scrollbar-corner {
        background: ${primaryColor}10;
      }
      #${scrollId} {
        scrollbar-color: ${primaryColor}50 ${primaryColor}15;
        scrollbar-width: thin;
      }
    `;

    const overflowClass = {
      vertical: 'overflow-y-auto overflow-x-hidden',
      horizontal: 'overflow-x-auto overflow-y-hidden',
      both: 'overflow-auto',
    }[orientation];

    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
        <div
          ref={ref}
          id={scrollId}
          className={cn(overflowClass, className)}
          {...props}
        >
          {children}
        </div>
      </>
    );
  }
);

ThemedScrollArea.displayName = 'ThemedScrollArea';
