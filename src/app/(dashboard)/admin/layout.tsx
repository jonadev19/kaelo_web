'use client';

import type { ReactNode } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { QueryProvider } from '@/context/QueryProvider';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    </QueryProvider>
  );
}
