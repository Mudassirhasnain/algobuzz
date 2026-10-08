import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  href?: string;
}

export default function Logo({
  className = '',
  size = 'md',
  showSubtitle = false,
  href = '/',
}: LogoProps) {
  const iconSize = size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-10 h-10 text-sm' : 'w-8 h-8 text-xs';
  const textTitleSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  const content = (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Compact AZ Cinematic Monogram Icon */}
      <div
        className={`${iconSize} rounded-md bg-neutral-950 flex items-center justify-center font-black tracking-tighter text-white shadow-sm border border-neutral-800 relative overflow-hidden transition-transform duration-200 group-hover:scale-105`}
      >
        <span className="font-extrabold text-white tracking-tight">A</span>
        <span className="text-[#E50914] font-black -ml-0.5">Z</span>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[#E50914]" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center tracking-tight leading-none">
          <span className={`font-black text-neutral-950 tracking-tighter ${textTitleSize}`}>
            ALGO
          </span>
          <span className={`font-black text-[#E50914] tracking-tighter ${textTitleSize}`}>
            BUZZ
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E50914] ml-0.5 mb-1" />
        </div>
        {showSubtitle && (
          <span className="text-[10px] tracking-widest uppercase font-semibold text-neutral-400 mt-0.5">
            Entertainment Media
          </span>
        )}
      </div>
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-block focus:outline-none">
      {content}
    </Link>
  );
}
