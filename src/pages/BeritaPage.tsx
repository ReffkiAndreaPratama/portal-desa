import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, Eye, User, ArrowLeft, Share2 } from 'lucide-react';
import { beritaService } from '../lib/db';
import { useDBData } from '../hooks/useDB';
import { beritaDesa as fallback } from '../data/desaData';
import { SkeletonCard } from '../components/common/SkeletonCard';
import toast from 'react-hot-toast';

const kategoris = ['Semua', 'Pemerintahan', 'KKN', 'Lingkungan', 'Pertanian', 'Kesehatan', 'UMKM', 'Pendidikan'];
const kategoriColors: Record<string, string> = {
  Pemerintahan: 'bg-blue-100 text-blue-700 border-blue-300',
  KKN:          'bg-orange-100 text-orange-700 border-orange-300',
  Lingkungan:   'bg-green-100 text-green-700 border-green-300',
  Pertanian:    'bg-lime-100 text-lime-700 border-lime-300',
  Kesehatan:    'bg-red-100 text-red-700 border-red-300',
  UMKM:         'bg-purple-100 text-purple-700 border-purple-300',
  Pendidikan:   'bg-yellow-100 text-yellow-700 border-yellow-300',
};

/* ── Detail Page ─────────────────────────────────────────────────── */
export function BeritaDetailPage() {
  const { id } = useParams();
  const { data: allBerita, loading } = useDBData(() => beritaService.getAll() as Promise<any[]>);
  const list: any[] = (allBerita as any[]) ?? fallback;
  const berita = list.find((b: any) => String(b.id) === id);

  const handleShare = (platform: string) => {
    const url  = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(berita?.judul ?? '');
    const map: Record<string, string> = {
      WhatsApp: `https://wa.me/?text=${text}%20${url}`,
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      Twitter:  `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    };
    if (map[platform]) window.open(map[platform], '_blank');
    toast.success(`Dibagikan ke ${platform}!`);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FFFDF7] pt-24">
      <div className="container-custom py-8 max-w-4xl">
        <div className="brutal-card overflow-hidden animate-pulse">
          <div className="h-72 bg-gray-200" />
          <div className="p-8 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-full" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="space-y-2 mt-4">
              {[...Array(5)].map((_, i) => <div key={i} className="h-3 bg-gray-200 rounded" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!berita) return (
    <div className="min-h-screen bg-[#FFFDF7] pt-24 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">📰</div>
        <h2 className="font-black text-2xl mb-2">Berita tidak ditemukan</h2>
        <Link to="/berita" className="brutal-btn bg-[#2E7D32] text-white px-5 py-2.5 rounded-xl font-bold inline-block mt-4">
          Kembali ke Berita
        </Link>
      </div>
    </div>
  );

  const related = list.filter((b: any) => String(b.id) !== id && b.kategori === berita.kategori).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-24">
      <div className="container-custom py-8 max-w-4xl">
        <Link to="/berita" className="inline-flex items-center gap-2 font-bold text-[#2E7D32] hover:gap-3 transition-all mb-6 text-sm">
          <ArrowLeft size={16} /> Kembali ke Berita
        </Link>
        <div className="brutal-card overflow-hidden">
          {berita.foto && <img src={berita.foto} alt={berita.judul} className="w-full h-64 md:h-80 object-cover" />}
          <div className="p-6 md:p-8">
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-4 ${kategoriColors[berita.kategori] ?? 'bg-gray-100 text-gray-700 border-gray-300'}`}>
              {berita.kategori}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-[#212121] mb-4">{berita.judul}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
              <span className="flex items-center gap-1"><User size={14} /> {berita.penulis}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(berita.tanggal).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
              <span className="flex items-center gap-1"><Eye size={14} /> {berita.views ?? 0} views</span>
            </div>
            {berita.ringkasan && <p className="text-gray-700 leading-relaxed text-base mb-4 font-medium">{berita.ringkasan}</p>}
            <p className="text-gray-600 leading-relaxed text-base whitespace-pre-line">{berita.konten}</p>

            {/* Share */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap items-center gap-3">
              <span className="font-bold text-sm flex items-center gap-1"><Share2 size={14} /> Bagikan:</span>
              {['WhatsApp', 'Facebook', 'Twitter'].map(s => (
                <button key={s} onClick={() => handleShare(s)}
                  className="brutal-btn text-xs px-3 py-1.5 rounded-lg bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-colors">
                  {s}
                </button>
              ))}
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link disalin!'); }}
                className="brutal-btn text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                📋 Salin Link
              </button>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <>
            <h2 className="font-black text-xl mt-10 mb-4">Berita Terkait</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((b: any) => (
                <Link key={b.id} to={`/berita/${b.id}`} className="brutal-card overflow-hidden group">
                  {b.foto && <img src={b.foto} alt={b.judul} className="w-full h-32 object-cover group-hover:scale-105 transition-transform" />}
                  <div className="p-4">
                    <p className="font-bold text-sm line-clamp-2">{b.judul}</p>
                    <p className="text-gray-400 text-xs mt-1">{new Date(b.tanggal).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── List Page ───────────────────────────────────────────────────── */
export default function BeritaPage() {
  const [activeKat, setActiveKat] = useState('Semua');
  const [search, setSearch]       = useState('');

  const { data, loading } = useDBData(() => beritaService.getAll() as Promise<any[]>);
  const allBerita: any[] = (data as any[]) ?? fallback;

  const filtered = allBerita.filter((b: any) => {
    const matchKat    = activeKat === 'Semua' || b.kategori === activeKat;
    const matchSearch = b.judul.toLowerCase().includes(search.toLowerCase());
    return matchKat && matchSearch;
  });

  const featured = activeKat === 'Semua' && !search ? filtered[0] : null;
  const gridList = featured ? filtered.slice(1) : filtered;

  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-24">
      <div className="gradient-green border-b-4 border-[#212121] py-10">
        <div className="container-custom flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Berita Desa</h1>
            <p className="text-white/70">Informasi terkini dari Desa Talang Marap</p>
          </div>
          <span className="text-white/60 text-sm font-bold hidden md:block">{allBerita.length} artikel</span>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input type="text" placeholder="Cari berita..." value={search}
            onChange={e => { setSearch(e.target.value); }}
            className="flex-1 px-4 py-3 border-3 border-[#212121] rounded-xl font-medium outline-none focus:border-[#2E7D32] bg-white shadow-[3px_3px_0_#212121]"
          />
          <div className="flex gap-2 flex-wrap">
            {kategoris.map(k => (
              <button key={k} onClick={() => setActiveKat(k)}
                className={`brutal-btn px-4 py-2 rounded-xl font-bold text-sm ${activeKat === k ? 'bg-[#2E7D32] text-white' : 'bg-white text-[#212121]'}`}>
                {k}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <div className="mb-8">
                <Link to={`/berita/${featured.id}`} className="brutal-card overflow-hidden grid grid-cols-1 md:grid-cols-2 group">
                  <div className="overflow-hidden h-64 md:h-auto">
                    <img src={featured.foto} alt={featured.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-3 w-fit ${kategoriColors[featured.kategori] ?? ''}`}>
                      ⭐ Berita Utama · {featured.kategori}
                    </span>
                    <h2 className="text-xl font-black text-[#212121] mb-3 leading-tight">{featured.judul}</h2>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-3">{featured.ringkasan}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>📅 {new Date(featured.tanggal).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
                      <span>👁 {featured.views ?? 0}</span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridList.map((berita: any) => (
                <Link key={berita.id} to={`/berita/${berita.id}`} className="brutal-card overflow-hidden group">
                  <div className="overflow-hidden h-44">
                    <img src={berita.foto} alt={berita.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-5">
                    <span className={`inline-block text-xs font-bold px-2 py-1 rounded-full border mb-2 ${kategoriColors[berita.kategori] ?? 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                      {berita.kategori}
                    </span>
                    <h3 className="font-black text-sm text-[#212121] line-clamp-2 mb-2">{berita.judul}</h3>
                    <p className="text-gray-500 text-xs line-clamp-2 mb-3">{berita.ringkasan}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(berita.tanggal).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</span>
                      <span className="flex items-center gap-1"><Eye size={10} /> {berita.views ?? 0}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <p className="text-5xl mb-4">📰</p>
                <p className="font-bold text-lg">Tidak ada berita ditemukan</p>
                <p className="text-sm mt-1">Coba kata kunci atau kategori lain</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
