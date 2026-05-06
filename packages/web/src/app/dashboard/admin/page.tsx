'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet } from '@/lib/api';

type AdminStats = {
  totalUsers: number;
  totalChildren: number;
  totalDoctors: number;
  totalGames: number;
  totalSessions: number;
  totalPremiumCodes: number;
  activePremiumCodes: number;
  todaySessions: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    apiGet<AdminStats>('/admin/stats').then(setStats).catch(() => {});
  }, []);

  const cards = [
    { label: 'Toplam Kullanıcı', value: stats?.totalUsers ?? 0, icon: '👥', color: 'from-violet-500 to-purple-500' },
    { label: 'Toplam Çocuk', value: stats?.totalChildren ?? 0, icon: '👶', color: 'from-emerald-500 to-teal-500' },
    { label: 'Doktorlar', value: stats?.totalDoctors ?? 0, icon: '🩺', color: 'from-blue-500 to-cyan-500' },
    { label: 'Oyunlar', value: stats?.totalGames ?? 0, icon: '🎮', color: 'from-pink-500 to-rose-500' },
    { label: 'Toplam Oturum', value: stats?.totalSessions ?? 0, icon: '📊', color: 'from-amber-500 to-orange-500' },
    { label: 'Bugünkü Oturum', value: stats?.todaySessions ?? 0, icon: '📅', color: 'from-green-500 to-emerald-500' },
    { label: 'Premium Kodlar', value: stats?.totalPremiumCodes ?? 0, icon: '🔑', color: 'from-yellow-500 to-amber-500' },
    { label: 'Aktif Premium', value: stats?.activePremiumCodes ?? 0, icon: '✅', color: 'from-cyan-500 to-blue-500' },
  ];

  const quickLinks = [
    { href: '/dashboard/admin/users', label: 'Kullanıcıları Yönet', tone: 'violet' },
    { href: '/dashboard/admin/games', label: 'Oyun Kataloğu', tone: 'pink' },
    { href: '/dashboard/admin/books', label: 'Kitap Kütüphanesi', tone: 'emerald' },
    { href: '/dashboard/admin/premium-codes', label: 'Premium Kodlar', tone: 'amber' },
  ];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(2,6,23,0.95))] p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.45em] text-violet-200/80">Admin Control Center</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Platform İstatistikleri</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
              Seed verisi, kullanıcı rolleri, oyun kataloğu ve premium kod akışı tek yerden izlenir.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Backend</p>
              <p className="mt-1 text-sm font-medium text-white">localhost:3001</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Web</p>
              <p className="mt-1 text-sm font-medium text-white">localhost:3000</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Örnek Hesap</p>
              <p className="mt-1 text-sm font-medium text-white">admin@gozmacerasi.dev</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Şifre</p>
              <p className="mt-1 text-sm font-medium text-white">Test1234!</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-slate-950/20 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/20"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-slate-300">{card.label}</p>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} text-lg shadow-lg`}
              >
                {card.icon}
              </div>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-white">{card.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-violet-200/70">Hızlı Erişim</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Sık kullanılan yönetim alanları</h2>
            </div>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
              Seed hazır
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group rounded-2xl border border-white/10 px-4 py-4 transition hover:border-white/20 hover:bg-white/10 ${
                  link.tone === 'violet'
                    ? 'bg-violet-500/10'
                    : link.tone === 'pink'
                      ? 'bg-pink-500/10'
                      : link.tone === 'emerald'
                        ? 'bg-emerald-500/10'
                        : 'bg-amber-500/10'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-white">{link.label}</span>
                  <span className="text-slate-300 transition-transform group-hover:translate-x-1">→</span>
                </div>
                <p className="mt-2 text-xs text-slate-400">Detaylı paneli aç</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Sistem Notu</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Bu panel neyi gösterir?</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>• Seed kullanıcıları, çocukları, doktorları ve adminleri yüklüdür.</li>
            <li>• Oyun ve kitap katalogları gerçek veri ile çalışır.</li>
            <li>• Premium kod sayfası hızlı kod üretimi için hazırdır.</li>
            <li>• Kullanıcı yönetiminde arama ve rol filtresi aktiftir.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
