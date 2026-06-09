import { useEffect, useState } from 'react'
import { CrudTable } from '../components/CrudTable'
import Modal from '../components/Modal'
import { FormField, Input, Select, FormActions } from '../components/FormField'
import { bankSampahService } from '../../lib/db'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'

const emptyNasabah = { id: 0, nama: '', nik: '', alamat: '', no_hp: '', poin: 0, aktif: true }
const emptySetor = { id: 0, nasabah_id: 0, jenis: 'Botol Plastik', berat: 0, poin: 0, tanggal: '' }
const jenisSampah = [
  { value: 'Botol Plastik', label: 'Botol Plastik', poinPerKg: 3000 },
  { value: 'Kardus/Kertas', label: 'Kardus/Kertas', poinPerKg: 1500 },
  { value: 'Kaleng/Logam', label: 'Kaleng/Logam', poinPerKg: 4000 },
  { value: 'Kaca', label: 'Kaca', poinPerKg: 1000 },
  { value: 'Minyak Jelantah', label: 'Minyak Jelantah', poinPerKg: 5000 },
  { value: 'Lainnya', label: 'Lainnya', poinPerKg: 500 },
]

export default function BankSampahAdmin() {
  const [nasabah, setNasabah] = useState<any[]>([])
  const [setor, setSetor] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'nasabah' | 'setor'>('nasabah')
  const [modalNasabah, setModalNasabah] = useState(false)
  const [modalSetor, setModalSetor] = useState(false)
  const [formNasabah, setFormNasabah] = useState(emptyNasabah)
  const [formSetor, setFormSetor] = useState({ ...emptySetor, tanggal: new Date().toISOString().slice(0, 10) })
  const [saving, setSaving] = useState(false)
  const isEditNasabah = formNasabah.id !== 0

  const load = async () => {
    setLoading(true)
    const [n, s] = await Promise.all([bankSampahService.getAllNasabah(), bankSampahService.getAllSetor()])
    setNasabah(n as any[]); setSetor(s as any[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const fn = (key: string) => (e: any) => setFormNasabah(p => ({ ...p, [key]: e.target.value }))
  const fs = (key: string) => (e: any) => {
    const val = e.target.value
    setFormSetor(p => {
      const updated = { ...p, [key]: val }
      if (key === 'jenis' || key === 'berat') {
        const jenis = jenisSampah.find(j => j.value === (key === 'jenis' ? val : p.jenis))
        const berat = parseFloat(key === 'berat' ? val : String(p.berat)) || 0
        updated.poin = Math.floor((jenis?.poinPerKg || 0) * berat)
      }
      return updated
    })
  }

  const handleSaveNasabah = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      isEditNasabah ? await bankSampahService.updateNasabah(formNasabah.id, formNasabah) : await bankSampahService.createNasabah(formNasabah)
      toast.success(isEditNasabah ? 'Nasabah diperbarui!' : 'Nasabah didaftarkan!')
      setModalNasabah(false); setFormNasabah(emptyNasabah); load()
    } catch (err: any) { toast.error(err.message) }
    setSaving(false)
  }

  const handleSaveSetor = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      await bankSampahService.createSetor(formSetor)
      toast.success('Setoran berhasil dicatat!')
      setModalSetor(false); setFormSetor({ ...emptySetor, tanggal: new Date().toISOString().slice(0, 10) }); load()
    } catch (err: any) { toast.error(err.message) }
    setSaving(false)
  }

  const handleDeleteNasabah = async (row: any) => { await bankSampahService.deleteNasabah(row.id); toast.success('Dihapus'); load() }

  const totalPoin = nasabah.reduce((a, n) => a + (n.poin || 0), 0)

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Nasabah', value: nasabah.length, icon: '👥' },
          { label: 'Total Setoran', value: setor.length, icon: '📦' },
          { label: 'Total Poin', value: `Rp ${(totalPoin).toLocaleString()}`, icon: '💰' },
        ].map((s, i) => (
          <div key={i} className="bg-white border-3 border-[#212121] rounded-2xl shadow-[3px_3px_0_#212121] p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="font-black text-lg text-[#2E7D32]">{s.value}</p>
            <p className="text-gray-500 text-xs font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['nasabah', '👥 Nasabah'], ['setor', '📦 Riwayat Setoran']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id as any)}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm border-2 border-[#212121] shadow-[2px_2px_0_#212121] transition-all ${
              tab === id ? 'bg-[#2E7D32] text-white' : 'bg-white text-[#212121] hover:bg-[#E8F5E9]'
            }`}>{label}</button>
        ))}
        <button onClick={() => { setFormSetor({ ...emptySetor, tanggal: new Date().toISOString().slice(0, 10) }); setModalSetor(true) }}
          className="ml-auto flex items-center gap-1.5 bg-[#43A047] text-white px-4 py-2 rounded-xl font-bold text-sm border-2 border-[#212121] shadow-[2px_2px_0_#212121] hover:shadow-[4px_4px_0_#212121] transition-all">
          <Plus size={14} /> Catat Setoran
        </button>
      </div>

      {tab === 'nasabah' && (
        <CrudTable title="Daftar Nasabah Bank Sampah" data={nasabah} loading={loading}
          onAdd={() => { setFormNasabah(emptyNasabah); setModalNasabah(true) }}
          onEdit={row => { setFormNasabah(row); setModalNasabah(true) }}
          onDelete={handleDeleteNasabah}
          searchKeys={['nama', 'nik', 'no_hp']} addLabel="Daftar Nasabah" emptyIcon="♻️"
          columns={[
            { key: 'nama', label: 'Nama', render: row => <span className="font-bold">{row.nama}</span> },
            { key: 'nik', label: 'NIK', render: row => <span className="text-xs font-mono">{row.nik}</span> },
            { key: 'no_hp', label: 'No. HP' },
            { key: 'alamat', label: 'Alamat' },
            { key: 'poin', label: 'Poin', render: row => <span className="font-black text-[#2E7D32]">Rp {(row.poin || 0).toLocaleString()}</span> },
            { key: 'aktif', label: 'Status', render: row => <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${row.aktif ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-500 border-gray-300'}`}>{row.aktif ? 'Aktif' : 'Nonaktif'}</span> },
          ]}
        />
      )}

      {tab === 'setor' && (
        <CrudTable title="Riwayat Setoran" data={setor} loading={loading}
          searchKeys={['jenis']} emptyIcon="📦"
          columns={[
            { key: 'tanggal', label: 'Tanggal', render: row => <span className="text-xs">{row.tanggal}</span> },
            { key: 'nasabah_id', label: 'Nasabah ID' },
            { key: 'jenis', label: 'Jenis Sampah', render: row => <span className="text-xs font-semibold">{row.jenis}</span> },
            { key: 'berat', label: 'Berat (kg)', render: row => <span className="font-bold">{row.berat} kg</span> },
            { key: 'poin', label: 'Nilai', render: row => <span className="font-black text-[#2E7D32]">Rp {(row.poin || 0).toLocaleString()}</span> },
          ]}
        />
      )}

      {/* Modal Nasabah */}
      <Modal open={modalNasabah} onClose={() => { setModalNasabah(false); setFormNasabah(emptyNasabah) }}
        title={isEditNasabah ? '✏️ Edit Nasabah' : '➕ Daftar Nasabah Baru'}>
        <form onSubmit={handleSaveNasabah} className="space-y-4">
          <FormField label="Nama Lengkap" required><Input value={formNasabah.nama} onChange={fn('nama')} required /></FormField>
          <FormField label="NIK" required><Input value={formNasabah.nik} onChange={fn('nik')} required placeholder="3400xxxxxxxxxxxx" /></FormField>
          <FormField label="Alamat" required><Input value={formNasabah.alamat} onChange={fn('alamat')} required /></FormField>
          <FormField label="Nomor HP" required><Input value={formNasabah.no_hp} onChange={fn('no_hp')} required placeholder="081234567890" /></FormField>
          <FormActions onCancel={() => { setModalNasabah(false); setFormNasabah(emptyNasabah) }} loading={saving} submitLabel={isEditNasabah ? 'Update' : 'Daftar'} />
        </form>
      </Modal>

      {/* Modal Setor */}
      <Modal open={modalSetor} onClose={() => setModalSetor(false)} title="📦 Catat Setoran Sampah">
        <form onSubmit={handleSaveSetor} className="space-y-4">
          <FormField label="Nasabah" required>
            <Select value={String(formSetor.nasabah_id)} onChange={fs('nasabah_id')}
              options={nasabah.map(n => ({ value: String(n.id), label: n.nama }))} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Jenis Sampah" required>
              <Select value={formSetor.jenis} onChange={fs('jenis')} options={jenisSampah.map(j => ({ value: j.value, label: j.label }))} />
            </FormField>
            <FormField label="Berat (kg)" required>
              <Input type="number" step="0.1" min="0.1" value={formSetor.berat} onChange={fs('berat')} required />
            </FormField>
          </div>
          <FormField label="Tanggal Setoran" required>
            <Input type="date" value={formSetor.tanggal} onChange={fs('tanggal')} required />
          </FormField>
          {formSetor.poin > 0 && (
            <div className="p-3 bg-[#E8F5E9] border-2 border-[#2E7D32] rounded-xl text-center">
              <p className="text-xs text-gray-500">Nilai yang akan diterima:</p>
              <p className="font-black text-2xl text-[#2E7D32]">Rp {formSetor.poin.toLocaleString()}</p>
            </div>
          )}
          <FormActions onCancel={() => setModalSetor(false)} loading={saving} submitLabel="Catat Setoran" />
        </form>
      </Modal>
    </div>
  )
}
