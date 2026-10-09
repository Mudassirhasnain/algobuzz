// Single source of truth for the public site URL and default SEO copy.
// Intentionally ignores APP_URL (it was an AI Studio leftover that pointed to localhost).
export const SITE_URL = 'https://algobuzz.vercel.app';
export const SITE_NAME = 'AlgoBuzz';

export const SITE_TITLE = 'AlgoBuzz: Trending News on AI, Tech, Movies, Anime & Gaming';
export const SITE_DESCRIPTION =
  'Daily trending news, explainers and reviews on AI and tech, movies, anime and gaming. Clear, fast and no-fluff stories from AlgoBuzz.';

export function absoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return SITE_URL;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

export function truncate(text: string, max: number): string {
  const clean = (text || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.\-]+$/, '')}…`;
}
