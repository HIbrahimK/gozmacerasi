'use client';

import { useMemo, useState } from 'react';

interface PremiumCode {
  id: string;
  code: string;
  duration: number;
  status: 'Kullanılmamış' | 'Aktif' | 'Süresi Doldu';
  usedBy?: string;
  createdAt: string;
}

export default function AdminPremiumCodesPage() {
  const [codes, setCodes] = useState<PremiumCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(5);
  const [duration, setDuration] = useState(30);

  const handleGenerateCodes = async () => {
    setLoading(true);
    try {
      const generatedCodes: PremiumCode[] = [];
      for (let i = 0; i < quantity; i++) {
        const code = `GOZE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        generatedCodes.push({
          id: `code_${i}`,
          code,
          duration,
          status: 'Kullanılmamış',
          createdAt: new Date().toISOString(),
        });
      }
      setCodes([...generatedCodes, ...codes]);
      setQuantity(5);
      setDuration(30);
    } catch (error) {
      console.error('Error generating codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const active = codes.filter((code) => code.status === 'Aktif').length;
    const unused = codes.filter((code) => code.status === 'Kullanılmamış').length;
    return {
      total: codes.length,
      active,
      unused,
    };
  }, [codes]);

  const handleCopyAll = async () => {
    const text = codes.map((code) => code.code).join('\n');
    if (text) {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-300/80">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Premium Kod Üretimi</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              Kodları hızlıca üret, kopyala ve kullanım durumunu tek ekranda takip et.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Seed: hazır</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Format: GOZE-XXXXXX</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Toplam Kod</p>
            <p className="mt-2 text-2xl font-semibold text-white">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Kullanılmamış</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-300">{stats.unused}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Aktif</p>
            <p className="mt-2 text-2xl font-semibold text-cyan-300">{stats.active}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-white">Yeni Kod Üret</h2>
          <div className="mt-5 space-y-4">
            <label className="block space-y-2 text-sm text-slate-300">
              <span>Kod Sayısı</span>
              <input
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
              />
            </label>
            <label className="block space-y-2 text-sm text-slate-300">
              <span>Süre (gün)</span>
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
              >
                <option value={30}>30 gün</option>
                <option value={180}>180 gün</option>
                <option value={365}>365 gün</option>
              </select>
            </label>
            <div className="flex gap-3">
              <button
                onClick={handleGenerateCodes}
                disabled={loading}
                className="flex-1 rounded-xl bg-amber-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-600"
              >
                {loading ? 'Üretiliyor...' : 'Kod Üret'}
              </button>
              <button
                onClick={() => setCodes([])}
                className="rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5"
              >
                Temizle
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Üretilen Kodlar</h2>
              <p className="mt-1 text-sm text-slate-400">Kopyala, paylaş veya kullanım durumunu takip et.</p>
            </div>
            <button
              onClick={handleCopyAll}
              disabled={!codes.length}
              className="rounded-xl bg-cyan-500/15 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Tümünü Kopyala
            </button>
          </div>

          <div className="mt-5 max-h-[520px] space-y-3 overflow-y-auto pr-1">
            {codes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/30 px-4 py-10 text-center text-slate-400">
                Henüz kod üretilmedi.
              </div>
            ) : (
              codes.map((code) => (
                <div key={code.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <code className="font-mono text-base text-white">{code.code}</code>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">{code.duration} gün</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      {code.status} • {new Date(code.createdAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(code.code)}
                    className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5"
                  >
                    Kopyala
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
