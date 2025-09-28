"use client"
import { ReactNode, useEffect, useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';

// Lightweight client guard (temporary) ensuring token presence; middleware handles server redirect.
function ClientAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('accessToken') || '') : '';
    if (!token) {
      router.replace('/login');
    } else {
      setOk(true);
    }
  }, [router]);
  if (!ok) return null; // or skeleton
  return <>{children}</>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={{
        '--sidebar-width': '280px',
        '--header-height': '56px'
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-4 md:p-6 space-y-6">
          <ClientAuthGuard>
            {children}
          </ClientAuthGuard>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
