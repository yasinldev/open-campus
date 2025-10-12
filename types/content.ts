export interface Fellow {
  slug: string;
  name: string;
  short: string;
  description: string;
  tags: string[];
  model?: string;
  repo?: string;
  docs?: string;
  avatar?: string;
}

export interface Course {
  slug: string;
  title: string;
  summary: string;
  level: 'intro' | 'intermediate' | 'advanced';
  fellows?: string[];
  syllabus?: string[];
  resources?: { label: string; url: string }[];
}

export interface Project {
  slug: string;
  title: string;
  abstract: string;
  fellows?: string[];
  links?: { label: string; url: string }[];
  metrics?: { name: string; value: string }[];
  publishedAt?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  author: string;
  category?: string;
  tags?: string[];
  coverImage?: string;
}

export interface Doc {
  slug: string;
  title: string;
  description?: string;
  order?: number;
}
