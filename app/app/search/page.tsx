import React from 'react';
import type { Metadata } from 'next';
import { getArticles } from '@/lib/db';
import ArticleCard from '@/components/ArticleCard';
import { Search as SearchIcon, Compass } from 'lucide-react';
import Link from 'next/link';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q || '';

  return {
    title: query ? `Search results for "${query}"` : 'Search News, Movies, Anime & Gaming Stories',
    description: 'Search the full AlgoBuzz archive of AI, tech, movie, anime and gaming news.',
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (q || '').trim();

  let results: any[] = [];
  let total = 0;

  if (query) {
    const data = await getArticles({
      search: query,
      status: 'published',
      limit: 30,
    });
    results = data.articles;
    total = data.total;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Search Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
        <h1 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-neutral-950 uppercase">
          Search AlgoBuzz
        </h1>
        <p className="text-sm sm:text-base text-neutral-600">
          Explore movies, anime adaptations, interactive gaming, and entertainment news archives.
        </p>

        {/* Search Form */}
        <form action="/search" method="GET" className="relative max-w-xl mx-auto pt-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search keywords, titles, directors, franchises..."
            className="w-full pl-12 pr-28 py-3.5 bg-white border-2 border-neutral-200 focus:border-[#E50914] rounded-2xl text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none shadow-sm transition-all"
          />
          <SearchIcon className="w-5 h-5 text-neutral-400 absolute left-4.5 top-5.5" />
          <button
            type="submit"
            className="absolute right-2 top-3.5 px-5 py-2 bg-[#E50914] hover:bg-neutral-900 text-white text-xs font-bold uppercase rounded-xl transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results Section */}
      {query ? (
        <div className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
              Showing <span className="text-neutral-950 font-black">{total}</span> results for &ldquo;
              <span className="text-[#E50914]">{query}</span>&rdquo;
            </h2>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((article) => (
                <ArticleCard key={article.id} article={article} variant="standard" />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-neutral-200 rounded-2xl max-w-xl mx-auto p-8 space-y-4">
              <Compass className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="text-lg font-bold text-neutral-900">No matching stories found</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                We couldn&apos;t find any stories matching &ldquo;{query}&rdquo;. Try broader terms like &ldquo;Dune&rdquo;, &ldquo;Anime&rdquo;, &ldquo;GTA&rdquo;, or &ldquo;Paramount&rdquo;.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-2">
                <Link
                  href="/search?q=Dune"
                  className="px-3 py-1 bg-neutral-100 text-xs font-semibold rounded-lg hover:bg-[#E50914] hover:text-white transition-colors"
                >
                  Dune
                </Link>
                <Link
                  href="/search?q=Chainsaw+Man"
                  className="px-3 py-1 bg-neutral-100 text-xs font-semibold rounded-lg hover:bg-[#E50914] hover:text-white transition-colors"
                >
                  Chainsaw Man
                </Link>
                <Link
                  href="/search?q=GTA"
                  className="px-3 py-1 bg-neutral-100 text-xs font-semibold rounded-lg hover:bg-[#E50914] hover:text-white transition-colors"
                >
                  GTA
                </Link>
                <Link
                  href="/search?q=Paramount"
                  className="px-3 py-1 bg-neutral-100 text-xs font-semibold rounded-lg hover:bg-[#E50914] hover:text-white transition-colors"
                >
                  Paramount
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-xl mx-auto text-center py-12 text-neutral-400">
          <p className="text-xs font-bold uppercase tracking-widest">
            Type a query above to explore stories across all sections
          </p>
        </div>
      )}
    </div>
  );
}
