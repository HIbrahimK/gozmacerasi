'use client';

import { useEffect, useState } from 'react';
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

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.35em] text-violet-300">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Platform İstatistikleri</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">{card.label}</p>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-lg`}
              >
                {card.icon}
              </div>
            </div>
            <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <h2 className="text-lg font-semibold text-white">Hızlı Aksiyonlar</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="/dashboard/admin/users"
            className="rounded-xl bg-violet-600/20 px-4 py-2 text-sm text-violet-300 transition hover:bg-violet-600/30"
          >
            Kullanıcıları Yönet
          </a>
          <button className="rounded-xl bg-emerald-600/20 px-4 py-2 text-sm text-emerald-300 transition hover:bg-emerald-600/30">
            Premium Kod Oluştur
          </button>
          <button className="rounded-xl bg-blue-600/20 px-4 py-2 text-sm text-blue-300 transition hover:bg-blue-600/30">
            Oyun Ekle
          </button>
          <button className="rounded-xl bg-pink-600/20 px-4 py-2 text-sm text-pink-300 transition hover:bg-pink-600/30">
            Blog Yazısı Ekle
          </button>
        </div>
      </div>
    </div>
  );
}
