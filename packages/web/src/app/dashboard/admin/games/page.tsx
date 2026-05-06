'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';

interface Game {
  id: string;
  title: string;
  category: string;
  description?: string;
  therapyTarget?: string;
  minAge: number;
  maxAge: number;
  isPlayable: boolean;
  createdAt: string;
}

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'playable' | 'locked'>('all');
  const [formData, setFormData] = useState({
    title: '',
    category: 'TargetingGame',
    description: '',
    therapyTarget: '',
    minAge: 4,
    maxAge: 14,
    isPlayable: true,
  });

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const data = await apiGet<Game[]>('/games');
      setGames(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching games:', error);
      setLoading(false);
    }
  };

  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiPost('/games', {
        title: formData.title,
        category: formData.category,
        description: formData.description || undefined,
        therapyTarget: formData.therapyTarget || undefined,
        minAge: formData.minAge,
        maxAge: formData.maxAge,
        isPlayable: formData.isPlayable,
      });
      setFormData({
        title: '',
        category: 'TargetingGame',
        description: '',
        therapyTarget: '',
        minAge: 4,
        maxAge: 14,
        isPlayable: true,
      });
      setShowForm(false);
      fetchGames();
    } catch (error) {
      console.error('Error adding game:', error);
    }
  };

  const categories = useMemo(
    () => Array.from(new Set(games.map((game) => game.category))).sort(),
    [games],
  );

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesSearch =
        !search ||
        [game.title, game.category, game.description ?? '', game.therapyTarget ?? '']
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || game.category === categoryFilter;
      const matchesAvailability =
        availabilityFilter === 'all'
          ? true
          : availabilityFilter === 'playable'
            ? game.isPlayable
            : !game.isPlayable;

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [availabilityFilter, categoryFilter, games, search]);

  const stats = useMemo(() => {
    const playable = games.filter((game) => game.isPlayable).length;
    return {
      total: games.length,
      playable,
      hidden: games.length - playable,
      categories: categories.length,
    };
  }, [categories.length, games]);

  const categoryLabels: Record<string, string> = {
    TargetingGame: 'Hedefleme',
    MotionGame: 'Hareket',
    PuzzleGame: 'Bulmaca',
    MemoryGame: 'Hafıza',
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-pink-300/80">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Oyun Kataloğu Yönetimi</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              Seed ile gelen 8 oyunu incele, filtrele ve yeni terapötik oyunlar ekle.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-xl bg-pink-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-600"
          >
            {showForm ? 'Formu Kapat' : '+ Yeni Oyun'}
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Toplam</p>
            <p className="mt-2 text-2xl font-semibold text-white">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Aktif</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-300">{stats.playable}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">İnaktif</p>
            <p className="mt-2 text-2xl font-semibold text-amber-300">{stats.hidden}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Kategori</p>
            <p className="mt-2 text-2xl font-semibold text-cyan-300">{stats.categories}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <input
          type="text"
          placeholder="Oyun adı, türü veya açıklama ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-pink-500 focus:outline-none"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-pink-500 focus:outline-none"
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {categoryLabels[category] ?? category}
            </option>
          ))}
        </select>
        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value as 'all' | 'playable' | 'locked')}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-pink-500 focus:outline-none"
        >
          <option value="all">Tüm Durumlar</option>
          <option value="playable">Aktif</option>
          <option value="locked">İnaktif</option>
        </select>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddGame}
          className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:grid-cols-2"
        >
          <label className="space-y-2 text-sm text-slate-300">
            <span>Oyun Adı</span>
            <input
              type="text"
              placeholder="Balon Patlatma"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-pink-500 focus:outline-none"
              required
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            <span>Kategori</span>
            <input
              type="text"
              placeholder="TargetingGame"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-pink-500 focus:outline-none"
              required
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300 lg:col-span-2">
            <span>Açıklama</span>
            <textarea
              placeholder="Görsel hedef takibi ve hassasiyet çalışması."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-28 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-pink-500 focus:outline-none"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            <span>Terapi Hedefi</span>
            <input
              type="text"
              placeholder="Hedef takibi"
              value={formData.therapyTarget}
              onChange={(e) => setFormData({ ...formData, therapyTarget: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-pink-500 focus:outline-none"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="space-y-2 text-sm text-slate-300">
              <span>Min Yaş</span>
              <input
                type="number"
                min="3"
                value={formData.minAge}
                onChange={(e) => setFormData({ ...formData, minAge: parseInt(e.target.value, 10) || 3 })}
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span>Max Yaş</span>
              <input
                type="number"
                min="3"
                value={formData.maxAge}
                onChange={(e) => setFormData({ ...formData, maxAge: parseInt(e.target.value, 10) || 14 })}
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
              />
            </label>
          </div>
          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-300 lg:col-span-2">
            <input
              type="checkbox"
              checked={formData.isPlayable}
              onChange={(e) => setFormData({ ...formData, isPlayable: e.target.checked })}
              className="h-4 w-4 rounded border-white/20 bg-slate-800 text-pink-500"
            />
            Bu oyun aktif listede görünsün
          </label>
          <div className="flex gap-3 lg:col-span-2">
            <button type="submit" className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-600">
              Kaydet
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 transition hover:bg-white/5"
            >
              Vazgeç
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
          Oyunlar yükleniyor...
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 bg-slate-950/40">
              <tr>
                <th className="px-5 py-4 text-left font-medium text-slate-400">Oyun</th>
                <th className="px-5 py-4 text-left font-medium text-slate-400">Kategori</th>
                <th className="px-5 py-4 text-left font-medium text-slate-400">Yaş</th>
                <th className="px-5 py-4 text-left font-medium text-slate-400">Durum</th>
                <th className="px-5 py-4 text-left font-medium text-slate-400">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {filteredGames.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-center text-slate-400" colSpan={5}>
                    Sonuç bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredGames.map((game) => (
                  <tr key={game.id} className="border-b border-white/5 transition hover:bg-white/5">
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">{game.title}</div>
                      <div className="mt-1 max-w-xl truncate text-xs text-slate-400">{game.description ?? '-'}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-300">{categoryLabels[game.category] ?? game.category}</td>
                    <td className="px-5 py-4 text-slate-300">
                      {game.minAge} - {game.maxAge}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${game.isPlayable ? 'bg-emerald-400/15 text-emerald-300' : 'bg-amber-400/15 text-amber-300'}`}>
                        {game.isPlayable ? 'Aktif' : 'İnaktif'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {new Date(game.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
