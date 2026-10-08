import React from 'react';
import { redirect, notFound } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { getArticleById } from '@/lib/db';
import PostEditor from '@/components/PostEditor';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  return (
    <div>
      <PostEditor initialArticle={article} isEditing={true} />
    </div>
  );
}
