import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { beritaService, wisataService, umkmService, aspirasiService, bankSampahService, prokerService, galeriService } from '../../lib/db'
import { isSupabase } from '../../lib/supabase'
import { ArrowRight, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    berita: 0, wisata: 0, umkm: 0, galeri: 0,
    aspirasi: 0, nasabahBankSampah: 0, proker: 0
  })
  const [aspirasiTerbaru, setAspirasiTerbaru] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      beritaService.getAll(),
      wisataService.getAll(),
      umkmService.getAll(),
      aspirasiService.getAll(),
      bankSampahService.getAllNasabah(),
      prokerService.getAll(),
      galeriService.getAll(),
    ]).then(([berita, wisata, umkm, aspirasi, nasabah, proker, galeri]) => {
      setStats({
        berita: (berita as any[]).length,
        wisata: (wisata as any[]).length,
        umkm: (umkm as any[]).length,
        galeri: (galeri as any[]).length,
        aspirasi: (aspirasi as any[]).length,
        nasabahBankSampah: (nasabah as any[]).length,
        proker: (proker as any[]).length,
      })
      setAspirasiTerbaru((aspirasi as any[]).slice(0, 4))
      setLoading(false)
    })
  }, [])

  const cards = [
    { label: 'Berita', value: stats.berita, icon: '📰', color: '#1565C0', link: '/admin/berita' },
    { label: 'Wisata', value: stats.wisata, icon: '🏞️', color: '#2E7D32', link: '/admin/wisata' },
    { label: 'UMKM', value: stats.umkm, icon: '🛍️', color: '#6A1B9A', link: '/admin/umkm' },
    { label: 'Galeri', value: stats.galeri, icon: '🖼️', color: '#E65100', link: '/admin/galeri' },
    { label: 'Aspirasi', value: stats.aspirasi, icon: '💬', color: '#AD1457', link: '/admin/aspirasi' },
    { label: 'Nasabah SiTARA', value: stats.nasabahBankSampah, icon: '♻️', color: '#00695C', link: '/admin/bank-sampah' },
    { label: 'Program Kerja', value: stats.proker, icon: '📋', color: '#F57F17', link: '/admin/kkn-proker' },
  ]

  const prokerPercent = 67

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-[#212121] border-4 border-[#212121] rounded-2xl shadow-[4px_4px_0_#2E7D32] p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#2E7D32]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className={`inline-flex items-center gap-2 mb-2 text-xs font-bold px-3 py-1 rounded-full border ${
            isSupabase ? 'bg-green-500/20 text-green-400 border-green-600' : 'bg-yellow-500/20 text-yellow-400 border-yellow-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isSupabase ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`} />
            {isSupabase ? '🔗 Terhubung ke Supabase' : '💻 Mode Lokal (Data Statis)'}
          </div>
          <h1 className="text-2xl font-black text-white mb-1">Selamat Datang di Admin Panel</h1>
          <p className="text-gray-400 text-sm">Portal Digital Desa Talang Marap — Kelola semua konten desa di sini</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
        {cards.map(card => (
          <Link key={card.label} to={card.link}
            className="bg-white border-3 border-[#212121] rounded-2xl shadow-[3px_3px_0_#212121] p-4 hover:shadow-[5px_5px_0_#212121] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all group">
            <div className="text-2xl mb-2">{card.icon}</div>
            <p className="font-black text-2xl" style={{ color: card.color }}>{loading ? '–' : card.value}</p>
            <p className="text-gray-500 text-xs font-medium">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aspirasi Terbaru */}
        <div className="bg-white border-4 border-[#212121] rounded-2xl shadow-[4px_4px_0_#212121] overflow-hidden">
          <div className="bg-[#2E7D32] px-4 py-3 flex items-center justify-between">
            <h3 className="font-black text-white text-sm">💬 Aspirasi Terbaru</h3>
            <Link to="/admin/aspirasi" className="text-white/70 hover:text-white text-xs font-bold flex items-center gap-1">
              Lihat semua <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {aspirasiTerbaru.length === 0 ? (
              <p className="p-6 text-center text-gray-400 text-sm">Belum ada aspirasi</p>
            ) : aspirasiTerbaru.map((a: any) => (
              <div key={a.id} className="px-4 py-3 flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                  a.status === 'selesai' ? 'bg-green-500' : a.status === 'diproses' ? 'bg-blue-500' : 'bg-yellow-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{a.nama || 'Anonim'}</p>
                  <p className="text-gray-500 text-xs truncate">{a.pesan}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                  a.status === 'selesai' ? 'bg-green-100 text-green-700 border-green-300' :
                  a.status === 'diproses' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                  'bg-yellow-100 text-yellow-700 border-yellow-300'
                }`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border-4 border-[#212121] rounded-2xl shadow-[4px_4px_0_#212121] overflow-hidden">
          <div className="bg-[#212121] px-4 py-3">
            <h3 className="font-black text-white text-sm">⚡ Aksi Cepat</h3>
          </div>
          <div className="p-4 grid grid-cols-2 gap-2">
            {[
              { label: '+ Tambah Berita', link: '/admin/berita', icon: '📝' },
              { label: '+ Upload Galeri', link: '/admin/galeri', icon: '🖼️' },
              { label: '+ Tambah UMKM', link: '/admin/umkm', icon: '🛍️' },
              { label: '+ Tambah Wisata', link: '/admin/wisata', icon: '🏞️' },
              { label: '+ Input Setoran', link: '/admin/bank-sampah', icon: '♻️' },
              { label: '⚙️ Pengaturan', link: '/admin/pengaturan', icon: '🔧' },
            ].map(a => (
              <Link key={a.link} to={a.link}
                className="flex items-center gap-2 px-3 py-2.5 bg-[#F1F8E9] border-2 border-[#2E7D32] rounded-xl text-sm font-bold text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-all">
                <span>{a.icon}</span> <span className="truncate">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Proker */}
      <div className="bg-white border-4 border-[#212121] rounded-2xl shadow-[4px_4px_0_#212121] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-base flex items-center gap-2">
            <TrendingUp size={18} className="text-[#2E7D32]" /> Progress KKN Periode 108 Kelompok 146
          </h3>
          <Link to="/admin/kkn-proker" className="text-[#2E7D32] text-xs font-bold hover:underline">Kelola →</Link>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Progress keseluruhan program kerja</span>
          <span className="font-black text-[#2E7D32]">{prokerPercent}%</span>
        </div>
        <div className="h-4 bg-gray-200 border-2 border-[#212121] rounded-full overflow-hidden">
          <div className="h-full bg-[#2E7D32] rounded-full transition-all duration-1000" style={{ width: `${prokerPercent}%` }} />
        </div>
        <div className="flex gap-4 mt-3 text-xs font-bold text-gray-500">
          <span className="text-green-600">✅ 2 Selesai</span>
          <span className="text-blue-600">⏳ 3 Berjalan</span>
          <span className="text-yellow-600">📋 1 Direncanakan</span>
        </div>
      </div>
    </div>
  )
}
