'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '../../lib/api';

type SessionSummary = {
  id: string;
  childId: string;
  gameId: string;
  durationMinutes: number;
  accuracy: number;
  reactionTimeMs: number;
  createdAt: string;
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);

  useEffect(() => {
    let active = true;

    async function loadSessions() {
      try {
        const data = await apiGet<SessionSummary[]>('/sessions');
        if (!active) return;
        setSessions(data);
      } catch {
        if (!active) return;
        setSessions([]);
      }
    }

    loadSessions();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_35%),linear-gradient(180deg,#04111d_0%,#0f172a_100%)] px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-6xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-sky-950/20 backdrop-blur-xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Sessions</p>
            <h1 className="mt-2 text-4xl font-semibold">Oturum geçmişi</h1>
          </div>
          <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-200">
            {sessions.length} kayıt
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sessions.map((session) => (
            <article key={session.id} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <p className="text-lg font-semibold">{session.gameId}</p>
              <p className="mt-2 text-sm text-slate-400">Child: {session.childId}</p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-slate-300">
                <div>
                  <p className="text-slate-500">Süre</p>
                  <p>{session.durationMinutes} dk</p>
                </div>
                <div>
                  <p className="text-slate-500">Doğruluk</p>
                  <p>%{session.accuracy}</p>
                </div>
                <div>
                  <p className="text-slate-500">RT</p>
                  <p>{session.reactionTimeMs} ms</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!sessions.length ? (
          <div className="mt-8 rounded-3xl border border-dashed border-white/15 bg-slate-950/60 p-8 text-slate-300">
            Henüz session kaydı yok.
          </div>
        ) : null}
      </div>
    </main>
  );
}
