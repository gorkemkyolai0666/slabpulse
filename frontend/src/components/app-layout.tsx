'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Gem,
  Box,
  Ruler,
  Cog,
  Sparkles,
  Building2,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { href: '/projects', label: 'Projeler', icon: Gem },
  { href: '/slabs', label: 'Levhalar', icon: Box },
  { href: '/surveys', label: 'Ölçüm', icon: Ruler },
  { href: '/cnc-tasks', label: 'CNC', icon: Cog },
  { href: '/finishes', label: 'Yüzeyler', icon: Sparkles },
  { href: '/firm', label: 'Atölye', icon: Building2 },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { firm, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen sp-mineral-bg">
      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b-2 border-foreground/10 px-6 py-4 lg:px-10">
            <div>
              <p className="font-display text-2xl leading-none tracking-tight">
                Slab<span className="text-primary">Pulse</span>
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                {firm?.name ?? 'Doğal Taş Atölyesi'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {user && (
                <span className="hidden text-sm text-muted-foreground md:inline">
                  {user.firstName} {user.lastName}
                </span>
              )}
              <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Tema değiştir">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={logout} aria-label="Çıkış yap">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <main className="flex-1 px-6 py-6 lg:px-10 lg:py-8">{children}</main>
        </div>

        <aside className="hidden w-56 shrink-0 border-l-2 border-foreground/10 bg-card/50 lg:block">
          <nav className="sticky top-0 flex flex-col py-4" aria-label="Ana menü">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="sp-sidebar-link"
                  data-active={active}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
      </div>

      <nav
        className="fixed bottom-0 left-0 right-0 flex gap-0 overflow-x-auto border-t-2 border-foreground/10 bg-card/95 backdrop-blur-sm lg:hidden"
        aria-label="Mobil menü"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-w-[4.5rem] flex-1 flex-col items-center gap-1 px-2 py-2 text-[10px] font-medium"
              data-active={active}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={`h-4 w-4 ${active ? 'text-primary' : 'text-muted-foreground'}`} aria-hidden />
              <span className={active ? 'text-primary' : 'text-muted-foreground'}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
