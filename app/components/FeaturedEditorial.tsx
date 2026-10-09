import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Flame, Clock, TrendingUp, Sparkles, PlusCircle } from 'lucide-react';
import ArticleCard from './ArticleCard';

interface FeaturedEditorialProps {
  leadStory?: Article | null;
  secondaryStories?: Article[];
  trendingStories?: Article[];
}

export default function FeaturedEditorial({
  leadStory,
  secondaryStories = [],
  trendingStories = [],
}: FeaturedEditorialProps) {
  return (
    <section className="pt-6 pb-12">
      {/* Ticker / Editorial Dispatch Bar */}
      <div className="flex items-center gap-3 py-2 px-4 mb-6 bg-white border border-neutral-200 rounded-lg text-xs overflow-hidden shadow-2xs">
        <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[#E50914] shrink-0">
          <Flame className="w-4 h-4 fill-[#E50914]" />
          <span>EDITORIAL DISPATCH</span>
        </div>
        <div className="h-3 w-[1px] bg-neutral-300 shrink-0" />
        <div className="text-neutral-600 truncate font-medium">
          <span className="font-bold text-neutral-900">ALGOBUZZ LIVE:</span> Independent journalism covering cinema, animation, interactive gaming, and entertainment culture.
        </div>
      </div>

      {/* Main Editorial Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Dominant Lead Story (Col 1-8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {leadStory ? (
            <ArticleCard article={leadStory} variant="featured" priority={true} />
          ) : (
            /* Standby frame for Main Article */
            <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-xl overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 p-8 md:p-10 flex flex-col justify-end text-white shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block px-2.5 py-1 text-xs font-black tracking-widest uppercase bg-[#E50914] text-white rounded">
                  MAIN ARTICLE SPOTLIGHT
                </span>
                <span className="text-xs text-neutral-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Homepage Lead Story
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black font-headline tracking-tight text-white max-w-2xl leading-tight">
                Publish a Story and Mark as &ldquo;Main Article&rdquo; to Headline AlgoBuzz
              </h2>

              <p className="mt-3 text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
                Use the admin editorial suite to write and publish your lead story. Any post with the Main Article option selected will dominate this featured hero section.
              </p>

              <div className="mt-5">
                <Link
                  href="/admin/posts/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold uppercase rounded-lg transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Create Main Article</span>
                </Link>
              </div>
            </div>
          )}

          {/* Secondary stories below lead story (2 columns) */}
          {secondaryStories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {secondaryStories.map((story) => (
                <ArticleCard key={story.id} article={story} variant="standard" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-white border border-neutral-200 rounded-xl shadow-2xs">
                <span className="text-[10px] font-black uppercase text-[#E50914] tracking-wider block mb-1">
                  FEATURE DESK 01
                </span>
                <h4 className="text-base font-bold font-headline text-neutral-900 leading-snug">
                  Secondary Lead Feature
                </h4>
                <p className="text-xs text-neutral-500 mt-2 line-clamp-2">
                  Additional published stories will automatically appear here in this secondary editorial card.
                </p>
              </div>
              <div className="p-6 bg-white border border-neutral-200 rounded-xl shadow-2xs">
                <span className="text-[10px] font-black uppercase text-[#E50914] tracking-wider block mb-1">
                  FEATURE DESK 02
                </span>
                <h4 className="text-base font-bold font-headline text-neutral-900 leading-snug">
                  Secondary Lead Feature
                </h4>
                <p className="text-xs text-neutral-500 mt-2 line-clamp-2">
                  Additional published stories will automatically appear here in this secondary editorial card.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Trending & Essential Dispatches (Col 9-12) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white border border-neutral-200/90 rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#E50914]" />
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900">
                  Trending Dispatches
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-neutral-400">Live 24h</span>
            </div>

            {trendingStories.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {trendingStories.map((story, idx) => (
                  <div key={story.id} className="py-3.5 first:pt-0 last:pb-0 flex gap-4 items-start group">
                    <span className="text-2xl font-black text-neutral-200 group-hover:text-[#E50914] transition-colors leading-none font-mono">
                      0{idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#E50914] block mb-1">
                        {story.category}
                      </span>
                      <Link
                        href={`/${story.category}/${story.slug}`}
                        className="text-sm font-bold text-neutral-900 group-hover:text-[#E50914] transition-colors leading-snug line-clamp-2 block"
                      >
                        {story.title}
                      </Link>
                      <div className="mt-1.5 flex items-center gap-2 text-[11px] text-neutral-400">
                        <span>By {story.author.name}</span>
                        <span>•</span>
                        <span>{story.readingTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center space-y-2">
                <p className="text-xs font-bold text-neutral-700">No trending dispatches yet</p>
                <p className="text-[11px] text-neutral-400">
                  Recent dispatches from each section will rank here automatically.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
