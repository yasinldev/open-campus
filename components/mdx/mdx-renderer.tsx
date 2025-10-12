'use client';

import { useEffect, useState } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { Loader2 } from 'lucide-react';

interface MDXRendererProps {
  content: string;
  className?: string;
}

export function MDXRenderer({ content, className = '' }: MDXRendererProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function compileMDX() {
      if (!content || content.trim() === '') {
        setMdxSource(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const compiled = await serialize(content, {
          mdxOptions: {
            remarkPlugins: [remarkMath, remarkGfm],
            rehypePlugins: [rehypeKatex],
          },
        });
        
        setMdxSource(compiled);
      } catch (err) {
        console.error('MDX compilation error:', err);
        setError('Failed to render content. Please check the MDX syntax.');
      } finally {
        setLoading(false);
      }
    }

    compileMDX();
  }, [content]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border border-destructive/50 rounded-lg bg-destructive/10">
        <p className="text-destructive font-medium">{error}</p>
      </div>
    );
  }

  if (!mdxSource) {
    return (
      <div className="p-6 border border-border rounded-lg bg-muted/50">
        <p className="text-muted-foreground text-center">No content available</p>
      </div>
    );
  }

  return (
    <div className={`prose prose-slate dark:prose-invert max-w-none ${className}`}>
      <MDXRemote {...mdxSource} />
    </div>
  );
}

