import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Flame, Clock, TrendingUp } from 'lucide-react';
import ArticleCard from './ArticleCard';

interface FeaturedEditorialProps {
  leadStory: Article;
  secondaryStories: Article[];
  trendingStories: Article[];
}

export default function FeaturedEditorial({
  leadStory,
  secondaryStories,
  trendingStories,
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
          <span className="font-bold text-neutral-900">BREAKING:</span> Paramount-Skydance merger finalized • Denis Villeneuve details Dune: Messiah • GTA VI RAGE 9 tech previewed
        </div>
      </div>

      {/* Main Editorial Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Dominant Lead Story (Col 1-8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <ArticleCard article={leadStory} variant="featured" priority={true} />

          {/* Secondary stories below lead story (2 columns) */}
          {secondaryStories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {secondaryStories.map((story) => (
                <ArticleCard key={story.id} article={story} variant="standard" />
              ))}
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
          </div>

          {/* Editorial Spotlight Banner */}
          <div className="bg-neutral-950 text-white rounded-xl p-6 relative overflow-hidden border border-neutral-800">
            <div className="relative z-10 space-y-3">
              <span className="inline-block px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest bg-[#E50914] text-white rounded">
                AlgoBuzz In-Depth
              </span>
              <h4 className="text-lg font-bold font-headline leading-tight">
                Cinematic Scale in the Streaming Age: Why Large Format Matters More Than Ever
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                An ongoing investigative critique on why 70mm and IMAX screenings continue to outpace living room consumption.
              </p>
              <Link
                href="/movies"
                className="inline-block text-xs font-bold text-[#E50914] hover:text-white transition-colors pt-1"
              >
                Explore Theatrical Archive →
              </Link>
            </div>
            {/* Background design glow */}
            <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-[#E50914]/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
