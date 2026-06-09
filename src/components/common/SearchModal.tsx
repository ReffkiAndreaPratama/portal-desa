import { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { beritaDesa, wisataDesa, umkmDesa } from '../../data/desaData';

const allItems = [
  ...beritaDesa.map(b => ({ title: b.judul, subtitle: b.kategori, path: `/berita/${b.id}`, type: 'Berita' })),
  ...wisataDesa.map(w => ({ title: w.nama, subtitle: w.kategori, path: `/wisata`, type: 'Wisata' })),
  ...umkmDesa.map(u => ({ title: u.nama, subtitle: u.kategori, path: `/umkm`, type: 'UMKM' })),
  { title: 'Profil Desa', subtitle: 'Informasi tentang desa', path: '/profil', type: 'Halaman' },
  { title: 'SiTARA - Sampah Digital', subtitle: 'Sistem informasi sampah', path: '/sitara', type: 'Program' },
  { title: 'Tim KKN 146', subtitle: 'Anggota KKN UNIB', path: '/kkn/tim', type: 'KKN' },
  { title: 'Galeri Foto', subtitle: 'Dokumentasi kegiatan', path: '/galeri', type: 'Halaman' },
  { title: 'Peta Interaktif', subtitle: 'Peta wilayah desa', path: '/peta', type: 'Halaman' },
  { title: 'Aspirasi Masyarakat', subtitle: 'Sampaikan aspirasi Anda', path: '/aspirasi', type: 'Layanan' },
  { title: 'Dokumen Desa', subtitle: 'Arsip dan dokumen resmi', path: '/dokumen', type: 'Halaman' },
];

const typeColors: Record<string, string> = {
  'Berita': 'bg-blue-100 text-blue-700',
  'Wisata': 'bg-green-100 text-green-700',
  'UMKM': 'bg-yellow-100 text-yellow-700',
  'Halaman': 'bg-gray-100 text-gray-700',
  'Program': 'bg-purple-100 text-purple-700',
  'KKN': 'bg-orange-100 text-orange-700',
  'Layanan': 'bg-red-100 text-red-700',
};

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useApp();
  const [query, setQuery] = useState('');
  const results = query.length > 1
    ? allItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setIsSearchOpen(true); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-20 px-3 sm:px-4"
      onClick={() => setIsSearchOpen(false)}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 border-4 border-[#212121] rounded-2xl shadow-[8px_8px_0_#212121] overflow-hidden"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-4 border-b-4 border-[#212121]">
          <Search size={20} className="text-[#2E7D32]" />
          <input
            autoFocus
            type="text"
            placeholder="Cari berita, wisata, UMKM, program..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-base font-medium outline-none dark:text-white placeholder-gray-400"
          />
          <button onClick={() => setIsSearchOpen(false)}
            className="w-8 h-8 rounded-lg border-2 border-[#212121] flex items-center justify-center hover:bg-red-100 transition-colors">
            <X size={14} />
          </button>
        </div>

        {results.length > 0 ? (
          <div className="max-h-80 overflow-y-auto">
            {results.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                onClick={() => { setIsSearchOpen(false); setQuery(''); }}
                className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-[#f0f9f0] dark:hover:bg-gray-800 transition-colors group"
              >
                <div className="flex-1">
                  <p className="font-bold text-sm dark:text-white group-hover:text-[#2E7D32]">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.subtitle}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${typeColors[item.type] || 'bg-gray-100'}`}>
                  {item.type}
                </span>
                <ArrowRight size={14} className="text-gray-400 group-hover:text-[#2E7D32]" />
              </Link>
            ))}
          </div>
        ) : query.length > 1 ? (
          <div className="p-8 text-center text-gray-500">
            <Search size={32} className="mx-auto mb-2 opacity-30" />
            <p className="font-semibold">Tidak ditemukan untuk "{query}"</p>
          </div>
        ) : (
          <div className="p-4">
            <p className="text-xs text-gray-400 font-medium mb-2">Pencarian Populer:</p>
            <div className="flex flex-wrap gap-2">
              {['Wisata', 'Kopi', 'KKN', 'SiTARA', 'Berita', 'UMKM'].map(tag => (
                <button key={tag} onClick={() => setQuery(tag)}
                  className="text-xs px-3 py-1 bg-[#f0f9f0] border-2 border-[#2E7D32] text-[#2E7D32] rounded-full font-semibold hover:bg-[#2E7D32] hover:text-white transition-colors">
                  {tag}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">Tekan <kbd className="px-1 bg-gray-100 border border-gray-300 rounded text-xs">Esc</kbd> untuk tutup</p>
          </div>
        )}
      </div>
    </div>
  );
}
