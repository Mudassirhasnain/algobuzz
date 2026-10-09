'use client';

import React, { useState } from 'react';
import { Share2, Link2, Check, Twitter, Facebook } from 'lucide-react';

interface ShareBarProps {
  title: string;
  url?: string;
}

export default function ShareBar({ title, url }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const currentUrl =
    url || (typeof window !== 'undefined' ? window.location.href : 'https://algobuzz.vercel.app');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShareTwitter = () => {
    const tweetText = encodeURIComponent(`${title} via @AlgoBuzz`);
    const shareUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(currentUrl)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareReddit = () => {
    const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}`;
    window.open(redditUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-center gap-2 py-4">
      <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mr-2 flex items-center gap-1">
        <Share2 className="w-3.5 h-3.5" />
        Share
      </span>

      {/* Copy Link Button */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-md transition-colors"
        title="Copy article link"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-bold">Link Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="w-3.5 h-3.5 text-neutral-500" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      {/* Twitter / X */}
      <button
        onClick={handleShareTwitter}
        className="p-1.5 bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-700 rounded-md transition-colors"
        title="Share to X"
        aria-label="Share to X"
      >
        <Twitter className="w-4 h-4" />
      </button>

      {/* Reddit */}
      <button
        onClick={handleShareReddit}
        className="px-2.5 py-1.5 bg-neutral-100 hover:bg-[#FF4500] hover:text-white text-neutral-700 text-xs font-bold rounded-md transition-colors"
        title="Share to Reddit"
      >
        Reddit
      </button>
    </div>
  );
}
