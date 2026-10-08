import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-900 mt-20">
      {/* Top Editorial Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-[#E50914] via-[#FF334B] to-neutral-900" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="text-white">
              <Logo size="lg" showSubtitle={false} />
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              AlgoBuzz is a premiere digital entertainment journal delivering authoritative journalism, technical deep dives, and critical essays spanning cinema, animation, gaming culture, and Hollywood business.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-neutral-500 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>Independent Editorial Desk</span>
              <span>•</span>
              <span>Global Bureau</span>
            </div>
          </div>

          {/* Editorial Sections */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-200">
              Editorial Sections
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/movies" className="text-neutral-400 hover:text-white transition-colors">
                  Movies & Theatrical
                </Link>
              </li>
              <li>
                <Link href="/anime" className="text-neutral-400 hover:text-white transition-colors">
                  Anime & Manga Adaptations
                </Link>
              </li>
              <li>
                <Link href="/gaming" className="text-neutral-400 hover:text-white transition-colors">
                  Gaming & Interactive Systems
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-neutral-400 hover:text-white transition-colors">
                  Industry & Box Office News
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Information */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-200">
              Journal Standards
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              AlgoBuzz upholds stringent editorial independence. All reviews, festival coverage, and investigative dispatches adhere to rigorous fact-checking standards and ethical attribution.
            </p>
            <div className="pt-4 flex flex-wrap gap-4 text-xs text-neutral-400">
              <span className="hover:text-white transition-colors cursor-pointer">Editorial Ethics</span>
              <span className="hover:text-white transition-colors cursor-pointer">Masthead</span>
              <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {currentYear} AlgoBuzz Media Group. All rights reserved.</p>
          <p className="text-neutral-500">
            Engineered with high performance Next.js App Router & Neon PostgreSQL.
          </p>
        </div>
      </div>
    </footer>
  );
}
