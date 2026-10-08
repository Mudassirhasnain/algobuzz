import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || 'http://localhost:3000'),
  title: {
    default: 'AlgoBuzz — Entertainment Journalism | Movies, Anime, Gaming, News',
    template: '%s | AlgoBuzz',
  },
  description:
    'AlgoBuzz is an authoritative digital entertainment publication delivering deep investigative reporting, critical reviews, and cultural dispatches across Movies, Anime, Gaming, and Hollywood News.',
  keywords: [
    'AlgoBuzz',
    'Entertainment News',
    'Movie Reviews',
    'Anime Season Previews',
    'Gaming News',
    'Hollywood Box Office',
    'Denis Villeneuve',
    'Chainsaw Man',
    'GTA 6',
  ],
  authors: [{ name: 'AlgoBuzz Editorial Team' }],
  creator: 'AlgoBuzz Media Group',
  publisher: 'AlgoBuzz Media Group',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'AlgoBuzz',
    title: 'AlgoBuzz — Entertainment Journalism | Movies, Anime, Gaming, News',
    description:
      'Authoritative entertainment journalism spanning cinema, Japanese animation, interactive gaming, and cultural industry shifts.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&h=630&q=85',
        width: 1200,
        height: 630,
        alt: 'AlgoBuzz Entertainment Journal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AlgoBuzz — Entertainment Journalism',
    description: 'Critical coverage and cultural reporting across Movies, Anime, Gaming, and News.',
    creator: '@AlgoBuzzMedia',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#E50914',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'AlgoBuzz',
    url: process.env.APP_URL || 'http://localhost:3000',
    logo: {
      '@type': 'ImageObject',
      url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    },
    sameAs: ['https://twitter.com/AlgoBuzzMedia'],
    masthead: `${process.env.APP_URL || 'http://localhost:3000'}/about`,
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAFAFA] text-neutral-900 selection:bg-[#E50914] selection:text-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
