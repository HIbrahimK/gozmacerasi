'use client';

import { useState, useEffect } from 'react';

interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  isAvailable: boolean;
  createdAt: string;
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', author: '', coverUrl: '' });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/books');
      const data = await response.json();
      setBooks(Array.isArray(data) ? data : data.books || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, isAvailable: true }),
      });
      if (response.ok) {
        setFormData({ title: '', author: '', coverUrl: '' });
        setShowForm(false);
        fetchBooks();
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Kitap Yönetimi</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          {showForm ? 'İptal' : '+ Yeni Kitap'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddBook} className="bg-slate-700 p-4 rounded space-y-4">
          <input
            type="text"
            placeholder="Kitap Adı"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 bg-slate-600 rounded text-white"
            required
          />
          <input
            type="text"
            placeholder="Yazar"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-3 py-2 bg-slate-600 rounded text-white"
            required
          />
          <input
            type="text"
            placeholder="Kapak Resmi URL"
            value={formData.coverUrl}
            onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
            className="w-full px-3 py-2 bg-slate-600 rounded text-white"
          />
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 py-2 rounded">
            Ekle
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center text-gray-400">Yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <div key={book.id} className="bg-slate-700 p-4 rounded">
              <div className="w-full h-32 bg-slate-600 rounded mb-2 flex items-center justify-center">
                📖
              </div>
              <h3 className="font-bold truncate">{book.title}</h3>
              <p className="text-sm text-gray-400">{book.author}</p>
              <p className="text-xs text-gray-500 mt-1">
                {book.isAvailable ? '✅ Kullanılabilir' : '❌ Kullanılamıyor'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
