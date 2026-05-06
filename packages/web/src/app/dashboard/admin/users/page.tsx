'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet, apiDelete } from '@/lib/api';

type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', name: '', password: '', role: 'PARENT' });

  async function loadUsers() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter) params.set('role', roleFilter);
      if (search) params.set('search', search);
      const qs = params.toString();
      const data = await apiGet<AdminUser[]>(`/admin/users${qs ? `?${qs}` : ''}`);
      setUsers(data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  async function handleDelete(id: string) {
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
    try {
      await apiDelete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert('Silme işlemi başarısız.');
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { apiPost } = await import('@/lib/api');
      await apiPost('/admin/users', newUser);
      setShowCreate(false);
      setNewUser({ email: '', name: '', password: '', role: 'PARENT' });
      loadUsers();
    } catch {
      alert('Kullanıcı oluşturma başarısız.');
    }
  }

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-red-400/15 text-red-300',
    DOCTOR: 'bg-blue-400/15 text-blue-300',
    PARENT: 'bg-emerald-400/15 text-emerald-300',
    CHILD: 'bg-amber-400/15 text-amber-300',
  };

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-violet-300">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Kullanıcı Yönetimi</h1>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
        >
          + Yeni Kullanıcı
        </button>
      </div>

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-4 text-lg font-semibold text-white">Yeni Kullanıcı Oluştur</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="email"
              placeholder="E-posta"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
              className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="İsim"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
              className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Şifre (min 6 karakter)"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
              minLength={6}
              className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white focus:border-violet-500 focus:outline-none"
            >
              <option value="PARENT">Ebeveyn</option>
              <option value="DOCTOR">Doktor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              className="rounded-xl bg-violet-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
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

      <div className="mb-6 flex gap-3">
        <input
          type="text"
          placeholder="İsim veya e-posta ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-violet-500 focus:outline-none"
        >
          <option value="">Tüm Roller</option>
          <option value="ADMIN">Admin</option>
          <option value="DOCTOR">Doktor</option>
          <option value="PARENT">Ebeveyn</option>
          <option value="CHILD">Çocuk</option>
        </select>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">İsim</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">E-posta</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Rol</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Tarih</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-slate-400">Aksiyon</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                  Yükleniyor...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                  Kullanıcı bulunamadı.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 transition hover:bg-white/5">
                  <td className="px-6 py-4 text-sm text-white">{user.name ?? '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${roleColors[user.role] ?? 'bg-slate-400/15 text-slate-300'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/admin/users/${user.id}`}
                        className="rounded-lg bg-blue-600/20 px-3 py-1.5 text-xs text-blue-300 transition hover:bg-blue-600/30"
                      >
                        Detay
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="rounded-lg bg-red-600/20 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-600/30"
                      >
                        Sil
                      </button>
                    </div>
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
