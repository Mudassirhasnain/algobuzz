import React from 'react';
import { getArticles } from '@/lib/db';
import FeaturedEditorial from '@/components/FeaturedEditorial';
import ArticleCard from '@/components/ArticleCard';
import LatestFeed from '@/components/LatestFeed';
import { ArrowRight, Film, Sparkles, Gamepad2, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { Category } from '@/lib/types';

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  // Fetch all published articles
  const { articles: allPublished, total } = await getArticles({
    status: 'published',
    limit: 30,
  });

  // 1. Identify the Main Article (explicitly selected as featured, or first published)
  const leadStory = allPublished.find((a) => a.featured) || allPublished[0] || null;
  const nonLeadArticles = allPublished.filter((a) => a.id !== leadStory?.id);

  // Secondary stories for top hero
  const secondaryStories = nonLeadArticles.slice(0, 2);
  const trendingStories = nonLeadArticles.slice(2, 6);

  // Group newest articles by category for category desks
  const moviesArticles = allPublished.filter((a) => a.category === 'movies').slice(0, 3);
  const animeArticles = allPublished.filter((a) => a.category === 'anime').slice(0, 3);
  const gamingArticles = allPublished.filter((a) => a.category === 'gaming').slice(0, 3);
  const newsArticles = allPublished.filter((a) => a.category === 'news').slice(0, 3);

  // Latest feed articles (excluding lead)
  const feedArticles = nonLeadArticles.slice(6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* 1. Sophisticated Featured Hero (with Main Article spotlight) */}
      <FeaturedEditorial
        leadStory={leadStory}
        secondaryStories={secondaryStories}
        trendingStories={trendingStories}
      />

      {/* 2. Category Quick Navigation Bar */}
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

      {/* 3. New Articles from Each Category (Editorial Desks) */}
      <section className="py-6 space-y-12">
        {/* Movies Row */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-6">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-[#E50914]" />
              <h3 className="text-xl font-black font-headline tracking-tight text-neutral-900 uppercase">
                Movies & Theatrical
              </h3>
            </div>
            <Link
              href="/movies"
              className="text-xs font-bold uppercase tracking-wider text-[#E50914] hover:text-neutral-900 transition-colors"
            >
              View Movies Desk →
            </Link>
          </div>
          {moviesArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {moviesArticles.map((art) => (
                <ArticleCard key={art.id} article={art} variant="standard" />
              ))}
            </div>
          ) : (
            <div className="py-8 px-6 bg-white border border-neutral-200/80 rounded-xl text-center text-xs text-neutral-400">
              New stories published in Movies will appear here.
            </div>
          )}
        </div>

        {/* Anime Row */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E50914]" />
              <h3 className="text-xl font-black font-headline tracking-tight text-neutral-900 uppercase">
                Anime & Manga Adaptations
              </h3>
            </div>
            <Link
              href="/anime"
              className="text-xs font-bold uppercase tracking-wider text-[#E50914] hover:text-neutral-900 transition-colors"
            >
              View Anime Desk →
            </Link>
          </div>
          {animeArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {animeArticles.map((art) => (
                <ArticleCard key={art.id} article={art} variant="standard" />
              ))}
            </div>
          ) : (
            <div className="py-8 px-6 bg-white border border-neutral-200/80 rounded-xl text-center text-xs text-neutral-400">
              New stories published in Anime will appear here.
            </div>
          )}
        </div>

        {/* Gaming Row */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-6">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-[#E50914]" />
              <h3 className="text-xl font-black font-headline tracking-tight text-neutral-900 uppercase">
                Gaming & Interactive Systems
              </h3>
            </div>
            <Link
              href="/gaming"
              className="text-xs font-bold uppercase tracking-wider text-[#E50914] hover:text-neutral-900 transition-colors"
            >
              View Gaming Desk →
            </Link>
          </div>
          {gamingArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gamingArticles.map((art) => (
                <ArticleCard key={art.id} article={art} variant="standard" />
              ))}
            </div>
          ) : (
            <div className="py-8 px-6 bg-white border border-neutral-200/80 rounded-xl text-center text-xs text-neutral-400">
              New stories published in Gaming will appear here.
            </div>
          )}
        </div>

        {/* News Row */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-6">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-[#E50914]" />
              <h3 className="text-xl font-black font-headline tracking-tight text-neutral-900 uppercase">
                Industry & Box Office News
              </h3>
            </div>
            <Link
              href="/news"
              className="text-xs font-bold uppercase tracking-wider text-[#E50914] hover:text-neutral-900 transition-colors"
            >
              View News Desk →
            </Link>
          </div>
          {newsArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsArticles.map((art) => (
                <ArticleCard key={art.id} article={art} variant="standard" />
              ))}
            </div>
          ) : (
            <div className="py-8 px-6 bg-white border border-neutral-200/80 rounded-xl text-center text-xs text-neutral-400">
              New stories published in News will appear here.
            </div>
          )}
        </div>
      </section>

      {/* 4. Latest Stories Feed (Reverse Chronological with Load More) */}
      <section className="pt-10 pb-16 border-t border-neutral-200">
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
          initialArticles={feedArticles.length > 0 ? feedArticles : nonLeadArticles.slice(0, 6)}
          initialTotal={total}
        />
      </section>
    </div>
  );
}
