import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  variant?: 'featured' | 'standard' | 'horizontal' | 'compact';
  priority?: boolean;
}

export default function ArticleCard({
  article,
  variant = 'standard',
  priority = false,
}: ArticleCardProps) {
  const articleUrl = `/${article.category}/${article.slug}`;

  // 1. Featured Variant (Dominant Lead Story)
  if (variant === 'featured') {
    return (
      <article className="group relative bg-white border border-neutral-200 rounded-xl overflow-hidden hover:border-neutral-300 transition-all duration-300 shadow-sm hover:shadow-md">
        <Link href={articleUrl} className="block relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden bg-neutral-900">
          <Image
            src={article.heroImage}
            alt={article.heroImageAlt || article.title}
            fill
            priority={priority}
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.93]"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          
          <div className="absolute bottom-0 inset-x-0 p-6 md:p-10 text-white z-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block px-2.5 py-1 text-xs font-black tracking-widest uppercase bg-[#E50914] text-white rounded">
                {article.category}
              </span>
              <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readingTime}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-headline tracking-tight leading-[1.1] text-white group-hover:text-red-100 transition-colors max-w-4xl">
              {article.title}
            </h2>

            <p className="mt-3 text-sm md:text-base text-neutral-300 line-clamp-2 max-w-3xl leading-relaxed hidden sm:block">
              {article.subtitle || article.excerpt}
            </p>

            <div className="mt-5 flex items-center gap-3 text-xs text-neutral-300">
              <span className="font-bold text-white tracking-wide">
                By {article.author.name}
              </span>
              <span>•</span>
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // 2. Horizontal Variant (Editorial Feature Split)
  if (variant === 'horizontal') {
    return (
      <article className="group bg-white border border-neutral-200/90 rounded-xl overflow-hidden hover:border-neutral-300 transition-all duration-200 flex flex-col sm:flex-row shadow-xs hover:shadow-md">
        <Link
          href={articleUrl}
          className="relative aspect-[16/10] sm:aspect-square sm:w-56 md:w-64 shrink-0 overflow-hidden bg-neutral-100"
        >
          <Image
            src={article.heroImage}
            alt={article.heroImageAlt || article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 100vw, 256px"
          />
        </Link>

        <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#E50914]">
                {article.category}
              </span>
              <span className="text-neutral-300">•</span>
              <span className="text-xs text-neutral-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readingTime}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold font-headline text-neutral-950 group-hover:text-[#E50914] transition-colors leading-snug">
              <Link href={articleUrl}>{article.title}</Link>
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span className="font-medium text-neutral-700">By {article.author.name}</span>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          </div>
        </div>
      </article>
    );
  }

  // 3. Compact Variant (Minimal sidebar / trending lists)
  if (variant === 'compact') {
    return (
      <article className="group flex gap-3.5 items-start py-3.5 border-b border-neutral-100 last:border-b-0">
        <Link
          href={articleUrl}
          className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-neutral-100"
        >
          <Image
            src={article.heroImage}
            alt={article.heroImageAlt || article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="80px"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#E50914] block mb-1">
            {article.category}
          </span>
          <h4 className="text-sm font-bold text-neutral-900 group-hover:text-[#E50914] transition-colors leading-snug line-clamp-2">
            <Link href={articleUrl}>{article.title}</Link>
          </h4>
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-neutral-400">
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            <span>•</span>
            <span>{article.readingTime}</span>
          </div>
        </div>
      </article>
    );
  }

  // 4. Standard Variant (Grid Cards)
  return (
    <article className="group bg-white border border-neutral-200/90 rounded-xl overflow-hidden hover:border-neutral-300 transition-all duration-300 flex flex-col shadow-xs hover:shadow-md">
      <Link href={articleUrl} className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
        <Image
          src={article.heroImage}
          alt={article.heroImageAlt || article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-block px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest bg-white/95 text-[#E50914] backdrop-blur-xs rounded shadow-xs">
            {article.category}
          </span>
        </div>
      </Link>

      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readingTime}
            </span>
          </div>

          <h3 className="text-lg font-bold font-headline text-neutral-950 group-hover:text-[#E50914] transition-colors leading-snug line-clamp-2">
            <Link href={articleUrl}>{article.title}</Link>
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span className="font-semibold text-neutral-700">By {article.author.name}</span>
          <span className="text-[#E50914] font-bold group-hover:translate-x-0.5 transition-transform">
            Read →
          </span>
        </div>
      </div>
    </article>
  );
}
