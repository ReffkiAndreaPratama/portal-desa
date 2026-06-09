import { useState } from 'react';
import { FileText, Download, Search } from 'lucide-react';
import { dokumenService } from '../lib/db';
import { useDBData } from '../hooks/useDB';
import { dokumenDesa as fallback } from '../data/desaData';

const kategoris = ['Semua', 'Perencanaan', 'Keuangan', 'Profil', 'Peraturan', 'Laporan', 'Data'];

export default function DokumenPage() {
  const [aktifKat, setAktifKat] = useState('Semua');
  const [search, setSearch]     = useState('');

  const { data, loading } = useDBData(() => dokumenService.getAll() as Promise<any[]>);
  const allDokumen: any[] = (data as any[]) ?? fallback;

  const filtered = allDokumen.filter(d =>
    (aktifKat === 'Semua' || d.kategori === aktifKat) &&
    d.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-24">
      <div className="gradient-green border-b-4 border-[#212121] py-10">
        <div className="container-custom flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Arsip Dokumen Desa</h1>
            <p className="text-white/70">Akses dokumen resmi Desa Talang Marap</p>
          </div>
          <span className="text-white/60 text-sm font-bold hidden md:block">{allDokumen.length} dokumen</span>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Cari dokumen..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-3 border-[#212121] rounded-xl font-medium outline-none focus:border-[#2E7D32] bg-white shadow-[3px_3px_0_#212121]" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {kategoris.map(k => (
              <button key={k} onClick={() => setAktifKat(k)}
                className={`brutal-btn px-4 py-2 rounded-xl font-bold text-sm ${aktifKat === k ? 'bg-[#2E7D32] text-white' : 'bg-white text-[#212121]'}`}>
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="brutal-card overflow-hidden">
          <div className="bg-[#2E7D32] p-4 text-white font-black flex items-center gap-2">
            <FileText size={18} /> Daftar Dokumen ({filtered.length})
          </div>
          {loading ? (
            <div className="divide-y divide-gray-100">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-2 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((doc: any) => (
                <div key={doc.id} className="p-4 flex items-center gap-4 hover:bg-[#F1F8E9] transition-colors">
                  <div className="w-12 h-12 bg-red-100 border-2 border-red-300 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-red-600 font-black text-xs">{doc.tipe}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{doc.nama}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                      <span className="bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full border border-[#66BB6A] font-semibold">{doc.kategori}</span>
                      <span>📅 {doc.tanggal ? new Date(doc.tanggal).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '-'}</span>
                      {doc.ukuran && <span>📦 {doc.ukuran}</span>}
                    </div>
                  </div>
                  {doc.url ? (
                    <a href={doc.url} target="_blank" rel="noreferrer"
                      className="brutal-btn bg-[#2E7D32] text-white px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1 shrink-0">
                      <Download size={12} /> Unduh
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 italic shrink-0">Belum tersedia</span>
                  )}
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="p-12 text-center text-gray-400">
                  <FileText size={40} className="mx-auto mb-2 opacity-30" />
                  <p className="font-bold">Dokumen tidak ditemukan</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 brutal-card p-6 bg-[#F1F8E9]">
          <h3 className="font-black text-base mb-2">📋 Perlu Dokumen Lain?</h3>
          <p className="text-sm text-gray-600 mb-3">Untuk permohonan dokumen resmi lainnya, kunjungi kantor desa atau hubungi sekretariat desa.</p>
          <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer"
            className="brutal-btn bg-[#2E7D32] text-white px-5 py-2 rounded-xl font-bold text-sm inline-flex items-center gap-2">
            💬 Hubungi Sekretariat
          </a>
        </div>
      </div>
    </div>
  );
}
