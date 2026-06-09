import { useState } from 'react';
import { ShoppingBag, MapPin, Package } from 'lucide-react';
import { umkmService } from '../lib/db';
import { useDBData } from '../hooks/useDB';
import { umkmDesa as fallback } from '../data/desaData';
import { SkeletonCard } from '../components/common/SkeletonCard';

const kategoris = ['Semua', 'Makanan', 'Minuman', 'Kerajinan', 'Kesehatan'];

export default function UMKMPage() {
  const [aktifKat, setAktifKat] = useState('Semua');
  const [search, setSearch]     = useState('');
  const { data, loading }       = useDBData(() => umkmService.getAll() as Promise<any[]>);
  const umkmDesa: any[]         = (data as any[]) ?? fallback;

  const filtered = umkmDesa.filter(u =>
    (aktifKat === 'Semua' || u.kategori === aktifKat) &&
    (u.nama.toLowerCase().includes(search.toLowerCase()) || u.deskripsi.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-24">
      <div className="gradient-green border-b-4 border-[#212121] py-10">
        <div className="container-custom">
          <h1 className="text-3xl font-black text-white mb-1">UMKM Desa Talang Marap</h1>
          <p className="text-white/70">Produk lokal berkualitas dari warga desa</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total UMKM', value: '32', icon: '🏪' },
            { label: 'Produk Aktif', value: '120+', icon: '📦' },
            { label: 'Penjual', value: '28', icon: '👤' },
            { label: 'Omset/Bulan', value: 'Rp 45Jt', icon: '💰' },
          ].map((s, i) => (
            <div key={i} className="brutal-card p-4 text-center">
              <span className="text-3xl">{s.icon}</span>
              <p className="font-black text-xl text-[#2E7D32] mt-1">{s.value}</p>
              <p className="text-gray-500 text-xs font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Cari produk UMKM..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 border-3 border-[#212121] rounded-xl font-medium outline-none focus:border-[#2E7D32] bg-white shadow-[3px_3px_0_#212121]"
          />
          <div className="flex gap-2 flex-wrap">
            {kategoris.map(k => (
              <button key={k} onClick={() => setAktifKat(k)}
                className={`brutal-btn px-4 py-2 rounded-xl font-bold text-sm ${
                  aktifKat === k ? 'bg-[#2E7D32] text-white' : 'bg-white text-[#212121]'
                }`}>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((umkm: any) => (
              <div key={umkm.id} className="brutal-card overflow-hidden group">
                <div className="relative overflow-hidden h-48">
                  <img src={umkm.foto} alt={umkm.nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full border ${
                    umkm.stok === 'Tersedia' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'
                  }`}>
                    <Package size={10} className="inline mr-1" />{umkm.stok}
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full border border-[#66BB6A] font-semibold">{umkm.kategori}</span>
                  <h3 className="font-black text-base mt-2 mb-1">{umkm.nama}</h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{umkm.deskripsi}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-black text-[#2E7D32] text-base">{umkm.harga}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <MapPin size={12} className="text-[#2E7D32]" /> {umkm.lokasi}
                    <span>·</span>
                    <span>👤 {umkm.pemilik}</span>
                  </div>
                  <a href={`https://wa.me/${umkm.kontak}?text=Halo, saya tertarik dengan produk ${umkm.nama} dari Desa Talang Marap`}
                    target="_blank" rel="noreferrer"
                    className="brutal-btn w-full bg-[#25D366] text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                    💬 Pesan via WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🛍️</p>
              <p className="font-bold">Tidak ada produk ditemukan</p>
            </div>
          )}
          </>
        )}

        {/* Daftar UMKM CTA */}
        <div className="mt-12 brutal-card bg-[#F1F8E9] p-8 text-center">
          <h3 className="text-2xl font-black mb-2">Punya Produk UMKM?</h3>
          <p className="text-gray-500 mb-4">Daftarkan produk Anda dan jangkau lebih banyak pelanggan melalui portal ini.</p>
          <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer"
            className="brutal-btn bg-[#2E7D32] text-white px-6 py-3 rounded-xl font-black inline-flex items-center gap-2">
            <ShoppingBag size={16} /> Daftar UMKM Sekarang
          </a>
        </div>
      </div>
    </div>
  );
}