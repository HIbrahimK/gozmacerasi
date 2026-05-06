'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiGet } from '@/lib/api';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  description?: string | null;
  coverColor: string;
  minAge: number;
  maxAge: number;
  pageCount: number;
  createdAt: string;
}

interface BookDetail extends Book {
  pages: Array<{
    id: string;
    pageNumber: number;
    textContent: string;
    illustration: string | null;
    depthLayer: number;
  }>;
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (!books.length) return;
    if (!selectedBook) {
      void openBook(books[0].id);
    }
  }, [books, selectedBook]);

  const fetchBooks = async () => {
    try {
      const data = await apiGet<Book[]>('/books');
      setBooks(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  const openBook = async (bookId: string) => {
    try {
      const detail = await apiGet<BookDetail>(`/books/${bookId}`);
      setSelectedBook(detail);
    } catch (error) {
      console.error('Error fetching book detail:', error);
    }
  };

  const categories = useMemo(
    () => Array.from(new Set(books.map((book) => book.category))).sort(),
    [books],
  );

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        !search ||
        [book.title, book.author, book.category, book.description ?? '']
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || book.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [books, categoryFilter, search]);

  const stats = useMemo(() => {
    const totalPages = books.reduce((sum, book) => sum + book.pageCount, 0);
    const averagePages = books.length ? Math.round(totalPages / books.length) : 0;
    const ageStart = books.length ? Math.min(...books.map((book) => book.minAge)) : 0;
    const ageEnd = books.length ? Math.max(...books.map((book) => book.maxAge)) : 0;

    return {
      total: books.length,
      totalPages,
      averagePages,
      ageRange: books.length ? `${ageStart}-${ageEnd}` : '-',
    };
  }, [books]);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/80">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Kitap Kütüphanesi</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              Seed verisiyle gelen stereoskopik kitapları hızlıca incele, sayfa önizlemesi aç ve detayları yönet.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            Kitap ekleme API&apos;si bu sürümde yok. Mevcut katalog görüntüleniyor.
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Toplam Kitap</p>
            <p className="mt-2 text-2xl font-semibold text-white">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Toplam Sayfa</p>
            <p className="mt-2 text-2xl font-semibold text-cyan-300">{stats.totalPages}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Ortalama Sayfa</p>
            <p className="mt-2 text-2xl font-semibold text-violet-300">{stats.averagePages}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Yaş Aralığı</p>
            <p className="mt-2 text-2xl font-semibold text-amber-300">{stats.ageRange}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr]">
        <input
          type="text"
          placeholder="Kitap, yazar veya kategori ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none"
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
          Kitaplar yükleniyor...
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredBooks.length === 0 ? (
              <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
                Sonuç bulunamadı.
              </div>
            ) : (
              filteredBooks.map((book) => (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => openBook(book.id)}
                  className={`text-left rounded-3xl border p-4 transition hover:-translate-y-0.5 hover:border-white/20 ${
                    selectedBook?.id === book.id ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div
                    className="flex h-40 items-end rounded-2xl p-4 text-white shadow-inner"
                    style={{ background: `linear-gradient(135deg, ${book.coverColor}, rgba(15, 23, 42, 0.95))` }}
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/70">{book.category}</p>
                      <h3 className="mt-2 text-lg font-semibold">{book.title}</h3>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-white">{book.author}</span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                        {book.pageCount} sayfa
                      </span>
                    </div>
                    <p className="line-clamp-2 text-sm text-slate-400">{book.description ?? 'Açıklama yok.'}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{book.minAge}-{book.maxAge} yaş</span>
                      <span>{new Date(book.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Seçili Kitap</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Detay görünümü</h2>
              </div>
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                Canlı
              </span>
            </div>

            {selectedBook ? (
              <div className="mt-6 space-y-5">
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-sm font-medium text-white">{selectedBook.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{selectedBook.author}</p>
                  <p className="mt-3 text-sm text-slate-300">{selectedBook.description ?? 'Açıklama yok.'}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
                    <span className="rounded-full bg-white/10 px-3 py-1">{selectedBook.category}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1">{selectedBook.pageCount} sayfa</span>
                    <span className="rounded-full bg-white/10 px-3 py-1">{selectedBook.minAge}-{selectedBook.maxAge} yaş</span>
                  </div>
                </div>

                <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                  {selectedBook.pages.map((page) => (
                    <div key={page.id} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Sayfa {page.pageNumber}</span>
                        <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] text-slate-400">
                          Katman {page.depthLayer}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-300">{page.textContent}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-6 text-sm text-slate-400">Bir kitap seçildiğinde önizleme burada görünür.</p>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
