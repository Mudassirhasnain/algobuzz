import React from 'react';

interface ArticleBodyProps {
  content: string;
}

export default function ArticleBody({ content }: ArticleBodyProps) {
  return (
    <div className="article-body-container max-w-3xl mx-auto">
      {/* Editorial Content formatted with pristine typography */}
      <div
        className="prose prose-lg max-w-none text-neutral-800 leading-relaxed font-normal
        [&>p]:mb-6 [&>p]:leading-[1.85] [&>p]:text-[1.08rem] [&>p]:text-neutral-800
        [&>h2]:text-2xl sm:[&>h2]:text-3xl [&>h2]:font-black [&>h2]:font-headline [&>h2]:tracking-tight [&>h2]:text-neutral-950 [&>h2]:mt-12 [&>h2]:mb-5 [&>h2]:pt-4 [&>h2]:border-t [&>h2]:border-neutral-200
        [&>h3]:text-xl sm:[&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-neutral-900 [&>h3]:mt-8 [&>h3]:mb-4
        [&>blockquote]:my-8 [&>blockquote]:pl-6 [&>blockquote]:border-l-4 [&>blockquote]:border-[#E50914] [&>blockquote]:italic [&>blockquote]:text-xl [&>blockquote]:font-serif [&>blockquote]:text-neutral-900 [&>blockquote]:bg-neutral-50/70 [&>blockquote]:py-4 [&>blockquote]:pr-6 [&>blockquote]:rounded-r-lg
        [&>ul]:my-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:mb-2.5 [&>ul>li]:text-neutral-850
        [&>ol]:my-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol>li]:mb-2.5 [&>ol>li]:text-neutral-850
        [&>strong]:font-bold [&>strong]:text-neutral-950
        [&>a]:text-[#E50914] [&>a]:underline [&>a]:underline-offset-4 [&>a]:font-semibold hover:[&>a]:text-neutral-950
        [&>img]:rounded-xl [&>img]:my-8 [&>img]:w-full [&>img]:shadow-sm
        [&>hr]:my-10 [&>hr]:border-neutral-200"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
