'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { apiGet, apiPost } from '@/lib/api';

type Preset = {
  id: string;
  name: string;
  glassColor: string;
  intensity: number;
  brightness: number;
  contrast: number;
};

type CalibrationState = {
  glassType: 'clip' | 'normal' | 'themed';
  glassColor: 'red-blue' | 'red-green';
  intensity: number;
  brightness: number;
  contrast: number;
};

const DEFAULT_STATE: CalibrationState = {
  glassType: 'normal',
  glassColor: 'red-blue',
  intensity: 70,
  brightness: 100,
  contrast: 100,
};

export default function CalibrationPage() {
  const [state, setState] = useState<CalibrationState>(DEFAULT_STATE);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [saved, setSaved] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    apiGet<Preset[]>('/calibration/presets').then(setPresets).catch(() => {});
  }, []);

  const renderTestPattern = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const intensityFactor = state.intensity / 100;
    const brightnessFactor = state.brightness / 100;
    const contrastFactor = state.contrast / 100;

    const applyFilter = (value: number) => {
      let result = value * brightnessFactor;
      result = ((result / 255 - 0.5) * contrastFactor + 0.5) * 255;
      return Math.max(0, Math.min(255, Math.round(result)));
    };

    const isRedBlue = state.glassColor === 'red-blue';

    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        const normalizedX = x / w;
        const normalizedY = y / h;

        const leftValue = Math.sin(normalizedX * Math.PI * 4) * 127 + 128;
        const rightValue = Math.cos(normalizedX * Math.PI * 4 + 1) * 127 + 128;

        const patternValue = (Math.sin(normalizedY * Math.PI * 3) + 1) / 2;

        const leftBrightness = leftValue * patternValue;
        const rightBrightness = rightValue * patternValue;

        let r: number, g: number, b: number;

        if (isRedBlue) {
          r = applyFilter(leftBrightness * intensityFactor);
          g = 0;
          b = applyFilter(((rightBrightness * 0.6 + rightBrightness * 0.4) / 2) * intensityFactor);
        } else {
          r = applyFilter(leftBrightness * intensityFactor);
          g = applyFilter(((rightBrightness * 0.6 + rightBrightness * 0.4) / 2) * intensityFactor);
          b = 0;
        }

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;

    const circleX = w * 0.5;
    const circleY = h * 0.5;
    const circleR = 40;

    ctx.beginPath();
    ctx.arc(circleX - 20, circleY, circleR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(circleX + 20, circleY, circleR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Bu şekil çıkıntıda mı yoksa çukurda mı?', w / 2, h - 20);
  }, [state]);

  useEffect(() => {
    renderTestPattern();
  }, [renderTestPattern]);

  function applyPreset(preset: Preset) {
    setState((prev) => ({
      ...prev,
      glassColor: preset.glassColor as 'red-blue' | 'red-green',
      intensity: preset.intensity,
      brightness: preset.brightness,
      contrast: preset.contrast,
    }));
    setSaved(false);
  }

  async function handleSave() {
    try {
      await apiPost('/calibration/profile', {
        childId: 'child_demo_a',
        ...state,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Kalibrasyon kaydedilemedi.');
    }
  }

  function handleReset() {
    setState(DEFAULT_STATE);
    setSaved(false);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.14),_transparent_35%),linear-gradient(180deg,#05111a_0%,#0f172a_100%)] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <a href="/dashboard/parent" className="text-sm text-slate-400 hover:text-slate-200">
            ← Ebeveyn Paneli
          </a>
          <h1 className="mt-2 text-4xl font-semibold">Gözlük Kalibrasyonu</h1>
          <p className="mt-2 text-slate-400">
            Gözlüğünüze uygun renk, yoğunluk ve parlaklık ayarlarını yapın.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold text-white">Stereo Test Kalıbı</h2>
              <p className="mt-2 text-sm text-slate-400">
                Gözlüğünüzü takın. Aşağıdaki kalıpta iki daire görüyorsanız kalibrasyon doğrudur.
                Daireler birbirinden farklı derinlikte görünmelidir.
              </p>
              <div className="mt-4 flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={480}
                  height={320}
                  className="rounded-xl border border-white/10"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold text-white">Ön Ayarlar</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    className="rounded-xl border border-white/10 bg-slate-950/70 p-4 text-left transition hover:border-violet-500/50 hover:bg-violet-500/10"
                  >
                    <p className="text-sm font-medium text-white">{preset.name}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {preset.glassColor === 'red-blue' ? 'Kırmızı-Mavi' : 'Kırmızı-Yeşil'} ·{' '}
                      {preset.intensity}% yoğunluk
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold text-white">Gözlük Tipi</h2>
              <div className="mt-4 space-y-2">
                {[
                  { value: 'clip', label: 'Klipsli Gözlük', icon: '📎' },
                  { value: 'normal', label: 'Normal Gözlük', icon: '👓' },
                  { value: 'themed', label: 'Tasarım Gözlük', icon: '🎨' },
                ].map((type) => (
                  <label
                    key={type.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${
                      state.glassType === type.value
                        ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                        : 'border-white/10 bg-slate-950/70 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="glassType"
                      value={type.value}
                      checked={state.glassType === type.value}
                      onChange={(e) =>
                        setState({ ...state, glassType: e.target.value as CalibrationState['glassType'] })
                      }
                      className="hidden"
                    />
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        state.glassType === type.value
                          ? 'border-violet-500 bg-violet-500'
                          : 'border-slate-600 bg-slate-900'
                      }`}
                    >
                      {state.glassType === type.value && (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold text-white">Renk Kombinasyonu</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { value: 'red-blue', label: 'Kırmızı-Mavi', colors: 'bg-gradient-to-r from-red-500 to-blue-500' },
                  { value: 'red-green', label: 'Kırmızı-Yeşil', colors: 'bg-gradient-to-r from-red-500 to-green-500' },
                ].map((color) => (
                  <button
                    key={color.value}
                    onClick={() => {
                      setState({ ...state, glassColor: color.value as CalibrationState['glassColor'] });
                      setSaved(false);
                    }}
                    className={`rounded-xl border p-4 text-center text-sm transition ${
                      state.glassColor === color.value
                        ? 'border-violet-500 bg-violet-500/10 text-white'
                        : 'border-white/10 bg-slate-950/70 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className={`mx-auto mb-2 h-4 w-16 rounded-full ${color.colors}`} />
                    {color.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
              <h2 className="text-lg font-semibold text-white">Ayalar</h2>

              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Yoğunluk</span>
                  <span className="text-white">{state.intensity}%</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={100}
                  value={state.intensity}
                  onChange={(e) => {
                    setState({ ...state, intensity: parseInt(e.target.value) });
                    setSaved(false);
                  }}
                  className="mt-2 w-full accent-violet-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Parlaklık</span>
                  <span className="text-white">{state.brightness}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={150}
                  value={state.brightness}
                  onChange={(e) => {
                    setState({ ...state, brightness: parseInt(e.target.value) });
                    setSaved(false);
                  }}
                  className="mt-2 w-full accent-violet-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Kontrast</span>
                  <span className="text-white">{state.contrast}%</span>
                </div>
                <input
                  type="range"
                  min={80}
                  max={120}
                  value={state.contrast}
                  onChange={(e) => {
                    setState({ ...state, contrast: parseInt(e.target.value) });
                    setSaved(false);
                  }}
                  className="mt-2 w-full accent-violet-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 rounded-xl bg-violet-600 py-3 text-sm font-medium text-white transition hover:bg-violet-700"
              >
                {saved ? '✓ Kaydedildi' : 'Profili Kaydet'}
              </button>
              <button
                onClick={handleReset}
                className="rounded-xl border border-white/10 px-6 py-3 text-sm text-slate-300 transition hover:bg-white/5"
              >
                Sıfırla
              </button>
            </div>

            {(state.brightness > 130 || state.brightness < 60 || state.intensity < 40) && (
              <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-300">
                ⚠️ Bu ayarlar göz sağlığı için uygun olmayabilir. Lütfen doktorunuza danışın.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
