'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { apiGet } from '@/lib/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

type ChildProgress = {
  child: {
    id: string;
    name: string;
    age: number;
    diagnosis: string | null;
    baselineVA: string | null;
    stereopsisLevel: string | null;
    dailyLimit: number;
  };
  totalSessions: number;
  avgAccuracy: number;
  avgReactionTimeMs: number;
  bestStreak: number;
  currentStreak: number;
  sessions: Array<{
    id: string;
    childName: string;
    gameTitle: string;
    durationMinutes: number;
    accuracy: number;
    reactionTimeMs: number;
    createdAt: string;
  }>;
};

export default function ChildProgressPage() {
  const params = useParams();
  const [data, setData] = useState<ChildProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    apiGet<ChildProgress>(`/parent/children/${params.id}/progress`)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-400">Yükleniyor...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-400">Çocuk profili bulunamadı.</p>
        <Link
          href="/dashboard/parent/children"
          className="mt-4 inline-block text-sm text-emerald-300 hover:text-emerald-200"
        >
          ← Geri dön
        </Link>
      </div>
    );
  }

  const accuracyData = {
    labels: data.sessions.slice(0, 10).reverse().map((_, i) => `Oturum ${i + 1}`),
    datasets: [
      {
        label: 'Doğruluk (%)',
        data: data.sessions.slice(0, 10).reverse().map((s) => s.accuracy),
        borderColor: '#22D3EE',
        backgroundColor: 'rgba(34, 211, 238, 0.2)',
        tension: 0.35,
        fill: true,
      },
    ],
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/parent/children"
          className="text-sm text-slate-400 hover:text-slate-200"
        >
          ← Çocuklarım
        </Link>
        <h1 className="mt-2 text-3xl font-semibold text-white">{data.child.name}</h1>
        <p className="mt-1 text-slate-400">
          {data.child.age} yaş · {data.child.diagnosis ?? 'Tanı yok'}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Toplam Oturum</p>
          <p className="mt-2 text-3xl font-semibold text-white">{data.totalSessions}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Ort. Doğruluk</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-300">%{data.avgAccuracy}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Ort. Tepki Süresi</p>
          <p className="mt-2 text-3xl font-semibold text-cyan-300">{data.avgReactionTimeMs}ms</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Streak</p>
          <p className="mt-2 text-3xl font-semibold text-amber-300">
            {data.currentStreak} gün (en iyi: {data.bestStreak})
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Doğruluk Trendi</h2>
        <div className="mt-4 h-64">
          <Line
            data={accuracyData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { labels: { color: '#CBD5E1' } } },
              scales: {
                x: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(148,163,184,0.15)' } },
                y: {
                  ticks: { color: '#94A3B8' },
                  grid: { color: 'rgba(148,163,184,0.15)' },
                  min: 0,
                  max: 100,
                },
              },
            }}
          />
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Son Oturumlar</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-sm text-slate-400">Oyun</th>
                <th className="px-4 py-3 text-left text-sm text-slate-400">Süre</th>
                <th className="px-4 py-3 text-left text-sm text-slate-400">Doğruluk</th>
                <th className="px-4 py-3 text-left text-sm text-slate-400">Tepki</th>
                <th className="px-4 py-3 text-left text-sm text-slate-400">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {data.sessions.map((session) => (
                <tr key={session.id} className="border-b border-white/5">
                  <td className="px-4 py-3 text-sm text-white">{session.gameTitle}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{session.durationMinutes} dk</td>
                  <td className="px-4 py-3 text-sm text-emerald-300">%{session.accuracy}</td>
                  <td className="px-4 py-3 text-sm text-cyan-300">{session.reactionTimeMs}ms</td>
                  <td className="px-4 py-3 text-sm text-slate-400">
                    {new Date(session.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
