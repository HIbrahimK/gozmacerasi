'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

type DoctorPrescription = {
  id: string;
  childId: string;
  childName: string;
  diagnosis: string;
  targetGoals: Record<string, boolean>;
  recommendedGames: Array<{ gameId: string; reason: string }>;
  difficultyRange: string;
  dailyLimitMinutes: number;
  notes: string | null;
  status: string;
  createdDate: string;
};

export default function DoctorPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<DoctorPrescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<DoctorPrescription[]>('/doctor/prescriptions')
      .then(setPrescriptions)
      .catch(() => setPrescriptions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-blue-300">Doktor</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Reçeteler</h1>
        </div>
        <a
          href="/dashboard/doctor/prescriptions/new"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          + Yeni Reçete
        </a>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">Yükleniyor...</div>
      ) : prescriptions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-12 text-center">
          <p className="text-slate-400">Henüz reçete yazılmamış.</p>
          <p className="mt-2 text-sm text-slate-500">
            Yukarıdaki butona tıklayarak yeni bir reçete oluşturun.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <div
              key={rx.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-semibold text-white">{rx.childName}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        rx.status === 'active'
                          ? 'bg-emerald-400/15 text-emerald-300'
                          : 'bg-slate-400/15 text-slate-400'
                      }`}
                    >
                      {rx.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">Tanı: {rx.diagnosis}</p>
                </div>
                <p className="text-xs text-slate-500">
                  {new Date(rx.createdDate).toLocaleDateString('tr-TR')}
                </p>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs text-slate-400">Zorluk</p>
                  <p className="mt-1 text-sm font-medium text-white capitalize">
                    {rx.difficultyRange}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs text-slate-400">Günlük Limit</p>
                  <p className="mt-1 text-sm font-medium text-white">{rx.dailyLimitMinutes} dk</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs text-slate-400">Hedefler</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {Object.entries(rx.targetGoals)
                      .filter(([, v]) => v)
                      .map(([k]) => k.replace(/_/g, ' '))
                      .join(', ') || '-'}
                  </p>
                </div>
              </div>

              {rx.recommendedGames.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-slate-400">Önerilen Oyunlar</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {rx.recommendedGames.map((game, i) => (
                      <span
                        key={i}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                      >
                        {game.gameId}: {game.reason}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {rx.notes && (
                <p className="mt-4 rounded-xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
                  📝 {rx.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
