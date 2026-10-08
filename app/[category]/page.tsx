import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getArticles } from '@/lib/db';
import { CATEGORY_INFO } from '@/lib/utils';
import { Category } from '@/lib/types';
import ArticleCard from '@/components/ArticleCard';
import LatestFeed from '@/components/LatestFeed';

const VALID_CATEGORIES = ['movies', 'anime', 'gaming', 'news'];

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const catKey = category.toLowerCase();

  if (!VALID_CATEGORIES.includes(catKey)) {
    return { title: 'Category Not Found' };
  }

  const info = CATEGORY_INFO[catKey];

  return {
    title: `${info.label} — In-Depth Coverage & Reviews`,
    description: info.description,
    openGraph: {
      title: `${info.label} | AlgoBuzz`,
      description: info.description,
      url: `/${catKey}`,
    },
    alternates: {
      canonical: `/${catKey}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const catKey = category.toLowerCase();

  if (!VALID_CATEGORIES.includes(catKey)) {
    notFound();
  }

  const info = CATEGORY_INFO[catKey];

  // Fetch published articles in this category
  const { articles, total } = await getArticles({
    category: catKey as Category,
    status: 'published',
    limit: 12,
  });

  const featuredStory = articles.find((a) => a.featured) || articles[0];
  const gridStories = articles.filter((a) => a.id !== featuredStory?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Category Editorial Header */}
      <div className="mb-12 pb-8 border-b border-neutral-200">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E50914]" />
          <span className="text-xs font-black uppercase tracking-widest text-[#E50914]">
            ALGOBUZZ SECTION DESK
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black font-headline tracking-tight text-neutral-950 uppercase">
          {info.label}
        </h1>

        <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-3xl leading-relaxed">
          {info.description}
        </p>
      </div>

      {/* Featured Lead in this category */}
      {featuredStory ? (
        <div className="space-y-12">
          <section>
            <div className="mb-4">
              <span className="text-[11px] font-black uppercase tracking-widest text-neutral-400">
                Featured Lead
              </span>
            </div>
            <ArticleCard article={featuredStory} variant="featured" priority={true} />
          </section>

          {/* Category Feed with Load More */}
          <section className="pt-6">
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-200">
              <h2 className="text-xl sm:text-2xl font-black font-headline tracking-tight text-neutral-900 uppercase">
                All {info.label} Stories ({total})
              </h2>
            </div>

            <LatestFeed
              initialArticles={gridStories}
              initialTotal={total - 1}
              category={catKey}
            />
          </section>
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-neutral-200 rounded-2xl">
          <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest">
            No articles currently published in this section.
          </p>
        </div>
      )}
    </div>
  );
}
