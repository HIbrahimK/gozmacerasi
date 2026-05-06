'use client';

import { useState, useEffect } from 'react';

interface Game {
  id: string;
  name: string;
  type: string;
  description: string;
  isPlayable: boolean;
  createdAt: string;
}

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: '', description: '' });

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/games');
      const data = await response.json();
      setGames(Array.isArray(data) ? data : data.games || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching games:', error);
      setLoading(false);
    }
  };

  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, isPlayable: true }),
      });
      if (response.ok) {
        setFormData({ name: '', type: '', description: '' });
        setShowForm(false);
        fetchGames();
      }
    } catch (error) {
      console.error('Error adding game:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Oyun Yönetimi</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          {showForm ? 'İptal' : '+ Yeni Oyun'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddGame} className="bg-slate-700 p-4 rounded space-y-4">
          <input
            type="text"
            placeholder="Oyun Adı"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-slate-600 rounded text-white"
            required
          />
          <input
            type="text"
            placeholder="Oyun Tipi (e.g., TargetingGame)"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 bg-slate-600 rounded text-white"
            required
          />
          <textarea
            placeholder="Açıklama"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
        <div className="bg-slate-700 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-600">
              <tr>
                <th className="px-4 py-2 text-left">Oyun Adı</th>
                <th className="px-4 py-2 text-left">Tipi</th>
                <th className="px-4 py-2 text-left">Durum</th>
                <th className="px-4 py-2 text-left">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.id} className="border-t border-slate-600 hover:bg-slate-600">
                  <td className="px-4 py-2">{game.name}</td>
                  <td className="px-4 py-2">{game.type}</td>
                  <td className="px-4 py-2">{game.isPlayable ? '✅ Aktif' : '⏸️ İnaktif'}</td>
                  <td className="px-4 py-2 text-xs text-gray-400">
                    {new Date(game.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
