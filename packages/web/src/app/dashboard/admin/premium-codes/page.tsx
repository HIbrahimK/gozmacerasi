'use client';

import { useState } from 'react';

interface PremiumCode {
  id: string;
  code: string;
  status: string;
  usedBy?: string;
  createdAt: string;
}

export default function AdminPremiumCodesPage() {
  const [codes, setCodes] = useState<PremiumCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(5);

  const handleGenerateCodes = async () => {
    setLoading(true);
    try {
      const generatedCodes = [];
      for (let i = 0; i < quantity; i++) {
        const code = `GOZE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        generatedCodes.push({
          id: `code_${i}`,
          code,
          status: 'Kullanılmamış',
          createdAt: new Date().toISOString(),
        });
      }
      setCodes([...generatedCodes, ...codes]);
      setQuantity(5);
    } catch (error) {
      console.error('Error generating codes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Premium Kod Üretimi</h1>

      <div className="bg-slate-700 p-6 rounded space-y-4">
        <label className="block">
          <span className="text-sm font-medium mb-2 block">Üretilecek Kod Sayısı</span>
          <input
            type="number"
            min="1"
            max="100"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-slate-600 rounded text-white"
          />
        </label>
        <button
          onClick={handleGenerateCodes}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded font-medium"
        >
          {loading ? 'Üretiliyor...' : '✨ Kod Üret'}
        </button>
      </div>

      {codes.length > 0 && (
        <div className="bg-slate-700 rounded overflow-hidden">
          <div className="bg-slate-600 px-4 py-2 font-medium">
            {codes.length} Kod Üretildi
          </div>
          <div className="space-y-2 p-4">
            {codes.map((code) => (
              <div key={code.id} className="flex justify-between items-center bg-slate-600 p-3 rounded">
                <div>
                  <code className="text-blue-400 font-mono">{code.code}</code>
                  <p className="text-xs text-gray-400">{code.status}</p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(code.code)}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                >
                  Kopyala
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
