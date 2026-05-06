'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '../../lib/api';

type GameCatalogItem = {
  id: string;
  title: string;
  category: string;
  description?: string;
  therapyTarget?: string;
  minAge: number;
  maxAge: number;
  isPlayable: boolean;
  createdAt: string;
};

export default function GamesPage() {
  const [games, setGames] = useState<GameCatalogItem[]>([]);

  useEffect(() => {
    let active = true;

    async function loadGames() {
      try {
        const data = await apiGet<GameCatalogItem[]>('/games');
        if (!active) return;
        setGames(data);
      } catch {
        if (!active) return;
        setGames([]);
      }
    }

    loadGames();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.12),_transparent_35%),linear-gradient(180deg,#061118_0%,#0f172a_100%)] px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-7xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-fuchsia-950/20 backdrop-blur-xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-fuchsia-300">Games</p>
            <h1 className="mt-2 text-4xl font-semibold">Oyun kataloğu</h1>
          </div>
          <div className="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-400/10 px-4 py-2 text-sm text-fuchsia-200">
            {games.length} oyun
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {games.map((game) => (
            <article key={game.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold">{game.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{game.category}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${game.isPlayable ? 'bg-emerald-400/15 text-emerald-300' : 'bg-amber-400/15 text-amber-300'}`}>
                  {game.isPlayable ? 'Playable' : 'Planned'}
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-300">{game.description ?? 'Açıklama eklenmedi.'}</p>
              <p className="mt-4 text-sm text-slate-400">Hedef: {game.therapyTarget ?? 'Tanımsız'}</p>
              <p className="mt-2 text-sm text-slate-400">Yaş: {game.minAge}-{game.maxAge}</p>
              {game.isPlayable && (
                <a
                  href={`/play/${game.id}`}
                  className="mt-4 inline-block rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
                >
                  Oyna →
                </a>
              )}
            </article>
          ))}
        </div>

        {!games.length ? (
          <div className="mt-8 rounded-3xl border border-dashed border-white/15 bg-slate-950/60 p-8 text-slate-300">
            Henüz oyun kaydı yok.
          </div>
        ) : null}
      </div>
    </main>
  );
}
