'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, apiPost } from '@/lib/api';

type Patient = {
  id: string;
  name: string;
  age: number;
  diagnosis: string | null;
};

const targetGoalOptions = [
  { key: 'binocular_fusion', label: 'Binoküler Füzyon' },
  { key: 'saccad_speed', label: 'Sakkad Hızı' },
  { key: 'stereopsis', label: 'Stereopsis' },
  { key: 'motor_control', label: 'Motor Kontrol' },
  { key: 'visual_acuity', label: 'Görsel Keskinlik' },
  { key: 'attention', label: 'Dikkat' },
];

export default function NewPrescriptionPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [form, setForm] = useState({
    childId: '',
    diagnosis: '',
    targetGoals: {} as Record<string, boolean>,
    recommendedGames: [] as Array<{ gameId: string; reason: string }>,
    difficultyRange: 'medium',
    dailyLimitMinutes: 30,
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiGet<Patient[]>('/doctor/patients').then(setPatients).catch(() => {});
  }, []);

  function toggleGoal(key: string) {
    setForm((prev) => ({
      ...prev,
      targetGoals: {
        ...prev.targetGoals,
        [key]: !prev.targetGoals[key],
      },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.childId || !form.diagnosis) {
      alert('Hasta ve tanı alanları zorunludur.');
      return;
    }

    setSubmitting(true);
    try {
      await apiPost('/doctor/prescriptions', form);
      router.push('/dashboard/doctor/prescriptions');
    } catch {
      alert('Reçete oluşturulamadı.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <a
          href="/dashboard/doctor/prescriptions"
          className="text-sm text-slate-400 hover:text-slate-200"
        >
          ← Reçeteler
        </a>
        <h1 className="mt-2 text-3xl font-semibold text-white">Yeni Reçete Oluştur</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Hasta Bilgileri</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-400">Hasta Seçin</label>
              <select
                value={form.childId}
                onChange={(e) => {
                  const patient = patients.find((p) => p.id === e.target.value);
                  setForm({
                    ...form,
                    childId: e.target.value,
                    diagnosis: patient?.diagnosis ?? form.diagnosis,
                  });
                }}
                required
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">Hasta seçin...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.age} yaş)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-400">Tanı</label>
              <input
                type="text"
                value={form.diagnosis}
                onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                required
                placeholder="Örn: Ambliyopi - Anisometrop"
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Tedavi Hedefleri</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            {targetGoalOptions.map((goal) => (
              <label
                key={goal.key}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${
                  form.targetGoals[goal.key]
                    ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                    : 'border-white/10 bg-slate-950/70 text-slate-300 hover:border-white/20'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!form.targetGoals[goal.key]}
                  onChange={() => toggleGoal(goal.key)}
                  className="hidden"
                />
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded border ${
                    form.targetGoals[goal.key]
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-slate-600 bg-slate-900'
                  }`}
                >
                  {form.targetGoals[goal.key] && '✓'}
                </div>
                {goal.label}
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Tedavi Parametreleri</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-400">Zorluk Aralığı</label>
              <select
                value={form.difficultyRange}
                onChange={(e) => setForm({ ...form, difficultyRange: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="easy">Kolay</option>
                <option value="medium">Orta</option>
                <option value="hard">Zor</option>
                <option value="adaptive">Adaptif (otomatik)</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-400">Günlük Limit (dakika)</label>
              <input
                type="number"
                value={form.dailyLimitMinutes}
                onChange={(e) =>
                  setForm({ ...form, dailyLimitMinutes: parseInt(e.target.value) || 30 })
                }
                min={5}
                max={120}
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Notlar</h2>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={4}
            placeholder="Ek notlar, özel talimatlar..."
            className="mt-4 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Oluşturuluyor...' : 'Reçete Oluştur'}
          </button>
          <a
            href="/dashboard/doctor/prescriptions"
            className="rounded-xl border border-white/10 px-8 py-3 text-sm text-slate-300 transition hover:bg-white/5"
          >
            İptal
          </a>
        </div>
      </form>
    </div>
  );
}
