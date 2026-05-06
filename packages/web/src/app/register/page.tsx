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

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await apiPost<AuthResponse>('/auth/register', {
        fullName,
        email,
        password,
      });
      setMessage(`Kayıt başarılı: ${response.user.email}`);
      window.localStorage.setItem('accessToken', response.accessToken);
      window.localStorage.setItem('token', response.accessToken);
    } catch {
      setMessage('Kayıt başarısız. Bilgileri kontrol et.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.18),_transparent_35%),linear-gradient(180deg,#120d1f_0%,#111827_100%)] px-6 py-12 text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="order-2 rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-xl shadow-slate-950/30 backdrop-blur-xl lg:order-1">
          <div className="mb-8 space-y-2">
            <h2 className="text-3xl font-semibold">Kayıt Ol</h2>
            <p className="text-sm text-slate-400">Yeni kullanıcı hesabı oluştur.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Ad Soyad</span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-pink-400"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-slate-300">E-posta</span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-pink-400"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Şifre</span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-pink-400"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            <button
              className="w-full rounded-2xl bg-pink-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-pink-300 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol'}
            </button>
          </form>

          {message ? (
            <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              {message}
            </p>
          ) : null}
        </section>

        <section className="order-1 flex flex-col justify-center space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-pink-950/20 backdrop-blur-xl lg:order-2">
          <p className="text-sm uppercase tracking-[0.35em] text-pink-200">Gözmacerasi</p>
          <h1 className="max-w-xl text-5xl font-semibold leading-tight text-white md:text-6xl">
            Yeni bir aile hesabı ile başlayın
          </h1>
          <p className="max-w-lg text-lg text-slate-300">
            Çocuk profillerini daha sonra ekleyebilir, oyun oturumlarını ve ilerlemeyi tek panelden izleyebilirsiniz.
          </p>
        </section>
      </div>
    </main>
  );
}
