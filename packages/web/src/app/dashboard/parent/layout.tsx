'use client';

import DashboardSidebar from '@/components/DashboardSidebar';

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#05111a_0%,#0f172a_100%)]">
      <DashboardSidebar role="parent" />
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
