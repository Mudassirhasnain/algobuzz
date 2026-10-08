'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  Clock,
  Star,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Article, Category, ArticleStatus } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function ManagePostsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/admin/articles');
      if (!res.ok) throw new Error('Failed to load posts');
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      console.error('Error fetching admin articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleToggleStatus = async (article: Article) => {
    const nextStatus: ArticleStatus = article.status === 'published' ? 'draft' : 'published';
    setActionLoadingId(article.id);

    try {
      const res = await fetch(`/api/admin/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) throw new Error('Status update failed');
      const data = await res.json();

      setArticles((prev) =>
        prev.map((a) => (a.id === article.id ? { ...a, status: nextStatus } : a))
      );
    } catch (err) {
      console.error('Error toggling status:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleFeatured = async (article: Article) => {
    const nextFeatured = !article.featured;
    setActionLoadingId(article.id);

    try {
      const res = await fetch(`/api/admin/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: nextFeatured }),
      });

      if (!res.ok) throw new Error('Featured update failed');

      setArticles((prev) =>
        prev.map((a) => (a.id === article.id ? { ...a, featured: nextFeatured } : a))
      );
    } catch (err) {
      console.error('Error toggling featured:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');

      setArticles((prev) => prev.filter((a) => a.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Error deleting article:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter articles
  const filtered = articles.filter((a) => {
    const matchesSearch =
      search === '' ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.author.name.toLowerCase().includes(search.toLowerCase()) ||
      a.slug.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || a.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#E50914]">
            Editorial Catalog
          </span>
          <h1 className="text-3xl font-black font-headline text-neutral-900 mt-1">
            Manage Stories
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Publish, edit, retract, and audit stories across all publication desks
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#E50914] hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm hover:shadow-md shrink-0 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Post</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by headline, author or slug..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#E50914]"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none focus:border-[#E50914]"
          >
            <option value="all">All Desks</option>
            <option value="movies">Movies</option>
            <option value="anime">Anime</option>
            <option value="gaming">Gaming</option>
            <option value="news">News</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none focus:border-[#E50914]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3 text-neutral-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#E50914]" />
            <span className="text-xs font-bold uppercase tracking-wider">Loading Stories Database...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <p className="text-sm font-bold text-neutral-700">No stories matching your filters</p>
            <p className="text-xs text-neutral-400">Try altering your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 w-14">Image</th>
                  <th className="py-3 px-4">Headline</th>
                  <th className="py-3 px-3">Section</th>
                  <th className="py-3 px-3">Author</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Featured</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((article) => {
                  const isActionLoading = actionLoadingId === article.id;
                  return (
                    <tr key={article.id} className="hover:bg-neutral-50/80 transition-colors">
                      {/* Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="relative w-12 h-10 rounded-md overflow-hidden bg-neutral-100 shrink-0">
                          <Image
                            src={article.heroImage}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      </td>

                      {/* Title & Slug */}
                      <td className="py-3 px-4 max-w-xs">
                        <Link
                          href={`/admin/posts/${article.id}/edit`}
                          className="font-bold text-neutral-900 hover:text-[#E50914] line-clamp-1 text-xs sm:text-sm block"
                        >
                          {article.title}
                        </Link>
                        <span className="text-[10px] text-neutral-400 font-mono block truncate">
                          /{article.category}/{article.slug}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 font-bold uppercase tracking-wider text-[10px] bg-neutral-100 text-[#E50914] rounded">
                          {article.category}
                        </span>
                      </td>

                      {/* Author */}
                      <td className="py-3 px-3 text-neutral-600 font-medium whitespace-nowrap">
                        {article.author.name}
                      </td>

                      {/* Status Toggle Button */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(article)}
                          disabled={isActionLoading}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider text-[10px] transition-colors ${
                            article.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                          title="Click to toggle Draft / Published"
                        >
                          {article.status === 'published' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          <span>{article.status}</span>
                        </button>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggleFeatured(article)}
                          disabled={isActionLoading}
                          className={`p-1.5 rounded transition-colors ${
                            article.featured
                              ? 'text-amber-500 hover:text-amber-600'
                              : 'text-neutral-300 hover:text-neutral-500'
                          }`}
                          title="Toggle Featured on homepage"
                        >
                          <Star className={`w-4 h-4 ${article.featured ? 'fill-amber-400' : ''}`} />
                        </button>
                      </td>

                      {/* Published Date */}
                      <td className="py-3 px-4 text-neutral-500 whitespace-nowrap">
                        {formatDate(article.publishedAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-6 text-right whitespace-nowrap space-x-1.5">
                        <Link
                          href={`/admin/posts/${article.id}/edit`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </Link>

                        {article.status === 'published' && (
                          <Link
                            href={`/${article.category}/${article.slug}`}
                            target="_blank"
                            className="inline-flex items-center p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
                            title="View Public Story"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}

                        <button
                          onClick={() => setDeleteConfirmId(article.id)}
                          className="inline-flex items-center p-1 text-neutral-400 hover:text-red-600 transition-colors"
                          title="Delete article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-neutral-200">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-neutral-900">Delete Story?</h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Are you sure you want to delete this story? This will permanently remove it from Neon PostgreSQL storage.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
