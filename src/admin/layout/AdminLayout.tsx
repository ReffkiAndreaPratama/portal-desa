import { useState, useEffect } from 'react'
import { Link, useLocation, Navigate, Outlet } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import {
  LayoutDashboard, Newspaper, Mountain, ShoppingBag, Image,
  Users, GraduationCap, ClipboardList, Calendar, MessageSquare,
  AlertTriangle, Recycle, FileText, BarChart3, Settings, Mail,
  LogOut, Menu, X
} from 'lucide-react'

const menuGroups = [
  {
    group: 'Utama',
    items: [
      { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/admin/dashboard' },
    ]
  },
  {
    group: 'Konten Desa',
    items: [
      { icon: <Newspaper size={18} />, label: 'Berita', path: '/admin/berita' },
      { icon: <Image size={18} />, label: 'Galeri', path: '/admin/galeri' },
      { icon: <Calendar size={18} />, label: 'Agenda', path: '/admin/agenda' },
      { icon: <FileText size={18} />, label: 'Dokumen', path: '/admin/dokumen' },
    ]
  },
  {
    group: 'Profil Desa',
    items: [
      { icon: <Users size={18} />, label: 'Perangkat Desa', path: '/admin/perangkat' },
      { icon: <BarChart3 size={18} />, label: 'Statistik', path: '/admin/statistik' },
    ]
  },
  {
    group: 'Potensi Desa',
    items: [
      { icon: <Mountain size={18} />, label: 'Wisata', path: '/admin/wisata' },
      { icon: <ShoppingBag size={18} />, label: 'UMKM', path: '/admin/umkm' },
    ]
  },
  {
    group: 'SiTARA',
    items: [
      { icon: <Recycle size={18} />, label: 'Bank Sampah', path: '/admin/bank-sampah' },
      { icon: <AlertTriangle size={18} />, label: 'Laporan Sampah', path: '/admin/laporan-sampah' },
      { icon: <BarChart3 size={18} />, label: 'Data Sampah Bulanan', path: '/admin/data-sampah' },
    ]
  },
  {
    group: 'KKN',
    items: [
      { icon: <GraduationCap size={18} />, label: 'Anggota KKN', path: '/admin/kkn-anggota' },
      { icon: <ClipboardList size={18} />, label: 'Program Kerja', path: '/admin/kkn-proker' },
    ]
  },
  {
    group: 'Layanan',
    items: [
      { icon: <MessageSquare size={18} />, label: 'Aspirasi', path: '/admin/aspirasi' },
      { icon: <Mail size={18} />, label: 'Pesan Kontak', path: '/admin/pesan-kontak' },
    ]
  },
  {
    group: 'Sistem',
    items: [
      { icon: <Settings size={18} />, label: 'Pengaturan Desa', path: '/admin/pengaturan' },
    ]
  },
]

export default function AdminLayout() {
  const { isAuthenticated, loading, user, logout } = useAdmin()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 1024)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile) setSidebarOpen(true)
      else setSidebarOpen(false)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  const location = useLocation()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="font-bold text-gray-500">Memuat...</p>
      </div>
    </div>
  )

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${
        isMobile
          ? `fixed inset-y-0 left-0 z-30 w-64 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
          : `${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} transition-all duration-300 shrink-0`
      } bg-[#212121] flex flex-col border-r-4 border-[#2E7D32]`}>
        {/* Logo */}
        <div className="p-4 border-b-2 border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#2E7D32] rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-black">T</span>
            </div>
            <div className="min-w-0">
              <p className="text-white font-black text-sm truncate">Admin Panel</p>
              <p className="text-gray-400 text-xs truncate">Desa Talang Marap</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
          {menuGroups.map(group => (
            <div key={group.group}>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-wider px-2 mb-1">{group.group}</p>
              {group.items.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all mb-0.5 ${
                    isActive(item.path)
                      ? 'bg-[#2E7D32] text-white shadow-[2px_2px_0_#1B5E20]'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t-2 border-gray-700">
          <div className="flex items-center gap-2 px-2 py-2 mb-2">
            <div className="w-7 h-7 bg-[#2E7D32] rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-black">{user?.email?.[0]?.toUpperCase()}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-bold truncate">{user?.email}</p>
              <p className="text-gray-500 text-[10px]">Administrator</p>
            </div>
          </div>
          <button onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl transition-all text-sm font-semibold">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b-4 border-[#212121] px-4 py-3 flex items-center justify-between shrink-0 shadow-[0_4px_0_#212121]">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-9 h-9 border-2 border-[#212121] rounded-lg flex items-center justify-center hover:bg-[#2E7D32] hover:text-white transition-all shadow-[2px_2px_0_#212121]">
              {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
            <div>
              <p className="font-black text-sm text-[#212121]">
                {menuGroups.flatMap(g => g.items).find(i => isActive(i.path))?.label || 'Admin Panel'}
              </p>
              <p className="text-gray-400 text-xs">Portal Digital Desa Talang Marap</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noreferrer"
              className="text-xs font-bold text-[#2E7D32] border-2 border-[#2E7D32] px-3 py-1.5 rounded-lg hover:bg-[#2E7D32] hover:text-white transition-all">
              🌐 Lihat Website
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
