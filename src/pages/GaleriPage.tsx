import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { galeriService } from '../lib/db';
import { useDBData } from '../hooks/useDB';
import { galeriData as fallback } from '../data/desaData';

const kategoris = ['Semua', 'Wisata', 'KKN', 'Pertanian', 'Pemerintahan', 'Kesehatan', 'UMKM', 'Lingkungan', 'Sosial'];

export default function GaleriPage() {
  const [aktifKat, setAktifKat] = useState('Semua');
  const [lightbox, setLightbox] = useState<any | null>(null);

  const { data, loading } = useDBData(() => galeriService.getAll() as Promise<any[]>);
  const allGaleri: any[] = (data as any[]) ?? fallback;

  const filtered = aktifKat === 'Semua' ? allGaleri : allGaleri.filter(g => g.kategori === aktifKat);

  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-24">
      <div className="gradient-green border-b-4 border-[#212121] py-10">
        <div className="container-custom flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Galeri Desa Talang Marap</h1>
            <p className="text-white/70">Dokumentasi kegiatan dan keindahan desa</p>
          </div>
          <span className="text-white/60 text-sm font-bold hidden md:block">{allGaleri.length} foto</span>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {kategoris.map(k => (
            <button key={k} onClick={() => setAktifKat(k)}
              className={`brutal-btn px-4 py-2 rounded-xl font-bold text-sm ${
                aktifKat === k ? 'bg-[#2E7D32] text-white' : 'bg-white text-[#212121]'
              }`}>
              {k} ({k === 'Semua' ? allGaleri.length : allGaleri.filter(g => g.kategori === k).length})
            </button>
          ))}
        </div>

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="brutal-card overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((item: any) => (
              <div key={item.id}
                className="brutal-card overflow-hidden cursor-pointer group"
                onClick={() => setLightbox(item)}>
                <div className="relative overflow-hidden h-40">
                  <img src={item.foto} alt={item.judul}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={28} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-white font-bold text-xs">{item.judul}</p>
                    <p className="text-white/60 text-[10px]">{item.kategori}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-3">🖼️</p>
            <p className="font-bold">Belum ada foto di kategori ini</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white hover:text-[#66BB6A] transition-colors">
              <X size={28} />
            </button>
            <div className="brutal-card overflow-hidden">
              <img src={lightbox.foto} alt={lightbox.judul}
                className="w-full max-h-[70vh] object-contain bg-black" />
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-black">{lightbox.judul}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full text-xs font-bold border border-[#66BB6A]">{lightbox.kategori}</span>
                    <span>📅 {lightbox.tanggal ? new Date(lightbox.tanggal).toLocaleDateString('id-ID', { dateStyle: 'long' }) : '-'}</span>
                  </div>
                </div>
                {/* Nav */}
                <div className="flex gap-2">
                  <button onClick={() => {
                    const idx = filtered.findIndex((f: any) => f.id === lightbox.id);
                    if (idx > 0) setLightbox(filtered[idx - 1]);
                  }} className="w-9 h-9 border-2 border-[#212121] rounded-xl flex items-center justify-center hover:bg-[#2E7D32] hover:text-white transition-colors font-bold">‹</button>
                  <button onClick={() => {
                    const idx = filtered.findIndex((f: any) => f.id === lightbox.id);
                    if (idx < filtered.length - 1) setLightbox(filtered[idx + 1]);
                  }} className="w-9 h-9 border-2 border-[#212121] rounded-xl flex items-center justify-center hover:bg-[#2E7D32] hover:text-white transition-colors font-bold">›</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
