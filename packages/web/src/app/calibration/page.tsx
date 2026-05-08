'use client';

import Link from 'next/link';
import { useEffect, useState, useRef, useCallback } from 'react';
import {
  AnaglyphCalibration,
  ALL_PRESETS,
  PRESET_RED_BLUE_STANDARD,
  saveCalibration,
  loadCalibration,
  getLeftEyeColorWithBleed,
  getRightEyeColorWithBleed,
  getBackgroundColor,
} from '@/lib/anaglyph-colors';

export default function CalibrationPage() {
  const [cal, setCal] = useState<AnaglyphCalibration>(PRESET_RED_BLUE_STANDARD);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'test' | 'advanced'>('test');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load saved calibration on mount
  useEffect(() => {
    setCal(loadCalibration());
  }, []);

  // ── Canvas Rendering ──
  const renderScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Background
    ctx.fillStyle = getBackgroundColor(cal);
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    const leftColor = getLeftEyeColorWithBleed(cal);
    const rightColor = getRightEyeColorWithBleed(cal);

    const centerY = h * 0.45;
    const leftX = w * 0.3;
    const rightX = w * 0.7;
    const radius = 55;

    // ── Left eye object (red tinted — invisible through red lens) ──
    // Outer glow
    const leftGrad = ctx.createRadialGradient(leftX, centerY, radius * 0.3, leftX, centerY, radius * 1.5);
    leftGrad.addColorStop(0, leftColor);
    leftGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = leftGrad;
    ctx.fillRect(leftX - radius * 2, centerY - radius * 2, radius * 4, radius * 4);

    // Main circle
    ctx.beginPath();
    ctx.arc(leftX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = leftColor;
    ctx.fill();

    // Inner star pattern
    ctx.save();
    ctx.translate(leftX, centerY);
    ctx.fillStyle = leftColor;
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 6; i++) {
      ctx.rotate(Math.PI / 3);
      ctx.fillRect(-4, -radius * 0.7, 8, radius * 0.5);
    }
    ctx.restore();

    // ── Right eye object (blue tinted — invisible through blue lens) ──
    const rightGrad = ctx.createRadialGradient(rightX, centerY, radius * 0.3, rightX, centerY, radius * 1.5);
    rightGrad.addColorStop(0, rightColor);
    rightGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = rightGrad;
    ctx.fillRect(rightX - radius * 2, centerY - radius * 2, radius * 4, radius * 4);

    ctx.beginPath();
    ctx.arc(rightX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = rightColor;
    ctx.fill();

    ctx.save();
    ctx.translate(rightX, centerY);
    ctx.fillStyle = rightColor;
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.fillRect(-5, -radius * 0.7, 10, radius * 0.5);
    }
    ctx.restore();

    // ── Both-eyes crosshair (neutral white — visible to both) ──
    const crossY = h * 0.45;
    const crossX = w * 0.5;
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(crossX - 15, crossY); ctx.lineTo(crossX + 15, crossY);
    ctx.moveTo(crossX, crossY - 15); ctx.lineTo(crossX, crossY + 15);
    ctx.stroke();

    // Small test dots scattered
    const dotPositions = [
      { x: w * 0.15, y: h * 0.2 }, { x: w * 0.85, y: h * 0.2 },
      { x: w * 0.15, y: h * 0.7 }, { x: w * 0.85, y: h * 0.7 },
      { x: w * 0.4, y: h * 0.75 }, { x: w * 0.6, y: h * 0.75 },
    ];
    dotPositions.forEach((pos, i) => {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? leftColor : rightColor;
      ctx.fill();
    });

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '13px Inter, system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('SOL GÖZ', leftX, centerY + radius + 30);
    ctx.fillText('SAĞ GÖZ', rightX, centerY + radius + 30);

    // Instructions
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '12px Inter, system-ui';
    ctx.fillText('🥽 Gözlüğü takın: Sol lens → sadece sağ nesneyi, sağ lens → sadece sol nesneyi görmeli', w / 2, h - 20);
  }, [cal]);

  useEffect(() => {
    renderScene();
  }, [renderScene]);

  // ── Handlers ──
  function handlePreset(preset: AnaglyphCalibration) {
    setCal({ ...preset });
    setSaved(false);
  }

  function handleSave() {
    saveCalibration(cal);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleReset() {
    setCal(PRESET_RED_BLUE_STANDARD);
    setSaved(false);
  }

  function updateLeftEye(channel: 'r' | 'g' | 'b', value: number) {
    setCal((prev) => ({
      ...prev,
      leftEye: { ...prev.leftEye, [channel]: value },
    }));
    setSaved(false);
  }

  function updateRightEye(channel: 'r' | 'g' | 'b', value: number) {
    setCal((prev) => ({
      ...prev,
      rightEye: { ...prev.rightEye, [channel]: value },
    }));
    setSaved(false);
  }

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#060d1b]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 text-lg font-bold text-white shadow-lg shadow-violet-500/20">
              G
            </div>
            <span className="text-lg font-bold tracking-tight">
              Göz<span className="gradient-text-cyan">Macerası</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:text-white">
              Dashboard
            </Link>
            <Link href="/games" className="btn-primary text-sm">
              Oyunlara Git
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative min-h-screen pt-24 pb-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-20 h-[400px] w-[400px] rounded-full bg-violet-500/8 blur-[120px]" />
          <div className="absolute right-1/4 top-40 h-[300px] w-[300px] rounded-full bg-purple-500/6 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard" className="text-sm text-slate-400 hover:text-slate-200 transition">
              ← Dashboard
            </Link>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              🥽 Gözlük <span className="gradient-text-cyan">Kalibrasyonu</span>
            </h1>
            <p className="mt-2 text-slate-400 max-w-2xl">
              3D anaglyph gözlüğünüzün renk kanallarını ayarlayın. Her göz sadece kendi rengindeki nesneleri görmelidir.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* ── Left: Canvas ── */}
            <div className="space-y-6">
              <div className="glass-card overflow-hidden p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Stereo Test Sahnesi</h2>
                  <div className="flex rounded-lg border border-white/8 bg-white/[0.02] p-0.5">
                    <button
                      onClick={() => setActiveTab('test')}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                        activeTab === 'test' ? 'bg-violet-500 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Test Sahnesi
                    </button>
                    <button
                      onClick={() => setActiveTab('advanced')}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                        activeTab === 'advanced' ? 'bg-violet-500 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Gelişmiş
                    </button>
                  </div>
                </div>

                <div className="flex justify-center rounded-xl border border-white/6 bg-black overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    className="block w-full max-w-[600px]"
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/6 bg-white/[0.02] p-3 text-center">
                    <div
                      className="mx-auto mb-2 h-4 w-12 rounded-full"
                      style={{ backgroundColor: getLeftEyeColorWithBleed(cal) }}
                    />
                    <p className="text-xs text-slate-400">Sol Göz Rengi</p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      R:{cal.leftEye.r} G:{cal.leftEye.g} B:{cal.leftEye.b}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/6 bg-white/[0.02] p-3 text-center">
                    <div
                      className="mx-auto mb-2 h-4 w-12 rounded-full"
                      style={{ backgroundColor: getRightEyeColorWithBleed(cal) }}
                    />
                    <p className="text-xs text-slate-400">Sağ Göz Rengi</p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      R:{cal.rightEye.r} G:{cal.rightEye.g} B:{cal.rightEye.b}
                    </p>
                  </div>
                </div>
              </div>

              {/* Preset buttons */}
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold mb-4">Gözlük Ön Ayarları</h2>
                <div className="grid grid-cols-2 gap-3">
                  {ALL_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handlePreset(preset)}
                      className={`group rounded-xl border p-4 text-left transition ${
                        cal.id === preset.id
                          ? 'border-violet-500 bg-violet-500/10'
                          : 'border-white/6 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: `rgb(${preset.leftEye.r},${preset.leftEye.g},${preset.leftEye.b})` }}
                        />
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: `rgb(${preset.rightEye.r},${preset.rightEye.g},${preset.rightEye.b})` }}
                        />
                      </div>
                      <p className="text-sm font-medium">{preset.name}</p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Bleed: {Math.round(preset.bleed * 100)}%
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: Controls ── */}
            <div className="space-y-5">
              {/* Left Eye Controls */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: getLeftEyeColorWithBleed(cal) }} />
                  <h3 className="text-sm font-semibold">Sol Göz Kanalı</h3>
                </div>
                {(['r', 'g', 'b'] as const).map((ch) => (
                  <div key={`left-${ch}`} className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{ch === 'r' ? 'Kırmızı' : ch === 'g' ? 'Yeşil' : 'Mavi'}</span>
                      <span className="text-white font-mono">{cal.leftEye[ch]}</span>
                    </div>
                    <input
                      type="range" min={0} max={255}
                      value={cal.leftEye[ch]}
                      onChange={(e) => updateLeftEye(ch, parseInt(e.target.value))}
                      className="w-full accent-violet-500"
                      style={{
                        accentColor: ch === 'r' ? '#ef4444' : ch === 'g' ? '#22c55e' : '#3b82f6',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Right Eye Controls */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: getRightEyeColorWithBleed(cal) }} />
                  <h3 className="text-sm font-semibold">Sağ Göz Kanalı</h3>
                </div>
                {(['r', 'g', 'b'] as const).map((ch) => (
                  <div key={`right-${ch}`} className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{ch === 'r' ? 'Kırmızı' : ch === 'g' ? 'Yeşil' : 'Mavi'}</span>
                      <span className="text-white font-mono">{cal.rightEye[ch]}</span>
                    </div>
                    <input
                      type="range" min={0} max={255}
                      value={cal.rightEye[ch]}
                      onChange={(e) => updateRightEye(ch, parseInt(e.target.value))}
                      className="w-full"
                      style={{
                        accentColor: ch === 'r' ? '#ef4444' : ch === 'g' ? '#22c55e' : '#3b82f6',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Global controls */}
              <div className="glass-card p-5 space-y-4">
                <h3 className="text-sm font-semibold">Genel Ayarlar</h3>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Yoğunluk</span>
                    <span className="text-white font-mono">{Math.round(cal.intensity * 100)}%</span>
                  </div>
                  <input
                    type="range" min={30} max={100}
                    value={Math.round(cal.intensity * 100)}
                    onChange={(e) => {
                      setCal((p) => ({ ...p, intensity: parseInt(e.target.value) / 100 }));
                      setSaved(false);
                    }}
                    className="w-full accent-violet-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Renk Geçirgenliği (Bleed)</span>
                    <span className="text-white font-mono">{Math.round(cal.bleed * 100)}%</span>
                  </div>
                  <input
                    type="range" min={0} max={40}
                    value={Math.round(cal.bleed * 100)}
                    onChange={(e) => {
                      setCal((p) => ({ ...p, bleed: parseInt(e.target.value) / 100 }));
                      setSaved(false);
                    }}
                    className="w-full accent-amber-500"
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Açık tonlu gözlükler için artırın
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Arka Plan Karanlığı</span>
                    <span className="text-white font-mono">{cal.backgroundLevel}</span>
                  </div>
                  <input
                    type="range" min={0} max={40}
                    value={cal.backgroundLevel}
                    onChange={(e) => {
                      setCal((p) => ({ ...p, backgroundLevel: parseInt(e.target.value) }));
                      setSaved(false);
                    }}
                    className="w-full accent-slate-500"
                  />
                </div>
              </div>

              {/* Save / Reset */}
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className={`flex-1 rounded-xl py-3 text-sm font-semibold transition ${
                    saved
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:shadow-lg hover:shadow-violet-500/20'
                  }`}
                >
                  {saved ? '✓ Kaydedildi!' : 'Kalibrasyonu Kaydet'}
                </button>
                <button
                  onClick={handleReset}
                  className="rounded-xl border border-white/8 px-5 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  Sıfırla
                </button>
              </div>

              {/* Warning */}
              {cal.bleed > 0.3 && (
                <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-300">
                  ⚠️ Yüksek renk geçirgenliği, ayrım kalitesini düşürebilir.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
