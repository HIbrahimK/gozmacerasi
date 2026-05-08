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

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      setLoading(false);
      return;
    }

    try {
      const response = await apiPost<AuthResponse>('/auth/register', {
        fullName,
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
      setError('Kayıt başarısız. Bu e-posta zaten kullanılıyor olabilir.');
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 text-lg font-bold text-white shadow-lg shadow-pink-500/20">
              G
            </div>
            <span className="text-lg font-bold tracking-tight">
              Göz<span className="gradient-text-pink">Macerası</span>
            </span>
          </Link>
          <Link href="/login" className="btn-secondary text-sm">
            Giriş Yap
          </Link>
        </div>
      </nav>

      <main className="relative min-h-screen pt-24 pb-16">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-pink-500/8 blur-[120px]" />
          <div className="absolute left-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-violet-500/6 blur-[100px]" />
        </div>

        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 lg:grid-cols-2 lg:items-center">
          {/* Left side — form */}
          <section className="animate-slide-up-delay-1 mx-auto w-full max-w-md lg:order-1">
            <div className="glass-card p-8 sm:p-10">
              <div className="mb-8 space-y-2">
                <h2 className="text-2xl font-bold">Kayıt Ol</h2>
                <p className="text-sm text-slate-400">
                  Yeni bir aile hesabı oluştur.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300" htmlFor="reg-name">
                    Ad Soyad
                  </label>
                  <input
                    id="reg-name"
                    className="input-field"
                    type="text"
                    placeholder="Adınız Soyadınız"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300" htmlFor="reg-email">
                    E-posta
                  </label>
                  <input
                    id="reg-email"
                    className="input-field"
                    type="email"
                    placeholder="ornek@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300" htmlFor="reg-password">
                    Şifre
                  </label>
                  <input
                    id="reg-password"
                    className="input-field"
                    type="password"
                    placeholder="En az 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300" htmlFor="reg-confirm">
                    Şifre Tekrar
                  </label>
                  <input
                    id="reg-confirm"
                    className="input-field"
                    type="password"
                    placeholder="Şifreyi tekrar girin"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  className="w-full rounded-2xl bg-gradient-to-r from-pink-400 to-rose-500 px-4 py-3.5 font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:shadow-pink-500/40 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Kayıt oluşturuluyor...
                    </span>
                  ) : (
                    'Ücretsiz Kayıt Ol'
                  )}
                </button>
              </form>

              <div className="mt-8 border-t border-white/6 pt-6 text-center text-sm text-slate-400">
                Zaten hesabın var mı?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-pink-400 transition hover:text-pink-300"
                >
                  Giriş Yap
                </Link>
              </div>
            </div>
          </section>

          {/* Right side — branding */}
          <section className="animate-slide-up hidden flex-col justify-center space-y-8 lg:order-2 lg:flex">
            <span className="text-sm font-medium uppercase tracking-[0.3em] text-pink-300">
              GözMacerası
            </span>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight xl:text-6xl">
              Yeni bir aile hesabı ile{' '}
              <span className="gradient-text-pink">başlayın</span>
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-slate-400">
              Çocuk profillerini daha sonra ekleyebilir, oyun oturumlarını ve
              ilerlemeyi tek panelden izleyebilirsiniz.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {['✅ Ücretsiz 3 Oyun', '✅ Aile Hesabı', '✅ Doktor Onaylı'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-pink-400/15 bg-pink-400/5 px-4 py-1.5 text-sm text-pink-200"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
