'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

type DoctorPatient = {
  id: string;
  name: string;
  age: number;
  diagnosis: string | null;
  totalSessions: number;
  avgAccuracy: number;
  lastSessionDate: string | null;
};

type DoctorPrescription = {
  id: string;
  childId: string;
  childName: string;
  diagnosis: string;
  status: string;
  createdDate: string;
};

export default function DoctorDashboardPage() {
  const [patients, setPatients] = useState<DoctorPatient[]>([]);
  const [prescriptions, setPrescriptions] = useState<DoctorPrescription[]>([]);

  useEffect(() => {
    Promise.all([
      apiGet<DoctorPatient[]>('/doctor/patients'),
      apiGet<DoctorPrescription[]>('/doctor/prescriptions'),
    ])
      .then(([p, rx]) => {
        setPatients(p);
        setPrescriptions(rx);
      })
      .catch(() => {});
  }, []);

  const lowAccuracyPatients = patients.filter((p) => p.avgAccuracy < 70 && p.totalSessions > 0);

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.35em] text-blue-300">Doktor</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Hasta Sayısı</p>
          <p className="mt-2 text-3xl font-semibold text-white">{patients.length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Aktif Reçete</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {prescriptions.filter((p) => p.status === 'active').length}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Uyarılar</p>
          <p className="mt-2 text-3xl font-semibold text-amber-300">{lowAccuracyPatients.length}</p>
        </div>
      </div>

      {lowAccuracyPatients.length > 0 && (
        <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6">
          <h2 className="text-lg font-semibold text-amber-300">⚠️ Dikkat Gereken Hastalar</h2>
          <div className="mt-4 space-y-3">
            {lowAccuracyPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/70 p-4"
              >
                <div>
                  <p className="font-medium text-white">{patient.name}</p>
                  <p className="text-sm text-slate-400">{patient.age} yaş · {patient.diagnosis ?? '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-amber-300">Doğruluk: %{patient.avgAccuracy}</p>
                  <p className="text-xs text-slate-500">{patient.totalSessions} oturum</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Hastalarım</h2>
            <a
              href="/dashboard/doctor/patients"
              className="text-sm text-blue-300 hover:text-blue-200"
            >
              Tümünü Gör →
            </a>
          </div>
          <div className="mt-4 space-y-3">
            {patients.slice(0, 5).map((patient) => (
              <a
                key={patient.id}
                href={`/dashboard/doctor/patients/${patient.id}`}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/70 p-4 transition hover:bg-white/5"
              >
                <div>
                  <p className="font-medium text-white">{patient.name}</p>
                  <p className="text-sm text-slate-400">
                    {patient.age} yaş · {patient.diagnosis ?? '-'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-emerald-300">%{patient.avgAccuracy}</p>
                  <p className="text-xs text-slate-500">{patient.totalSessions} oturum</p>
                </div>
              </a>
            ))}
            {!patients.length && <p className="text-sm text-slate-400">Hasta bulunamadı.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Son Reçeteler</h2>
            <a
              href="/dashboard/doctor/prescriptions"
              className="text-sm text-blue-300 hover:text-blue-200"
            >
              Tümünü Gör →
            </a>
          </div>
          <div className="mt-4 space-y-3">
            {prescriptions.slice(0, 5).map((rx) => (
              <div
                key={rx.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/70 p-4"
              >
                <div>
                  <p className="font-medium text-white">{rx.childName}</p>
                  <p className="text-sm text-slate-400">{rx.diagnosis}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      rx.status === 'active'
                        ? 'bg-emerald-400/15 text-emerald-300'
                        : 'bg-slate-400/15 text-slate-400'
                    }`}
                  >
                    {rx.status}
                  </span>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(rx.createdDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
            ))}
            {!prescriptions.length && <p className="text-sm text-slate-400">Reçete bulunamadı.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
