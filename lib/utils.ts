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
  { label: string; tag: string; description: string; color: string }
> = {
  movies: {
    label: 'Movies',
    tag: 'MOVIES',
    description: 'Theatrical releases, box office analysis, filmmaker retrospectives, and casting dispatches.',
    color: '#E50914',
  },
  anime: {
    label: 'Anime',
    tag: 'ANIME',
    description: 'Studio breakthroughs, season previews, theatrical adaptations, and Japanese animation culture.',
    color: '#FF334B',
  },
  gaming: {
    label: 'Gaming',
    tag: 'GAMING',
    description: 'Next-gen hardware, critical game analysis, development deep dives, and interactive narratives.',
    color: '#E11D48',
  },
  news: {
    label: 'News',
    tag: 'NEWS',
    description: 'Studio mergers, global theatrical trends, streaming wars, and cultural entertainment updates.',
    color: '#DC2626',
  },
};
