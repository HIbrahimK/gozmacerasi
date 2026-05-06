'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiGet } from '@/lib/api';

type DoctorPatientDetail = {
  id: string;
  name: string;
  age: number;
  diagnosis: string | null;
  baselineVA: string | null;
  dailyLimit: number;
  totalSessions: number;
  avgAccuracy: number;
  lastSessionDate: string | null;
  sessions: Array<{
    id: string;
    gameTitle: string;
    durationMinutes: number;
    accuracy: number;
    reactionTimeMs: number;
    createdAt: string;
  }>;
  prescriptions: Array<{
    id: string;
    diagnosis: string;
    difficultyRange: string;
    dailyLimitMinutes: number;
    notes: string | null;
    status: string;
    createdDate: string;
  }>;
};

export default function DoctorPatientDetailPage() {
  const params = useParams();
  const [patient, setPatient] = useState<DoctorPatientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sessions' | 'prescriptions'>('sessions');

  useEffect(() => {
    if (!params.id) return;
    apiGet<DoctorPatientDetail>(`/doctor/patients/${params.id}`)
      .then(setPatient)
      .catch(() => setPatient(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-400">Yükleniyor...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-400">Hasta bulunamadı.</p>
        <Link
          href="/dashboard/doctor/patients"
          className="mt-4 inline-block text-sm text-blue-300 hover:text-blue-200"
        >
          ← Geri dön
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/doctor/patients"
          className="text-sm text-slate-400 hover:text-slate-200"
        >
          ← Hastalarım
        </Link>
        <h1 className="mt-2 text-3xl font-semibold text-white">{patient.name}</h1>
        <p className="mt-1 text-slate-400">
          {patient.age} yaş · {patient.diagnosis ?? 'Tanı yok'} · VA: {patient.baselineVA ?? '-'}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Toplam Oturum</p>
          <p className="mt-2 text-3xl font-semibold text-white">{patient.totalSessions}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Ort. Doğruluk</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-300">%{patient.avgAccuracy}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Günlük Limit</p>
          <p className="mt-2 text-3xl font-semibold text-white">{patient.dailyLimit} dk</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Reçete Sayısı</p>
          <p className="mt-2 text-3xl font-semibold text-blue-300">{patient.prescriptions.length}</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex gap-2 border-b border-white/10">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-4 py-3 text-sm font-medium transition ${
              activeTab === 'sessions'
                ? 'border-b-2 border-blue-400 text-blue-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Oturumlar ({patient.sessions.length})
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-4 py-3 text-sm font-medium transition ${
              activeTab === 'prescriptions'
                ? 'border-b-2 border-blue-400 text-blue-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Reçeteler ({patient.prescriptions.length})
          </button>
        </div>

        {activeTab === 'sessions' && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm text-slate-400">Oyun</th>
                  <th className="px-6 py-4 text-left text-sm text-slate-400">Süre</th>
                  <th className="px-6 py-4 text-left text-sm text-slate-400">Doğruluk</th>
                  <th className="px-6 py-4 text-left text-sm text-slate-400">Tepki</th>
                  <th className="px-6 py-4 text-left text-sm text-slate-400">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {patient.sessions.map((session) => (
                  <tr key={session.id} className="border-b border-white/5">
                    <td className="px-6 py-4 text-sm text-white">{session.gameTitle}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{session.durationMinutes} dk</td>
                    <td className="px-6 py-4 text-sm text-emerald-300">%{session.accuracy}</td>
                    <td className="px-6 py-4 text-sm text-cyan-300">{session.reactionTimeMs}ms</td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(session.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div className="mt-4 space-y-4">
            {patient.prescriptions.map((rx) => (
              <div
                key={rx.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-white">{rx.diagnosis}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Zorluk: {rx.difficultyRange} · Günlük: {rx.dailyLimitMinutes} dk
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      rx.status === 'active'
                        ? 'bg-emerald-400/15 text-emerald-300'
                        : 'bg-slate-400/15 text-slate-400'
                    }`}
                  >
                    {rx.status}
                  </span>
                </div>
                {rx.notes && <p className="mt-3 text-sm text-slate-300">{rx.notes}</p>}
                <p className="mt-3 text-xs text-slate-500">
                  {new Date(rx.createdDate).toLocaleDateString('tr-TR')}
                </p>
              </div>
            ))}
            {!patient.prescriptions.length && (
              <p className="text-sm text-slate-400">Bu hasta için reçete bulunamadı.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
