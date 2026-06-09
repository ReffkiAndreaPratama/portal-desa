import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { desaInfo } from '../../data/desaData';

export default function Footer() {
  return (
    <footer className="bg-[#212121] text-white mt-20">
      {/* Top Banner */}
      <div className="gradient-green py-4 border-b-4 border-[#212121]">
        <div className="container-custom text-center">
          <p className="font-bold text-white text-sm">
            🌿 Portal Digital Desa Talang Marap — Powered by KKN Periode 108 Kelompok 146 Universitas Bengkulu 🎓
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl border-3 border-white bg-[#2E7D32] flex items-center justify-center">
                <span className="text-white font-black text-xl">T</span>
              </div>
              <div>
                <p className="font-black text-base leading-tight text-[#66BB6A]">Portal Digital</p>
                <p className="font-bold text-xs text-gray-400">{desaInfo.nama}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {desaInfo.tagline}
            </p>
            <div className="flex gap-3">
              {[
                { icon: '📷', href: `https://instagram.com/${desaInfo.instagram}` },
                { icon: '👍', href: '#' },
                { icon: '▶️', href: '#' },
                { icon: <MessageCircle size={16} />, href: `https://wa.me/${desaInfo.whatsapp}` },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer"
                  className="w-8 h-8 rounded-lg border-2 border-gray-600 flex items-center justify-center hover:border-[#66BB6A] hover:text-[#66BB6A] hover:bg-[#66BB6A]/10 transition-all">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black text-base mb-4 text-[#66BB6A] border-b-2 border-[#2E7D32] pb-2">Menu Utama</h4>
            <ul className="space-y-2">
              {[
                ['Beranda', '/'],
                ['Profil Desa', '/profil'],
                ['Berita Desa', '/berita'],
                ['Wisata', '/wisata'],
                ['UMKM Desa', '/umkm'],
                ['Galeri', '/galeri'],
                ['Peta Desa', '/peta'],
                ['Arsip Dokumen', '/dokumen'],
              ].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="text-gray-400 hover:text-[#66BB6A] text-sm transition-colors flex items-center gap-2">
                    <span className="text-[#2E7D32]">›</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Program */}
          <div>
            <h4 className="font-black text-base mb-4 text-[#66BB6A] border-b-2 border-[#2E7D32] pb-2">Program KKN</h4>
            <ul className="space-y-2">
              {[
                ['SiTARA - Sampah Digital', '/sitara'],
                ['Bank Sampah', '/sitara/bank-sampah'],
                ['Jadwal Pengangkutan', '/sitara/jadwal'],
                ['Edukasi Lingkungan', '/sitara/edukasi'],
                ['Tim KKN 146', '/kkn/tim'],
                ['Program Kerja', '/kkn/proker'],
                ['Dokumentasi KKN', '/kkn/dokumentasi'],
                ['Aspirasi Masyarakat', '/aspirasi'],
              ].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="text-gray-400 hover:text-[#66BB6A] text-sm transition-colors flex items-center gap-2">
                    <span className="text-[#2E7D32]">›</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black text-base mb-4 text-[#66BB6A] border-b-2 border-[#2E7D32] pb-2">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin size={16} className="text-[#66BB6A] shrink-0 mt-0.5" />
                <span>{desaInfo.alamat}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone size={16} className="text-[#66BB6A] shrink-0" />
                <a href={`https://wa.me/${desaInfo.whatsapp}`} className="hover:text-[#66BB6A]">+62 812-3456-7890</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail size={16} className="text-[#66BB6A] shrink-0" />
                <a href={`mailto:${desaInfo.email}`} className="hover:text-[#66BB6A]">{desaInfo.email}</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Clock size={16} className="text-[#66BB6A] shrink-0" />
                <span>{desaInfo.jamOperasional}</span>
              </li>
            </ul>

            <div className="mt-6 p-3 bg-[#2E7D32]/20 border border-[#2E7D32] rounded-xl">
              <p className="text-xs text-[#66BB6A] font-bold mb-1">🌿 Program KKN UNIB</p>
              <p className="text-xs text-gray-400">Periode 108 • Kelompok 146</p>
              <p className="text-xs text-gray-400 mt-1">Universitas Bengkulu</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© 2025 Portal Digital Desa Talang Marap. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-4">
            <p>Made with 💚 by KKN UNIB Periode 108 Kelompok 146</p>
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2E7D32] text-white text-xs font-black rounded-lg border-2 border-[#66BB6A] hover:bg-[#43A047] transition-colors"
            >
              🔐 Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
