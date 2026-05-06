'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiGet } from '@/lib/api';

type BookPage = {
  id: string;
  pageNumber: number;
  textContent: string;
  illustration: string | null;
  depthLayer: number;
};

type BookDetail = {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string | null;
  coverColor: string;
  pages: BookPage[];
};

export default function BookReaderPage() {
  const params = useParams();
  const bookId = params.id as string;
  const [book, setBook] = useState<BookDetail | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    apiGet<BookDetail>(`/books/${bookId}`).then(setBook).catch(() => {});
  }, [bookId]);

  const renderPage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !book) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const page = book.pages[currentPage];
    if (!page) return;

    ctx.clearRect(0, 0, w, h);

    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, `${book.coverColor}15`);
    gradient.addColorStop(1, '#0a0a1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const depthOffset = page.depthLayer === 2 ? 15 : 0;

    ctx.save();
    ctx.font = 'bold 28px system-ui';
    ctx.fillStyle = book.coverColor;
    ctx.textAlign = 'center';
    ctx.fillText(book.title, w / 2, 60);

    ctx.font = '16px system-ui';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(`${book.author} — Sayfa ${page.pageNumber}`, w / 2, 90);
    ctx.restore();

    ctx.save();
    ctx.font = '20px system-ui';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';

    const maxWidth = w - 120;
    const lineHeight = 32;
    const words = page.textContent.split(' ');
    let line = '';
    let y = 160 + depthOffset;

    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line) {
        ctx.fillText(line.trim(), 60 + depthOffset, y);
        line = word + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) ctx.fillText(line.trim(), 60 + depthOffset, y);

    ctx.restore();

    ctx.save();
    ctx.strokeStyle = `${book.coverColor}40`;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    ctx.strokeRect(40, 120, w - 80, h - 180);
    ctx.setLineDash([]);
    ctx.restore();

    if (page.depthLayer === 2) {
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = book.coverColor;
      ctx.beginPath();
      ctx.arc(w * 0.75, h * 0.6, 60, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(w * 0.8, h * 0.4, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(`${currentPage + 1} / ${book.pages.length}`, w / 2, h - 20);
    ctx.restore();
  }, [book, currentPage, bookId]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);

  if (!book) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#05111a_0%,#0f172a_100%)] text-white">
        <p className="text-slate-400">Yükleniyor...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#05111a_0%,#0f172a_100%)] px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/books" className="text-sm text-slate-400 hover:text-slate-200">
              ← Kütüphane
            </Link>
            <h1 className="mt-1 text-2xl font-semibold">{book.title}</h1>
            <p className="text-sm text-slate-400">{book.author}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm">
              {currentPage + 1} / {book.pages.length}
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
          <canvas
            ref={canvasRef}
            width={900}
            height={600}
            className="block w-full"
          />

          {!isReading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="text-center">
                <p className="mb-2 text-lg text-slate-300">
                  Gözlüğünüzü takın ve stereoskopik okumaya başlayın.
                </p>
                <p className="mb-6 text-sm text-slate-500">
                  Kırmızı-mavi 3D gözlüğünüzü taktığınızdan emin olun.
                </p>
                <button
                  onClick={() => setIsReading(true)}
                  className="rounded-xl bg-indigo-600 px-8 py-3 text-lg font-semibold text-white transition hover:bg-indigo-700"
                >
                  Okumaya Başla
                </button>
                <p className="mt-4 text-sm text-slate-500">
                  Kalibrasyon: <a href="/calibration" className="text-indigo-400 hover:text-indigo-300">Ayarları Değiştir</a>
                </p>
              </div>
            </div>
          )}
        </div>

        {isReading && (
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="rounded-xl border border-white/10 px-6 py-3 text-sm text-slate-300 transition hover:bg-white/5 disabled:opacity-30"
            >
              ← Önceki Sayfa
            </button>

            <div className="flex gap-1">
              {book.pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`h-2 w-2 rounded-full transition ${
                    i === currentPage ? 'bg-indigo-400' : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            {currentPage < book.pages.length - 1 ? (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Sonraki Sayfa →
              </button>
            ) : (
              <Link
                href="/books"
                className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                ✓ Kitap Bitti
              </Link>
            )}
          </div>
        )}

        <div className="mt-6 grid grid-cols-5 gap-2">
          {book.pages.map((page, i) => (
            <button
              key={page.id}
              onClick={() => {
                setCurrentPage(i);
                setIsReading(true);
              }}
              className={`rounded-lg border p-2 text-center text-xs transition ${
                i === currentPage
                  ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {page.pageNumber}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
