import { NextRequest, NextResponse } from 'next/server';
import { getArticles } from '@/lib/db';
import { Category, ArticleStatus } from '@/lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = (searchParams.get('category') as Category) || undefined;
  const status = (searchParams.get('status') as ArticleStatus) || 'published';
  const featured = searchParams.has('featured') ? searchParams.get('featured') === 'true' : undefined;
  const search = searchParams.get('search') || undefined;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  try {
    const { articles, total } = await getArticles({
      category,
      status,
      featured,
      search,
      page,
      limit,
    });

    const hasMore = page * limit < total;

    return NextResponse.json({
      articles,
      total,
      page,
      limit,
      hasMore,
    });
  } catch (error) {
    console.error('API /api/articles error:', error);
    return NextResponse.json({ error: 'Failed to retrieve articles' }, { status: 500 });
  }
}
