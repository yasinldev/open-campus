'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  language?: string;
}

export function CodeBlock({ children, className, language }: CodeBlockProps) {
  return (
    <div className="relative my-4">
      {language && (
        <div className="absolute right-2 top-2 rounded bg-muted px-2 py-1 text-xs font-mono text-muted-foreground">
          {language}
        </div>
      )}
      <pre className={cn('overflow-x-auto rounded-lg bg-muted p-4', className)}>
        <code className="font-mono text-sm">{children}</code>
      </pre>
    </div>
  );
}
