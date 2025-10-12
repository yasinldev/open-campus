# Article Lesson Setup Guide

## 📦 Required Packages

Install the following packages for MDX and LaTeX support:

```bash
npm install @mdx-js/react @next/mdx rehype-katex remark-math remark-gfm
# or
pnpm add @mdx-js/react @next/mdx rehype-katex remark-math remark-gfm
```

## 📝 Package Descriptions

- **@mdx-js/react**: MDX runtime for React components
- **@next/mdx**: Next.js MDX integration
- **rehype-katex**: Renders LaTeX math using KaTeX
- **remark-math**: Parses math syntax in Markdown
- **remark-gfm**: GitHub Flavored Markdown support

## 🎨 KaTeX CSS

Add KaTeX CSS to your `app/globals.css`:

```css
/* KaTeX CSS for LaTeX rendering */
@import url('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css');
```

## 📖 MDX Syntax Examples

### Basic Markdown
```mdx
# Heading 1
## Heading 2

**Bold text** and *italic text*

- List item 1
- List item 2

1. Numbered item 1
2. Numbered item 2
```

### Inline Math
```mdx
The quadratic formula is $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
```

### Block Math
```mdx
$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

### Code Blocks
```mdx
\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`
```

## 🔧 Implementation

### 1. Create MDX Renderer Component

Create `components/mdx/mdx-renderer.tsx`:

```tsx
'use client';

import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { useEffect, useState } from 'react';

export function MDXRenderer({ content }: { content: string }) {
  const [mdxSource, setMdxSource] = useState(null);

  useEffect(() => {
    async function compileMDX() {
      const compiled = await serialize(content, {
        mdxOptions: {
          remarkPlugins: [remarkMath, remarkGfm],
          rehypePlugins: [rehypeKatex],
        },
      });
      setMdxSource(compiled);
    }
    compileMDX();
  }, [content]);

  if (!mdxSource) return <div>Loading...</div>;

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <MDXRemote {...mdxSource} />
    </div>
  );
}
```

### 2. Update Course Learning Page

In `app/[locale]/dashboard/courses/[slug]/page.tsx`:

```tsx
import { MDXRenderer } from '@/components/mdx/mdx-renderer';

// In the lesson content area:
{currentLesson?.type === 'article' ? (
  <div className="p-6 bg-background">
    <MDXRenderer content={currentLesson.mdx_content || ''} />
  </div>
) : (
  // Video player
)}
```

## 🎯 Database Schema

The `syllabus` JSONB in `courses` table should include:

```json
{
  "week": 1,
  "title": "Introduction to Calculus",
  "type": "article",
  "mdx_content": "# Introduction\n\nCalculus is...\n\n$$\\int_0^1 x^2 dx$$",
  "topics": ["Limits", "Derivatives"],
  "locked": false
}
```

## ✅ Features

- ✅ Full Markdown support
- ✅ LaTeX math rendering (inline and block)
- ✅ Code syntax highlighting
- ✅ GitHub Flavored Markdown (tables, task lists, etc.)
- ✅ Responsive design
- ✅ Dark mode support

## 🚀 Usage

1. Run SQL migration: `sql/add_article_type_and_mdx.sql`
2. Install packages
3. Add KaTeX CSS
4. Create MDX renderer component
5. Update course learning page
6. Test with sample article lesson

## 📚 Example Article Content

```mdx
# Introduction to Derivatives

## What is a Derivative?

The derivative of a function $f(x)$ represents the **rate of change** at any point.

### Definition

$$
f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
$$

### Common Derivatives

| Function | Derivative |
|----------|------------|
| $x^n$ | $nx^{n-1}$ |
| $e^x$ | $e^x$ |
| $\sin(x)$ | $\cos(x)$ |

### Example

Find the derivative of $f(x) = x^2 + 3x + 2$:

$$
\begin{align}
f'(x) &= \frac{d}{dx}(x^2 + 3x + 2) \\
&= 2x + 3
\end{align}
$$

## Practice Problems

1. Find $\frac{d}{dx}(x^3 - 2x + 1)$
2. Calculate $\lim_{x \to 0} \frac{\sin(x)}{x}$
```

