'use client';

import { useMDXComponent } from 'next-contentlayer2/hooks';
import Image from 'next/image';
import { Callout } from './ui/callout';
import { CodeBlock } from './ui/code-block';

const components = {
  Image,
  Callout,
  CodeBlock,
  h1: ({ ...props }) => <h1 className="mt-8 mb-4 text-4xl font-bold" {...props} />,
  h2: ({ ...props }) => <h2 className="mt-8 mb-4 text-3xl font-bold" {...props} />,
  h3: ({ ...props }) => <h3 className="mt-6 mb-3 text-2xl font-semibold" {...props} />,
  h4: ({ ...props }) => <h4 className="mt-4 mb-2 text-xl font-semibold" {...props} />,
  p: ({ ...props }) => <p className="mb-4 leading-7" {...props} />,
  ul: ({ ...props }) => <ul className="mb-4 ml-6 list-disc" {...props} />,
  ol: ({ ...props }) => <ol className="mb-4 ml-6 list-decimal" {...props} />,
  li: ({ ...props }) => <li className="mb-2" {...props} />,
  a: ({ ...props }) => (
    <a className="text-primary underline underline-offset-4 hover:text-primary/80" {...props} />
  ),
  code: ({ ...props }) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm" {...props} />
  ),
  pre: ({ ...props }) => <pre className="mb-4 overflow-x-auto rounded-lg bg-muted p-4" {...props} />,
  blockquote: ({ ...props }) => (
    <blockquote className="mt-6 border-l-2 border-primary pl-6 italic" {...props} />
  ),
};

interface MDXContentProps {
  code: string;
}

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMDXComponent(code);

  return (
    <div className="prose prose-invert max-w-none">
      <Component components={components} />
    </div>
  );
}
