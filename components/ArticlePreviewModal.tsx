'use client';

import React from 'react';
import Image from 'next/image';
import { X, Clock, Calendar, User, Eye } from 'lucide-react';
import ArticleBody from './ArticleBody';
import { formatDate } from '@/lib/utils';
import { Category } from '@/lib/types';

interface ArticlePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    title: string;
    subtitle: string;
    excerpt: string;
    category: Category;
    authorName: string;
    authorRole: string;
    heroImage: string;
    heroImageAlt: string;
    imageCaption?: string;
    content: string;
    readingTime: string;
    tags: string[];
  };
}

export default function ArticlePreviewModal({
  isOpen,
  onClose,
  data,
}: ArticlePreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-sm p-4 sm:p-6 md:p-10 flex justify-center">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-neutral-200">
        {/* Modal Top Bar */}
        <div className="bg-neutral-950 text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-neutral-300">
              Live Editorial Preview (Draft Mode)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Public article replica */}
        <div className="p-6 sm:p-10 overflow-y-auto max-h-[80vh]">
          {/* Category & Headline */}
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-8">
            <span className="inline-block px-3 py-1 text-xs font-black uppercase tracking-widest bg-[#E50914] text-white rounded">
              {data.category}
            </span>

            <h1 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-neutral-950 leading-[1.1]">
              {data.title || 'Untitled Headline'}
            </h1>

            {data.subtitle && (
              <p className="text-lg sm:text-xl text-neutral-600 font-medium leading-relaxed">
                {data.subtitle}
              </p>
            )}

            {/* Byline & Metadata */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-500 font-medium border-t border-neutral-100">
              <span className="flex items-center gap-1.5 font-bold text-neutral-900">
                <User className="w-3.5 h-3.5 text-neutral-400" />
                By {data.authorName || 'Staff Writer'} ({data.authorRole || 'Contributor'})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                {formatDate(new Date().toISOString())}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                {data.readingTime || '4 min read'}
              </span>
            </div>
          </div>

          {/* Hero Image */}
          {data.heroImage && (
            <div className="max-w-4xl mx-auto mb-10">
              <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200">
                <Image
                  src={data.heroImage}
                  alt={data.heroImageAlt || 'Hero visual'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 900px"
                />
              </div>
              {data.imageCaption && (
                <p className="text-xs text-neutral-500 mt-2 text-center italic">
                  {data.imageCaption}
                </p>
              )}
            </div>
          )}

          {/* Article Body */}
          <div className="max-w-3xl mx-auto">
            <ArticleBody content={data.content || '<p>No content written yet.</p>'} />
          </div>

          {/* Tags */}
          {data.tags && data.tags.length > 0 && (
            <div className="max-w-3xl mx-auto mt-10 pt-6 border-t border-neutral-200 flex flex-wrap gap-2">
              <span className="text-xs font-bold text-neutral-400 mr-2 py-1">TAGS:</span>
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-semibold bg-neutral-100 text-neutral-700 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
