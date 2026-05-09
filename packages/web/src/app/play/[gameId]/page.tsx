'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { TargetingGame, PuzzleGame, MotionGame, MemoryGame } from '@gozmacerasi/game-engine';
import type { BaseGame, SessionResult, GameConfig, AnaglyphCalibrationV2 } from '@gozmacerasi/game-engine';

import { apiGet } from '@/lib/api';

const STORAGE_KEY = 'gozmacerasi_calibration';

function loadCalibrationV2(): AnaglyphCalibrationV2 | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as AnaglyphCalibrationV2;
  } catch { /* ignore */ }
  return undefined;
}

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
  const [hasCalibration, setHasCalibration] = useState(false);

  const GameClass = GAME_MAP[gameId];
  const gameName = GAME_NAMES[gameId] ?? gameId;

  useEffect(() => {
    apiGet<any>('/calibration/active')
      .then((active) => {
        if (active) {
          const cal: AnaglyphCalibrationV2 = {
            id: active.id,
            name: active.name,
            type: active.type,
            leftEye: active.left,
            rightEye: active.right,
            bg: active.bg,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cal));
          setHasCalibration(true);
        } else {
          setHasCalibration(!!loadCalibrationV2());
        }
      })
      .catch(() => {
        setHasCalibration(!!loadCalibrationV2());
      });
  }, []);

  const startGame = useCallback(() => {
    if (!canvasRef.current || !GameClass) return;

    const calV2 = loadCalibrationV2();

    const config: GameConfig = {
      width: 800,
      height: 500,
      childId: 'child_demo_a',
      gameId,
    };

    const game = new GameClass(config);
    game.init(canvasRef.current);

    // Apply V2 calibration if available
    if (calV2 && game['anaglyph']) {
      game['anaglyph'].updateProfileV2(calV2);
    }

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
      if (gameRef.current && !(gameRef.current as unknown as { isRunning: boolean }).isRunning) {
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
      <main className="flex min-h-screen items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl text-slate-400">Oyun bulunamadı: {gameId}</p>
          <Link href="/games" className="mt-4 inline-block text-sm text-violet-300 hover:text-violet-200">
            ← Oyun listesine dön
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* Navbar */}
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
          <div className="flex items-center gap-3">
            <Link href="/calibration" className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:text-white">
              🥽 Kalibrasyon
            </Link>
            <Link href="/games" className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:text-white">
              Oyunlar
            </Link>
          </div>
        </div>
      </nav>

      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Link href="/games" className="text-sm text-slate-400 hover:text-slate-200 transition">
                ← Oyunlar
              </Link>
              <h1 className="mt-1 text-2xl font-bold">{gameName}</h1>
            </div>
            {isPlaying && (
              <div className="glass-card px-5 py-2.5">
                <span className="text-sm text-slate-400">Skor: </span>
                <span className="text-xl font-bold gradient-text-cyan">{score}</span>
              </div>
            )}
          </div>

          {/* Calibration warning */}
          {!hasCalibration && !isPlaying && !result && (
            <div className="mb-4 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 flex items-center gap-3">
              <span className="text-lg">⚠️</span>
              <div>
                <p className="text-sm text-amber-200 font-medium">Kalibrasyon yapılmamış</p>
                <p className="text-xs text-amber-300/70 mt-0.5">
                  Optimal 3D deneyim için{' '}
                  <Link href="/calibration" className="underline hover:text-amber-200">kalibrasyonu tamamlayın</Link>.
                </p>
              </div>
            </div>
          )}

          {/* Game canvas */}
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
                  <div className="text-5xl mb-4">🎮</div>
                  <p className="mb-2 text-lg font-semibold">
                    {gameName}
                  </p>
                  <p className="mb-6 text-sm text-slate-400 max-w-sm mx-auto">
                    3D gözlüğünüzü takın. Her göz sadece kendi renkindeki hedefleri görecek.
                    İki gözü birden kullanarak tüm hedefleri vurun!
                  </p>
                  <button
                    onClick={startGame}
                    className="btn-primary px-8 py-3 text-lg"
                  >
                    ▶ Oyunu Başlat
                  </button>
                  <p className="mt-4 text-xs text-slate-500">
                    <Link href="/calibration" className="text-violet-400 hover:text-violet-300">
                      🥽 Kalibrasyon Ayarları
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Result panel */}
          {result && (
            <div className="mt-6 glass-card p-6">
              <h2 className="text-xl font-bold mb-4">🏆 Oyun Sonucu</h2>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { label: 'Skor', value: String(result.finalScore), color: 'text-white' },
                  { label: 'Doğruluk', value: `%${result.accuracy}`, color: 'text-emerald-300' },
                  { label: 'Tepki Süresi', value: `${result.reactionTimeMs}ms`, color: 'text-cyan-300' },
                  { label: 'Süre', value: `${result.duration}s`, color: 'text-white' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/6 bg-white/[0.02] p-4 text-center">
                    <p className="text-xs text-slate-400">{stat.label}</p>
                    <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-violet-400/15 bg-violet-400/5 p-4">
                  <p className="text-xs text-slate-400">Focus Score</p>
                  <p className="mt-1 text-3xl font-bold text-violet-300">
                    {result.focusScore.focusScore}/100
                  </p>
                </div>
                <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/5 p-4">
                  <p className="text-xs text-slate-400">Adaptif Zorluk</p>
                  <p className="mt-1 text-3xl font-bold text-cyan-300">
                    {result.adaptiveState.difficulty}/10
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={startGame}
                  className="btn-primary px-6 py-3"
                >
                  🔄 Tekrar Oyna
                </button>
                <Link
                  href="/games"
                  className="btn-secondary px-6 py-3"
                >
                  Oyunlara Dön
                </Link>
                <Link
                  href="/dashboard"
                  className="btn-secondary px-6 py-3"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
