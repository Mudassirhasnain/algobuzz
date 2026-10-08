import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getArticleBySlug, getRelatedArticles, getAdjacentArticles } from '@/lib/db';
import { formatDate, formatFullDate } from '@/lib/utils';
import ArticleBody from '@/components/ArticleBody';
import ShareBar from '@/components/ShareBar';
import RelatedStories from '@/components/RelatedStories';
import { Clock, Calendar, User, ArrowLeft } from 'lucide-react';

interface ArticlePageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const article = await getArticleBySlug(category, slug, false);

  if (!article) {
    return { title: 'Article Not Found | AlgoBuzz' };
  }

  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const canonicalUrl = `${appUrl}/${article.category}/${article.slug}`;

  return {
    title: `${article.title} | AlgoBuzz`,
    description: article.excerpt || article.subtitle,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: article.title,
      description: article.excerpt || article.subtitle,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      section: article.category,
      tags: article.tags,
      images: [
        {
          url: article.heroImage,
          width: 1200,
          height: 630,
          alt: article.heroImageAlt || article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || article.subtitle,
      images: [article.heroImage],
      creator: '@AlgoBuzzMedia',
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { category, slug } = await params;
  const article = await getArticleBySlug(category, slug, false);

  if (!article) {
    notFound();
  }

  const [relatedArticles, adjacent] = await Promise.all([
    getRelatedArticles(article, 3),
    getAdjacentArticles(article),
  ]);

  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const articleUrl = `${appUrl}/${article.category}/${article.slug}`;

  // Structured Data (JSON-LD) for NewsArticle
  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt || article.subtitle,
    image: [article.heroImage],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: [
      {
        '@type': 'Person',
        name: article.author.name,
        jobTitle: article.author.role,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'AlgoBuzz',
      logo: {
        '@type': 'ImageObject',
        url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleSection: article.category,
    keywords: article.tags.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb / Back Link */}
        <div className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
          <Link
            href={`/${article.category}`}
            className="flex items-center gap-1 hover:text-[#E50914] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {article.category}</span>
          </Link>
        </div>

        {/* Top Header Section */}
        <div className="max-w-4xl mx-auto text-center space-y-5 mb-10">
          {/* Category Tag */}
          <Link
            href={`/${article.category}`}
            className="inline-block px-3 py-1 text-xs font-black uppercase tracking-widest bg-[#E50914] text-white rounded hover:bg-neutral-950 transition-colors"
          >
            {article.category}
          </Link>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-headline tracking-tight text-neutral-950 leading-[1.08]">
            {article.title}
          </h1>

          {/* Subtitle / Deck */}
          {article.subtitle && (
            <p className="text-lg sm:text-2xl text-neutral-600 font-medium leading-relaxed max-w-3xl mx-auto">
              {article.subtitle}
            </p>
          )}

          {/* Byline & Date */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-500 font-medium border-t border-neutral-200">
            {/* Author Avatar & Name */}
            <div className="flex items-center gap-2 text-neutral-900 font-bold">
              {article.author.avatar ? (
                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-neutral-300">
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    fill
                    className="object-cover"
                    sizes="28px"
                  />
                </div>
              ) : (
                <User className="w-4 h-4 text-neutral-400" />
              )}
              <span>By {article.author.name}</span>
              <span className="text-neutral-400 font-normal">({article.author.role})</span>
            </div>

            <span className="text-neutral-300">•</span>

            <span className="flex items-center gap-1.5" title={formatFullDate(article.publishedAt)}>
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            </span>

            <span className="text-neutral-300">•</span>

            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>{article.readingTime}</span>
            </span>
          </div>

          {/* Share Bar */}
          <div className="flex justify-center pt-2">
            <ShareBar title={article.title} url={articleUrl} />
          </div>
        </div>

        {/* Full-width Cinematic Hero Image */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-neutral-900 shadow-md">
            <Image
              src={article.heroImage}
              alt={article.heroImageAlt || article.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1100px"
            />
          </div>
          {article.imageCaption && (
            <p className="text-xs text-neutral-500 mt-2.5 text-center italic">
              {article.imageCaption}
            </p>
          )}
        </div>

        {/* Article Body Content */}
        <ArticleBody content={article.content} />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="max-w-3xl mx-auto mt-12 pt-6 border-t border-neutral-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mr-2">
                FILED UNDER:
              </span>
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 bg-neutral-100 hover:bg-[#E50914] hover:text-white text-neutral-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio Card */}
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white border border-neutral-200 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-xs">
          {article.author.avatar && (
            <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-[#E50914]">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          )}
          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <h4 className="text-base font-black font-headline text-neutral-900">
              {article.author.name}
            </h4>
            <p className="text-xs font-bold uppercase tracking-wider text-[#E50914]">
              {article.author.role}
            </p>
            <p className="text-xs text-neutral-600 leading-relaxed pt-1">
              Senior staff correspondent for AlgoBuzz covering the intersection of creative storytelling, production economics, and international entertainment media.
            </p>
          </div>
        </div>

        {/* Related Stories & Prev/Next */}
        <RelatedStories
          currentArticle={article}
          relatedArticles={relatedArticles}
          prevArticle={adjacent.prev}
          nextArticle={adjacent.next}
        />
      </article>
    </>
  );
}
