"use client";
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> { value?: number }

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('h-2 w-full overflow-hidden rounded bg-muted', className)} {...props}>
        <div className="h-full bg-indigo-500 transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    );
  }
);
Progress.displayName = 'Progress';
