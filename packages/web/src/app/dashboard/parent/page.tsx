'use client';

import { useEffect, useState } from 'react';
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
import EngagementWidgets from '@/components/EngagementWidgets';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

type ParentChild = {
  id: string;
  name: string;
  age: number;
  diagnosis: string | null;
  dailyLimit: number;
  createdAt: string;
};

type ParentWeeklyPoint = {
  day: string;
  sessions: number;
  avgAccuracy: number;
};

type ParentSessionSummary = {
  id: string;
  childName: string;
  gameTitle: string;
  durationMinutes: number;
  accuracy: number;
  reactionTimeMs: number;
  createdAt: string;
};

type ParentDashboard = {
  children: ParentChild[];
  totalSessions: number;
  todaySessions: number;
  weeklyTrend: ParentWeeklyPoint[];
  recentSessions: ParentSessionSummary[];
};

export default function ParentDashboardPage() {
  const [data, setData] = useState<ParentDashboard | null>(null);

  useEffect(() => {
    apiGet<ParentDashboard>('/parent/dashboard').then(setData).catch(() => {});
  }, []);

  const lineData = {
    labels: data?.weeklyTrend.map((p) => p.day) ?? [],
    datasets: [
      {
        label: 'Günlük Oturum',
        data: data?.weeklyTrend.map((p) => p.sessions) ?? [],
        borderColor: '#22D3EE',
        backgroundColor: 'rgba(34, 211, 238, 0.2)',
        tension: 0.35,
        fill: true,
      },
      {
        label: 'Ort. Doğruluk (%)',
        data: data?.weeklyTrend.map((p) => p.avgAccuracy) ?? [],
        borderColor: '#34D399',
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        tension: 0.35,
        fill: false,
      },
    ],
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Ebeveyn</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Genel Bakış</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Çocuk Sayısı</p>
          <p className="mt-2 text-3xl font-semibold text-white">{data?.children.length ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Toplam Oturum</p>
          <p className="mt-2 text-3xl font-semibold text-white">{data?.totalSessions ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Bugünkü Oturum</p>
          <p className="mt-2 text-3xl font-semibold text-white">{data?.todaySessions ?? 0}</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Haftalık Terapi Trendi</h2>
        <div className="mt-4 h-64">
          <Line
            data={lineData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { labels: { color: '#CBD5E1' } } },
              scales: {
                x: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(148,163,184,0.15)' } },
                y: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(148,163,184,0.15)' } },
              },
            }}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Çocuk Profilleri</h2>
          <div className="mt-4 space-y-3">
            {data?.children.map((child) => (
              <a
                key={child.id}
                href={`/dashboard/parent/children/${child.id}`}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/70 p-4 transition hover:bg-white/5"
              >
                <div>
                  <p className="font-medium text-white">{child.name}</p>
                  <p className="text-sm text-slate-400">
                    {child.age} yaş · {child.diagnosis ?? 'Tanı yok'}
                  </p>
                </div>
                <span className="text-sm text-slate-400">{child.dailyLimit} dk/gün</span>
              </a>
            ))}
            {!data?.children.length && (
              <p className="text-sm text-slate-400">Henüz çocuk profili eklenmedi.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Son Oturumlar</h2>
          <div className="mt-4 space-y-3">
            {data?.recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/70 p-4"
              >
                <div>
                  <p className="font-medium text-white">{session.gameTitle}</p>
                  <p className="text-sm text-slate-400">
                    {session.childName} · {session.durationMinutes} dk
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-emerald-300">%{session.accuracy}</p>
                  <p className="text-xs text-slate-500">{session.reactionTimeMs}ms</p>
                </div>
              </div>
            ))}
            {!data?.recentSessions.length && (
              <p className="text-sm text-slate-400">Henüz oturum kaydı yok.</p>
            )}
          </div>
        </div>
      </div>

      {data?.children.length ? (
        <div className="mt-8">
          <EngagementWidgets childId={data.children[0].id} />
        </div>
      ) : null}
    </div>
  );
}
