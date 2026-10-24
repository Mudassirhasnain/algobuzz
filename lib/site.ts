// Single source of truth for the public site URL and default SEO copy.
// Intentionally ignores APP_URL (it was an AI Studio leftover that pointed to localhost).
export const SITE_URL = 'https://algobuzz.me';
export const SITE_NAME = 'AlgoBuzz';

// Square brand logo (192x192) used for structured data. Replaces the old Unsplash stock photo.
export const SITE_LOGO = `${SITE_URL}/favicon.png`;

// Default social-share image for pages that don't set their own.
export const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&h=630&q=85';

export const SITE_TITLE = 'AlgoBuzz: Trending News on AI, Tech, Movies, Anime & Gaming';
export const SITE_DESCRIPTION =
  'AlgoBuzz brings daily trending news, explainers and reviews on AI, tech, movies, anime and gaming. Stay updated with what everyone is talking about.';

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
