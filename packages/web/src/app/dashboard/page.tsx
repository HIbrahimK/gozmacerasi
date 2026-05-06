'use client';

import Link from 'next/link';

const panels = [
  {
    role: 'admin',
    title: 'Admin Panel',
    description: 'Kullanıcı yönetimi, oyun kataloğu, premium kodlar, platform istatistikleri',
    icon: '🛡️',
    href: '/dashboard/admin',
    gradient: 'from-violet-600 to-purple-600',
    borderColor: 'border-violet-400/20',
    bgGlow: 'bg-violet-400/10',
  },
  {
    role: 'parent',
    title: 'Ebeveyn Panel',
    description: 'Çocuk profilleri, oyun geçmişi, ilerleme raporları, AI asistan',
    icon: '👨‍👩‍👧',
    href: '/dashboard/parent',
    gradient: 'from-emerald-600 to-teal-600',
    borderColor: 'border-emerald-400/20',
    bgGlow: 'bg-emerald-400/10',
  },
  {
    role: 'doctor',
    title: 'Doktor Panel',
    description: 'Hasta listesi, reçete yazma, performans metrikleri, motor analiz',
    icon: '🩺',
    href: '/dashboard/doctor',
    gradient: 'from-blue-600 to-cyan-600',
    borderColor: 'border-blue-400/20',
    bgGlow: 'bg-blue-400/10',
  },
];

export default function DashboardSelectorPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.14),_transparent_35%),linear-gradient(180deg,#05111a_0%,#0f172a_100%)] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Dashboard</p>
          <h1 className="mt-2 text-4xl font-semibold">Kontrol Merkezi</h1>
          <p className="mt-4 text-slate-400">Devam etmek için bir panel seçin</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {panels.map((panel) => (
            <Link
              key={panel.role}
              href={panel.href}
              className="group rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10"
            >
              <div
                className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${panel.gradient} text-3xl shadow-lg`}
              >
                {panel.icon}
              </div>
              <h2 className="text-xl font-semibold text-white">{panel.title}</h2>
              <p className="mt-3 text-sm text-slate-400">{panel.description}</p>
              <div className="mt-6 flex items-center gap-2 text-sm text-slate-300 group-hover:text-white">
                <span>Paneli Aç</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
