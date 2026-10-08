'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heading2,
  Heading3,
  Bold,
  Italic,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  Minus,
  Eye,
  Save,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Star,
} from 'lucide-react';
import { Article, Category, ArticleStatus } from '@/lib/types';
import { slugify, calculateReadingTime } from '@/lib/utils';
import ImageUploader from './ImageUploader';
import ArticlePreviewModal from './ArticlePreviewModal';

interface PostEditorProps {
  initialArticle?: Article;
  isEditing?: boolean;
}

export default function PostEditor({ initialArticle, isEditing = false }: PostEditorProps) {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState(initialArticle?.title || '');
  const [slug, setSlug] = useState(initialArticle?.slug || '');
  const [subtitle, setSubtitle] = useState(initialArticle?.subtitle || '');
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt || '');
  const [category, setCategory] = useState<Category>(initialArticle?.category || 'movies');
  const [authorName, setAuthorName] = useState(initialArticle?.author.name || 'Julian Vance');
  const [authorRole, setAuthorRole] = useState(initialArticle?.author.role || 'Staff Writer');
  const [tagsInput, setTagsInput] = useState(initialArticle?.tags.join(', ') || '');
  const [heroImage, setHeroImage] = useState(initialArticle?.heroImage || '');
  const [heroImageAlt, setHeroImageAlt] = useState(initialArticle?.heroImageAlt || '');
  const [imageCaption, setImageCaption] = useState(initialArticle?.imageCaption || '');
  const [content, setContent] = useState(
    initialArticle?.content ||
      `<h2>The Narrative Shift</h2>\n<p>Enter the opening paragraph of your entertainment story here. Detail the immediate development, cinematic stakes, or production revelation.</p>\n\n<blockquote>\n"An essential quote that crystallizes the impact of the announcement or production milestone."\n</blockquote>\n\n<h2>Behind the Scenes & Production Realities</h2>\n<p>Expand on casting, studio executives, game engine details, or historical context.</p>`
  );
  const [status, setStatus] = useState<ArticleStatus>(initialArticle?.status || 'draft');
  const [featured, setFeatured] = useState(initialArticle?.featured || false);
  const [publishedAt, setPublishedAt] = useState(
    initialArticle?.publishedAt
      ? new Date(initialArticle.publishedAt).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );

  // UI state
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-slugify when title changes if creating new
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing) {
      setSlug(slugify(val));
    }
  };

  // Content toolbar insertion helper
  const insertFormatting = (tagStart: string, tagEnd = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    const replacement = `${tagStart}${selectedText || 'Text'}${tagEnd}`;
    const newContent =
      textarea.value.substring(0, start) + replacement + textarea.value.substring(end);

    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagStart.length, start + replacement.length - tagEnd.length);
    }, 0);
  };

  const handleSave = async (targetStatus?: ArticleStatus) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const finalStatus = targetStatus || status;

    if (!title.trim()) {
      setErrorMsg('Article Title is required.');
      return;
    }
    if (!content.trim()) {
      setErrorMsg('Article Content cannot be empty.');
      return;
    }
    if (!heroImage.trim()) {
      setErrorMsg('A Hero Image is required before saving or publishing.');
      return;
    }

    setSaving(true);

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug: slug || slugify(title),
      subtitle,
      excerpt: excerpt || subtitle,
      content,
      category,
      authorName,
      authorRole,
      heroImage,
      heroImageAlt: heroImageAlt || title,
      imageCaption,
      tags: tagsArray,
      status: finalStatus,
      featured,
      publishedAt: new Date(publishedAt).toISOString(),
      readingTime: calculateReadingTime(content),
    };

    try {
      const url = isEditing
        ? `/api/admin/articles/${initialArticle?.id}`
        : `/api/admin/articles`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save article.');
      }

      setStatus(finalStatus);
      setSuccessMsg(
        finalStatus === 'published'
          ? 'Article successfully published to live site!'
          : 'Draft saved successfully.'
      );

      setTimeout(() => {
        router.push('/admin/posts');
        router.refresh();
      }, 1200);
    } catch (err: any) {
      console.error('Save error:', err);
      setErrorMsg(err?.message || 'Failed to save article. Please retry.');
    } finally {
      setSaving(false);
    }
  };

  const readingTimeEstimate = calculateReadingTime(content);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider rounded ${
                status === 'published'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {status}
            </span>
            {featured && (
              <span className="px-2 py-0.5 text-[11px] font-bold uppercase bg-red-100 text-[#E50914] rounded">
                Featured Lead
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black font-headline text-neutral-900 mt-1">
            {isEditing ? 'Edit Story' : 'New Editorial Story'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Preview Button */}
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition-colors"
          >
            <Eye className="w-4 h-4 text-neutral-500" />
            <span>Preview</span>
          </button>

          {/* Save Draft Button */}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('draft')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-neutral-500" />
            <span>Save Draft</span>
          </button>

          {/* Publish Button */}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('published')}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#E50914] hover:bg-red-700 text-white text-xs font-black tracking-wide uppercase rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{status === 'published' ? 'Update & Publish' : 'Publish Story'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Column (Col 1-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-4 shadow-xs">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Headline <span className="text-[#E50914]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Riveting, high-impact entertainment headline..."
                className="w-full text-xl sm:text-2xl font-black font-headline px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-950 focus:outline-none focus:border-[#E50914] focus:bg-white transition-all"
              />
            </div>

            {/* Subtitle / Deck */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Subtitle / Deck
              </label>
              <textarea
                rows={2}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Secondary lead explaining context and depth..."
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-800 focus:outline-none focus:border-[#E50914] focus:bg-white transition-all"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Excerpt (Feed & Social Snippet)
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Concise 1-2 sentence synopsis for card previews and meta description..."
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-700 focus:outline-none focus:border-[#E50914] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Hero Image Component */}
          <ImageUploader
            value={heroImage}
            altText={heroImageAlt}
            caption={imageCaption}
            onChangeUrl={setHeroImage}
            onChangeAlt={setHeroImageAlt}
            onChangeCaption={setImageCaption}
          />

          {/* Rich Content Editor */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-neutral-100 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={() => insertFormatting('<h2>', '</h2>')}
                  className="p-2 hover:bg-white rounded text-neutral-700 hover:text-neutral-950 font-bold transition-colors"
                  title="H2 Section Heading"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<h3>', '</h3>')}
                  className="p-2 hover:bg-white rounded text-neutral-700 hover:text-neutral-950 font-bold transition-colors"
                  title="H3 Subheading"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <div className="h-4 w-[1px] bg-neutral-300 mx-1" />
                <button
                  type="button"
                  onClick={() => insertFormatting('<strong>', '</strong>')}
                  className="p-2 hover:bg-white rounded text-neutral-700 hover:text-neutral-950 transition-colors"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<em>', '</em>')}
                  className="p-2 hover:bg-white rounded text-neutral-700 hover:text-neutral-950 transition-colors"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<blockquote>\n"', '"\n</blockquote>')}
                  className="p-2 hover:bg-white rounded text-neutral-700 hover:text-neutral-950 transition-colors"
                  title="Blockquote / Pull Quote"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <div className="h-4 w-[1px] bg-neutral-300 mx-1" />
                <button
                  type="button"
                  onClick={() => insertFormatting('<ul>\n  <li>', '</li>\n</ul>')}
                  className="p-2 hover:bg-white rounded text-neutral-700 hover:text-neutral-950 transition-colors"
                  title="Unordered List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<ol>\n  <li>', '</li>\n</ol>')}
                  className="p-2 hover:bg-white rounded text-neutral-700 hover:text-neutral-950 transition-colors"
                  title="Ordered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<a href="https://..." target="_blank" rel="noopener">', '</a>')}
                  className="p-2 hover:bg-white rounded text-neutral-700 hover:text-neutral-950 transition-colors"
                  title="Insert Hyperlink"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<hr />\n')}
                  className="p-2 hover:bg-white rounded text-neutral-700 hover:text-neutral-950 transition-colors"
                  title="Horizontal Rule"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>{readingTimeEstimate}</span>
              </div>
            </div>

            <div className="p-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                Article Body (Rich Editorial HTML) <span className="text-[#E50914]">*</span>
              </label>
              <textarea
                ref={textareaRef}
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write long-form entertainment journalism here..."
                className="w-full font-mono text-sm leading-relaxed p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:border-[#E50914] focus:bg-white transition-all resize-y"
              />
              <p className="text-[11px] text-neutral-400 mt-2">
                Format using the toolbar or write semantic tags (&lt;h2&gt;, &lt;p&gt;, &lt;blockquote&gt;, &lt;ul&gt;). Click &quot;Preview&quot; above at any point to see the public reader view.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Settings Column (Col 9-12) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Editorial Metadata */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-5 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-3">
              Editorial Classification
            </h3>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Category Section <span className="text-[#E50914]">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-900 focus:outline-none focus:border-[#E50914]"
              >
                <option value="movies">Movies</option>
                <option value="anime">Anime</option>
                <option value="gaming">Gaming</option>
                <option value="news">News</option>
              </select>
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="my-article-slug"
                className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#E50914]"
              />
              <p className="text-[10px] text-neutral-400 mt-1">
                Final URL: /{category}/{slug || '...'}
              </p>
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Author Byline
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Julian Vance"
                className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#E50914]"
              />
            </div>

            {/* Author Role */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Author Editorial Title
              </label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="Chief Film Critic"
                className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#E50914]"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Dune, Sci-Fi, IMAX, Warner Bros"
                className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>

          {/* Publishing Controls */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-5 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-3">
              Publishing Options
            </h3>

            {/* Publication Status */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('draft')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
                    status === 'draft'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('published')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
                    status === 'published'
                      ? 'bg-[#E50914] text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  Published
                </button>
              </div>
            </div>

            {/* Main Article Toggle (Select or Unselect) */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                  <Star className={`w-4 h-4 ${featured ? 'fill-amber-400 text-amber-500' : 'text-neutral-400'}`} />
                  Main Article (Lead Story)
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    featured ? 'bg-amber-100 text-amber-800' : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {featured ? 'Main Story' : 'Standard Story'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                When selected, this article sits in the primary lead hero slot on the homepage. Unselect to publish as a regular category story.
              </p>
              <button
                type="button"
                onClick={() => setFeatured(!featured)}
                className={`w-full py-2 px-3 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  featured
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                    : 'bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-700'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${featured ? 'fill-white' : ''}`} />
                <span>{featured ? '★ Selected as Main Article' : '☆ Select as Main Article'}</span>
              </button>
            </div>

            {/* Publication Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Publication Date
              </label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Full-fidelity Preview Modal */}
      <ArticlePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        data={{
          title,
          subtitle,
          excerpt,
          category,
          authorName,
          authorRole,
          heroImage,
          heroImageAlt,
          imageCaption,
          content,
          readingTime: readingTimeEstimate,
          tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
        }}
      />
    </div>
  );
}
