export type Category = 'movies' | 'anime' | 'gaming' | 'news';

export type ArticleStatus = 'draft' | 'published';

export interface Author {
  name: string;
  role: string;
  avatar?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  content: string;
  category: Category;
  author: Author;
  heroImage: string;
  heroImageAlt: string;
  imageCaption?: string;
  tags: string[];
  status: ArticleStatus;
  featured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  readingTime: string;
}

export interface ArticleFilterOptions {
  category?: Category;
  status?: ArticleStatus;
  featured?: boolean;
  search?: string;
  tag?: string;
  page?: number;
  limit?: number;
}
