import { useEffect, useState } from 'react'
import { pengaturanService } from '../../lib/db'
import { isSupabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { FormField, Input } from '../components/FormField'
import { Settings, Save, Globe, Users } from 'lucide-react'

const sections = [
  {
    title: '🏡 Identitas Desa', icon: <Globe size={18} />,
    fields: [
      { key: 'nama_desa', label: 'Nama Desa', placeholder: 'Desa Talang Marap' },
      { key: 'tagline', label: 'Tagline / Slogan', placeholder: 'Mengenal Desa...' },
      { key: 'kecamatan', label: 'Kecamatan', placeholder: 'Kecamatan Ulu Manna' },
      { key: 'kabupaten', label: 'Kabupaten', placeholder: 'Bengkulu Selatan' },
      { key: 'provinsi', label: 'Provinsi', placeholder: 'Bengkulu' },
      { key: 'kode_pos', label: 'Kode Pos', placeholder: '38500' },
    ]
  },
  {
    title: '👤 Kepala Desa', icon: <Users size={18} />,
    fields: [
      { key: 'kepala_desa', label: 'Nama Kepala Desa', placeholder: 'Bapak Sumarno' },
      { key: 'periode_kepala', label: 'Periode Jabatan', placeholder: '2019 - 2025' },
    ]
  },
  {
    title: '📊 Statistik Utama', icon: <Users size={18} />,
    fields: [
      { key: 'jumlah_penduduk', label: 'Jumlah Penduduk', placeholder: '1847', type: 'number' },
      { key: 'jumlah_kk', label: 'Jumlah KK', placeholder: '512', type: 'number' },
      { key: 'luas_wilayah', label: 'Luas Wilayah', placeholder: '24.5 km²' },
      { key: 'jumlah_dusun', label: 'Jumlah Dusun', placeholder: '4', type: 'number' },
    ]
  },
  {
    title: '📞 Kontak & Lokasi', icon: <Globe size={18} />,
    fields: [
      { key: 'alamat', label: 'Alamat Lengkap', placeholder: 'Jl. Raya Talang Marap No. 1...' },
      { key: 'whatsapp', label: 'WhatsApp (tanpa +)', placeholder: '6281234567890' },
      { key: 'email', label: 'Email Desa', placeholder: 'desatalangmarap@gmail.com' },
      { key: 'jam_operasional', label: 'Jam Operasional', placeholder: 'Senin - Jumat: 08.00 - 16.00' },
      { key: 'google_maps_url', label: 'URL Google Maps', placeholder: 'https://maps.google.com/...' },
    ]
  },
  {
    title: '📱 Media Sosial', icon: <Globe size={18} />,
    fields: [
      { key: 'instagram', label: 'Instagram (tanpa @)', placeholder: 'desatalangmarap' },
      { key: 'facebook', label: 'Facebook', placeholder: 'Desa Talang Marap' },
      { key: 'tiktok', label: 'TikTok', placeholder: '@desatalangmarap' },
      { key: 'youtube', label: 'YouTube Channel', placeholder: 'Portal Desa Talang Marap' },
    ]
  },
]

export default function PengaturanAdmin() {
  const [data, setData] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    pengaturanService.getAll().then(d => { setData(d); setLoading(false) })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      await pengaturanService.setBulk(data)
      toast.success('Pengaturan berhasil disimpan!')
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan')
    }
    setSaving(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-8 h-8 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#2E7D32] rounded-xl flex items-center justify-center">
          <Settings size={20} className="text-white" />
        </div>
        <div>
          <h2 className="font-black text-xl text-[#212121]">Pengaturan Desa</h2>
          <p className="text-gray-500 text-sm">Kelola informasi utama desa yang tampil di website</p>
        </div>
      </div>

      {!isSupabase && (
        <div className="mb-4 p-3 bg-yellow-50 border-2 border-yellow-400 rounded-xl text-xs font-medium text-yellow-800">
          ⚠️ Mode Lokal: Perubahan tidak tersimpan ke database. Aktifkan Supabase untuk menyimpan permanen.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {sections.map(section => (
          <div key={section.title} className="bg-white border-4 border-[#212121] rounded-2xl shadow-[4px_4px_0_#212121] overflow-hidden">
            <div className="bg-[#212121] px-4 py-3 flex items-center gap-2 text-white font-black">
              {section.icon} {section.title}
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map(field => (
                <FormField key={field.key} label={field.label}>
                  <Input
                    type={(field as any).type || 'text'}
                    value={data[field.key] || ''}
                    onChange={e => setData(p => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                  />
                </FormField>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-[#2E7D32] text-white px-8 py-3 rounded-xl font-black text-base border-3 border-[#212121] shadow-[4px_4px_0_#212121] hover:shadow-[6px_6px_0_#212121] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-60">
            <Save size={18} /> {saving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
          </button>
        </div>
      </form>
    </div>
  )
}
