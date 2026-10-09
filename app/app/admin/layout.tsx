import React from 'react';
import { isAdminAuthenticated } from '@/lib/auth';
import AdminSidebar from '@/components/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await isAdminAuthenticated();

  if (!isAuth) {
    // Unauthenticated layout (e.g. for /admin/login)
    return <div className="min-h-screen bg-neutral-50">{children}</div>;
  }

  // Authenticated Editorial Workspace Layout
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral-100 text-neutral-900">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
