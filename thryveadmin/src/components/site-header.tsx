import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from 'next/navigation';

function titleFromPath(path: string) {
  if (path === '/dashboard') return 'Dashboard';
  const parts = path.replace(/\/$/, '').split('/').filter(Boolean);
  const idx = parts.indexOf('dashboard');
  const rel = idx >= 0 ? parts.slice(idx + 1) : parts;
  if (rel.length === 0) return 'Dashboard';
  return rel.map(p => p.replace(/-/g,' ')).map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(' / ');
}

export function SiteHeader() {
  const pathname = usePathname();
  const pageTitle = titleFromPath(pathname || '/dashboard');
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-semibold tracking-tight">{pageTitle}</h1>
        <div className="ml-auto flex items-center gap-2" />
      </div>
    </header>
  );
}
