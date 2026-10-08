import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAdminAuthenticated } from '@/lib/auth';
import { getAllArticlesForAdmin, getCategoryCounts } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import {
  FileText,
  CheckCircle2,
  Clock,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Layers,
  Edit,
  ExternalLink,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect('/admin/login');
  }

  const articles = await getAllArticlesForAdmin();
  const categoryCounts = await getCategoryCounts();

  const totalPosts = articles.length;
  const publishedPosts = articles.filter((a) => a.status === 'published').length;
  const draftPosts = articles.filter((a) => a.status === 'draft').length;
  const featuredPosts = articles.filter((a) => a.featured).length;

  const recentPosts = articles.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-[#E50914]">
            Control Center
          </span>
          <h1 className="text-3xl font-black font-headline text-neutral-900 mt-1">
            Editorial Overview
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Live telemetry and publishing pipeline for AlgoBuzz
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="px-4 py-2.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-bold rounded-xl transition-colors shadow-2xs"
          >
            Manage All Posts
          </Link>
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E50914] hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Post</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Posts */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Articles</span>
            <FileText className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-headline text-neutral-900">
              {totalPosts}
            </span>
            <span className="text-xs font-semibold text-neutral-400">records</span>
          </div>
        </div>

        {/* Published Posts */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold uppercase tracking-wider">Published</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-headline text-neutral-900">
              {publishedPosts}
            </span>
            <span className="text-xs font-semibold text-emerald-600">live publicly</span>
          </div>
        </div>

        {/* Draft Posts */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold uppercase tracking-wider">Drafts In Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-headline text-neutral-900">
              {draftPosts}
            </span>
            <span className="text-xs font-semibold text-amber-600">unpublished</span>
          </div>
        </div>

        {/* Featured Stories */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between text-[#E50914]">
            <span className="text-xs font-bold uppercase tracking-wider">Lead Stories</span>
            <TrendingUp className="w-4 h-4 text-[#E50914]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black font-headline text-neutral-900">
              {featuredPosts}
            </span>
            <span className="text-xs font-semibold text-neutral-400">spotlighted</span>
          </div>
        </div>
      </div>

      {/* Category Distribution Bar */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs">
        <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#E50914]" />
          <span>Active Content by Department</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
            <span className="text-[11px] font-bold text-neutral-500 uppercase">Movies Desk</span>
            <p className="text-2xl font-black text-neutral-900 mt-1">{categoryCounts.movies || 0}</p>
          </div>
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
            <span className="text-[11px] font-bold text-neutral-500 uppercase">Anime Desk</span>
            <p className="text-2xl font-black text-neutral-900 mt-1">{categoryCounts.anime || 0}</p>
          </div>
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
            <span className="text-[11px] font-bold text-neutral-500 uppercase">Gaming Desk</span>
            <p className="text-2xl font-black text-neutral-900 mt-1">{categoryCounts.gaming || 0}</p>
          </div>
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
            <span className="text-[11px] font-bold text-neutral-500 uppercase">News Desk</span>
            <p className="text-2xl font-black text-neutral-900 mt-1">{categoryCounts.news || 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Dispatches Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black font-headline text-neutral-900">
              Recent Editorial Entries
            </h3>
            <p className="text-xs text-neutral-500">
              Latest articles created or updated in the database
            </p>
          </div>
          <Link
            href="/admin/posts"
            className="text-xs font-bold text-[#E50914] hover:text-red-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-6">Headline</th>
                <th className="py-3 px-4">Section</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Published Date</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {recentPosts.map((post) => (
                <tr key={post.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-neutral-900 max-w-sm truncate">
                    {post.title}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 font-bold uppercase tracking-wider text-[10px] bg-neutral-100 text-[#E50914] rounded">
                      {post.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600 font-medium">
                    {post.author.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 font-bold uppercase tracking-wider text-[10px] rounded ${
                        post.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-500">
                    {formatDate(post.publishedAt)}
                  </td>
                  <td className="py-3.5 px-6 text-right space-x-2">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold rounded transition-colors"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </Link>
                    {post.status === 'published' && (
                      <Link
                        href={`/${post.category}/${post.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2 py-1 text-neutral-400 hover:text-neutral-900"
                        title="View Public Article"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
