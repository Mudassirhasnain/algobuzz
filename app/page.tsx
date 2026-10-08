import React from 'react';
import { getArticles } from '@/lib/db';
import FeaturedEditorial from '@/components/FeaturedEditorial';
import LatestFeed from '@/components/LatestFeed';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  // Fetch published articles
  const { articles: allPublished, total } = await getArticles({
    status: 'published',
    limit: 25,
  });

  // Pick lead story (featured story or newest)
  const featuredArticle = allPublished.find((a) => a.featured) || allPublished[0];
  const remaining = allPublished.filter((a) => a.id !== featuredArticle?.id);

  // Secondary stories for top hero
  const secondaryStories = remaining.slice(0, 2);
  const trendingStories = remaining.slice(2, 6);

  // Remaining articles for Latest Stories feed
  const feedArticles = remaining.slice(6);
  const feedTotal = Math.max(0, total - (1 + secondaryStories.length + trendingStories.length));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Editorial Featured Hero */}
      {featuredArticle && (
        <FeaturedEditorial
          leadStory={featuredArticle}
          secondaryStories={secondaryStories}
          trendingStories={trendingStories}
        />
      )}

      {/* Category Spotlight Badges / Quick Navigation Bar */}
      <section className="py-8 my-6 border-y border-neutral-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/movies"
            className="p-4 bg-white border border-neutral-200 rounded-xl hover:border-[#E50914] hover:shadow-xs transition-all group"
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-[#E50914] block">
              Section 01
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-black text-lg font-headline text-neutral-900 group-hover:text-[#E50914] transition-colors">
                Movies
              </span>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 group-hover:text-[#E50914] transition-all" />
            </div>
          </Link>

          <Link
            href="/anime"
            className="p-4 bg-white border border-neutral-200 rounded-xl hover:border-[#E50914] hover:shadow-xs transition-all group"
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-[#E50914] block">
              Section 02
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-black text-lg font-headline text-neutral-900 group-hover:text-[#E50914] transition-colors">
                Anime
              </span>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 group-hover:text-[#E50914] transition-all" />
            </div>
          </Link>

          <Link
            href="/gaming"
            className="p-4 bg-white border border-neutral-200 rounded-xl hover:border-[#E50914] hover:shadow-xs transition-all group"
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-[#E50914] block">
              Section 03
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-black text-lg font-headline text-neutral-900 group-hover:text-[#E50914] transition-colors">
                Gaming
              </span>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 group-hover:text-[#E50914] transition-all" />
            </div>
          </Link>

          <Link
            href="/news"
            className="p-4 bg-white border border-neutral-200 rounded-xl hover:border-[#E50914] hover:shadow-xs transition-all group"
          >
            <span className="text-[10px] font-black uppercase tracking-wider text-[#E50914] block">
              Section 04
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-black text-lg font-headline text-neutral-900 group-hover:text-[#E50914] transition-colors">
                News
              </span>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 group-hover:text-[#E50914] transition-all" />
            </div>
          </Link>
        </div>
      </section>

      {/* Latest Stories Section */}
      <section className="pt-8 pb-16">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 bg-[#E50914] rounded-sm" />
            <h2 className="text-2xl sm:text-3xl font-black font-headline tracking-tight text-neutral-950 uppercase">
              Latest Stories
            </h2>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Real-Time Feed
          </span>
        </div>

        <LatestFeed
          initialArticles={feedArticles.length > 0 ? feedArticles : remaining.slice(0, 6)}
          initialTotal={total}
        />
      </section>
    </div>
  );
}
