import { neon } from '@neondatabase/serverless';
import { Article, ArticleFilterOptions, Category } from './types';
import { INITIAL_ARTICLES } from './seed-data';
import fs from 'fs';
import path from 'path';

const DATABASE_URL = process.env.DATABASE_URL;

// Disk persistence fallback when DATABASE_URL is not provided or during offline test
const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'articles.json');

function ensureDataFile(): Article[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf8');
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error ensuring local data file:', err);
    return [];
  }
}

function writeDataFile(articles: Article[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing local data file:', err);
  }
}

let isInitialized = false;

// Neon client initialization
function getNeonSql() {
  if (!DATABASE_URL || !DATABASE_URL.startsWith('postgres')) {
    return null;
  }
  try {
    return neon(DATABASE_URL);
  } catch (err) {
    console.warn('[Database] Neon connection string invalid or unreachable:', err);
    return null;
  }
}

export async function initDatabase(): Promise<void> {
  if (isInitialized) return;

  const sql = getNeonSql();
  if (!sql) {
    ensureDataFile();
    isInitialized = true;
    return;
  }

  try {
    // Ensure articles table in Neon
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        subtitle TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT NOT NULL,
        author_name TEXT NOT NULL,
        author_role TEXT NOT NULL,
        author_avatar TEXT,
        hero_image TEXT NOT NULL,
        hero_image_alt TEXT NOT NULL,
        image_caption TEXT,
        tags TEXT[] NOT NULL DEFAULT '{}',
        status TEXT NOT NULL DEFAULT 'draft',
        featured BOOLEAN NOT NULL DEFAULT false,
        published_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL,
        reading_time TEXT NOT NULL
      );
    `;

    isInitialized = true;
    console.log('[Neon PostgreSQL] Connected and initialized successfully.');
  } catch (error) {
    console.warn('[Neon PostgreSQL] Fallback to persistent disk store:', error);
    ensureDataFile();
    isInitialized = true;
  }
}

// Map database row to typed Article
function mapRowToArticle(row: any): Article {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    subtitle: row.subtitle,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category as Category,
    author: {
      name: row.author_name,
      role: row.author_role,
      avatar: row.author_avatar || undefined,
    },
    heroImage: row.hero_image,
    heroImageAlt: row.hero_image_alt,
    imageCaption: row.image_caption || undefined,
    tags: Array.isArray(row.tags) ? row.tags : [],
    status: row.status as 'draft' | 'published',
    featured: Boolean(row.featured),
    publishedAt: new Date(row.published_at).toISOString(),
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
    readingTime: row.reading_time,
  };
}

export async function getArticles(options: ArticleFilterOptions = {}): Promise<{ articles: Article[]; total: number }> {
  await initDatabase();
  const sql = getNeonSql();

  if (sql) {
    try {
      let query = `SELECT * FROM articles WHERE 1=1`;
      const params: any[] = [];

      if (options.status) {
        params.push(options.status);
        query += ` AND status = $${params.length}`;
      } else {
        // Default to published unless requested otherwise
        params.push('published');
        query += ` AND status = $${params.length}`;
      }

      if (options.category) {
        params.push(options.category);
        query += ` AND category = $${params.length}`;
      }

      if (options.featured !== undefined) {
        params.push(options.featured);
        query += ` AND featured = $${params.length}`;
      }

      if (options.search) {
        params.push(`%${options.search}%`);
        const p = `$${params.length}`;
        query += ` AND (title ILIKE ${p} OR subtitle ILIKE ${p} OR excerpt ILIKE ${p} OR author_name ILIKE ${p} OR category ILIKE ${p} OR array_to_string(tags, ' ') ILIKE ${p})`;
      }

      query += ` ORDER BY published_at DESC`;

      const limit = options.limit || 20;
      const page = options.page || 1;
      const offset = (page - 1) * limit;

      const countRows = (await sql.query(
        `SELECT COUNT(*)::int AS count FROM (${query}) q`,
        params
      )) as any[];
      const total = countRows[0]?.count || 0;

      const dataParams = [...params, limit, offset];
      const dataRows = (await sql.query(
        `${query} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        dataParams
      )) as any[];

      return {
        articles: dataRows.map(mapRowToArticle),
        total,
      };
    } catch (err) {
      console.warn('[Neon Query Error, fallback to disk storage]:', err);
    }
  }

  // Fallback to disk persistence
  let all = ensureDataFile();

  if (options.status) {
    all = all.filter((a) => a.status === options.status);
  } else {
    // Default public behavior: only published articles
    all = all.filter((a) => a.status === 'published');
  }

  if (options.category) {
    all = all.filter((a) => a.category === options.category);
  }

  if (options.featured !== undefined) {
    all = all.filter((a) => a.featured === options.featured);
  }

  if (options.search) {
    const s = options.search.toLowerCase();
    all = all.filter(
      (a) =>
        a.title.toLowerCase().includes(s) ||
        a.subtitle.toLowerCase().includes(s) ||
        a.excerpt.toLowerCase().includes(s) ||
        a.author.name.toLowerCase().includes(s) ||
        a.category.toLowerCase().includes(s) ||
        a.tags.some((t) => t.toLowerCase().includes(s))
    );
  }

  // Sort by publishedAt DESC
  all.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const total = all.length;
  const limit = options.limit || 20;
  const page = options.page || 1;
  const offset = (page - 1) * limit;
  const articles = all.slice(offset, offset + limit);

  return { articles, total };
}

export async function getArticleBySlug(
  category: string,
  slug: string,
  includeDrafts = false
): Promise<Article | null> {
  await initDatabase();
  const sql = getNeonSql();

  if (sql) {
    try {
      const rows = includeDrafts
        ? await sql`SELECT * FROM articles WHERE LOWER(category) = LOWER(${category}) AND slug = ${slug} LIMIT 1;`
        : await sql`SELECT * FROM articles WHERE LOWER(category) = LOWER(${category}) AND slug = ${slug} AND status = 'published' LIMIT 1;`;
      if (rows.length > 0) {
        return mapRowToArticle(rows[0]);
      }
    } catch (err) {
      console.warn('[Neon getArticleBySlug error]:', err);
    }
  }

  const all = ensureDataFile();
  const found = all.find(
    (a) =>
      a.category.toLowerCase() === category.toLowerCase() &&
      a.slug === slug &&
      (includeDrafts || a.status === 'published')
  );
  return found || null;
}

export async function getArticleById(id: string): Promise<Article | null> {
  await initDatabase();
  const sql = getNeonSql();

  if (sql) {
    try {
      const rows = await sql`SELECT * FROM articles WHERE id = ${id} LIMIT 1;`;
      if (rows.length > 0) {
        return mapRowToArticle(rows[0]);
      }
    } catch (err) {
      console.warn('[Neon getArticleById error]:', err);
    }
  }

  const all = ensureDataFile();
  const found = all.find((a) => a.id === id);
  return found || null;
}

export async function createArticle(
  data: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Article> {
  await initDatabase();
  const now = new Date().toISOString();
  const id = `art-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const newArticle: Article = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        INSERT INTO articles (
          id, title, slug, subtitle, excerpt, content, category,
          author_name, author_role, author_avatar, hero_image, hero_image_alt,
          image_caption, tags, status, featured, published_at, created_at, updated_at, reading_time
        ) VALUES (
          ${newArticle.id}, ${newArticle.title}, ${newArticle.slug}, ${newArticle.subtitle}, ${newArticle.excerpt}, ${newArticle.content}, ${newArticle.category},
          ${newArticle.author.name}, ${newArticle.author.role}, ${newArticle.author.avatar || null}, ${newArticle.heroImage}, ${newArticle.heroImageAlt},
          ${newArticle.imageCaption || null}, ${newArticle.tags}, ${newArticle.status}, ${newArticle.featured}, ${newArticle.publishedAt}, ${newArticle.createdAt}, ${newArticle.updatedAt}, ${newArticle.readingTime}
        );
      `;
    } catch (err) {
      console.error('[Neon createArticle error]:', err);
      throw new Error(
        /duplicate key|unique/i.test(String((err as any)?.message))
          ? 'An article with this URL slug already exists. Change the slug and try again.'
          : 'Database write failed, article was NOT saved. Check DATABASE_URL on Vercel.'
      );
    }
  }

  // Also maintain local disk backup
  const all = ensureDataFile();
  all.unshift(newArticle);
  writeDataFile(all);

  return newArticle;
}

export async function updateArticle(
  id: string,
  updates: Partial<Article>
): Promise<Article | null> {
  await initDatabase();
  const now = new Date().toISOString();

  const existing = await getArticleById(id);
  if (!existing) return null;

  const updated: Article = {
    ...existing,
    ...updates,
    updatedAt: now,
  };

  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        UPDATE articles SET
          title = ${updated.title},
          slug = ${updated.slug},
          subtitle = ${updated.subtitle},
          excerpt = ${updated.excerpt},
          content = ${updated.content},
          category = ${updated.category},
          author_name = ${updated.author.name},
          author_role = ${updated.author.role},
          author_avatar = ${updated.author.avatar || null},
          hero_image = ${updated.heroImage},
          hero_image_alt = ${updated.heroImageAlt},
          image_caption = ${updated.imageCaption || null},
          tags = ${updated.tags},
          status = ${updated.status},
          featured = ${updated.featured},
          published_at = ${updated.publishedAt},
          updated_at = ${updated.updatedAt},
          reading_time = ${updated.readingTime}
        WHERE id = ${id};
      `;
    } catch (err) {
      console.error('[Neon updateArticle error]:', err);
      throw new Error(
        /duplicate key|unique/i.test(String((err as any)?.message))
          ? 'Another article already uses this URL slug.'
          : 'Database update failed, changes were NOT saved.'
      );
    }
  }

  const all = ensureDataFile();
  const idx = all.findIndex((a) => a.id === id);
  if (idx !== -1) {
    all[idx] = updated;
    writeDataFile(all);
  }

  return updated;
}

export async function deleteArticle(id: string): Promise<boolean> {
  await initDatabase();

  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`DELETE FROM articles WHERE id = ${id};`;
    } catch (err) {
      console.warn('[Neon deleteArticle error]:', err);
    }
  }

  const all = ensureDataFile();
  const filtered = all.filter((a) => a.id !== id);
  if (filtered.length !== all.length) {
    writeDataFile(filtered);
    return true;
  }
  return true;
}

export async function getRelatedArticles(
  current: Article,
  limit = 3
): Promise<Article[]> {
  const { articles } = await getArticles({
    status: 'published',
    category: current.category,
    limit: 10,
  });

  return articles.filter((a) => a.id !== current.id).slice(0, limit);
}

export async function getAdjacentArticles(
  current: Article
): Promise<{ prev: Article | null; next: Article | null }> {
  const { articles } = await getArticles({
    status: 'published',
    category: current.category,
    limit: 50,
  });

  const idx = articles.findIndex((a) => a.id === current.id);
  if (idx === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: idx > 0 ? articles[idx - 1] : null,
    next: idx < articles.length - 1 ? articles[idx + 1] : null,
  };
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const { articles } = await getArticles({ status: 'published', limit: 200 });
  const counts: Record<string, number> = {
    movies: 0,
    anime: 0,
    gaming: 0,
    news: 0,
  };
  for (const a of articles) {
    if (counts[a.category] !== undefined) {
      counts[a.category]++;
    }
  }
  return counts;
}

export async function getAllArticlesForAdmin(): Promise<Article[]> {
  await initDatabase();
  const sql = getNeonSql();

  if (sql) {
    try {
      const rows = await sql`SELECT * FROM articles ORDER BY created_at DESC;`;
      return rows.map(mapRowToArticle);
    } catch (err) {
      console.warn('[Neon getAllArticlesForAdmin error]:', err);
    }
  }

  const all = ensureDataFile();
  return [...all].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
