'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface CalloutProps {
  type?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const styles = {
    info: 'bg-blue-950/50 border-blue-500/50 text-blue-200',
    warning: 'bg-yellow-950/50 border-yellow-500/50 text-yellow-200',
    success: 'bg-green-950/50 border-green-500/50 text-green-200',
    error: 'bg-red-950/50 border-red-500/50 text-red-200',
  };

  return (
    <div className={cn('my-4 rounded-lg border-l-4 p-4', styles[type])}>
      {title && <div className="mb-2 font-semibold">{title}</div>}
      <div className="text-sm">{children}</div>
    </div>
  );
}
