import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Home, MapPin, Layers, Newspaper, Mountain, ShoppingBag, Image, Map, Recycle, GraduationCap, Phone, BarChart3, ChevronRight, Play, Star, TrendingUp, Leaf } from 'lucide-react';
import { desaInfo, beritaDesa, wisataDesa, agendaDesa } from '../data/desaData';

// Ornaments
const MountainSVG = () => (
  <svg viewBox="0 0 300 120" className="w-full opacity-10 fill-[#2E7D32]" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,120 L60,20 L120,70 L180,0 L240,60 L300,30 L300,120Z"/>
  </svg>
);

const quickLinks = [
  { icon: <Users size={24} />, label: 'Profil Desa', path: '/profil', color: '#2E7D32', bg: '#E8F5E9' },
  { icon: <Newspaper size={24} />, label: 'Berita', path: '/berita', color: '#1565C0', bg: '#E3F2FD' },
  { icon: <Mountain size={24} />, label: 'Wisata', path: '/wisata', color: '#E65100', bg: '#FFF3E0' },
  { icon: <ShoppingBag size={24} />, label: 'UMKM', path: '/umkm', color: '#6A1B9A', bg: '#F3E5F5' },
  { icon: <Image size={24} />, label: 'Galeri', path: '/galeri', color: '#00695C', bg: '#E0F2F1' },
  { icon: <Map size={24} />, label: 'Peta', path: '/peta', color: '#C62828', bg: '#FFEBEE' },
  { icon: <Recycle size={24} />, label: 'SiTARA', path: '/sitara', color: '#2E7D32', bg: '#E8F5E9' },
  { icon: <GraduationCap size={24} />, label: 'KKN', path: '/kkn', color: '#F57F17', bg: '#FFFDE7' },
  { icon: <Phone size={24} />, label: 'Kontak', path: '/kontak', color: '#880E4F', bg: '#FCE4EC' },
  { icon: <BarChart3 size={24} />, label: 'Data Statistik', path: '/data', color: '#1B5E20', bg: '#E8F5E9' },
];

const announcements = [
  '📢 Musdes RPJMDes 2025-2031 • 1 Juni 2025',
  '🎓 KKN UNIB Periode 108 Kelompok 146 telah bertugas',
  '♻️ Launching SiTARA - Sistem Informasi Sampah Digital',
  '🌾 Festival Panen Raya Talang Marap sukses digelar',
  '💻 Pelatihan Digital Marketing UMKM - 12 Juni 2025',
  '🏥 Posyandu Rutin Bulan Juni - 87 Balita terlayani',
  '🌿 Bank Sampah Desa resmi beroperasi',
  '📱 Portal Digital Desa Talang Marap live!',
];

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 25);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function HomePage() {
  const [currentBg, setCurrentBg] = useState(0);
  const heroImages = [
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920',
    'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1920',
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentBg(p => (p + 1) % heroImages.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Images */}
        {heroImages.map((img, i) => (
          <div key={i} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${i === currentBg ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${img})` }} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
        
        {/* Ornament */}
        <div className="absolute bottom-0 left-0 right-0 opacity-20">
          <MountainSVG />
        </div>
        
        <div className="relative container-custom w-full pt-24 pb-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#2E7D32] border-2 border-white/30 text-white text-xs font-bold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
              <Leaf size={12} />
              Portal Resmi Desa Digital
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight mb-4">
              DESA
              <span className="block text-[#66BB6A]">TALANG MARAP</span>
            </h1>
            <p className="text-white/80 text-base md:text-lg mb-2 font-medium">
              {desaInfo.kecamatan} · {desaInfo.kabupaten} · {desaInfo.provinsi}
            </p>
            <p className="text-white/60 text-lg italic mb-8">"{desaInfo.tagline}"</p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { icon: <Users size={20} />, label: 'Penduduk', value: 1847, suffix: '' },
                { icon: <Home size={20} />, label: 'KK', value: 512, suffix: '' },
                { icon: <MapPin size={20} />, label: 'Luas (km²)', value: 24, suffix: '.5' },
                { icon: <Layers size={20} />, label: 'Dusun', value: 4, suffix: '' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-4 text-center hover:bg-white/20 transition-all">
                  <div className="flex justify-center mb-1 text-[#66BB6A]">{stat.icon}</div>
                  <p className="text-2xl font-black text-white">
                    {stat.suffix === '' ? <CountUp target={stat.value} /> : `${stat.value}${stat.suffix}`}
                  </p>
                  <p className="text-white/60 text-xs font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link to="/profil" className="brutal-btn bg-[#2E7D32] text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 text-sm">
                Jelajahi Desa <ArrowRight size={16} />
              </Link>
              <Link to="/wisata" className="brutal-btn bg-white text-[#212121] px-6 py-3 rounded-xl font-black flex items-center gap-2 text-sm">
                <Play size={16} className="text-[#2E7D32]" /> Lihat Potensi
              </Link>
            </div>
          </div>

          {/* Image dots */}
          <div className="absolute bottom-8 right-6 flex gap-2">
            {heroImages.map((_, i) => (
              <button key={i} onClick={() => setCurrentBg(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentBg ? 'bg-white w-6' : 'bg-white/50'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* RUNNING MARQUEE */}
      <div className="bg-[#2E7D32] border-y-4 border-[#212121] py-3 overflow-hidden">
        <div className="marquee-wrapper">
          <div className="marquee-content">
            {[...announcements, ...announcements].map((text, i) => (
              <span key={i} className="text-white font-bold text-sm mx-6">
                {text} <span className="text-[#81C784] mx-4">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK ACCESS */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#E8F5E9] border-2 border-[#2E7D32] text-[#2E7D32] text-xs font-black px-4 py-1 rounded-full mb-3">MENU CEPAT</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#212121]">Akses <span className="text-gradient">Layanan Desa</span></h2>
            <p className="text-gray-500 mt-2">Semua informasi dan layanan desa dalam satu portal</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {quickLinks.map((link, i) => (
              <Link key={i} to={link.path}
                className="group brutal-card p-5 flex flex-col items-center gap-3 text-center transition-all">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
                  style={{ backgroundColor: link.bg, color: link.color }}>
                  {link.icon}
                </div>
                <span className="font-bold text-sm text-[#212121]">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BERITA TERBARU */}
      <section className="section-padding bg-[#F1F8E9]">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="inline-block bg-[#E8F5E9] border-2 border-[#2E7D32] text-[#2E7D32] text-xs font-black px-4 py-1 rounded-full mb-2">BERITA TERKINI</span>
              <h2 className="text-3xl font-black text-[#212121]">Kabar <span className="text-gradient">Desa</span></h2>
            </div>
            <Link to="/berita" className="brutal-btn bg-[#2E7D32] text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hidden md:flex">
              Semua Berita <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {beritaDesa.slice(0, 3).map(berita => (
              <Link key={berita.id} to={`/berita/${berita.id}`} className="brutal-card overflow-hidden group">
                <div className="overflow-hidden h-48">
                  <img src={berita.foto} alt={berita.judul}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <span className="inline-block bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold px-2 py-1 rounded-full border border-[#2E7D32] mb-2">{berita.kategori}</span>
                  <h3 className="font-black text-[#212121] text-base leading-tight mb-2 line-clamp-2">{berita.judul}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">{berita.ringkasan}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>📅 {new Date(berita.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>👁 {berita.views}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6 md:hidden">
            <Link to="/berita" className="brutal-btn bg-[#2E7D32] text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2">
              Semua Berita <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* WISATA HIGHLIGHT */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="inline-block bg-[#E8F5E9] border-2 border-[#2E7D32] text-[#2E7D32] text-xs font-black px-4 py-1 rounded-full mb-2">WISATA DESA</span>
              <h2 className="text-3xl font-black text-[#212121]">Destinasi <span className="text-gradient">Unggulan</span></h2>
            </div>
            <Link to="/wisata" className="brutal-btn bg-[#2E7D32] text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hidden md:flex">
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {wisataDesa.map(wisata => (
              <Link key={wisata.id} to="/wisata" className="brutal-card overflow-hidden group">
                <div className="relative overflow-hidden h-48">
                  <img src={wisata.foto} alt={wisata.nama}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white font-black text-sm">{wisata.nama}</p>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-white/80 text-xs">{wisata.rating}</span>
                    </div>
                  </div>
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#2E7D32] text-xs font-bold px-2 py-1 rounded-full border border-[#2E7D32]">
                    {wisata.harga}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-gray-500 text-xs line-clamp-2">{wisata.deskripsi}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {wisata.fasilitas.slice(0, 3).map(f => (
                      <span key={f} className="text-[10px] bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full border border-[#66BB6A]">{f}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SITARA PROMO */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="bg-[#212121] border-4 border-[#212121] rounded-3xl shadow-[8px_8px_0_#2E7D32] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12">
                <div className="inline-flex items-center gap-2 bg-[#2E7D32] text-white text-xs font-black px-4 py-2 rounded-full mb-6">
                  <Recycle size={14} /> PROGRAM UNGGULAN KKN
                </div>
                <h2 className="text-4xl font-black text-white mb-2">SiTARA</h2>
                <p className="text-[#66BB6A] font-bold text-lg mb-4">Sistem Informasi Sampah Talang Marap</p>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Platform digital pengelolaan sampah terpadu: bank sampah, jadwal angkut, edukasi lingkungan, pelaporan, hingga leaderboard warga peduli lingkungan.
                </p>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: 'Nasabah', value: '78' },
                    { label: 'Total Setor', value: '312 kg' },
                    { label: 'Nilai Poin', value: '4.6 Jt' },
                  ].map(s => (
                    <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center border border-white/20">
                      <p className="text-[#66BB6A] font-black text-xl">{s.value}</p>
                      <p className="text-gray-400 text-xs">{s.label}</p>
                    </div>
                  ))}
                </div>
                <Link to="/sitara" className="brutal-btn bg-[#2E7D32] text-white px-6 py-3 rounded-xl font-black inline-flex items-center gap-2">
                  Buka SiTARA <ArrowRight size={16} />
                </Link>
              </div>
              <div className="p-8 flex items-center justify-center">
                <div className="relative w-56 h-56">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border-8 border-[#2E7D32] flex items-center justify-center bg-[#2E7D32]/20">
                      <Recycle size={80} className="text-[#66BB6A]" />
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-[#66BB6A] border-2 border-[#212121] rounded-xl px-3 py-1 text-xs font-black text-[#212121]">♻️ Organik 60%</div>
                  <div className="absolute -bottom-2 -left-2 bg-[#43A047] border-2 border-[#212121] rounded-xl px-3 py-1 text-xs font-black text-white">📦 Anorganik 35%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KKN SECTION */}
      <section className="section-padding bg-[#F1F8E9]">
        <div className="container-custom">
          <div className="text-center mb-10">
            <span className="inline-block bg-[#E8F5E9] border-2 border-[#2E7D32] text-[#2E7D32] text-xs font-black px-4 py-1 rounded-full mb-3">KKN UNIB</span>
            <h2 className="text-3xl font-black text-[#212121]">Periode 108 · <span className="text-gradient">Kelompok 146</span></h2>
            <p className="text-gray-500 mt-2">10 mahasiswa dari berbagai fakultas Universitas Bengkulu</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { icon: '💻', title: 'Portal Digital Desa', desc: 'Website profil desa dan sistem informasi terintegrasi', progress: 75 },
              { icon: '♻️', title: 'SiTARA - Bank Sampah', desc: 'Digitalisasi pengelolaan sampah dan bank sampah desa', progress: 45 },
              { icon: '📱', title: 'Digital Marketing UMKM', desc: 'Pelatihan pemasaran digital bagi pelaku UMKM', progress: 100 },
            ].map((p, i) => (
              <div key={i} className="brutal-card p-6">
                <div className="text-4xl mb-3">{p.icon}</div>
                <h3 className="font-black text-base mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{p.desc}</p>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>Progress</span>
                  <span className="text-[#2E7D32]">{p.progress}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full border-2 border-[#212121] overflow-hidden">
                  <div className="h-full bg-[#2E7D32] rounded-full transition-all duration-1000" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/kkn" className="brutal-btn bg-[#2E7D32] text-white px-8 py-3 rounded-xl font-black inline-flex items-center gap-2">
              Selengkapnya tentang KKN <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* AGENDA */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <span className="inline-block bg-[#E8F5E9] border-2 border-[#2E7D32] text-[#2E7D32] text-xs font-black px-4 py-1 rounded-full mb-3">AGENDA</span>
              <h2 className="text-3xl font-black text-[#212121] mb-6">Kegiatan <span className="text-gradient">Mendatang</span></h2>
              <div className="space-y-3">
                {agendaDesa.slice(0, 4).map(agenda => (
                  <div key={agenda.id} className="brutal-card p-4 flex items-center gap-4">
                    <div className="bg-[#2E7D32] text-white w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 border-2 border-[#212121]">
                      <span className="font-black text-lg leading-none">{new Date(agenda.tanggal).getDate()}</span>
                      <span className="text-[10px] font-bold">{new Date(agenda.tanggal).toLocaleDateString('id-ID', { month: 'short' })}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-sm">{agenda.judul}</p>
                      <p className="text-gray-500 text-xs mt-1">⏰ {agenda.jam} · 📍 {agenda.lokasi}</p>
                    </div>
                    <span className="text-xs bg-[#E8F5E9] border border-[#2E7D32] text-[#2E7D32] px-2 py-1 rounded-full font-semibold shrink-0">{agenda.kategori}</span>
                  </div>
                ))}
              </div>
              <Link to="/kalender" className="mt-4 inline-flex items-center gap-2 font-bold text-[#2E7D32] hover:gap-3 transition-all text-sm">
                Lihat Kalender Lengkap <ArrowRight size={14} />
              </Link>
            </div>

            <div>
              <span className="inline-block bg-[#E8F5E9] border-2 border-[#2E7D32] text-[#2E7D32] text-xs font-black px-4 py-1 rounded-full mb-3">STATISTIK</span>
              <h2 className="text-3xl font-black text-[#212121] mb-6">Data <span className="text-gradient">Desa</span></h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Total Penduduk', value: 1847, icon: '👥', trend: '+2.3%' },
                  { label: 'Kepala Keluarga', value: 512, icon: '🏠', trend: '+1.8%' },
                  { label: 'UMKM Aktif', value: 32, icon: '🛍️', trend: '+5.1%' },
                  { label: 'Wisatawan/Bulan', value: 1200, icon: '🏞️', trend: '+12%' },
                  { label: 'Nasabah Bank Sampah', value: 78, icon: '♻️', trend: 'Baru' },
                  { label: 'Pelajar', value: 385, icon: '📚', trend: '+3.2%' },
                ].map((stat, i) => (
                  <div key={i} className="brutal-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{stat.icon}</span>
                      <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                        <TrendingUp size={10} /> {stat.trend}
                      </span>
                    </div>
                    <p className="font-black text-xl text-[#2E7D32]">{stat.value.toLocaleString()}</p>
                    <p className="text-gray-500 text-xs font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
              <Link to="/data" className="mt-4 inline-flex items-center gap-2 font-bold text-[#2E7D32] hover:gap-3 transition-all text-sm">
                Dashboard Statistik Lengkap <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA ASPIRASI */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="brutal-card bg-gradient-to-br from-[#2E7D32] to-[#43A047] p-8 md:p-12 text-center text-white border-[#212121]">
            <div className="text-5xl mb-4">💬</div>
            <h2 className="text-3xl font-black mb-3">Suarakan Aspirasimu!</h2>
            <p className="text-white/80 mb-6 max-w-lg mx-auto">
              Ada saran, keluhan, atau ide untuk kemajuan desa? Sampaikan aspirasi Anda langsung kepada perangkat desa.
            </p>
            <Link to="/aspirasi" className="brutal-btn bg-white text-[#212121] px-8 py-3 rounded-xl font-black inline-flex items-center gap-2">
              Kirim Aspirasi <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
