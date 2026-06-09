import { useState } from 'react';
import { Phone, Mail, MapPin, Target, Eye, Award } from 'lucide-react';
import { desaInfo, perangkatDesa as perangkatFallback, statistikDemografi, sejarahTimeline } from '../data/desaData';
import { perangkatService } from '../lib/db';
import { useDBData } from '../hooks/useDB';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#2E7D32', '#43A047', '#66BB6A', '#81C784', '#A5D6A7', '#C8E6C9', '#E8F5E9'];

function SejarahSection() {
  return (
    <div>
      <span className="inline-block bg-[#E8F5E9] border-2 border-[#2E7D32] text-[#2E7D32] text-xs font-black px-4 py-1 rounded-full mb-3">SEJARAH</span>
      <h2 className="text-3xl font-black mb-8">Perjalanan Desa <span className="text-gradient">Talang Marap</span></h2>
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-[#2E7D32] rounded-full" />
        <div className="space-y-6">
          {sejarahTimeline.map((item, i) => (
            <div key={i} className="relative flex gap-6 items-start">
              <div className="w-16 h-16 rounded-2xl bg-[#2E7D32] border-4 border-[#212121] shadow-[4px_4px_0_#212121] flex flex-col items-center justify-center shrink-0 relative z-10">
                <span className="text-white font-black text-xs text-center leading-tight">{item.tahun}</span>
              </div>
              <div className="brutal-card p-5 flex-1 mt-1">
                <h3 className="font-black text-base text-[#212121] mb-1">{item.judul}</h3>
                <p className="text-gray-500 text-sm">{item.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VisiMisiSection() {
  return (
    <div className="space-y-6">
      <div>
        <span className="inline-block bg-[#E8F5E9] border-2 border-[#2E7D32] text-[#2E7D32] text-xs font-black px-4 py-1 rounded-full mb-3">VISI & MISI</span>
        <h2 className="text-3xl font-black mb-6">Arah <span className="text-gradient">Pembangunan Desa</span></h2>
      </div>
      <div className="brutal-card bg-gradient-to-br from-[#2E7D32] to-[#43A047] p-8 text-white border-[#212121]">
        <div className="flex items-center gap-3 mb-4">
          <Eye size={28} className="text-[#A5D6A7]" />
          <h3 className="font-black text-xl">Visi Desa</h3>
        </div>
        <p className="text-white/90 text-lg font-semibold italic leading-relaxed">
          "Terwujudnya Desa Talang Marap yang Maju, Mandiri, Sejahtera, dan Berdaya Saing Berbasis Potensi Lokal dan Teknologi"
        </p>
      </div>
      <div className="brutal-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <Target size={28} className="text-[#2E7D32]" />
          <h3 className="font-black text-xl">Misi Desa</h3>
        </div>
        <div className="space-y-4">
          {[
            'Meningkatkan kualitas sumber daya manusia melalui pendidikan dan pelatihan',
            'Mengembangkan ekonomi lokal berbasis pertanian, UMKM, dan wisata desa',
            'Mewujudkan tata kelola pemerintahan yang transparan dan akuntabel',
            'Meningkatkan infrastruktur dan fasilitas pelayanan publik',
            'Melestarikan lingkungan hidup dan budaya lokal',
            'Mendorong digitalisasi dan pemanfaatan teknologi informasi untuk pelayanan desa',
          ].map((misi, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#2E7D32] text-white flex items-center justify-center shrink-0 font-black text-sm border-2 border-[#212121]">
                {i + 1}
              </div>
              <p className="text-gray-600 font-medium pt-1">{misi}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Award size={24} />, label: 'Desa Mandiri', desc: '2023' },
          { icon: <Award size={24} />, label: 'Desa Digital', desc: '2025' },
          { icon: <Award size={24} />, label: 'UMKM Award', desc: '2024' },
        ].map((a, i) => (
          <div key={i} className="brutal-card p-4 text-center">
            <div className="text-[#2E7D32] flex justify-center mb-2">{a.icon}</div>
            <p className="font-black text-sm">{a.label}</p>
            <p className="text-gray-400 text-xs">{a.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PerangkatSection({ list, loading }: { list: any[]; loading: boolean }) {
  return (
    <div>
      <span className="inline-block bg-[#E8F5E9] border-2 border-[#2E7D32] text-[#2E7D32] text-xs font-black px-4 py-1 rounded-full mb-3">PERANGKAT DESA</span>
      <h2 className="text-3xl font-black mb-8">Struktur <span className="text-gradient">Pemerintahan</span></h2>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="brutal-card p-5 text-center animate-pulse">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3" />
              <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
              <div className="h-2 bg-gray-200 rounded w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {list.map((p: any, i: number) => (
            <div key={p.id ?? i} className="brutal-card p-5 text-center">
              <img
                src={p.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.nama)}&background=2E7D32&color=fff&size=200`}
                alt={p.nama}
                className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-[#2E7D32] shadow-[3px_3px_0_#212121]"
              />
              <p className="font-black text-sm text-[#212121]">{p.nama}</p>
              <p className="text-[#2E7D32] text-xs font-bold mt-1 mb-2">{p.jabatan}</p>
              {p.kontak && (
                <a href={`https://wa.me/62${String(p.kontak).replace(/^0/, '')}`}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[#2E7D32] transition-colors">
                  <Phone size={10} /> {p.kontak}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DemografiSection() {
  const { usia, pendidikan, pekerjaan } = statistikDemografi;
  return (
    <div>
      <span className="inline-block bg-[#E8F5E9] border-2 border-[#2E7D32] text-[#2E7D32] text-xs font-black px-4 py-1 rounded-full mb-3">DEMOGRAFI</span>
      <h2 className="text-3xl font-black mb-8">Data <span className="text-gradient">Kependudukan</span></h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Penduduk', value: statistikDemografi.penduduk.total.toLocaleString(), color: '#2E7D32' },
          { label: 'Laki-laki', value: statistikDemografi.penduduk.lakiLaki.toLocaleString(), color: '#1565C0' },
          { label: 'Perempuan', value: statistikDemografi.penduduk.perempuan.toLocaleString(), color: '#AD1457' },
          { label: 'Rasio L/P', value: '99.5%', color: '#E65100' },
        ].map((s, i) => (
          <div key={i} className="brutal-card p-5 text-center">
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-gray-500 text-sm font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="brutal-card p-6">
          <h3 className="font-black mb-4">Kelompok Usia</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={usia}>
              <XAxis dataKey="label" tick={{ fontSize: 9 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2E7D32" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="brutal-card p-6">
          <h3 className="font-black mb-4">Tingkat Pendidikan</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pendidikan} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name }) => name as string}>
                {pendidikan.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="brutal-card p-6 md:col-span-2">
          <h3 className="font-black mb-4">Mata Pencaharian</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={pekerjaan} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="label" type="category" width={150} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#43A047" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const tabs = ['Sejarah', 'Visi & Misi', 'Perangkat Desa', 'Demografi'];

export default function ProfilPage() {
  const [active, setActive] = useState(0);
  const { data: perangkatData, loading: loadingPerangkat } = useDBData(() => perangkatService.getAll() as Promise<any[]>);
  const perangkatDesa: any[] = (perangkatData as any[]) ?? perangkatFallback;

  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-24">
      {/* Header */}
      <div className="gradient-green border-b-4 border-[#212121] py-12">
        <div className="container-custom">
          <div className="text-white">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
              <span>Beranda</span> <span>›</span> <span className="text-white">Profil Desa</span>
            </div>
            <h1 className="text-4xl font-black mb-2">Profil Desa Talang Marap</h1>
            <p className="text-white/80">{desaInfo.kecamatan} · {desaInfo.kabupaten} · {desaInfo.provinsi}</p>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: <MapPin size={20} />, label: 'Lokasi', value: desaInfo.kecamatan },
            { icon: <Phone size={20} />, label: 'WhatsApp', value: '+62 812-3456-7890' },
            { icon: <Mail size={20} />, label: 'Email', value: 'desatalangmarap@gmail.com' },
            { icon: <Target size={20} />, label: 'Kode Pos', value: '38500' },
          ].map((info, i) => (
            <div key={i} className="brutal-card p-4 flex items-center gap-3">
              <div className="text-[#2E7D32]">{info.icon}</div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{info.label}</p>
                <p className="font-bold text-sm text-[#212121]">{info.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`brutal-btn px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap flex-shrink-0 ${
                active === i
                  ? 'bg-[#2E7D32] text-white border-[#212121]'
                  : 'bg-white text-[#212121] border-[#212121] hover:bg-[#E8F5E9]'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="fade-in">
          {active === 0 && <SejarahSection />}
          {active === 1 && <VisiMisiSection />}
          {active === 2 && <PerangkatSection list={perangkatDesa} loading={loadingPerangkat} />}
          {active === 3 && <DemografiSection />}
        </div>
      </div>
    </div>
  );
}
