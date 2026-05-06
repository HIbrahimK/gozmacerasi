'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet } from '@/lib/api';

type DoctorPatient = {
  id: string;
  name: string;
  age: number;
  diagnosis: string | null;
  baselineVA: string | null;
  dailyLimit: number;
  totalSessions: number;
  avgAccuracy: number;
  lastSessionDate: string | null;
};

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<DoctorPatient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<DoctorPatient[]>('/doctor/patients')
      .then(setPatients)
      .catch(() => setPatients([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-blue-300">Doktor</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Hastalarım</h1>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
          {patients.length} hasta
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Hasta</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Yaş</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Tanı</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">VA</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Oturum</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Doğruluk</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Son Oturum</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-slate-400">Aksiyon</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                  Yükleniyor...
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                  Hasta bulunamadı.
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-b border-white/5 transition hover:bg-white/5"
                >
                  <td className="px-6 py-4 text-sm font-medium text-white">{patient.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{patient.age}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{patient.diagnosis ?? '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{patient.baselineVA ?? '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{patient.totalSessions}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm font-medium ${
                        patient.avgAccuracy >= 80
                          ? 'text-emerald-300'
                          : patient.avgAccuracy >= 60
                          ? 'text-amber-300'
                          : 'text-red-300'
                      }`}
                    >
                      %{patient.avgAccuracy}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {patient.lastSessionDate
                      ? new Date(patient.lastSessionDate).toLocaleDateString('tr-TR')
                      : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/doctor/patients/${patient.id}`}
                      className="rounded-lg bg-blue-600/20 px-3 py-1.5 text-xs text-blue-300 transition hover:bg-blue-600/30"
                    >
                      Detay
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
