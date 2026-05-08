'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const stats = [
  { value: '20.000+', label: 'Aktif Kullanıcı' },
  { value: '100+', label: 'Özel Oyun' },
  { value: '%95', label: 'Memnuniyet' },
  { value: '3+ Ay', label: 'Ort. Tedavi' },
];

const features = [
  {
    icon: '👁️',
    title: 'Göz Koordinasyonunu Güçlendir',
    description:
      'Her iki gözü bağımsız olarak uyaran 3D teknoloji, gözlerin birlikte çalışma becerisini klinik düzeyde geliştirir.',
    color: 'from-cyan-500 to-blue-500',
    glowColor: 'rgba(34,211,238,0.15)',
  },
  {
    icon: '🧠',
    title: 'Stereoskopik Görüşü Eğit',
    description:
      'Bilimsel temelli 3D görsel egzersizler, beynin derinlik algısını aktive ederek kalıcı tedavi sağlar.',
    color: 'from-emerald-500 to-teal-500',
    glowColor: 'rgba(52,211,153,0.15)',
  },
  {
    icon: '📊',
    title: 'Detaylı Rapor ve Analiz',
    description:
      'Her oturum sonrası görsel raporlarla tedavi sürecini şeffaf şekilde izle. Doktorunla paylaş.',
    color: 'from-violet-500 to-purple-500',
    glowColor: 'rgba(167,139,250,0.15)',
  },
];

const steps = [
  {
    num: '01',
    title: '3D Gözlüğünü Edin',
    description:
      'Kırmızı-mavi anaglyph gözlüğü eczane veya online satış noktalarından kolayca temin edin.',
    icon: '🥽',
  },
  {
    num: '02',
    title: 'Oyununu Seç',
    description:
      'Çocuklar için ilk 3 oyun ücretsiz. Yetişkinler için özel 3D kitap programı mevcut.',
    icon: '🎮',
  },
  {
    num: '03',
    title: 'Günlük 15 Dakika Uygula',
    description:
      'Günlük 15-20 dakikalık düzenli uygulama göz tembelliğinde belirgin iyileşme sağlar.',
    icon: '⏱️',
  },
  {
    num: '04',
    title: 'İlerlemeyi Takip Et',
    description:
      'Oturum bazlı raporlar ve haftalık özetlerle gelişimi gözlemle.',
    icon: '📈',
  },
];

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <>
      {/* ─── Navbar ─── */}
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

          <div className="hidden items-center gap-1 md:flex">
            <Link href="/" className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
              Ana Sayfa
            </Link>
            <Link href="/games" className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
              Oyunlar
            </Link>
            <Link href="/books" className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
              Kitaplar
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link href="/dashboard" className="btn-primary text-sm">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white">
                  Giriş Yap
                </Link>
                <Link href="/register" className="btn-primary text-sm">
                  Ücretsiz Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-20 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute right-1/4 top-40 h-[400px] w-[400px] rounded-full bg-blue-500/8 blur-[100px]" />
          <div className="absolute left-1/2 top-60 h-[300px] w-[300px] rounded-full bg-violet-500/6 blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="animate-slide-up">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Türkiye&apos;nin #1 Amblyopi Tedavi Platformu
            </span>
          </div>

          <h1 className="animate-slide-up-delay-1 mt-6 text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
            Göz Tembelliğini{' '}
            <span className="gradient-text-cyan">Oyunla</span>{' '}
            <br className="hidden md:block" />
            Tedavi Et
          </h1>

          <p className="animate-slide-up-delay-2 mx-auto mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
            Kırmızı-mavi 3D anaglyph gözlüklerle oynanan özel oyunlar sayesinde göz
            tembelliğini eğlenceli bir maceraya dönüştür. 8 oyun + 3D kitap kütüphanesi.
          </p>

          <div className="animate-slide-up-delay-3 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register" className="btn-primary px-8 py-4 text-base">
              🚀 Ücretsiz Başla
            </Link>
            <Link href="/games" className="btn-secondary px-8 py-4 text-base">
              🎮 Oyunları Keşfet
            </Link>
          </div>

          {/* Stats strip */}
          <div className="animate-slide-up-delay-3 mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-1 rounded-2xl border border-white/6 bg-white/[0.02] p-1 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-item rounded-xl py-5">
                <div className="stat-value gradient-text-cyan">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <span className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
              Neden GözMacerası?
            </span>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Bilimsel Temelli, Eğlenceli Tedavi
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Göz tembelliği tedavisinde klinik yöntemlerle oyun teknolojisini bir araya getiren ilk Türk platformu.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-card group p-8"
                style={{ boxShadow: `0 8px 40px -12px ${feature.glowColor}` }}
              >
                <div
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-2xl shadow-lg`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="relative py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-emerald-500/8 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <span className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-400">
              Nasıl Çalışır?
            </span>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              4 Adımda Tedaviye Başla
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Karmaşık prosedürler yok. Gözlüğünü tak, içeriğini seç, günlük rutinini oluştur.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.num} className="glass-card relative p-7">
                <span className="absolute top-6 right-6 text-4xl font-black text-white/[0.04]">
                  {step.num}
                </span>
                <div className="mb-5 text-3xl">{step.icon}</div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="glass-card relative overflow-hidden p-12">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10" />
            <div className="relative">
              <h2 className="text-3xl font-bold md:text-4xl">
                Hemen Ücretsiz Başla
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-slate-400">
                İlk 3 oyun tamamen ücretsiz. Kayıt olmadan hemen oynamaya başla.
                Gözlerindeki farkı hisset.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/register" className="btn-primary px-8 py-4 text-base">
                  Ücretsiz Kayıt Ol
                </Link>
                <Link href="/login" className="btn-secondary px-8 py-4 text-base">
                  Giriş Yap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 text-sm text-slate-500 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 text-xs font-bold text-white">
                G
              </div>
              <span className="font-medium text-slate-400">GözMacerası</span>
            </div>
            <p>© 2026 GözMacerası. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
