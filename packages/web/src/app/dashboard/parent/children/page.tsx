'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet, apiPost } from '@/lib/api';

type ParentChild = {
  id: string;
  name: string;
  age: number;
  diagnosis: string | null;
  baselineVA: string | null;
  stereopsisLevel: string | null;
  dailyLimit: number;
  createdAt: string;
};

export default function ParentChildrenPage() {
  const [children, setChildren] = useState<ParentChild[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', age: 6, diagnosis: '', dailyLimit: 30 });

  useEffect(() => {
    apiGet<ParentChild[]>('/parent/children').then(setChildren).catch(() => {});
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const child = await apiPost<ParentChild>('/parent/children', form);
      setChildren((prev) => [child, ...prev]);
      setShowCreate(false);
      setForm({ name: '', age: 6, diagnosis: '', dailyLimit: 30 });
    } catch {
      alert('Çocuk profili oluşturulamadı.');
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Ebeveyn</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Çocuklarım</h1>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          + Yeni Çocuk
        </button>
      </div>

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-4 text-lg font-semibold text-white">Yeni Çocuk Profili</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Çocuk adı"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Yaş"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) || 6 })}
              min={1}
              max={18}
              className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Tanı (opsiyonel)"
              value={form.diagnosis}
              onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
              className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Günlük limit (dakika)"
              value={form.dailyLimit}
              onChange={(e) => setForm({ ...form, dailyLimit: parseInt(e.target.value) || 30 })}
              min={5}
              max={120}
              className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Oluştur
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="rounded-xl border border-white/10 px-6 py-2 text-sm text-slate-300 transition hover:bg-white/5"
            >
              İptal
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {children.map((child) => (
          <Link
            key={child.id}
            href={`/dashboard/parent/children/${child.id}`}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold text-white">{child.name}</p>
                <p className="mt-1 text-sm text-slate-400">{child.age} yaş</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-lg">
                👶
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Tanı</span>
                <span className="text-white">{child.diagnosis ?? 'Tanı yok'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">VA Skoru</span>
                <span className="text-white">{child.baselineVA ?? '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Günlük Limit</span>
                <span className="text-white">{child.dailyLimit} dk</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-300 opacity-0 transition group-hover:opacity-100">
              <span>Detayları Gör</span>
              <span>→</span>
            </div>
          </Link>
        ))}
      </div>

      {!children.length && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-12 text-center">
          <p className="text-slate-400">Henüz çocuk profili eklenmedi.</p>
          <p className="mt-2 text-sm text-slate-500">
            Yukarıdaki butona tıklayarak yeni bir profil oluşturun.
          </p>
        </div>
      )}
    </div>
  );
}
