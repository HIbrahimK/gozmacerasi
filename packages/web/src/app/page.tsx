'use client';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
          Gözmacerasi
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Akıllı uyarlanabilir görme terapisi oyunları
        </p>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition">
            Giriş Yap
          </button>
          <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition">
            Kayıt Ol
          </button>
        </div>
      </div>
    </main>
  );
}
