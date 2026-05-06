'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard/admin', icon: '📊' },
  { label: 'Kullanıcılar', href: '/dashboard/admin/users', icon: '👥' },
  { label: 'Oyunlar', href: '/dashboard/admin/games', icon: '🎮' },
  { label: 'Premium Kodlar', href: '/dashboard/admin/codes', icon: '🔑' },
  { label: 'Blog', href: '/dashboard/admin/blog', icon: '📝' },
  { label: 'Ayarlar', href: '/dashboard/admin/settings', icon: '⚙️' },
];

const parentNav: NavItem[] = [
  { label: 'Genel Bakış', href: '/dashboard/parent', icon: '📊' },
  { label: 'Çocuklarım', href: '/dashboard/parent/children', icon: '👶' },
  { label: 'Oyunlar', href: '/dashboard/parent/games', icon: '🎮' },
  { label: 'Raporlar', href: '/dashboard/parent/reports', icon: '📈' },
  { label: 'AI Asistan', href: '/dashboard/parent/ai', icon: '🤖' },
  { label: 'Ayarlar', href: '/dashboard/parent/settings', icon: '⚙️' },
];

const doctorNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard/doctor', icon: '📊' },
  { label: 'Hastalarım', href: '/dashboard/doctor/patients', icon: '🩺' },
  { label: 'Reçeteler', href: '/dashboard/doctor/prescriptions', icon: '📋' },
  { label: 'Raporlar', href: '/dashboard/doctor/reports', icon: '📈' },
  { label: 'Ayarlar', href: '/dashboard/doctor/settings', icon: '⚙️' },
];

type Role = 'admin' | 'parent' | 'doctor';

const navMap: Record<Role, NavItem[]> = {
  admin: adminNav,
  parent: parentNav,
  doctor: doctorNav,
};

const roleLabels: Record<Role, string> = {
  admin: 'Admin Panel',
  parent: 'Ebeveyn Panel',
  doctor: 'Doktor Panel',
};

export default function DashboardSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const navItems = navMap[role];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-bold">
          G
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Gözmacerası</p>
          <p className="text-xs text-slate-400">{roleLabels[role]}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== `/dashboard/${role}` && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-3 py-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
        >
          <span className="text-lg">🔙</span>
          Tüm Paneller
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
        >
          <span className="text-lg">🏠</span>
          Ana Sayfa
        </Link>
      </div>
    </aside>
  );
}
