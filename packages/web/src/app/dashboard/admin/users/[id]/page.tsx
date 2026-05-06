'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiGet } from '@/lib/api';

type AdminUserDetail = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  parentProfile: {
    id: string;
    phone: string | null;
    childrenCount: number;
  } | null;
  doctorProfile: {
    id: string;
    specialization: string | null;
    licenseNumber: string | null;
    verified: boolean;
    patientsCount: number;
  } | null;
  adminProfile: {
    id: string;
  } | null;
};

export default function AdminUserDetailPage() {
  const params = useParams();
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    apiGet<AdminUserDetail>(`/admin/users/${params.id}`)
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-400">Yükleniyor...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-400">Kullanıcı bulunamadı.</p>
        <Link href="/dashboard/admin/users" className="mt-4 inline-block text-sm text-violet-300 hover:text-violet-200">
          ← Geri dön
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/admin/users" className="text-sm text-slate-400 hover:text-slate-200">
          ← Kullanıcılar
        </Link>
        <h1 className="mt-2 text-3xl font-semibold text-white">{user.name ?? 'İsimsiz Kullanıcı'}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-white">Temel Bilgiler</h2>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">ID</span>
              <span className="text-sm text-white font-mono">{user.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">E-posta</span>
              <span className="text-sm text-white">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Rol</span>
              <span className="text-sm text-white">{user.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Kayıt Tarihi</span>
              <span className="text-sm text-white">
                {new Date(user.createdAt).toLocaleDateString('tr-TR')}
              </span>
            </div>
          </div>
        </div>

        {user.parentProfile && (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-emerald-300">Ebeveyn Profili</h2>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Telefon</span>
                <span className="text-sm text-white">{user.parentProfile.phone ?? '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Çocuk Sayısı</span>
                <span className="text-sm text-white">{user.parentProfile.childrenCount}</span>
              </div>
            </div>
          </div>
        )}

        {user.doctorProfile && (
          <div className="rounded-2xl border border-blue-400/20 bg-blue-400/5 p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-blue-300">Doktor Profili</h2>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Uzmanlık</span>
                <span className="text-sm text-white">{user.doctorProfile.specialization ?? '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Lisans No</span>
                <span className="text-sm text-white">{user.doctorProfile.licenseNumber ?? '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Doğrulanmış</span>
                <span className="text-sm text-white">
                  {user.doctorProfile.verified ? '✅ Evet' : '❌ Hayır'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Hasta Sayısı</span>
                <span className="text-sm text-white">{user.doctorProfile.patientsCount}</span>
              </div>
            </div>
          </div>
        )}

        {user.adminProfile && (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-red-300">Admin Profili</h2>
            <p className="mt-4 text-sm text-slate-400">Bu kullanıcı platform yöneticisidir.</p>
          </div>
        )}
      </div>
    </div>
  );
}
