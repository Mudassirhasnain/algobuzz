import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdminAuthenticated } from '@/lib/auth';
import { getArticleById, updateArticle, deleteArticle } from '@/lib/db';
import { slugify, calculateReadingTime } from '@/lib/utils';
import { Category, ArticleStatus } from '@/lib/types';

function refreshPublicPages() {
  try {
    revalidatePath('/');
    revalidatePath('/[category]', 'page');
    revalidatePath('/[category]/[slug]', 'page');
    revalidatePath('/sitemap.xml');
  } catch (err) {
    console.warn('revalidatePath failed:', err);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }

  return NextResponse.json({ article });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();

    const updates: any = {};
    if (body.title !== undefined) updates.title = body.title.trim();
    if (body.slug !== undefined) updates.slug = slugify(body.slug || body.title);
    if (body.subtitle !== undefined) updates.subtitle = body.subtitle.trim();
    if (body.excerpt !== undefined) updates.excerpt = body.excerpt.trim();
    if (body.content !== undefined) {
      updates.content = body.content.trim();
      if (!body.readingTime) {
        updates.readingTime = calculateReadingTime(body.content);
      }
    }
    if (body.category !== undefined) updates.category = body.category as Category;
    if (body.heroImage !== undefined) updates.heroImage = body.heroImage.trim();
    if (body.heroImageAlt !== undefined) updates.heroImageAlt = body.heroImageAlt.trim();
    if (body.imageCaption !== undefined) updates.imageCaption = body.imageCaption.trim();
    if (body.authorName !== undefined || body.authorRole !== undefined || body.authorAvatar !== undefined) {
      const existing = await getArticleById(id);
      updates.author = {
        name: body.authorName || existing?.author.name || 'AlgoBuzz Editorial Team',
        role: body.authorRole || existing?.author.role || 'Staff Writer',
        avatar: body.authorAvatar ?? existing?.author.avatar,
      };
    }
    if (body.tags !== undefined) {
      updates.tags = Array.isArray(body.tags)
        ? body.tags
        : typeof body.tags === 'string'
        ? body.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : [];
    }
    if (body.status !== undefined) updates.status = body.status as ArticleStatus;
    if (body.featured !== undefined) updates.featured = Boolean(body.featured);
    if (body.publishedAt !== undefined) updates.publishedAt = body.publishedAt;
    if (body.readingTime !== undefined) updates.readingTime = body.readingTime;

    const updated = await updateArticle(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Article not found or update failed' }, { status: 404 });
    }

    refreshPublicPages();
    return NextResponse.json({ success: true, article: updated });
  } catch (err: any) {
    console.error('Error updating article:', err);
    return NextResponse.json({ error: err?.message || 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const success = await deleteArticle(id);
    refreshPublicPages();
    return NextResponse.json({ success });
  } catch (err) {
    console.error('Error deleting article:', err);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
