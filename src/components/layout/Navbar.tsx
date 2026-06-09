import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Moon, Sun, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { desaInfo } from '../../data/desaData';

const navItems = [
  { label: 'Beranda', path: '/' },
  {
    label: 'Profil', path: '/profil',
    children: [
      { label: 'Sejarah Desa', path: '/profil/sejarah' },
      { label: 'Visi & Misi', path: '/profil/visi-misi' },
      { label: 'Perangkat Desa', path: '/profil/perangkat' },
      { label: 'Demografi', path: '/profil/demografi' },
    ]
  },
  { label: 'Berita', path: '/berita' },
  { label: 'Wisata', path: '/wisata' },
  { label: 'UMKM', path: '/umkm' },
  {
    label: 'SiTARA', path: '/sitara',
    children: [
      { label: 'Dashboard Sampah', path: '/sitara' },
      { label: 'Bank Sampah', path: '/sitara/bank-sampah' },
      { label: 'Jadwal Angkut', path: '/sitara/jadwal' },
      { label: 'Edukasi', path: '/sitara/edukasi' },
      { label: 'Lapor Sampah', path: '/sitara/laporan' },
    ]
  },
  {
    label: 'KKN', path: '/kkn',
    children: [
      { label: 'Tentang KKN', path: '/kkn' },
      { label: 'Tim Kami', path: '/kkn/tim' },
      { label: 'Program Kerja', path: '/kkn/proker' },
      { label: 'Dokumentasi', path: '/kkn/dokumentasi' },
    ]
  },
  { label: 'Galeri', path: '/galeri' },
  { label: 'Kontak', path: '/kontak' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { darkMode, toggleDarkMode, toggleLanguage, language, setIsSearchOpen } = useApp();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b-4 border-[#212121] shadow-[0_4px_0_#212121]'
        : 'bg-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl border-3 border-[#212121] bg-[#2E7D32] flex items-center justify-center shadow-[3px_3px_0_#212121] group-hover:shadow-[5px_5px_0_#212121] group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] transition-all">
              <span className="text-white font-black text-lg">T</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-black text-sm leading-tight text-[#2E7D32]">Portal Digital</p>
              <p className="font-bold text-xs text-gray-600 dark:text-gray-300">{desaInfo.nama}</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <div
                key={item.path}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all hover:bg-[#2E7D32] hover:text-white ${
                    location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                      ? 'bg-[#2E7D32] text-white'
                      : 'text-[#212121] dark:text-gray-200'
                  }`}
                >
                  {item.label}
                  {item.children && <ChevronDown size={14} />}
                </Link>
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border-4 border-[#212121] rounded-xl shadow-[4px_4px_0_#212121] overflow-hidden z-50">
                    {item.children.map(child => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="block px-4 py-3 text-sm font-semibold hover:bg-[#2E7D32] hover:text-white transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0 dark:text-gray-200"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-9 h-9 rounded-lg border-2 border-[#212121] flex items-center justify-center hover:bg-[#2E7D32] hover:text-white transition-all shadow-[2px_2px_0_#212121] hover:shadow-[4px_4px_0_#212121] hover:-translate-x-[1px] hover:-translate-y-[1px]"
            >
              <Search size={16} />
            </button>
            <button
              onClick={toggleLanguage}
              className="hidden md:flex w-9 h-9 rounded-lg border-2 border-[#212121] items-center justify-center hover:bg-[#2E7D32] hover:text-white transition-all shadow-[2px_2px_0_#212121] text-xs font-bold"
            >
              {language === 'id' ? 'EN' : 'ID'}
            </button>
            <button
              onClick={toggleDarkMode}
              className="w-9 h-9 rounded-lg border-2 border-[#212121] flex items-center justify-center hover:bg-[#2E7D32] hover:text-white transition-all shadow-[2px_2px_0_#212121]"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            {/* Tombol Admin Dashboard */}
            <Link
              to="/admin"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 border-[#212121] bg-[#212121] text-white text-xs font-black shadow-[2px_2px_0_#2E7D32] hover:shadow-[4px_4px_0_#2E7D32] hover:bg-[#2E7D32] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all"
            >
              <LayoutDashboard size={14} />
              <span className="hidden lg:inline">Admin</span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-9 h-9 rounded-lg border-2 border-[#212121] flex items-center justify-center hover:bg-[#2E7D32] hover:text-white transition-all shadow-[2px_2px_0_#212121]"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-900 border-4 border-[#212121] rounded-2xl shadow-[6px_6px_0_#212121] mb-4 overflow-hidden">
            {navItems.map(item => (
              <div key={item.path}>
                <Link
                  to={item.path}
                  className={`block px-5 py-3 font-semibold text-sm border-b border-gray-100 dark:border-gray-800 hover:bg-[#2E7D32] hover:text-white transition-colors ${
                    location.pathname === item.path ? 'bg-[#2E7D32] text-white' : 'dark:text-gray-200'
                  }`}
                >
                  {item.label}
                </Link>
                {item.children && item.children.map(child => (
                  <Link
                    key={child.path}
                    to={child.path}
                    className="block pl-8 pr-5 py-2 text-xs font-medium border-b border-gray-50 dark:border-gray-800 hover:bg-[#66BB6A] hover:text-white transition-colors text-gray-500 dark:text-gray-400"
                  >
                    └ {child.label}
                  </Link>
                ))}
              </div>
            ))}
            {/* Admin link di mobile */}
            <Link
              to="/admin"
              className="flex items-center gap-2 px-5 py-3 font-black text-sm bg-[#212121] text-white hover:bg-[#2E7D32] transition-colors"
            >
              <LayoutDashboard size={15} /> Panel Admin
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
