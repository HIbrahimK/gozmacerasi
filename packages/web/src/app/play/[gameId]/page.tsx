'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { TargetingGame, PuzzleGame, MotionGame, MemoryGame } from '@gozmacerasi/game-engine';
import type { BaseGame, SessionResult, GameConfig } from '@gozmacerasi/game-engine';

const GAME_MAP: Record<string, typeof TargetingGame | typeof PuzzleGame | typeof MotionGame | typeof MemoryGame> = {
  'game_target_1': TargetingGame,
  'game_target_2': TargetingGame,
  'game_target_3': TargetingGame,
  'game_motion_1': MotionGame,
  'game_motion_2': MotionGame,
  'game_puzzle_1': PuzzleGame,
  'game_puzzle_2': PuzzleGame,
  'game_memory_1': MemoryGame,
};

const GAME_NAMES: Record<string, string> = {
  'game_target_1': 'Balon Patlatma',
  'game_target_2': 'Yıldız Toplama',
  'game_target_3': 'Hedef Vur',
  'game_motion_1': 'Kelebek Yakalama',
  'game_motion_2': 'Kurbağa Geçirme',
  'game_puzzle_1': 'Labirent Kaçışı',
  'game_puzzle_2': 'Resim Tamamlama',
  'game_memory_1': 'Eşleştirme Oyunu',
};

export default function PlayGamePage() {
  const params = useParams();
  const gameId = params.gameId as string;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<BaseGame | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<SessionResult | null>(null);
  const [score, setScore] = useState(0);

  const GameClass = GAME_MAP[gameId];
  const gameName = GAME_NAMES[gameId] ?? gameId;

  const startGame = useCallback(() => {
    if (!canvasRef.current || !GameClass) return;

    const config: GameConfig = {
      width: 800,
      height: 500,
      childId: 'child_demo_a',
      gameId,
    };

    const game = new GameClass(config);
    game.init(canvasRef.current);
    game.start();

    gameRef.current = game;
    setIsPlaying(true);
    setResult(null);

    const scoreInterval = setInterval(() => {
      if (gameRef.current) {
        setScore(gameRef.current.getScore());
      }
    }, 500);

    const checkInterval = setInterval(() => {
      if (gameRef.current && !gameRef.current['isRunning']) {
        clearInterval(checkInterval);
        clearInterval(scoreInterval);
        const sessionResult = gameRef.current.stop();
        setResult(sessionResult);
        setIsPlaying(false);
        gameRef.current = null;
      }
    }, 1000);

    return () => {
      clearInterval(checkInterval);
      clearInterval(scoreInterval);
    };
  }, [GameClass, gameId]);

  useEffect(() => {
    return () => {
      if (gameRef.current) {
        gameRef.current.stop();
        gameRef.current = null;
      }
    };
  }, []);

  if (!GameClass) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#05111a_0%,#0f172a_100%)] text-white">
        <div className="text-center">
          <p className="text-xl text-slate-400">Oyun bulunamadı: {gameId}</p>
          <a href="/games" className="mt-4 inline-block text-sm text-violet-300 hover:text-violet-200">
            ← Oyun listesine dön
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#05111a_0%,#0f172a_100%)] px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <a href="/games" className="text-sm text-slate-400 hover:text-slate-200">
              ← Oyunlar
            </a>
            <h1 className="mt-1 text-2xl font-semibold">{gameName}</h1>
          </div>
          {isPlaying && (
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">
              <span className="text-sm text-slate-400">Skor: </span>
              <span className="text-lg font-bold text-white">{score}</span>
            </div>
          )}
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="block w-full"
            style={{ cursor: isPlaying ? 'crosshair' : 'default' }}
          />

          {!isPlaying && !result && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="text-center">
                <p className="mb-4 text-lg text-slate-300">
                  Gözlüğünüzü takın ve kalibrasyon ayarlarını kontrol edin.
                </p>
                <button
                  onClick={startGame}
                  className="rounded-xl bg-violet-600 px-8 py-3 text-lg font-semibold text-white transition hover:bg-violet-700"
                >
                  Oyunu Başlat
                </button>
                <p className="mt-4 text-sm text-slate-500">
                  Kalibrasyon: <a href="/calibration" className="text-violet-400 hover:text-violet-300">Ayarları Değiştir</a>
                </p>
              </div>
            </div>
          )}
        </div>

        {result && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-white">Oyun Sonucu</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4 text-center">
                <p className="text-sm text-slate-400">Skor</p>
                <p className="mt-1 text-2xl font-bold text-white">{result.finalScore}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4 text-center">
                <p className="text-sm text-slate-400">Doğruluk</p>
                <p className="mt-1 text-2xl font-bold text-emerald-300">%{result.accuracy}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4 text-center">
                <p className="text-sm text-slate-400">Tepki Süresi</p>
                <p className="mt-1 text-2xl font-bold text-cyan-300">{result.reactionTimeMs}ms</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4 text-center">
                <p className="text-sm text-slate-400">Süre</p>
                <p className="mt-1 text-2xl font-bold text-white">{result.duration}s</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-violet-400/20 bg-violet-400/5 p-4">
                <p className="text-sm text-slate-400">Focus Score</p>
                <p className="mt-1 text-3xl font-bold text-violet-300">
                  {result.focusScore.focusScore}/100
                </p>
                <div className="mt-2 space-y-1 text-xs text-slate-400">
                  <p>Doğruluk: {result.focusScore.accuracy}</p>
                  <p>Tepki: {result.focusScore.reactionTimeEfficiency}</p>
                  <p>Tutarlılık: {result.focusScore.consistency}</p>
                </div>
              </div>
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                <p className="text-sm text-slate-400">Adaptif Zorluk</p>
                <p className="mt-1 text-3xl font-bold text-cyan-300">
                  {result.adaptiveState.difficulty}/10
                </p>
                <div className="mt-2 space-y-1 text-xs text-slate-400">
                  <p>Kontrast: {result.adaptiveState.contrast.toFixed(2)}</p>
                  <p>Hız: {result.adaptiveState.speedFactor.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
              <p className="text-sm font-semibold text-amber-300">Motor Analiz</p>
              <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                  <p className="text-xs text-slate-400">Tıklama</p>
                  <p className="text-sm font-medium text-white">{result.trackingMetrics.totalClicks}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Doğru</p>
                  <p className="text-sm font-medium text-emerald-300">{result.trackingMetrics.correctClicks}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Motor Pürüzsüzlük</p>
                  <p className="text-sm font-medium text-white">{(result.trackingMetrics.motorSmoothness * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Göz Eğilimi</p>
                  <p className="text-sm font-medium text-white">{result.trackingMetrics.dominantEyeBias.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={startGame}
                className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-700"
              >
                Tekrar Oyna
              </button>
              <a
                href="/dashboard/parent"
                className="rounded-xl border border-white/10 px-6 py-3 text-sm text-slate-300 transition hover:bg-white/5"
              >
                Dashboard&apos;a Dön
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
