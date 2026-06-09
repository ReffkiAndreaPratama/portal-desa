import { useState } from 'react';
import { MapPin, Clock, Star, Users, ChevronRight, Navigation } from 'lucide-react';
import { wisataService } from '../lib/db';
import { useDBData } from '../hooks/useDB';
import { wisataDesa as fallback } from '../data/desaData';
import { SkeletonCard } from '../components/common/SkeletonCard';

const itinerary = [
  { waktu: '07.00', kegiatan: 'Check-in & Sarapan di Desa', lokasi: 'Warung Mak Sari', icon: '🍳' },
  { waktu: '08.30', kegiatan: 'Kunjungi Bukit Panorama Marap', lokasi: 'Bukit Panorama', icon: '⛰️' },
  { waktu: '11.00', kegiatan: 'Air Terjun Talang Indah', lokasi: 'Air Terjun', icon: '💧' },
  { waktu: '13.00', kegiatan: 'Makan Siang + Istirahat', lokasi: 'Gazebo Wisata', icon: '🍽️' },
  { waktu: '14.30', kegiatan: 'Danau Hijau Talang', lokasi: 'Danau Hijau', icon: '🏞️' },
  { waktu: '16.00', kegiatan: 'Kebun Kopi Heritage + Oleh-oleh', lokasi: 'Kebun Kopi', icon: '☕' },
  { waktu: '18.00', kegiatan: 'Pulang', lokasi: '-', icon: '🏠' },
];

export default function WisataPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const { data, loading } = useDBData(() => wisataService.getAll() as Promise<any[]>);
  const wisataDesa: any[] = (data as any[]) ?? fallback;

  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-24">
      <div className="gradient-green border-b-4 border-[#212121] py-10">
        <div className="container-custom">
          <h1 className="text-3xl font-black text-white mb-1">Wisata Desa Talang Marap</h1>
          <p className="text-white/70">Jelajahi keindahan alam dan budaya desa</p>
        </div>
      </div>

      {loading && (
        <div className="container-custom py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}
      {!loading && (      <div className="container-custom py-8">
        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Destinasi Wisata', value: '4', icon: '🏞️' },
            { label: 'Rating Rata-rata', value: '4.7', icon: '⭐' },
            { label: 'Pengunjung/Bulan', value: '1.2K+', icon: '👥' },
            { label: 'Harga Mulai', value: 'Rp 5.000', icon: '💰' },
          ].map((s, i) => (
            <div key={i} className="brutal-card p-4 text-center">
              <span className="text-3xl">{s.icon}</span>
              <p className="font-black text-xl text-[#2E7D32] mt-1">{s.value}</p>
              <p className="text-gray-500 text-xs font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Wisata Cards */}
        <h2 className="text-2xl font-black mb-6">Destinasi <span className="text-gradient">Unggulan</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {wisataDesa.map(wisata => (
            <div key={wisata.id} className="brutal-card overflow-hidden cursor-pointer" onClick={() => setSelected(wisata.id === selected ? null : wisata.id)}>
              <div className="relative overflow-hidden h-52">
                <img src={wisata.foto} alt={wisata.nama} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#2E7D32] text-white text-xs font-bold px-2 py-1 rounded-full border border-white/30">{wisata.kategori}</span>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1 flex items-center gap-1">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-black text-sm">{wisata.rating}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-black text-lg text-[#212121]">{wisata.nama}</h3>
                  <span className="text-[#2E7D32] font-black text-sm bg-[#E8F5E9] px-2 py-1 rounded-lg border border-[#2E7D32]">{wisata.harga}</span>
                </div>
                <p className="text-gray-500 text-sm mb-4">{wisata.deskripsi}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Clock size={12} /> {wisata.jamOperasional}</span>
                  <span className="flex items-center gap-1"><Users size={12} /> {wisata.pengunjung}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(wisata.fasilitas as string[]).map((f: string) => (
                    <span key={f} className="text-xs bg-[#E8F5E9] text-[#2E7D32] px-2 py-1 rounded-full border border-[#66BB6A]">✓ {f}</span>
                  ))}
                </div>
                {wisata.id === selected && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <a href={wisata.maps} target="_blank" rel="noreferrer"
                      className="brutal-btn bg-[#2E7D32] text-white px-4 py-2 rounded-xl font-bold text-sm inline-flex items-center gap-2">
                      <Navigation size={14} /> Buka di Maps
                    </a>
                  </div>
                )}
                <button className="mt-2 text-xs text-[#2E7D32] font-bold flex items-center gap-1 hover:gap-2 transition-all">
                  {wisata.id === selected ? 'Tutup detail' : 'Lihat detail'} <ChevronRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Virtual Tour Placeholder */}
        <div className="brutal-card overflow-hidden mb-12">
          <div className="gradient-green p-8 text-center text-white">
            <h2 className="text-2xl font-black mb-2">🎬 Virtual Tour 360°</h2>
            <p className="text-white/80 mb-4">Jelajahi Desa Talang Marap dari layar Anda</p>
            <div className="bg-black/30 border-2 border-white/30 rounded-2xl p-12 mx-auto max-w-2xl">
              <div className="text-6xl mb-3">🌄</div>
              <p className="text-white/60 text-sm">Virtual tour 360° segera hadir</p>
              <p className="text-white/40 text-xs mt-1">Powered by KKN UNIB 108/146</p>
            </div>
          </div>
        </div>

        {/* Itinerary */}
        <div className="mb-12">
          <h2 className="text-2xl font-black mb-6">🗺️ Rekomendasi <span className="text-gradient">Itinerary Sehari</span></h2>
          <div className="brutal-card overflow-hidden">
            <div className="bg-[#2E7D32] p-4 text-white font-black">Paket Wisata 1 Hari Desa Talang Marap</div>
            <div className="divide-y divide-gray-100">
              {itinerary.map((item, i) => (
                <div key={i} className="p-4 flex items-center gap-4 hover:bg-[#F1F8E9] transition-colors">
                  <div className="w-14 text-center">
                    <span className="text-xs font-black text-[#2E7D32]">{item.waktu}</span>
                  </div>
                  <div className="text-2xl">{item.icon}</div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{item.kegiatan}</p>
                    <p className="text-gray-400 text-xs flex items-center gap-1">
                      <MapPin size={10} /> {item.lokasi}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="brutal-card bg-[#2E7D32] p-8 text-center text-white border-[#212121]">
          <h3 className="text-2xl font-black mb-2">Rencanakan Kunjungan Anda</h3>
          <p className="text-white/80 mb-4">Hubungi kami untuk informasi lebih lanjut atau pemesanan paket wisata</p>
          <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer"
            className="brutal-btn bg-white text-[#212121] px-6 py-3 rounded-xl font-black inline-flex items-center gap-2">
            📞 Hubungi via WhatsApp
          </a>
        </div>
      </div>
      )}
    </div>
  );
}
