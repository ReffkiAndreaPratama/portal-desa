import { useState } from 'react';
import { MapPin, Home, BookOpen, Heart, Church, Store, Recycle, Leaf } from 'lucide-react';

const layers = [
  { id: 'ibadah', label: 'Rumah Ibadah', icon: <Church size={14} />, color: '#8B4513', count: 4 },
  { id: 'sekolah', label: 'Sekolah', icon: <BookOpen size={14} />, color: '#1565C0', count: 3 },
  { id: 'posyandu', label: 'Posyandu', icon: <Heart size={14} />, color: '#AD1457', count: 4 },
  { id: 'kantor', label: 'Kantor Desa', icon: <Home size={14} />, color: '#E65100', count: 1 },
  { id: 'wisata', label: 'Wisata', icon: <Leaf size={14} />, color: '#2E7D32', count: 4 },
  { id: 'umkm', label: 'UMKM', icon: <Store size={14} />, color: '#6A1B9A', count: 6 },
  { id: 'tps', label: 'TPS', icon: <Recycle size={14} />, color: '#00695C', count: 4 },
];

const titikPenting = [
  { nama: 'Kantor Desa Talang Marap', tipe: 'kantor', deskripsi: 'Pusat pemerintahan desa' },
  { nama: 'SDN 01 Talang Marap', tipe: 'sekolah', deskripsi: 'Sekolah Dasar Negeri' },
  { nama: 'Masjid Al-Ikhlas', tipe: 'ibadah', deskripsi: 'Masjid utama desa' },
  { nama: 'Posyandu Melati', tipe: 'posyandu', deskripsi: 'Dusun I' },
  { nama: 'Air Terjun Talang Indah', tipe: 'wisata', deskripsi: 'Destinasi wisata utama' },
  { nama: 'Bukit Panorama Marap', tipe: 'wisata', deskripsi: 'Spot sunrise terbaik' },
  { nama: 'TPS Dusun I', tipe: 'tps', deskripsi: 'Tempat Pembuangan Sampah' },
  { nama: 'Pasar Desa', tipe: 'umkm', deskripsi: 'Pusat jual beli lokal' },
];

export default function PetaPage() {
  const [activeLayers, setActiveLayers] = useState<string[]>(layers.map(l => l.id));

  const toggleLayer = (id: string) => {
    setActiveLayers(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-24">
      <div className="gradient-green border-b-4 border-[#212121] py-10">
        <div className="container-custom">
          <h1 className="text-3xl font-black text-white mb-1">Peta Interaktif Desa</h1>
          <p className="text-white/70">Eksplorasi wilayah dan fasilitas Desa Talang Marap</p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Layer Control */}
          <div className="lg:col-span-1 space-y-4">
            <div className="brutal-card p-5">
              <h3 className="font-black mb-4 flex items-center gap-2"><MapPin size={16} className="text-[#2E7D32]" /> Layer Peta</h3>
              <div className="space-y-2">
                {layers.map(layer => (
                  <button key={layer.id}
                    onClick={() => toggleLayer(layer.id)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all font-semibold text-sm ${
                      activeLayers.includes(layer.id)
                        ? 'border-[#212121] bg-white shadow-[2px_2px_0_#212121]'
                        : 'border-gray-200 bg-gray-50 opacity-50'
                    }`}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: layer.color }}>
                      {layer.icon}
                    </div>
                    <span className="flex-1 text-left">{layer.label}</span>
                    <span className="bg-gray-100 text-gray-600 text-xs font-black px-1.5 py-0.5 rounded-full">{layer.count}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setActiveLayers(layers.map(l => l.id))}
                className="brutal-btn mt-3 w-full bg-[#E8F5E9] text-[#2E7D32] py-2 rounded-xl font-bold text-sm">
                Tampilkan Semua
              </button>
            </div>

            <div className="brutal-card p-5">
              <h3 className="font-black mb-3 text-sm">📍 Titik Penting</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {titikPenting.filter(t => activeLayers.includes(t.tipe)).map((t, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 hover:bg-[#F1F8E9] rounded-lg cursor-pointer">
                    <div className="w-2 h-2 rounded-full mt-2 shrink-0"
                      style={{ backgroundColor: layers.find(l => l.id === t.tipe)?.color || '#212121' }} />
                    <div>
                      <p className="font-bold text-xs">{t.nama}</p>
                      <p className="text-gray-400 text-[10px]">{t.deskripsi}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Area */}
          <div className="lg:col-span-3">
            <div className="brutal-card overflow-hidden">
              {/* Simulated Map with embedded iframe placeholder */}
              <div className="relative bg-gradient-to-br from-[#E8F5E9] via-[#C8E6C9] to-[#A5D6A7] h-[500px] flex items-center justify-center">
                <div className="absolute inset-0">
                  {/* Decorative map-like elements */}
                  <svg viewBox="0 0 800 500" className="w-full h-full opacity-20">
                    {/* Roads */}
                    <path d="M0,250 Q200,200 400,250 Q600,300 800,250" stroke="#8B6914" strokeWidth="8" fill="none" />
                    <path d="M200,0 Q250,200 300,500" stroke="#8B6914" strokeWidth="6" fill="none" />
                    <path d="M500,0 Q520,200 480,500" stroke="#8B6914" strokeWidth="5" fill="none" />
                    {/* River */}
                    <path d="M0,400 Q100,380 200,420 Q350,460 500,400 Q650,340 800,380" stroke="#1565C0" strokeWidth="6" fill="none" />
                    {/* Forest areas */}
                    <circle cx="650" cy="120" r="80" fill="#2E7D32" opacity="0.4" />
                    <circle cx="150" cy="350" r="60" fill="#43A047" opacity="0.3" />
                  </svg>
                </div>

                {/* Map markers */}
                {activeLayers.includes('kantor') && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-[#E65100] text-white p-2 rounded-full border-3 border-white shadow-lg animate-bounce">
                      <Home size={16} />
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white border-2 border-[#212121] rounded-lg px-2 py-1 text-xs font-bold whitespace-nowrap shadow-[2px_2px_0_#212121]">
                      Kantor Desa
                    </div>
                  </div>
                )}
                {activeLayers.includes('wisata') && (
                  <div className="absolute top-1/4 right-1/4">
                    <div className="bg-[#2E7D32] text-white p-2 rounded-full border-3 border-white shadow-lg">
                      <Leaf size={14} />
                    </div>
                  </div>
                )}
                {activeLayers.includes('wisata') && (
                  <div className="absolute top-16 right-32">
                    <div className="bg-[#2E7D32] text-white p-2 rounded-full border-3 border-white shadow-lg">
                      <Leaf size={14} />
                    </div>
                  </div>
                )}

                <div className="relative text-center z-10 bg-white/80 backdrop-blur-sm border-3 border-[#212121] rounded-2xl p-6 shadow-[6px_6px_0_#212121]">
                  <MapPin size={36} className="text-[#2E7D32] mx-auto mb-2" />
                  <h3 className="font-black text-lg">Peta Desa Talang Marap</h3>
                  <p className="text-gray-500 text-sm mb-4">Klik untuk membuka peta interaktif penuh</p>
                  <a href="https://www.google.com/maps" target="_blank" rel="noreferrer"
                    className="brutal-btn bg-[#2E7D32] text-white px-5 py-2.5 rounded-xl font-bold text-sm inline-flex items-center gap-2">
                    🗺️ Buka Google Maps
                  </a>
                </div>
              </div>
              <div className="p-4 bg-[#F1F8E9] border-t-3 border-[#212121] flex items-center gap-3 text-xs text-gray-500">
                <MapPin size={12} className="text-[#2E7D32]" />
                <span className="font-medium">Koordinat: -4.35°LS, 103.12°BT • Desa Talang Marap, Bengkulu Selatan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Batas Wilayah */}
        <div className="mt-8 brutal-card p-6">
          <h2 className="font-black text-xl mb-4">🗺️ Batas Wilayah Desa</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { arah: '⬆️ Utara', batas: 'Desa Muara Puti' },
              { arah: '⬇️ Selatan', batas: 'Desa Tanjung Baru' },
              { arah: '⬅️ Barat', batas: 'Hutan Lindung Bukit Barisan' },
              { arah: '➡️ Timur', batas: 'Desa Pulau Makmur' },
            ].map((b, i) => (
              <div key={i} className="p-4 bg-[#F1F8E9] border-2 border-[#2E7D32] rounded-xl text-center">
                <p className="text-lg mb-1">{b.arah}</p>
                <p className="font-bold text-sm">{b.batas}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
