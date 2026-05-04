'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '../../lib/api';

type ChildProfile = {
  id: string;
  fullName: string;
  diagnosis?: string;
  dailyLimitMinutes: number;
  createdAt: string;
};

export default function DashboardPage() {
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [status, setStatus] = useState('Çocuk profilleri yükleniyor...');

  useEffect(() => {
    let active = true;

    async function loadChildren() {
      try {
        const data = await apiGet<ChildProfile[]>('/children');
        if (!active) return;
        setChildren(data);
        setStatus(data.length ? '' : 'Henüz çocuk profili eklenmedi.');
      } catch {
        if (!active) return;
        setStatus('Çocuk profilleri şu anda erişilemiyor.');
      }
    }

    loadChildren();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.14),_transparent_35%),linear-gradient(180deg,#05111a_0%,#0f172a_100%)] px-6 py-10 text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-emerald-950/20 backdrop-blur-xl">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Dashboard</p>
              <h1 className="mt-2 text-4xl font-semibold">Gözmacerasi Kontrol Merkezi</h1>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
              Phase 1 active
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-400">Toplam çocuk</p>
              <p className="mt-3 text-4xl font-semibold">{children.length}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-400">Bugünkü oyun</p>
              <p className="mt-3 text-4xl font-semibold">0</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-sm text-slate-400">Aktif streak</p>
              <p className="mt-3 text-4xl font-semibold">0</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Çocuk Profilleri</h2>
              <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10">
                Yeni Profil
              </button>
            </div>

            {children.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {children.map((child) => (
                  <article key={child.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
                    <p className="text-lg font-semibold">{child.fullName}</p>
                    <p className="mt-2 text-sm text-slate-400">{child.diagnosis ?? 'Tanı eklenmedi'}</p>
                    <p className="mt-4 text-sm text-slate-300">Günlük limit: {child.dailyLimitMinutes} dk</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/60 p-8 text-slate-300">
                {status}
              </div>
            )}
          </div>
        </section>

        <aside className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-xl shadow-slate-950/30 backdrop-blur-xl">
          <h2 className="text-xl font-semibold">Bugünün Özeti</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Son oturum</p>
              <p className="mt-2 font-medium">Henüz kayıt yok</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Hatırlatma</p>
              <p className="mt-2 font-medium">Görme terapisi akışını günün erken saatlerinde başlat.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Geliştirme notu</p>
              <p className="mt-2 font-medium">Auth ve child profile katmanları hazır; sırada session tracking var.</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
