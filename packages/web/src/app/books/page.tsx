'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiGet } from '@/lib/api';

type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string | null;
  coverColor: string;
  minAge: number;
  maxAge: number;
  pageCount: number;
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    apiGet<Book[]>('/books').then(setBooks).catch(() => {});
  }, []);

  const categoryIcons: Record<string, string> = {
    Macera: '🏰',
    Masal: '✨',
    Eğlence: '😄',
    Bilim: '🔬',
    Doğa: '🌿',
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14),_transparent_35%),linear-gradient(180deg,#05111a_0%,#0f172a_100%)] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Kütüphane</p>
            <h1 className="mt-2 text-4xl font-semibold">Stereoskopik Kitaplar</h1>
            <p className="mt-2 text-slate-400">
              Kırmızı-mavi gözlüğünüzü takın ve 3 boyutlu kitapları okuyun.
            </p>
          </div>
          <div className="rounded-xl border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-200">
            {books.length} kitap
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <Link
              key={book.id}
              href={`/books/${book.id}`}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10"
            >
              <div
                className="flex h-40 items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${book.coverColor}40, ${book.coverColor}10)`,
                }}
              >
                <div className="text-center">
                  <span className="text-5xl">{categoryIcons[book.category] ?? '📚'}</span>
                  <p className="mt-2 text-xs uppercase tracking-wider text-white/60">
                    {book.category}
                  </p>
                </div>
              </div>

              <div className="p-5">
                <h2 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition">
                  {book.title}
                </h2>
                <p className="mt-1 text-sm text-slate-400">{book.author}</p>
                <p className="mt-3 text-sm text-slate-300 line-clamp-2">
                  {book.description ?? 'Açıklama eklenmedi.'}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>{book.pageCount} sayfa</span>
                  <span>{book.minAge}-{book.maxAge} yaş</span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-indigo-300 opacity-0 transition group-hover:opacity-100">
                  <span>Okumaya Başla</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {!books.length && (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-12 text-center">
            <p className="text-slate-400">Henüz kitap eklenmedi.</p>
          </div>
        )}
      </div>
    </main>
  );
}
