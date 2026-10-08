'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ChevronRight, Film, Sparkles, Gamepad2, Newspaper, Lock } from 'lucide-react';
import Logo from './Logo';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath?: string;
}

const CATEGORIES = [
  { name: 'Movies', href: '/movies', icon: Film, desc: 'Blockbusters, Indie Auteurs & Box Office' },
  { name: 'Anime', href: '/anime', icon: Sparkles, desc: 'Manga Adaptations & Japanese Animation' },
  { name: 'Gaming', href: '/gaming', icon: Gamepad2, desc: 'Next-Gen Consoles & Interactive Epics' },
  { name: 'News', href: '/news', icon: Newspaper, desc: 'Industry Mergers, Streaming & Hollywood' },
];

export default function MobileMenu({ isOpen, onClose, currentPath }: MobileMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 pb-2">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entertainment stories..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 border border-neutral-200 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#E50914] focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
          </form>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 mb-2">
            Editorial Sections
          </p>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = currentPath === cat.href;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                onClick={onClose}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors group ${
                  isActive
                    ? 'bg-neutral-100 text-[#E50914]'
                    : 'text-neutral-900 hover:bg-neutral-50 hover:text-neutral-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-[#E50914] text-white'
                        : 'bg-neutral-100 text-neutral-600 group-hover:bg-[#E50914] group-hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-base block">{cat.name}</span>
                    <span className="text-xs text-neutral-500 line-clamp-1">{cat.desc}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-900 transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-6 border-t border-neutral-100 bg-neutral-50 space-y-3">
          <Link
            href="/admin/login"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-neutral-900 hover:bg-[#E50914] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-2xs"
          >
            <Lock className="w-3.5 h-3.5 text-[#E50914]" />
            <span>Editor Sign In</span>
          </Link>
          <p className="text-[11px] text-neutral-500 leading-relaxed text-center">
            <strong>AlgoBuzz</strong> — Independent digital entertainment journalism covering cinema, animation, interactive gaming, and media culture.
          </p>
        </div>
      </div>
    </div>
  );
}
