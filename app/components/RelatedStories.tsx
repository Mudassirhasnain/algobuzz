import React from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';
import ArticleCard from './ArticleCard';
import { ArrowLeft, ArrowRight, Compass } from 'lucide-react';

interface RelatedStoriesProps {
  currentArticle: Article;
  relatedArticles: Article[];
  prevArticle: Article | null;
  nextArticle: Article | null;
}

export default function RelatedStories({
  currentArticle,
  relatedArticles,
  prevArticle,
  nextArticle,
}: RelatedStoriesProps) {
  return (
    <section className="mt-16 pt-12 border-t border-neutral-200">
      {/* Prev / Next Story Navigator */}
      {(prevArticle || nextArticle) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {prevArticle ? (
            <Link
              href={`/${prevArticle.category}/${prevArticle.slug}`}
              className="p-5 border border-neutral-200 rounded-xl hover:border-neutral-300 hover:bg-neutral-50/60 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Previous Story</span>
              </div>
              <h4 className="text-base font-bold text-neutral-900 group-hover:text-[#E50914] transition-colors line-clamp-2">
                {prevArticle.title}
              </h4>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}

          {nextArticle && (
            <Link
              href={`/${nextArticle.category}/${nextArticle.slug}`}
              className="p-5 border border-neutral-200 rounded-xl hover:border-neutral-300 hover:bg-neutral-50/60 transition-all flex flex-col justify-between text-right sm:text-right group"
            >
              <div className="flex items-center justify-end gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                <span>Next Story</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="text-base font-bold text-neutral-900 group-hover:text-[#E50914] transition-colors line-clamp-2">
                {nextArticle.title}
              </h4>
            </Link>
          )}
        </div>
      )}

      {/* Related Stories Section */}
      {relatedArticles.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#E50914]" />
              <h3 className="text-xl sm:text-2xl font-black font-headline tracking-tight text-neutral-950 uppercase">
                Related Dispatches in {currentArticle.category}
              </h3>
            </div>
            <Link
              href={`/${currentArticle.category}`}
              className="text-xs font-bold uppercase tracking-wider text-[#E50914] hover:text-neutral-950 transition-colors"
            >
              View All {currentArticle.category} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="standard" />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
