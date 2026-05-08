'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type UserInfo = {
  id: string;
  email: string;
  fullName?: string;
  role?: string;
};

const quickActions = [
  {
    title: 'Oyunlara Başla',
    description: 'Terapi oyunlarını oyna ve puanlarını topla',
    icon: '🎮',
    href: '/games',
    color: 'from-cyan-500 to-blue-500',
    glow: 'shadow-cyan-500/20',
  },
  {
    title: 'Kitap Kütüphanesi',
    description: '3D kitaplarla derinlik algısını geliştir',
    icon: '📚',
    href: '/books',
    color: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-500/20',
  },
  {
    title: 'İlerleme Raporu',
    description: 'Tedavi sürecini ve gelişimi izle',
    icon: '📊',
    href: '/sessions',
    color: 'from-violet-500 to-purple-500',
    glow: 'shadow-violet-500/20',
  },
  {
    title: 'Kalibrasyon',
    description: 'Göz kalibrasyonunu ayarla',
    icon: '👁️',
    href: '/calibration',
    color: 'from-amber-500 to-orange-500',
    glow: 'shadow-amber-500/20',
  },
];

const panels = [
  {
    role: 'admin',
    title: 'Admin Panel',
    description: 'Kullanıcı yönetimi, oyun kataloğu, premium kodlar, platform istatistikleri',
    icon: '🛡️',
    href: '/dashboard/admin',
    gradient: 'from-violet-500 to-purple-500',
    borderGlow: 'hover:border-violet-400/30',
  },
  {
    role: 'parent',
    title: 'Ebeveyn Panel',
    description: 'Çocuk profilleri, oyun geçmişi, ilerleme raporları, AI asistan',
    icon: '👨‍👩‍👧',
    href: '/dashboard/parent',
    gradient: 'from-emerald-500 to-teal-500',
    borderGlow: 'hover:border-emerald-400/30',
  },
  {
    role: 'doctor',
    title: 'Doktor Panel',
    description: 'Hasta listesi, reçete yazma, performans metrikleri, motor analiz',
    icon: '🩺',
    href: '/dashboard/doctor',
    gradient: 'from-blue-500 to-cyan-500',
    borderGlow: 'hover:border-blue-400/30',
  },
];

const recentStats = [
  { label: 'Toplam Oturum', value: '—', icon: '🎯' },
  { label: 'Oyun Süresi', value: '—', icon: '⏱️' },
  { label: 'Başarı Oranı', value: '—', icon: '📈' },
  { label: 'Seri Gün', value: '—', icon: '🔥' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // ignore
      }
    }

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Günaydın');
    else if (hour < 18) setGreeting('İyi Günler');
    else setGreeting('İyi Akşamlar');
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/');
  }

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#060d1b]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-lg font-bold text-white shadow-lg shadow-cyan-500/20">
              G
            </div>
            <span className="text-lg font-bold tracking-tight">
              Göz<span className="gradient-text-cyan">Macerası</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden items-center gap-2 text-sm text-slate-400 sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-xs font-bold text-white">
                  {(user.fullName || user.email)?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-slate-300">{user.fullName || user.email}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="rounded-lg border border-white/8 bg-white/[0.03] px-4 py-2 text-sm text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              Çıkış
            </button>
          </div>
        </div>
      </nav>

      <main className="relative min-h-screen pt-24 pb-16">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-20 h-[500px] w-[500px] rounded-full bg-cyan-500/6 blur-[120px]" />
          <div className="absolute right-1/4 top-60 h-[400px] w-[400px] rounded-full bg-emerald-500/4 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          {/* Greeting */}
          <div className="animate-slide-up mb-10">
            <span className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
              Dashboard
            </span>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              {greeting},{' '}
              <span className="gradient-text-cyan">
                {user?.fullName?.split(' ')[0] || 'Kullanıcı'}
              </span>
              ! 👋
            </h1>
            <p className="mt-2 text-slate-400">
              Bugün seni neler bekliyor? Hemen bir oyuna başla veya ilerleme raporunu incele.
            </p>
          </div>

          {/* Summary stats */}
          <div className="animate-slide-up-delay-1 mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {recentStats.map((stat) => (
              <div
                key={stat.label}
                className="glass-card flex items-center gap-4 p-5"
              >
                <div className="text-2xl">{stat.icon}</div>
                <div>
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="animate-slide-up-delay-2 mb-12">
            <h2 className="mb-5 text-lg font-semibold text-slate-200">
              Hızlı Erişim
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="glass-card group relative overflow-hidden p-6"
                >
                  <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br opacity-10 blur-2xl group-hover:opacity-20 transition" />
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} text-xl shadow-lg ${action.glow}`}
                  >
                    {action.icon}
                  </div>
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                    {action.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 group-hover:text-slate-300 transition">
                    <span>Aç</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Role panels */}
          <div className="animate-slide-up-delay-3">
            <h2 className="mb-5 text-lg font-semibold text-slate-200">
              Yönetim Panelleri
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {panels.map((panel) => (
                <Link
                  key={panel.role}
                  href={panel.href}
                  className={`glass-card group p-7 ${panel.borderGlow}`}
                >
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${panel.gradient} text-2xl shadow-lg`}
                  >
                    {panel.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{panel.title}</h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    {panel.description}
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-sm text-slate-400 group-hover:text-white transition">
                    <span>Paneli Aç</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
