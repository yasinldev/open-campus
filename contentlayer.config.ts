import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

export const Fellow = defineDocumentType(() => ({
  name: 'Fellow',
  filePathPattern: 'fellows/**/*.mdx',
  contentType: 'mdx',
  fields: {
    slug: { type: 'string', required: true },
    name: { type: 'string', required: true },
    short: { type: 'string', required: true },
    description: { type: 'string', required: true },
    tags: { type: 'list', of: { type: 'string' }, required: true },
    model: { type: 'string', required: false },
    repo: { type: 'string', required: false },
    docs: { type: 'string', required: false },
    avatar: { type: 'string', required: false },
  },
  computedFields: {
    url: { type: 'string', resolve: (doc) => `/fellows/${doc.slug}` },
  },
}));

export const Course = defineDocumentType(() => ({
  name: 'Course',
  filePathPattern: 'courses/**/*.mdx',
  contentType: 'mdx',
  fields: {
    slug: { type: 'string', required: true },
    title: { type: 'string', required: true },
    summary: { type: 'string', required: true },
    level: { type: 'enum', options: ['intro', 'intermediate', 'advanced'], required: true },
    fellows: { type: 'list', of: { type: 'string' }, required: false },
    syllabus: { type: 'list', of: { type: 'string' }, required: false },
    resources: {
      type: 'list',
      of: { type: 'json' },
      required: false,
    },
  },
  computedFields: {
    url: { type: 'string', resolve: (doc) => `/courses/${doc.slug}` },
  },
}));

export const Project = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: 'research/**/*.mdx',
  contentType: 'mdx',
  fields: {
    slug: { type: 'string', required: true },
    title: { type: 'string', required: true },
    abstract: { type: 'string', required: true },
    fellows: { type: 'list', of: { type: 'string' }, required: false },
    links: {
      type: 'list',
      of: { type: 'json' },
      required: false,
    },
    metrics: {
      type: 'list',
      of: { type: 'json' },
      required: false,
    },
    publishedAt: { type: 'date', required: false },
  },
  computedFields: {
    url: { type: 'string', resolve: (doc) => `/research/${doc.slug}` },
  },
}));

export const BlogPost = defineDocumentType(() => ({
  name: 'BlogPost',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    slug: { type: 'string', required: true },
    title: { type: 'string', required: true },
    summary: { type: 'string', required: true },
    publishedAt: { type: 'date', required: true },
    author: { type: 'string', required: true },
    category: { type: 'string', required: false },
    tags: { type: 'list', of: { type: 'string' }, required: false },
    coverImage: { type: 'string', required: false },
  },
  computedFields: {
    url: { type: 'string', resolve: (doc) => `/blog/${doc.slug}` },
  },
}));

export const Doc = defineDocumentType(() => ({
  name: 'Doc',
  filePathPattern: 'docs/**/*.mdx',
  contentType: 'mdx',
  fields: {
    slug: { type: 'string', required: true },
    title: { type: 'string', required: true },
    description: { type: 'string', required: false },
    order: { type: 'number', required: false },
  },
  computedFields: {
    url: { type: 'string', resolve: (doc) => `/docs/${doc.slug}` },
  },
}));

export default makeSource({
  contentDirPath: './content',
  documentTypes: [Fellow, Course, Project, BlogPost, Doc],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: 'github-dark',
          onVisitLine(node: any) {
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }];
            }
          },
          onVisitHighlightedLine(node: any) {
            node.properties.className.push('line--highlighted');
          },
          onVisitHighlightedWord(node: any) {
            node.properties.className = ['word--highlighted'];
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['anchor'],
            ariaLabel: 'Link to section',
          },
        },
      ],
    ],
  },
});
