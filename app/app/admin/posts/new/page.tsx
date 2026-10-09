import React from 'react';
import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import PostEditor from '@/components/PostEditor';

export default async function NewPostPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect('/admin/login');
  }

  return (
    <div>
      <PostEditor isEditing={false} />
    </div>
  );
}
