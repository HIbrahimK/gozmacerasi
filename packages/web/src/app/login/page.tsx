'use client';

import { FormEvent, useState } from 'react';
import { apiPost } from '../../lib/api';

type AuthResponse = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName?: string;
  };
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await apiPost<AuthResponse>('/auth/login', {
        email,
        password,
      });
      setMessage(`Giriş başarılı: ${response.user.email}`);
      window.localStorage.setItem('accessToken', response.accessToken);
      window.localStorage.setItem('token', response.accessToken);
    } catch {
      setMessage('Giriş başarısız. Bilgileri kontrol et.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_35%),linear-gradient(180deg,#08111f_0%,#0f172a_100%)] px-6 py-12 text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-center space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Gözmacerasi</p>
          <h1 className="max-w-xl text-5xl font-semibold leading-tight text-white md:text-6xl">
            Görme terapisi için akıllı başlangıç noktası
          </h1>
          <p className="max-w-lg text-lg text-slate-300">
            Çocuk profillerini, oyun akışını ve ilerleme takibini tek panelde yönetin.
          </p>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-xl shadow-slate-950/30 backdrop-blur-xl">
          <div className="mb-8 space-y-2">
            <h2 className="text-3xl font-semibold">Giriş Yap</h2>
            <p className="text-sm text-slate-400">Hesabınla devam et.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm text-slate-300">E-posta</span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-cyan-400"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Şifre</span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-cyan-400"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            <button
              className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          {message ? (
            <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              {message}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
