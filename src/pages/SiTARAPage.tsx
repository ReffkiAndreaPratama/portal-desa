import { useState } from 'react';
import { Recycle, MapPin, Calendar, AlertTriangle, Trophy } from 'lucide-react';
import { sampahData } from '../data/desaData';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useDBData } from '../hooks/useDB';
import { bankSampahService, laporanSampahService, dataSampahService } from '../lib/db';
import toast from 'react-hot-toast';

const tabs = ['Dashboard', 'Bank Sampah', 'Jadwal Angkut', 'Edukasi', 'Lapor Sampah'];
const PIE_COLORS = ['#2E7D32', '#43A047', '#FF5722'];

const edukasiArtikel = [
  { judul: 'Cara Memilah Sampah di Rumah', kategori: 'Pemilahan', icon: '🗑️', ringkasan: 'Panduan lengkap memilah sampah organik, anorganik, dan B3 dengan benar.' },
  { judul: 'Manfaat Bank Sampah bagi Warga', kategori: 'Bank Sampah', icon: '🏦', ringkasan: 'Ketahui bagaimana bank sampah bisa menghasilkan pendapatan tambahan.' },
  { judul: 'Cara Membuat Kompos dari Sampah Dapur', kategori: 'Daur Ulang', icon: '🌱', ringkasan: 'Langkah mudah mengubah sisa makanan menjadi pupuk kompos berkualitas.' },
  { judul: 'Bahaya Sampah B3 bagi Kesehatan', kategori: 'Kesehatan', icon: '⚠️', ringkasan: 'Kenali jenis sampah B3 dan cara penanganannya yang aman.' },
];

export default function SiTARAPage() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [laporForm, setLaporForm] = useState({ nama: '', deskripsi: '', lokasi: '', foto: '' });
  const [laporSent, setLaporSent] = useState(false);
  const [laporLoading, setLaporLoading] = useState(false);

  const { data: nasabahData } = useDBData(() => bankSampahService.getAllNasabah() as Promise<any[]>);
  const { data: statsSampahData } = useDBData(() => dataSampahService.getLatest() as Promise<any>);

  const nasabahList: any[] = (nasabahData as any[]) ?? sampahData.leaderboard.map((l, i) => ({ id: i + 1, nama: l.nama, poin: l.poin }));
  const sortedLeaderboard = [...nasabahList].sort((a, b) => (b.poin || 0) - (a.poin || 0)).slice(0, 5);

  // Gunakan data DB jika ada, fallback ke sampahData statis
  const statsLive = statsSampahData as any;
  const totalSampah   = statsLive?.total    ?? sampahData.totalSampah;
  const organikVal    = statsLive?.organik  ?? sampahData.organik;
  const anorganikVal  = statsLive?.anorganik ?? sampahData.anorganik;
  const b3Val         = statsLive?.b3       ?? sampahData.b3;

  const pieData = [
    { name: 'Organik',    value: organikVal },
    { name: 'Anorganik',  value: anorganikVal },
    { name: 'B3',         value: b3Val },
  ];

  const handleLapor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLaporLoading(true);
    try {
      await laporanSampahService.submit(laporForm);
      setLaporSent(true);
      toast.success('Laporan berhasil dikirim!');
      setTimeout(() => { setLaporSent(false); setLaporForm({ nama: '', deskripsi: '', lokasi: '', foto: '' }); }, 4000);
    } catch {
      toast.error('Gagal mengirim laporan, coba lagi.');
    }
    setLaporLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-24">
      {/* Header */}
      <div className="bg-[#212121] border-b-4 border-[#2E7D32] py-10">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-[#2E7D32] rounded-xl border-2 border-[#66BB6A] flex items-center justify-center">
              <Recycle size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">SiTARA</h1>
              <p className="text-[#66BB6A] text-sm font-bold">Sistem Informasi Sampah Talang Marap</p>
            </div>
          </div>
          <p className="text-gray-400 mt-2 text-sm">Platform digital pengelolaan sampah terpadu Desa Talang Marap</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b-4 border-[#212121] sticky top-[64px] md:top-[80px] z-40">
        <div className="container-custom overflow-x-auto">
          <div className="flex gap-1 py-3">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`brutal-btn px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab ? 'bg-[#2E7D32] text-white' : 'bg-[#F1F8E9] text-[#212121]'
                }`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* DASHBOARD */}
        {activeTab === 'Dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Sampah (kg/bulan)', value: `${totalSampah.toLocaleString()} kg`,  icon: '🗑️', color: '#212121' },
                { label: 'Sampah Organik',           value: `${organikVal.toLocaleString()} kg`,   icon: '🌿', color: '#2E7D32' },
                { label: 'Sampah Anorganik',          value: `${anorganikVal.toLocaleString()} kg`, icon: '📦', color: '#1565C0' },
                { label: 'Sampah B3',                 value: `${b3Val} kg`,                         icon: '⚠️', color: '#E65100' },
              ].map((s, i) => (
                <div key={i} className="brutal-card p-5">
                  <span className="text-3xl">{s.icon}</span>
                  <p className="font-black text-xl mt-2" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-gray-500 text-xs font-medium mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="brutal-card p-6">
                <h3 className="font-black text-lg mb-4">Komposisi Sampah</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="brutal-card p-6">
                <h3 className="font-black text-lg mb-4">Status TPS</h3>
                <div className="space-y-3">
                  {sampahData.tps.map((tps, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                      <div>
                        <p className="font-bold text-sm">{tps.nama}</p>
                        <p className="text-gray-400 text-xs flex items-center gap-1"><MapPin size={10} /> Kapasitas: {tps.kapasitas}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full border ${
                        tps.status === 'Normal' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'
                      }`}>
                        {tps.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BANK SAMPAH */}
        {activeTab === 'Bank Sampah' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Nasabah Aktif',    value: nasabahList.length || sampahData.nasabahAktif,                             icon: '👥' },
                { label: 'Total Setor (kg)', value: sampahData.totalSetor,                                                      icon: '📦' },
                { label: 'Total Nilai (Rp)', value: `${((nasabahList.reduce((a, n) => a + (n.poin || 0), 0) || sampahData.nilaiPoin) / 1000000).toFixed(1)}Jt`, icon: '💰' },
              ].map((s, i) => (
                <div key={i} className="brutal-card p-5 text-center">
                  <span className="text-3xl">{s.icon}</span>
                  <p className="font-black text-2xl text-[#2E7D32] mt-1">{s.value}</p>
                  <p className="text-gray-500 text-xs font-medium">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Poin Simulator */}
            <div className="brutal-card p-6">
              <h3 className="font-black text-lg mb-4">💡 Simulasi Poin Bank Sampah</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {[
                  { jenis: 'Botol Plastik', satuan: '/kg', poin: 3000 },
                  { jenis: 'Kardus/Kertas', satuan: '/kg', poin: 1500 },
                  { jenis: 'Kaleng/Logam', satuan: '/kg', poin: 4000 },
                  { jenis: 'Kaca', satuan: '/kg', poin: 1000 },
                  { jenis: 'Elektronik', satuan: '/pcs', poin: 10000 },
                  { jenis: 'Minyak Jelantah', satuan: '/liter', poin: 5000 },
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-[#F1F8E9] border-2 border-[#2E7D32] rounded-xl flex justify-between items-center">
                    <span className="font-semibold text-sm">{item.jenis}</span>
                    <span className="font-black text-[#2E7D32] text-sm">Rp {item.poin.toLocaleString()}{item.satuan}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-xs">*Harga sesuai ketentuan bank sampah desa. Setoran minimum 1 kg.</p>
            </div>

            {/* Leaderboard */}
            <div className="brutal-card p-6">
              <h3 className="font-black text-lg mb-4 flex items-center gap-2"><Trophy size={20} className="text-yellow-500" /> Leaderboard Warga Peduli Lingkungan</h3>
              <div className="space-y-3">
                {sortedLeaderboard.map((w: any, idx: number) => (
                  <div key={w.id ?? idx} className={`flex items-center gap-4 p-3 rounded-xl border-2 ${
                    idx === 0 ? 'bg-yellow-50 border-yellow-300' : idx === 1 ? 'bg-gray-50 border-gray-300' : idx === 2 ? 'bg-orange-50 border-orange-300' : 'bg-white border-gray-200'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm border-2 ${
                      idx === 0 ? 'bg-yellow-400 border-yellow-600 text-white' : idx <= 2 ? 'bg-gray-300 border-gray-500 text-white' : 'bg-[#E8F5E9] border-[#2E7D32] text-[#2E7D32]'
                    }`}>
                      {idx <= 2 ? ['🥇','🥈','🥉'][idx] : idx + 1}
                    </div>
                    <span className="flex-1 font-bold text-sm">{w.nama}</span>
                    <span className="text-gray-500 text-xs">{w.setor ?? w.poin_setor ?? '—'}x setor</span>
                    <span className="font-black text-[#2E7D32]">Rp {(w.poin || 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* JADWAL ANGKUT */}
        {activeTab === 'Jadwal Angkut' && (
          <div className="space-y-6">
            <div className="brutal-card overflow-hidden">
              <div className="bg-[#2E7D32] p-4 text-white font-black flex items-center gap-2">
                <Calendar size={20} /> Jadwal Pengangkutan Sampah
              </div>
              <div className="divide-y divide-gray-100">
                {sampahData.jadwalAngkut.map((j, i) => (
                  <div key={i} className="p-5 flex items-center gap-4 hover:bg-[#F1F8E9] transition-colors">
                    <div className="w-16 h-16 bg-[#E8F5E9] border-3 border-[#2E7D32] rounded-2xl flex flex-col items-center justify-center shrink-0">
                      <span className="font-black text-[#2E7D32] text-sm text-center leading-tight">{j.hari}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-base">{j.dusun}</p>
                      <p className="text-gray-500 text-sm flex items-center gap-1">⏰ {j.jam}</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-full font-semibold">Aktif</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="brutal-card p-6 bg-[#FFF9C4] border-[#F9A825]">
              <h3 className="font-black flex items-center gap-2 mb-2"><AlertTriangle size={18} className="text-yellow-600" /> Pengumuman</h3>
              <p className="text-gray-700 text-sm">Pastikan sampah sudah dipilah sebelum diangkut. Sampah yang belum dipilah tidak akan diangkut oleh petugas.</p>
            </div>
          </div>
        )}

        {/* EDUKASI */}
        {activeTab === 'Edukasi' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black">📚 Edukasi <span className="text-gradient">Pengelolaan Sampah</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {edukasiArtikel.map((a, i) => (
                <div key={i} className="brutal-card p-6 hover:cursor-pointer">
                  <div className="text-4xl mb-3">{a.icon}</div>
                  <span className="text-xs bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full border border-[#66BB6A] font-semibold">{a.kategori}</span>
                  <h3 className="font-black text-base mt-2 mb-1">{a.judul}</h3>
                  <p className="text-gray-500 text-sm">{a.ringkasan}</p>
                  <button className="mt-4 text-sm font-bold text-[#2E7D32] hover:underline">Baca selengkapnya →</button>
                </div>
              ))}
            </div>

            <div className="brutal-card overflow-hidden">
              <div className="bg-[#212121] p-4 text-white font-black">🎬 Video Edukasi</div>
              <div className="p-6 space-y-3">
                {['Cara Memilah Sampah yang Benar', 'Membuat Pupuk Kompos di Rumah', 'Bank Sampah Digital SiTARA', 'Daur Ulang Kreatif'].map((v, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:border-[#2E7D32] hover:bg-[#F1F8E9] transition-all cursor-pointer">
                    <div className="w-10 h-10 bg-red-100 border-2 border-red-300 rounded-lg flex items-center justify-center">▶</div>
                    <p className="font-semibold text-sm">{v}</p>
                    <span className="ml-auto text-xs text-gray-400">3:45</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LAPOR SAMPAH */}
        {activeTab === 'Lapor Sampah' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h2 className="text-2xl font-black mb-1">🚨 Lapor <span className="text-gradient">Sampah Ilegal</span></h2>
              <p className="text-gray-500 text-sm">Temukan tempat pembuangan liar? Laporkan kepada kami.</p>
            </div>
            {laporSent ? (
              <div className="brutal-card p-8 text-center bg-[#E8F5E9]">
                <div className="text-5xl mb-3">✅</div>
                <h3 className="font-black text-lg text-[#2E7D32]">Laporan Terkirim!</h3>
                <p className="text-gray-500 text-sm mt-1">Tim desa akan menindaklanjuti laporan Anda segera.</p>
              </div>
            ) : (
              <form onSubmit={handleLapor} className="brutal-card p-6 space-y-4">
                {[
                  { label: 'Nama Pelapor', key: 'nama', placeholder: 'Nama Anda', type: 'text' },
                  { label: 'Lokasi Kejadian', key: 'lokasi', placeholder: 'Dusun / RT / Jalan...', type: 'text' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block font-bold text-sm mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={(laporForm as any)[f.key]}
                      onChange={e => setLaporForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border-3 border-[#212121] rounded-xl font-medium outline-none focus:border-[#2E7D32] bg-white"
                    />
                  </div>
                ))}
                <div>
                  <label className="block font-bold text-sm mb-1">Deskripsi Laporan</label>
                  <textarea
                    placeholder="Jelaskan kondisi sampah yang ditemukan..."
                    value={laporForm.deskripsi}
                    onChange={e => setLaporForm(prev => ({ ...prev, deskripsi: e.target.value }))}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border-3 border-[#212121] rounded-xl font-medium outline-none focus:border-[#2E7D32] bg-white resize-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm mb-1">Upload Foto (opsional)</label>
                  <div className="border-3 border-dashed border-[#212121] rounded-xl p-6 text-center bg-gray-50 hover:bg-[#F1F8E9] cursor-pointer transition-colors">
                    <p className="text-gray-400 text-sm">📷 Klik atau drag foto ke sini</p>
                  </div>
                </div>
                <button type="submit" disabled={laporLoading} className="brutal-btn w-full bg-[#2E7D32] text-white py-3 rounded-xl font-black disabled:opacity-60">
                  {laporLoading ? '⏳ Mengirim...' : 'Kirim Laporan'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
