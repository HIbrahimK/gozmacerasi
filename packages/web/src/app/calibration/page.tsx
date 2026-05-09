'use client';

import Link from 'next/link';
import { useEffect, useState, useRef, useCallback } from 'react';
import {
  AnaglyphCalibrationV2,
  ALL_PRESETS,
  PRESET_RED_CYAN,
  saveCalibration,
  loadCalibration,
} from '@/lib/anaglyph-colors';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';

type PatternType = 'blocks' | 'full' | 'text' | 'rings' | 'checker' | 'race';

export default function CalibrationPage() {
  const [cal, setCal] = useState<AnaglyphCalibrationV2>(PRESET_RED_CYAN);
  const [pattern, setPattern] = useState<PatternType>('blocks');
  
  const [userPresets, setUserPresets] = useState<any[]>([]);
  const [systemPresets, setSystemPresets] = useState<any[]>([]);
  const [presetName, setPresetName] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const ringsCanvasRef = useRef<HTMLCanvasElement>(null);

  // Load initial data
  useEffect(() => {
    // Attempt to load from API first
    apiGet<any>('/calibration/active')
      .then((active) => {
        if (active) {
          setCal({
            id: active.id,
            name: active.name,
            type: active.type,
            leftEye: active.left,
            rightEye: active.right,
            bg: active.bg,
          });
        } else {
          setCal(loadCalibration());
        }
      })
      .catch(() => {
        setCal(loadCalibration());
      });

    loadLists();
  }, []);

  const loadLists = () => {
    apiGet<any[]>('/calibration/user')
      .then(setUserPresets)
      .catch(() => {});
    apiGet<any[]>('/calibration/presets')
      .then(setSystemPresets)
      .catch(() => {});
  };

  const handleSaveUserPreset = async () => {
    if (!presetName.trim()) return;
    try {
      await apiPost('/calibration/user', {
        name: presetName,
        type: cal.type || 'rc',
        bg: cal.bg,
        left: cal.leftEye,
        right: cal.rightEye,
      });
      setPresetName('');
      loadLists();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUserPreset = async (id: string) => {
    try {
      await apiDelete(`/calibration/user/${id}`);
      loadLists();
    } catch (err) {
      console.error(err);
    }
  };

  const applyPreset = async (p: any, isUser: boolean) => {
    const newCal: AnaglyphCalibrationV2 = {
      id: p.id,
      name: p.name,
      type: p.type,
      leftEye: isUser ? p.left : p.left || (p.glassColor === 'red-blue' ? [255,0,0] : [255,0,0]),
      rightEye: isUser ? p.right : p.right || (p.glassColor === 'red-blue' ? [0,0,255] : [0,255,0]),
      bg: isUser ? p.bg : [255, 255, 255],
    };
    setCal(newCal);

    if (isUser) {
      try {
        await apiPut(`/calibration/user/${p.id}/active`);
      } catch (err) {}
    } else {
      saveCalibration(newCal); // local save for system presets
    }
  };

  const applyLocalPreset = (p: AnaglyphCalibrationV2) => {
    setCal(p);
    saveCalibration(p);
  };

  const updateChannel = (eye: 'leftEye' | 'rightEye' | 'bg', chIdx: number, val: number) => {
    setCal((prev) => {
      const arr = [...prev[eye]] as [number, number, number];
      arr[chIdx] = val;
      const next = { ...prev, [eye]: arr };
      saveCalibration(next);
      return next;
    });
  };

  // ── Canvas Rendering for Rings ──
  useEffect(() => {
    if (pattern !== 'rings') return;
    const canvas = ringsCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.parentElement?.clientWidth || 600;
    const ch = canvas.parentElement?.clientHeight || 400;
    canvas.width = cw;
    canvas.height = ch;

    const cx = cw / 2;
    const cy = ch / 2;
    const maxR = Math.min(cx, cy) * 0.9;

    ctx.fillStyle = `rgb(${cal.bg.join(',')})`;
    ctx.fillRect(0, 0, cw, ch);

    const steps = 10;
    for (let i = steps; i >= 1; i--) {
      const frac = i / steps;
      const color = i % 2 === 0 ? cal.leftEye : cal.rightEye;
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * frac, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${color.join(',')})`;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${cal.bg.join(',')})`;
    ctx.fill();
  }, [pattern, cal]);

  const leftColorStr = `rgb(${cal.leftEye.join(',')})`;
  const rightColorStr = `rgb(${cal.rightEye.join(',')})`;
  const bgColorStr = `rgb(${cal.bg.join(',')})`;

  return (
    <div className="flex h-screen w-full bg-[#0a0a0f] text-[#d0d0e0] font-mono overflow-hidden selection:bg-violet-500/30">
      
      {/* ── PANEL ── */}
      <div
        className={`flex flex-col bg-[#111118] border-r border-[#2a2a3a] transition-all duration-300 z-10 ${
          isPanelOpen ? 'w-[340px] min-w-[340px]' : 'w-0 min-w-0 border-none'
        }`}
      >
        <div className="p-4 border-b border-[#2a2a3a] flex items-center gap-3 shrink-0">
          <Link href="/dashboard" className="text-slate-400 hover:text-white mr-2">←</Link>
          <div className="h-4 w-4 rounded-full border-[1.5px] border-[#4fffb0] flex items-center justify-center">
            <div className="h-2 w-2 bg-[#4fffb0] rounded-full" />
          </div>
          <span className="text-[13px] tracking-widest uppercase text-[#606078] font-semibold">
            Kalibratör
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-[#2a2a3a] scrollbar-track-transparent">
          
          {/* Gözlük Tipi */}
          <div className="bg-[#16161f] border border-[#2a2a3a] rounded-xl overflow-hidden">
            <div className="px-3.5 py-2.5 text-[11px] tracking-[0.1em] uppercase text-[#4fffb0] border-b border-[#2a2a3a]">
              Gözlük Tipi (Sistem)
            </div>
            <div className="p-3">
              <div className="grid grid-cols-3 gap-1.5">
                {ALL_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => applyLocalPreset(p)}
                    className={`p-2 rounded-lg border text-center text-[11px] transition ${
                      cal.type === p.type
                        ? 'border-[#4fffb0] text-[#4fffb0] bg-[#1a1a28]'
                        : 'border-[#2a2a3a] text-[#606078] hover:border-[#4fffb0] hover:text-[#d0d0e0]'
                    }`}
                  >
                    <div className="flex justify-center gap-1 mb-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: `rgb(${p.leftEye.join(',')})` }} />
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: `rgb(${p.rightEye.join(',')})` }} />
                    </div>
                    {p.type?.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Arka Plan */}
          <div className="bg-[#16161f] border border-[#2a2a3a] rounded-xl overflow-hidden">
            <div className="px-3.5 py-2.5 text-[11px] tracking-[0.1em] uppercase text-[#4fffb0] border-b border-[#2a2a3a]">
              Arka Plan
            </div>
            <div className="p-3">
              <div className="w-full h-9 rounded-md border border-[#2a2a3a] mb-2" style={{ backgroundColor: bgColorStr }} />
              {(['R', 'G', 'B'] as const).map((lbl, i) => (
                <div key={`bg-${lbl}`} className="flex items-center gap-2 mb-2">
                  <span className={`text-[11px] w-3 shrink-0 ${lbl === 'R' ? 'text-red-400' : lbl === 'G' ? 'text-green-400' : 'text-blue-400'}`}>{lbl}</span>
                  <input
                    type="range" min="0" max="255" value={cal.bg[i]}
                    onChange={(e) => updateChannel('bg', i, parseInt(e.target.value))}
                    className="flex-1 h-1 bg-[#2a2a3a] rounded-full appearance-none outline-none accent-[#4fffb0] cursor-pointer"
                  />
                  <span className="text-[11px] w-8 text-right shrink-0">{cal.bg[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sol Göz */}
          <div className="bg-[#16161f] border border-[#2a2a3a] rounded-xl overflow-hidden">
            <div className="px-3.5 py-2.5 text-[11px] tracking-[0.1em] uppercase text-[#ff6060] border-b border-[#2a2a3a]">
              Sol Göz (Kırmızı Cam)
            </div>
            <div className="p-3">
              <div className="text-[10px] text-[#606078] mb-2 leading-relaxed">
                Kırmızı cam → KAYBOLMALI<br/>Diğer cam → SİYAH görünmeli
              </div>
              <div className="w-full h-9 rounded-md border border-[#2a2a3a] mb-2" style={{ backgroundColor: leftColorStr }} />
              {(['R', 'G', 'B'] as const).map((lbl, i) => (
                <div key={`l-${lbl}`} className="flex items-center gap-2 mb-2">
                  <span className={`text-[11px] w-3 shrink-0 ${lbl === 'R' ? 'text-red-400' : lbl === 'G' ? 'text-green-400' : 'text-blue-400'}`}>{lbl}</span>
                  <input
                    type="range" min="0" max="255" value={cal.leftEye[i]}
                    onChange={(e) => updateChannel('leftEye', i, parseInt(e.target.value))}
                    className="flex-1 h-1 bg-[#2a2a3a] rounded-full appearance-none outline-none accent-[#4fffb0] cursor-pointer"
                  />
                  <span className="text-[11px] w-8 text-right shrink-0">{cal.leftEye[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ Göz */}
          <div className="bg-[#16161f] border border-[#2a2a3a] rounded-xl overflow-hidden">
            <div className="px-3.5 py-2.5 text-[11px] tracking-[0.1em] uppercase text-[#4fd8ff] border-b border-[#2a2a3a]">
              Sağ Göz (Camgöbeği Cam)
            </div>
            <div className="p-3">
              <div className="text-[10px] text-[#606078] mb-2 leading-relaxed">
                Sağ cam → KAYBOLMALI<br/>Kırmızı cam → SİYAH görünmeli
              </div>
              <div className="w-full h-9 rounded-md border border-[#2a2a3a] mb-2" style={{ backgroundColor: rightColorStr }} />
              {(['R', 'G', 'B'] as const).map((lbl, i) => (
                <div key={`r-${lbl}`} className="flex items-center gap-2 mb-2">
                  <span className={`text-[11px] w-3 shrink-0 ${lbl === 'R' ? 'text-red-400' : lbl === 'G' ? 'text-green-400' : 'text-blue-400'}`}>{lbl}</span>
                  <input
                    type="range" min="0" max="255" value={cal.rightEye[i]}
                    onChange={(e) => updateChannel('rightEye', i, parseInt(e.target.value))}
                    className="flex-1 h-1 bg-[#2a2a3a] rounded-full appearance-none outline-none accent-[#4fffb0] cursor-pointer"
                  />
                  <span className="text-[11px] w-8 text-right shrink-0">{cal.rightEye[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Kayıt */}
          <div className="bg-[#16161f] border border-[#2a2a3a] rounded-xl overflow-hidden">
            <div className="px-3.5 py-2.5 text-[11px] tracking-[0.1em] uppercase text-[#4fffb0] border-b border-[#2a2a3a]">
              Kayıtlı Presetler
            </div>
            <div className="p-3">
              <div className="flex flex-col gap-1.5 mb-2">
                {userPresets.length === 0 ? (
                  <div className="text-xs text-[#606078] py-2">Henüz preset yok.</div>
                ) : (
                  userPresets.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => applyPreset(p, true)}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-md border cursor-pointer transition ${
                        p.isActive ? 'border-[#4fffb0] bg-[#1a1a28]' : 'border-[#2a2a3a] bg-[#0a0a0f] hover:border-[#4fffb0]'
                      }`}
                    >
                      <div className="flex gap-1 shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `rgb(${p.left.join(',')})` }} />
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `rgb(${p.right.join(',')})` }} />
                      </div>
                      <span className="flex-1 text-[12px] truncate font-sans">{p.name}</span>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteUserPreset(p.id); }} className="text-[#ff4f6a] text-lg leading-none px-1">×</button>
                    </div>
                  ))
                )}
              </div>
              
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Preset adı…"
                  maxLength={24}
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  className="flex-1 bg-[#0a0a0f] border border-[#2a2a3a] rounded-md px-2.5 py-2 text-[12px] text-[#d0d0e0] outline-none focus:border-[#4fffb0] font-sans"
                />
                <button
                  onClick={handleSaveUserPreset}
                  className="px-3.5 py-2 rounded-md border border-[#4fffb0] text-[#4fffb0] text-[12px] hover:bg-[#4fffb0] hover:text-[#0a0a0f] transition font-sans whitespace-nowrap"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── STAGE ── */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Topbar */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-[#2a2a3a] bg-[#111118] shrink-0">
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="p-1.5 text-[#606078] hover:text-[#4fffb0] border border-[#2a2a3a] hover:border-[#4fffb0] rounded-md transition"
          >
            ☰
          </button>
          <div className="flex gap-1 ml-2">
            {(['blocks', 'full', 'text', 'rings', 'checker'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPattern(p)}
                className={`px-3 py-1.5 rounded-md text-[11px] border transition ${
                  pattern === p ? 'border-[#4fffb0] text-[#4fffb0] bg-[#1a1a28]' : 'border-[#2a2a3a] text-[#606078] hover:border-[#4fffb0] hover:text-[#d0d0e0]'
                }`}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="ml-auto p-1.5 text-[#606078] hover:text-[#4fffb0] border border-[#2a2a3a] hover:border-[#4fffb0] rounded-md transition">
            ⛶
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-6 relative" style={{ backgroundColor: bgColorStr }}>
          
          <div className="absolute top-4 right-4 bg-black/80 border border-white/10 rounded-lg p-3 text-[11px] text-[#606078] max-w-[240px] pointer-events-none">
            <span className="text-[#4fffb0]">Sol cam (kırmızı)</span> → sol bloğu filtreler<br/>
            <span className="text-[#4fffb0]">Sağ cam (diğer)</span> → sağ bloğu filtreler<br/>
            Renkleri tam eşleşene kadar ayarlayın
          </div>

          <div className="w-full h-full max-w-[900px] max-h-[600px] rounded-2xl border border-[#2a2a3a] overflow-hidden relative flex items-center justify-center" style={{ backgroundColor: bgColorStr }}>
            
            {pattern === 'blocks' && (
              <div className="flex items-center justify-around w-full px-10 gap-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="text-[11px] tracking-widest uppercase text-[#606078]">Sol Göz</div>
                  <div className="w-40 h-40 rounded-2xl border border-white/5" style={{ backgroundColor: leftColorStr }} />
                  <div className="text-[10px] text-[#606078] text-center">Kırmızı cam<br/>kaybolmalı</div>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="text-[11px] tracking-widest uppercase text-[#606078]">Sağ Göz</div>
                  <div className="w-40 h-40 rounded-2xl border border-white/5" style={{ backgroundColor: rightColorStr }} />
                  <div className="text-[10px] text-[#606078] text-center">Camgöbeği cam<br/>kaybolmalı</div>
                </div>
              </div>
            )}

            {pattern === 'full' && (
              <div className="flex w-full h-full">
                <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: leftColorStr }}>
                  <div className="text-[13px] tracking-[0.1em] text-white opacity-30 mix-blend-difference">SOL</div>
                </div>
                <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: rightColorStr }}>
                  <div className="text-[13px] tracking-[0.1em] text-white opacity-30 mix-blend-difference">SAĞ</div>
                </div>
              </div>
            )}

            {pattern === 'text' && (
              <div className="flex flex-col items-center justify-center gap-5 p-8">
                <div className="flex gap-10">
                  <div className="text-center">
                    <div className="text-[28px] font-semibold tracking-tight leading-tight transition-colors" style={{ color: leftColorStr }}>KALİBRASYON</div>
                    <div className="text-[11px] text-[#606078] mt-1.5 tracking-[0.08em]">SOL GÖZ · KIRMIZI CAM</div>
                  </div>
                  <div className="text-[11px] text-[#606078] mt-4">|</div>
                  <div className="text-center">
                    <div className="text-[28px] font-semibold tracking-tight leading-tight transition-colors" style={{ color: rightColorStr }}>KALİBRASYON</div>
                    <div className="text-[11px] text-[#606078] mt-1.5 tracking-[0.08em]">SAĞ GÖZ · DİĞER CAM</div>
                  </div>
                </div>
                <div className="text-[11px] text-[#606078] mt-3">Her metin yalnızca kendi camından okunabilmeli</div>
              </div>
            )}

            {pattern === 'rings' && (
              <div className="w-full h-full">
                <canvas ref={ringsCanvasRef} className="w-full h-full" />
              </div>
            )}

            {pattern === 'checker' && (
              <div className="w-full h-full grid grid-cols-8 grid-rows-5">
                {Array.from({ length: 40 }).map((_, i) => {
                  const r = Math.floor(i / 8);
                  const c = i % 8;
                  const even = (r + c) % 2 === 0;
                  return (
                    <div key={i} className="transition-colors" style={{ backgroundColor: even ? leftColorStr : rightColorStr }} />
                  );
                })}
              </div>
            )}

          </div>
        </div>

        {/* Info bar */}
        <div className="flex gap-5 px-4 py-2 border-t border-[#2a2a3a] bg-[#111118] shrink-0 text-[10px] text-[#606078]">
          <div>ARKAPLAN <span className="text-[#d0d0e0] ml-1.5">{bgColorStr}</span></div>
          <div>SOL GÖZ <span className="text-[#d0d0e0] ml-1.5">{leftColorStr}</span></div>
          <div>SAĞ GÖZ <span className="text-[#d0d0e0] ml-1.5">{rightColorStr}</span></div>
        </div>

      </div>
    </div>
  );
}
