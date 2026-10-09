export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function calculateReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const noHtml = text.replace(/<[^>]*>/g, '');
  const words = noHtml.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d);
  } catch {
    return isoString;
  }
}

export function formatFullDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(d);
  } catch {
    return isoString;
  }
}

export const CATEGORY_INFO: Record<
  string,
  { label: string; tag: string; description: string; color: string; seoTitle: string; seoDescription: string }
> = {
  movies: {
    label: 'Movies',
    tag: 'MOVIES',
    description: 'Theatrical releases, box office analysis, filmmaker retrospectives, and casting dispatches.',
    color: '#E50914',
    seoTitle: 'Movie News, Reviews & Box Office Updates',
    seoDescription: 'Latest movie news, honest reviews, trailers breakdowns and weekend box office results. Everything worth knowing about new releases, in one place.',
  },
  anime: {
    label: 'Anime',
    tag: 'ANIME',
    description: 'Studio breakthroughs, season previews, theatrical adaptations, and Japanese animation culture.',
    color: '#FF334B',
    seoTitle: 'Anime News, Season Previews & Reviews',
    seoDescription: 'Fresh anime news, seasonal previews, episode talk and manga adaptation updates. Find out what to watch next and what everyone is talking about.',
  },
  gaming: {
    label: 'Gaming',
    tag: 'GAMING',
    description: 'Next-gen hardware, critical game analysis, development deep dives, and interactive narratives.',
    color: '#E11D48',
    seoTitle: 'Gaming News, Reviews & Release Dates',
    seoDescription: 'Breaking gaming news, game reviews, release dates and hardware updates for PC, PlayStation, Xbox and Switch. No hype, just what matters.',
  },
  news: {
    label: 'News',
    tag: 'NEWS',
    description: 'Studio mergers, global theatrical trends, streaming wars, and cultural entertainment updates.',
    color: '#DC2626',
    seoTitle: 'Trending News: AI, Tech & Entertainment Updates',
    seoDescription: 'The latest trending stories on AI, tech, jobs and entertainment, explained clearly. Get the facts and the why it matters in minutes.',
  },
};
