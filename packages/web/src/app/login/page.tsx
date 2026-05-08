'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { apiPost } from '../../lib/api';

type AuthResponse = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName?: string;
    role?: string;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiPost<AuthResponse>('/auth/login', {
        email,
        password,
      });
      window.localStorage.setItem('accessToken', response.accessToken);
      window.localStorage.setItem('token', response.accessToken);
      if (response.user) {
        window.localStorage.setItem('user', JSON.stringify(response.user));
      }
      router.push('/dashboard');
    } catch {
      setError('Giriş başarısız. E-posta veya şifrenizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#060d1b]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-lg font-bold text-white shadow-lg shadow-cyan-500/20">
              G
            </div>
            <span className="text-lg font-bold tracking-tight">
              Göz<span className="gradient-text-cyan">Macerası</span>
            </span>
          </Link>
          <Link href="/register" className="btn-primary text-sm">
            Ücretsiz Kayıt Ol
          </Link>
        </div>
      </nav>

      <main className="relative min-h-screen pt-24 pb-16">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/8 blur-[120px]" />
          <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/6 blur-[100px]" />
        </div>

        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-2 lg:items-center">
          {/* Left side — branding */}
          <section className="animate-slide-up hidden flex-col justify-center space-y-8 lg:flex">
            <span className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
              GözMacerası
            </span>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight xl:text-6xl">
              Görme terapisi için{' '}
              <span className="gradient-text-cyan">akıllı başlangıç</span> noktası
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-slate-400">
              Çocuk profillerini, oyun akışını ve ilerleme takibini tek panelde
              yönetin. Doktor onaylı, aile dostu.
            </p>

            <div className="grid max-w-sm grid-cols-3 gap-4">
              <div className="rounded-xl border border-white/6 bg-white/[0.02] p-4 text-center">
                <div className="text-xl font-bold gradient-text-cyan">%85</div>
                <div className="mt-1 text-xs text-slate-500">İyileşme</div>
              </div>
              <div className="rounded-xl border border-white/6 bg-white/[0.02] p-4 text-center">
                <div className="text-xl font-bold gradient-text-emerald">3 Ay</div>
                <div className="mt-1 text-xs text-slate-500">Ort. Tedavi</div>
              </div>
              <div className="rounded-xl border border-white/6 bg-white/[0.02] p-4 text-center">
                <div className="text-xl font-bold gradient-text-pink">20K+</div>
                <div className="mt-1 text-xs text-slate-500">Kullanıcı</div>
              </div>
            </div>
          </section>

          {/* Right side — form */}
          <section className="animate-slide-up-delay-1 mx-auto w-full max-w-md">
            <div className="glass-card p-8 sm:p-10">
              <div className="mb-8 space-y-2">
                <h2 className="text-2xl font-bold">Giriş Yap</h2>
                <p className="text-sm text-slate-400">
                  Hesabınla devam et.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300" htmlFor="login-email">
                    E-posta
                  </label>
                  <input
                    id="login-email"
                    className="input-field"
                    type="email"
                    placeholder="ornek@gozmacerasi.dev"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300" htmlFor="login-password">
                    Şifre
                  </label>
                  <input
                    id="login-password"
                    className="input-field"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  className="btn-primary w-full py-3.5"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Giriş yapılıyor...
                    </span>
                  ) : (
                    'Giriş Yap'
                  )}
                </button>
              </form>

              <div className="mt-8 border-t border-white/6 pt-6 text-center text-sm text-slate-400">
                Hesabın yok mu?{' '}
                <Link
                  href="/register"
                  className="font-semibold text-cyan-400 transition hover:text-cyan-300"
                >
                  Ücretsiz Kayıt Ol
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
