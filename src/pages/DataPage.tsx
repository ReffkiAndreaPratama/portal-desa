import { statistikDemografi, desaInfo, sampahData } from '../data/desaData';
import { useDBData } from '../hooks/useDB';
import { statistikService } from '../lib/db';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';

const COLORS = ['#2E7D32', '#43A047', '#66BB6A', '#81C784', '#A5D6A7', '#C8E6C9', '#E8F5E9'];

const fallbackPerkembangan = [
  { tahun: '2020', penduduk: 1680, kk: 467, umkm: 18 },
  { tahun: '2021', penduduk: 1710, kk: 475, umkm: 21 },
  { tahun: '2022', penduduk: 1748, kk: 486, umkm: 25 },
  { tahun: '2023', penduduk: 1790, kk: 498, umkm: 28 },
  { tahun: '2024', penduduk: 1820, kk: 507, umkm: 30 },
  { tahun: '2025', penduduk: 1847, kk: 512, umkm: 32 },
];

export default function DataPage() {
  const { data: statistikRaw } = useDBData(() => statistikService.getAll() as Promise<any[]>);
  const perkembangan = ((statistikRaw as any[]) ?? fallbackPerkembangan).map((s: any) => ({
    tahun: String(s.tahun), penduduk: s.penduduk, kk: s.kk, umkm: s.umkm,
  }));
  const latest = perkembangan[perkembangan.length - 1] ?? fallbackPerkembangan[fallbackPerkembangan.length - 1];
  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-24">
      <div className="gradient-green border-b-4 border-[#212121] py-10">
        <div className="container-custom">
          <h1 className="text-3xl font-black text-white mb-1">Dashboard Statistik Desa</h1>
          <p className="text-white/70">Data kependudukan dan perkembangan Desa Talang Marap</p>
        </div>
      </div>

      <div className="container-custom py-8 space-y-10">
        {/* KPI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Penduduk', value: (latest.penduduk ?? desaInfo.penduduk).toLocaleString(), icon: '👥', sub: '+27 dari tahun lalu' },
            { label: 'Kepala Keluarga', value: (latest.kk ?? desaInfo.kk).toLocaleString(), icon: '🏠', sub: '+5 dari tahun lalu' },
            { label: 'UMKM Aktif', value: String(latest.umkm ?? 32), icon: '🛍️', sub: '+2 dari tahun lalu' },
            { label: 'Luas Wilayah', value: desaInfo.luasWilayah, icon: '🗺️', sub: '4 Dusun' },
          ].map((s, i) => (
            <div key={i} className="brutal-card p-5">
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className="font-black text-2xl text-[#2E7D32]">{s.value}</p>
              <p className="font-bold text-sm text-[#212121]">{s.label}</p>
              <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Tren Perkembangan */}
        <div className="brutal-card p-6">
          <h2 className="font-black text-xl mb-5">📈 Tren Perkembangan Desa (2020-2025)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={perkembangan}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" />
              <XAxis dataKey="tahun" />
              <YAxis yAxisId="kiri" />
              <YAxis yAxisId="kanan" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="kiri" type="monotone" dataKey="penduduk" stroke="#2E7D32" strokeWidth={3} name="Penduduk" dot={{ fill: '#2E7D32', r: 5 }} />
              <Line yAxisId="kanan" type="monotone" dataKey="umkm" stroke="#F57F17" strokeWidth={2} name="UMKM" dot={{ fill: '#F57F17', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Demografi Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="brutal-card p-6">
            <h3 className="font-black text-lg mb-4">👥 Sebaran Usia</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={statistikDemografi.usia}>
                <XAxis dataKey="label" tick={{ fontSize: 9 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#2E7D32" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="brutal-card p-6">
            <h3 className="font-black text-lg mb-4">📚 Tingkat Pendidikan</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statistikDemografi.pendidikan} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ percent }) => `${((percent as number)*100).toFixed(0)}%`}>
                  {statistikDemografi.pendidikan.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v, statistikDemografi.pendidikan.find(p => p.value === v)?.label || n]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="brutal-card p-6">
            <h3 className="font-black text-lg mb-4">💼 Mata Pencaharian</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={statistikDemografi.pekerjaan} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="label" type="category" width={130} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#43A047" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="brutal-card p-6">
            <h3 className="font-black text-lg mb-4">🕌 Agama</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statistikDemografi.agama} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statistikDemografi.agama.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sampah Stats */}
        <div className="brutal-card p-6">
          <h2 className="font-black text-xl mb-5">♻️ Data Pengelolaan Sampah (SiTARA)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Sampah/Bulan', value: `${sampahData.totalSampah.toLocaleString()} kg`, icon: '🗑️' },
              { label: 'Organik', value: `${sampahData.organik} kg`, icon: '🌿', pct: '60%' },
              { label: 'Anorganik', value: `${sampahData.anorganik} kg`, icon: '📦', pct: '35%' },
              { label: 'B3', value: `${sampahData.b3} kg`, icon: '⚠️', pct: '5%' },
            ].map((s, i) => (
              <div key={i} className="p-4 bg-[#F1F8E9] border-3 border-[#2E7D32] rounded-xl text-center">
                <span className="text-3xl">{s.icon}</span>
                <p className="font-black text-lg text-[#2E7D32] mt-1">{s.value}</p>
                {s.pct && <p className="text-xs text-gray-500">{s.pct} dari total</p>}
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="brutal-card p-4 bg-[#FFFDE7] border-[#F9A825]">
          <p className="text-sm font-bold text-yellow-800">📌 Catatan Data</p>
          <p className="text-xs text-yellow-700 mt-1">Data yang ditampilkan bersumber dari profil desa, sensus penduduk, dan program SiTARA. Data diperbarui secara berkala oleh perangkat desa bersama tim KKN UNIB.</p>
        </div>
      </div>
    </div>
  );
}
