import React, { useState } from 'react';
import { MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { aspirasiService } from '../lib/db';
import { useDBData } from '../hooks/useDB';
import toast from 'react-hot-toast';

const fallbackAspirasi = [
  { id: 1, nama: 'Warga Dusun I', kategori: 'Infrastruktur', pesan: 'Mohon perbaikan jalan di Dusun I yang sudah rusak parah setelah hujan.', status: 'selesai', created_at: '2025-05-01' },
  { id: 2, nama: 'Kelompok Tani', kategori: 'Pertanian', pesan: 'Perlu bantuan alat pertanian dan bibit unggul untuk musim tanam berikutnya.', status: 'diproses', created_at: '2025-05-15' },
  { id: 3, nama: 'Warga Anonim', kategori: 'Pendidikan', pesan: 'Tolong ada program bimbingan belajar untuk anak SD di balai desa.', status: 'diterima', created_at: '2025-06-01' },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  selesai:  { label: 'Selesai',  color: 'bg-green-100 text-green-700 border-green-300',   icon: <CheckCircle size={14} /> },
  diproses: { label: 'Diproses', color: 'bg-blue-100 text-blue-700 border-blue-300',     icon: <Clock size={14} /> },
  diterima: { label: 'Diterima', color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: <AlertCircle size={14} /> },
};

const kategoris = ['Infrastruktur', 'Pertanian', 'Kesehatan', 'Pendidikan', 'Lingkungan', 'Sosial', 'Lainnya'];

export default function AspirasiPage() {
  const [form, setForm]       = useState({ nama: '', kategori: '', pesan: '', anonim: false });
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: aspirasiData, refetch } = useDBData(() => aspirasiService.getAll() as Promise<any[]>);
  const aspirasiList: any[] = (aspirasiData as any[])?.length ? (aspirasiData as any[]) : fallbackAspirasi;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await aspirasiService.submit({
        nama: form.anonim ? 'Anonim' : form.nama,
        kategori: form.kategori,
        pesan: form.pesan,
        anonim: form.anonim,
      });
      setSent(true);
      toast.success('Aspirasi berhasil dikirim! Terima kasih.');
      refetch();
      setTimeout(() => {
        setSent(false);
        setForm({ nama: '', kategori: '', pesan: '', anonim: false });
      }, 4000);
    } catch {
      toast.error('Gagal mengirim, coba lagi.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-24">
      <div className="gradient-green border-b-4 border-[#212121] py-10">
        <div className="container-custom">
          <h1 className="text-3xl font-black text-white mb-1">Aspirasi Masyarakat</h1>
          <p className="text-white/70">Suarakan aspirasi Anda untuk kemajuan Desa Talang Marap</p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Form Aspirasi */}
          <div>
            <div className="brutal-card p-6">
              <h2 className="font-black text-xl mb-5 flex items-center gap-2">
                <MessageSquare size={22} className="text-[#2E7D32]" /> Kirim Aspirasi
              </h2>

              {sent ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-3">🎉</div>
                  <h3 className="font-black text-lg text-[#2E7D32]">Aspirasi Terkirim!</h3>
                  <p className="text-gray-500 text-sm mt-1">Terima kasih telah berpartisipasi dalam pembangunan desa.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nama */}
                  <div>
                    <label className="block font-bold text-sm mb-1">Nama</label>
                    <input
                      type="text"
                      placeholder={form.anonim ? 'Anonim' : 'Nama Anda'}
                      disabled={form.anonim}
                      value={form.anonim ? '' : form.nama}
                      onChange={e => setForm(p => ({ ...p, nama: e.target.value }))}
                      className="w-full px-4 py-3 border-3 border-[#212121] rounded-xl font-medium outline-none focus:border-[#2E7D32] bg-white disabled:bg-gray-100 disabled:text-gray-400"
                    />
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input type="checkbox" checked={form.anonim}
                        onChange={e => setForm(p => ({ ...p, anonim: e.target.checked }))}
                        className="w-4 h-4 accent-[#2E7D32]" />
                      <span className="text-sm text-gray-600 font-medium">Kirim sebagai anonim</span>
                    </label>
                  </div>

                  {/* Kategori */}
                  <div>
                    <label className="block font-bold text-sm mb-1">Kategori <span className="text-red-500">*</span></label>
                    <select
                      value={form.kategori}
                      onChange={e => setForm(p => ({ ...p, kategori: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border-3 border-[#212121] rounded-xl font-medium outline-none focus:border-[#2E7D32] bg-white"
                    >
                      <option value="">Pilih kategori...</option>
                      {kategoris.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>

                  {/* Pesan */}
                  <div>
                    <label className="block font-bold text-sm mb-1">Aspirasi / Pesan <span className="text-red-500">*</span></label>
                    <textarea
                      placeholder="Sampaikan aspirasi, saran, atau keluhan Anda..."
                      value={form.pesan}
                      onChange={e => setForm(p => ({ ...p, pesan: e.target.value }))}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border-3 border-[#212121] rounded-xl font-medium outline-none focus:border-[#2E7D32] bg-white resize-none"
                    />
                  </div>

                  <button type="submit" disabled={loading}
                    className="brutal-btn w-full bg-[#2E7D32] text-white py-3 rounded-xl font-black disabled:opacity-60">
                    {loading ? '⏳ Mengirim...' : 'Kirim Aspirasi 📨'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* List Aspirasi */}
          <div>
            <h2 className="font-black text-xl mb-5">📋 Aspirasi Terbaru</h2>
            <div className="space-y-4">
              {aspirasiList.slice(0, 6).map((a: any) => {
                const st = statusConfig[a.status] ?? statusConfig.diterima;
                return (
                  <div key={a.id} className="brutal-card p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-black text-sm">{a.anonim ? '🎭 Anonim' : a.nama}</p>
                        <span className="text-xs bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full border border-[#66BB6A] font-semibold">
                          {a.kategori}
                        </span>
                      </div>
                      <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border ${st.color}`}>
                        {st.icon} {st.label}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">"{a.pesan}"</p>
                    {a.balasan && (
                      <div className="mt-2 p-2 bg-[#E8F5E9] border border-[#2E7D32] rounded-lg text-xs text-[#2E7D32] font-medium">
                        💬 Balasan: {a.balasan}
                      </div>
                    )}
                    <p className="text-gray-400 text-xs mt-2">
                      📅 {a.created_at ? new Date(a.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' }) : '-'}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 brutal-card p-4 bg-[#F1F8E9]">
              <p className="text-sm font-bold text-[#2E7D32] mb-1">ℹ️ Informasi</p>
              <p className="text-xs text-gray-600">
                Setiap aspirasi akan ditinjau oleh perangkat desa. Balasan akan ditampilkan langsung di daftar ini.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
