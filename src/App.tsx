import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from './context/AppContext'
import { AdminProvider } from './admin/context/AdminContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import SearchModal from './components/common/SearchModal'
import ChatbotWidget from './components/common/ChatbotWidget'

// Public pages
import HomePage from './pages/HomePage'
import ProfilPage from './pages/ProfilPage'
import BeritaPage, { BeritaDetailPage } from './pages/BeritaPage'
import WisataPage from './pages/WisataPage'
import UMKMPage from './pages/UMKMPage'
import SiTARAPage from './pages/SiTARAPage'
import KKNPage from './pages/KKNPage'
import GaleriPage from './pages/GaleriPage'
import KontakPage from './pages/KontakPage'
import AspirasiPage from './pages/AspirasiPage'
import DokumenPage from './pages/DokumenPage'
import DataPage from './pages/DataPage'
import PetaPage from './pages/PetaPage'
import KalenderPage from './pages/KalenderPage'

// Admin pages
import AdminLayout from './admin/layout/AdminLayout'
import LoginPage from './admin/pages/LoginPage'
import DashboardPage from './admin/pages/DashboardPage'
import BeritaAdmin from './admin/pages/BeritaAdmin'
import WisataAdmin from './admin/pages/WisataAdmin'
import UMKMAdmin from './admin/pages/UMKMAdmin'
import GaleriAdmin from './admin/pages/GaleriAdmin'
import PerangkatAdmin from './admin/pages/PerangkatAdmin'
import AgendaAdmin from './admin/pages/AgendaAdmin'
import AspirasiAdmin from './admin/pages/AspirasiAdmin'
import BankSampahAdmin from './admin/pages/BankSampahAdmin'
import LaporanSampahAdmin from './admin/pages/LaporanSampahAdmin'
import KKNAnggotaAdmin from './admin/pages/KKNAnggotaAdmin'
import KKNProkerAdmin from './admin/pages/KKNProkerAdmin'
import DokumenAdmin from './admin/pages/DokumenAdmin'
import StatistikAdmin from './admin/pages/StatistikAdmin'
import PengaturanAdmin from './admin/pages/PengaturanAdmin'
import DataSampahAdmin from './admin/pages/DataSampahAdmin'
import PesanKontakAdmin from './admin/pages/PesanKontakAdmin'

import BackToTop from './components/common/BackToTop';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#FFFDF7] dark:bg-gray-950 transition-colors">
        <Navbar />
        <SearchModal />
        <main>{children}</main>
        <Footer />
        <ChatbotWidget />
        <BackToTop />
      </div>
    </AppProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style: { border: '3px solid #212121', boxShadow: '4px 4px 0 #212121', fontWeight: 700, borderRadius: '12px' },
        success: { iconTheme: { primary: '#2E7D32', secondary: 'white' } },
      }} />

      <AdminProvider>
        <Routes>
          {/* ── ADMIN ── */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="berita" element={<BeritaAdmin />} />
            <Route path="wisata" element={<WisataAdmin />} />
            <Route path="umkm" element={<UMKMAdmin />} />
            <Route path="galeri" element={<GaleriAdmin />} />
            <Route path="perangkat" element={<PerangkatAdmin />} />
            <Route path="agenda" element={<AgendaAdmin />} />
            <Route path="aspirasi" element={<AspirasiAdmin />} />
            <Route path="bank-sampah" element={<BankSampahAdmin />} />
            <Route path="laporan-sampah" element={<LaporanSampahAdmin />} />
            <Route path="kkn-anggota" element={<KKNAnggotaAdmin />} />
            <Route path="kkn-proker" element={<KKNProkerAdmin />} />
            <Route path="dokumen" element={<DokumenAdmin />} />
            <Route path="statistik" element={<StatistikAdmin />} />
            <Route path="pengaturan" element={<PengaturanAdmin />} />
            <Route path="data-sampah" element={<DataSampahAdmin />} />
            <Route path="pesan-kontak" element={<PesanKontakAdmin />} />
          </Route>

          {/* ── PUBLIC ── */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/profil" element={<PublicLayout><ProfilPage /></PublicLayout>} />
          <Route path="/profil/*" element={<PublicLayout><ProfilPage /></PublicLayout>} />
          <Route path="/berita" element={<PublicLayout><BeritaPage /></PublicLayout>} />
          <Route path="/berita/:id" element={<PublicLayout><BeritaDetailPage /></PublicLayout>} />
          <Route path="/wisata" element={<PublicLayout><WisataPage /></PublicLayout>} />
          <Route path="/umkm" element={<PublicLayout><UMKMPage /></PublicLayout>} />
          <Route path="/sitara" element={<PublicLayout><SiTARAPage /></PublicLayout>} />
          <Route path="/sitara/*" element={<PublicLayout><SiTARAPage /></PublicLayout>} />
          <Route path="/kkn" element={<PublicLayout><KKNPage /></PublicLayout>} />
          <Route path="/kkn/*" element={<PublicLayout><KKNPage /></PublicLayout>} />
          <Route path="/galeri" element={<PublicLayout><GaleriPage /></PublicLayout>} />
          <Route path="/kontak" element={<PublicLayout><KontakPage /></PublicLayout>} />
          <Route path="/aspirasi" element={<PublicLayout><AspirasiPage /></PublicLayout>} />
          <Route path="/dokumen" element={<PublicLayout><DokumenPage /></PublicLayout>} />
          <Route path="/data" element={<PublicLayout><DataPage /></PublicLayout>} />
          <Route path="/peta" element={<PublicLayout><PetaPage /></PublicLayout>} />
          <Route path="/kalender" element={<PublicLayout><KalenderPage /></PublicLayout>} />

          <Route path="*" element={
            <PublicLayout>
              <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="text-center">
                  <div className="text-8xl mb-4">🌿</div>
                  <h1 className="text-4xl font-black mb-2">404</h1>
                  <p className="text-gray-500 mb-6">Halaman tidak ditemukan</p>
                  <a href="/" className="brutal-btn bg-[#2E7D32] text-white px-6 py-3 rounded-xl font-black inline-block">Kembali ke Beranda</a>
                </div>
              </div>
            </PublicLayout>
          } />
        </Routes>
      </AdminProvider>
    </BrowserRouter>
  )
}
