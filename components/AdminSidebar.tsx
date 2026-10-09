'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  ExternalLink,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import Logo from './Logo';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Manage Posts', href: '/admin/posts', icon: FileText },
    { name: 'Create Post', href: '/admin/posts/new', icon: PlusCircle },
  ];

  return (
    <aside className="w-64 bg-neutral-950 text-neutral-300 min-h-screen flex flex-col justify-between p-6 border-r border-neutral-900 shrink-0">
      <div className="space-y-8">
        {/* Admin Header & Logo */}
        <div>
          <Logo size="md" href="/admin" />
          <div className="mt-3 flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded text-[11px] font-bold text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Editorial Workspace</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 px-3 mb-2">
            Publishing
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#E50914] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="space-y-3 pt-6 border-t border-neutral-900">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
