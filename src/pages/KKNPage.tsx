import { useState } from 'react';
import { GraduationCap, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useDBData } from '../hooks/useDB';
import { anggotaKKNService, prokerService } from '../lib/db';
import { anggotaKKN as anggotaFallback, programKerjaKKN as prokerFallback } from '../data/desaData';

const tabs = ['Tentang KKN', 'Tim Kami', 'Program Kerja'];

const statusConfig = {
  completed: { label: 'Selesai', color: 'bg-green-100 text-green-700 border-green-300', icon: <CheckCircle size={12} /> },
  ongoing:   { label: 'Berjalan', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: <Clock size={12} /> },
  planned:   { label: 'Direncanakan', color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: <AlertCircle size={12} /> },
};

export default function KKNPage() {
  const [activeTab, setActiveTab] = useState('Tentang KKN');

  const { data: anggotaData, loading: loadingAnggota } = useDBData(() => anggotaKKNService.getAll() as Promise<any[]>);
  const { data: prokerData,  loading: loadingProker  } = useDBData(() => prokerService.getAll()    as Promise<any[]>);

  const anggotaList:  any[] = (anggotaData as any[]) ?? anggotaFallback;
  const prokerList:   any[] = (prokerData  as any[]) ?? prokerFallback;

  const avgProgress = prokerList.length
    ? Math.round(prokerList.reduce((a, p) => a + (p.progress ?? 0), 0) / prokerList.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-24">
      {/* Header */}
      <div className="bg-[#212121] border-b-4 border-[#2E7D32] py-10">
        <div className="container-custom text-white">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap size={36} className="text-[#66BB6A]" />
            <div>
              <h1 className="text-3xl font-black">KKN UNIB</h1>
              <p className="text-[#66BB6A] font-bold">Periode 108 · Kelompok 146</p>
            </div>
          </div>
          <p className="text-gray-400 mt-2">Universitas Bengkulu — Desa Talang Marap, {new Date().getFullYear()}</p>
        </div>
      </div>

      {/* Sticky Tabs */}
      <div className="bg-white border-b-4 border-[#212121] sticky top-[64px] md:top-[80px] z-40">
        <div className="container-custom">
          <div className="flex gap-2 py-3">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`brutal-btn px-5 py-2 rounded-xl font-bold text-sm ${
                  activeTab === tab ? 'bg-[#2E7D32] text-white' : 'bg-[#F1F8E9] text-[#212121]'
                }`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom py-8">

        {/* ── TENTANG ── */}
        {activeTab === 'Tentang KKN' && (
          <div className="space-y-8">
            <div className="brutal-card bg-[#212121] p-8 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#2E7D32]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Anggota',       value: String(anggotaList.length || 10), icon: '👥' },
                    { label: 'Fakultas',      value: '6',  icon: '🏛️' },
                    { label: 'Program Kerja', value: String(prokerList.length || 6),   icon: '📋' },
                    { label: 'Durasi (hari)', value: '40', icon: '📅' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white/10 border border-white/20 rounded-xl p-4 text-center">
                      <div className="text-2xl mb-1">{s.icon}</div>
                      <p className="font-black text-2xl text-[#66BB6A]">{s.value}</p>
                      <p className="text-white/60 text-xs">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-[#2E7D32]/20 border border-[#2E7D32] rounded-2xl p-5">
                  <h3 className="font-black text-[#66BB6A] mb-2">🎯 Tema KKN</h3>
                  <p className="text-white font-bold text-lg italic">
                    "Pemberdayaan Masyarakat Berbasis Digitalisasi dan Pengelolaan Lingkungan Desa Talang Marap"
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="brutal-card p-6">
                <h3 className="font-black text-lg mb-4">📋 Informasi KKN</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Universitas',     value: 'Universitas Bengkulu' },
                    { label: 'Periode',         value: 'KKN Periode 108' },
                    { label: 'Kelompok',        value: 'Kelompok 146' },
                    { label: 'Lokasi',          value: 'Desa Talang Marap, Bengkulu Selatan' },
                    { label: 'DPL',             value: 'Dr. Ahmad Fauzi, M.Si.' },
                    { label: 'Tanggal Mulai',   value: '5 Juni 2025' },
                    { label: 'Tanggal Selesai', value: '15 Juli 2025' },
                  ].map(info => (
                    <div key={info.label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-500 text-sm font-medium">{info.label}</span>
                      <span className="font-bold text-sm text-right">{info.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="brutal-card p-6">
                <h3 className="font-black text-lg mb-4">🎯 Tujuan Program</h3>
                <div className="space-y-3">
                  {[
                    'Membangun portal digital desa yang komprehensif',
                    'Digitalisasi pengelolaan sampah melalui SiTARA',
                    'Memberdayakan UMKM melalui digital marketing',
                    'Meningkatkan literasi digital masyarakat',
                    'Mendukung pembangunan berkelanjutan desa',
                    'Mendokumentasikan potensi dan aset desa',
                  ].map((t, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-[#2E7D32] text-white rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">{i + 1}</div>
                      <p className="text-sm text-gray-600 font-medium">{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TIM ── */}
        {activeTab === 'Tim Kami' && (
          <div>
            <h2 className="text-2xl font-black mb-6">👥 Meet Our <span className="text-gradient">Team</span></h2>

            {loadingAnggota ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="brutal-card p-4 text-center animate-pulse">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3" />
                    <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                    <div className="h-2 bg-gray-200 rounded w-1/2 mx-auto" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
                {anggotaList.map((anggota: any) => (
                  <div key={anggota.id} className="brutal-card p-4 text-center">
                    <div className="relative mb-3">
                      <img
                        src={anggota.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(anggota.nama)}&background=2E7D32&color=fff&size=200`}
                        alt={anggota.nama}
                        className="w-20 h-20 rounded-full mx-auto border-4 border-[#2E7D32] shadow-[3px_3px_0_#212121]"
                      />
                      {anggota.posisi !== 'Anggota' && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#2E7D32] text-white text-[9px] font-black px-2 py-0.5 rounded-full border border-[#212121] whitespace-nowrap">
                          {anggota.posisi}
                        </div>
                      )}
                    </div>
                    <p className="font-black text-xs mt-2 leading-tight">{anggota.nama}</p>
                    <p className="text-[#2E7D32] text-[10px] font-bold mt-0.5">{anggota.prodi}</p>
                    <p className="text-gray-400 text-[10px]">{anggota.fakultas}</p>
                    <p className="text-gray-300 text-[9px] mt-1">{anggota.nim}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PROKER ── */}
        {activeTab === 'Program Kerja' && (
          <div className="space-y-5">
            <h2 className="text-2xl font-black mb-6">📋 Program <span className="text-gradient">Kerja KKN</span></h2>

            {/* Overall Progress */}
            <div className="brutal-card p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black">Progress Keseluruhan</h3>
                <span className="font-black text-[#2E7D32] text-xl">{avgProgress}%</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full border-3 border-[#212121] overflow-hidden">
                <div className="h-full bg-[#2E7D32] rounded-full transition-all" style={{ width: `${avgProgress}%` }} />
              </div>
              <div className="flex gap-4 mt-3 text-xs font-bold">
                <span className="flex items-center gap-1 text-green-600"><CheckCircle size={12} /> {prokerList.filter(p => p.status === 'completed').length} Selesai</span>
                <span className="flex items-center gap-1 text-blue-600"><Clock size={12} /> {prokerList.filter(p => p.status === 'ongoing').length} Berjalan</span>
                <span className="flex items-center gap-1 text-yellow-600"><AlertCircle size={12} /> {prokerList.filter(p => p.status === 'planned').length} Direncanakan</span>
              </div>
            </div>

            {loadingProker ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="brutal-card p-6 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-xl shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-3 bg-gray-200 rounded w-full" />
                        <div className="h-2 bg-gray-200 rounded-full w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              prokerList.map((proker: any) => {
                const status = statusConfig[proker.status as keyof typeof statusConfig] ?? statusConfig.planned;
                const mulai = proker.tanggalMulai || proker.tanggal_mulai;
                return (
                  <div key={proker.id} className="brutal-card p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl shrink-0">{proker.icon ?? '📋'}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <span className="text-xs bg-[#E8F5E9] text-[#2E7D32] border border-[#66BB6A] px-2 py-0.5 rounded-full font-semibold">{proker.kategori}</span>
                            <h3 className="font-black text-base mt-1">{proker.nama}</h3>
                          </div>
                          <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border shrink-0 ${status.color}`}>
                            {status.icon} {status.label}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm mb-3">{proker.deskripsi}</p>
                        <div className="flex items-center justify-between mb-1 text-xs font-bold">
                          <span>Progress</span>
                          <span className="text-[#2E7D32]">{proker.progress}%</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full border-2 border-[#212121] overflow-hidden mb-3">
                          <div className={`h-full rounded-full ${proker.progress === 100 ? 'bg-green-500' : 'bg-[#2E7D32]'}`}
                            style={{ width: `${proker.progress}%` }} />
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div><p className="text-gray-400">🎯 Target</p><p className="font-semibold">{proker.target}</p></div>
                          <div><p className="text-gray-400">📦 Output</p><p className="font-semibold">{proker.output}</p></div>
                          {mulai && (
                            <div><p className="text-gray-400">📅 Mulai</p>
                              <p className="font-semibold">{new Date(mulai).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</p>
                            </div>
                          )}
                          <div><p className="text-gray-400">👤 PIC</p><p className="font-semibold">{proker.pic}</p></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </div>
  );
}
