'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';
import Logo from './Logo';
import MobileMenu from './MobileMenu';

const NAV_ITEMS = [
  { name: 'Movies', href: '/movies' },
  { name: 'Anime', href: '/anime' },
  { name: 'Gaming', href: '/gaming' },
  { name: 'News', href: '/news' },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle scroll styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md transition-all duration-200 border-b ${
          isScrolled ? 'border-neutral-200 shadow-sm py-2.5' : 'border-neutral-150 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Branding */}
            <div className="flex items-center gap-8">
              <Logo size="md" showSubtitle={false} />

              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`relative px-4 py-1.5 text-sm font-bold tracking-tight uppercase transition-colors duration-150 ${
                        isActive
                          ? 'text-[#E50914]'
                          : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 rounded-md'
                      }`}
                    >
                      {item.name}
                      {isActive && (
                        <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#E50914] rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: Search bar & mobile hamburger */}
            <div className="flex items-center gap-2">
              {/* Expandable / quick desktop search */}
              <div className="hidden sm:block relative">
                {isSearchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <input
                      type="text"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search AlgoBuzz..."
                      className="w-64 pl-3.5 pr-8 py-1.5 text-sm bg-neutral-100 border border-neutral-300 rounded-full text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#E50914] focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="absolute right-2.5 text-neutral-400 hover:text-neutral-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200/80 rounded-full transition-colors"
                    aria-label="Search articles"
                  >
                    <Search className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Search</span>
                    <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-neutral-200 rounded text-neutral-400 font-mono">
                      /
                    </kbd>
                  </button>
                )}
              </div>

              {/* Mobile search icon button */}
              <Link
                href="/search"
                className="sm:hidden p-2 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-md transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </Link>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-md transition-colors"
                aria-label="Open mobile navigation"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentPath={pathname}
      />
    </>
  );
}
