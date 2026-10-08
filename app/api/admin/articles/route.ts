import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getAllArticlesForAdmin, createArticle } from '@/lib/db';
import { slugify, calculateReadingTime } from '@/lib/utils';
import { Category, ArticleStatus } from '@/lib/types';

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const articles = await getAllArticlesForAdmin();
    return NextResponse.json({ articles });
  } catch (err) {
    console.error('Error fetching admin articles:', err);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized: Admin login required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      slug,
      subtitle,
      excerpt,
      content,
      category,
      authorName,
      authorRole,
      authorAvatar,
      heroImage,
      heroImageAlt,
      imageCaption,
      tags,
      status,
      featured,
      publishedAt,
      readingTime,
    } = body;

    if (!title || !content || !category || !heroImage) {
      return NextResponse.json(
        { error: 'Missing required fields: Title, Content, Category, and Hero Image are required.' },
        { status: 400 }
      );
    }

    const finalSlug = slugify(slug || title);
    const finalReadingTime = readingTime || calculateReadingTime(content);
    const finalPublishedAt = publishedAt || new Date().toISOString();

    const created = await createArticle({
      title: title.trim(),
      slug: finalSlug,
      subtitle: (subtitle || '').trim(),
      excerpt: (excerpt || '').trim() || (subtitle || '').trim(),
      content: content.trim(),
      category: category as Category,
      author: {
        name: (authorName || 'AlgoBuzz Editorial Team').trim(),
        role: (authorRole || 'Staff Writer').trim(),
        avatar: authorAvatar || undefined,
      },
      heroImage: heroImage.trim(),
      heroImageAlt: (heroImageAlt || title).trim(),
      imageCaption: imageCaption ? imageCaption.trim() : undefined,
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      status: (status as ArticleStatus) || 'draft',
      featured: Boolean(featured),
      publishedAt: finalPublishedAt,
      readingTime: finalReadingTime,
    });

    return NextResponse.json({ success: true, article: created }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating article:', err);
    return NextResponse.json({ error: err?.message || 'Failed to create article' }, { status: 500 });
  }
}
