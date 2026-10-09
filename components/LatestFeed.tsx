'use client';

import React, { useState } from 'react';
import { Article } from '@/lib/types';
import ArticleCard from './ArticleCard';
import { Loader2, ArrowDownCircle } from 'lucide-react';

interface LatestFeedProps {
  initialArticles: Article[];
  initialTotal: number;
  category?: string;
}

export default function LatestFeed({
  initialArticles,
  initialTotal,
  category,
}: LatestFeedProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialArticles.length < initialTotal);

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({
        page: nextPage.toString(),
        limit: '6',
        status: 'published',
      });
      if (category) {
        params.set('category', category);
      }

      const res = await fetch(`/api/articles?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load more articles');
      const data = await res.json();

      if (data.articles && data.articles.length > 0) {
        setArticles((prev) => [...prev, ...data.articles]);
        setPage(nextPage);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more stories:', err);
    } finally {
      setLoading(false);
    }
  };

  if (articles.length === 0) {
    return (
      <div className="py-16 px-6 text-center bg-white border border-neutral-200/80 rounded-2xl max-w-xl mx-auto shadow-2xs">
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#E50914] mb-3" />
        <h3 className="text-base font-bold text-neutral-900 font-headline">
          No stories published yet
        </h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto leading-relaxed">
          Stories published via the editorial desk will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Editorial layout mixture: alternate between standard grid cards and horizontal features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, idx) => {
          // Every 4th item render horizontal across 2 columns on large screens for editorial rhythm
          const isWide = idx % 5 === 2;
          if (isWide) {
            return (
              <div key={article.id} className="md:col-span-2">
                <ArticleCard article={article} variant="horizontal" />
              </div>
            );
          }
          return (
            <div key={article.id}>
              <ArticleCard article={article} variant="standard" />
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="pt-8 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-bold tracking-wide uppercase rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#E50914]" />
                <span>Loading Stories...</span>
              </>
            ) : (
              <>
                <span>Load More Stories</span>
                <ArrowDownCircle className="w-4 h-4 group-hover:translate-y-0.5 transition-transform text-[#E50914]" />
              </>
            )}
          </button>
        </div>
      )}

      {!hasMore && articles.length > 0 && (
        <div className="pt-8 text-center">
          <p className="text-xs uppercase tracking-widest font-bold text-neutral-400">
            You’ve caught up with the latest dispatches
          </p>
        </div>
      )}
    </div>
  );
}
