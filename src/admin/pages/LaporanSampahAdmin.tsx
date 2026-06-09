import { useEffect, useState } from 'react'
import { CrudTable } from '../components/CrudTable'
import Modal from '../components/Modal'
import { FormField, Textarea, Select, FormActions } from '../components/FormField'
import { laporanSampahService } from '../../lib/db'
import toast from 'react-hot-toast'

const statusOpts = [
  { value: 'diterima', label: '📬 Diterima' },
  { value: 'diproses', label: '⏳ Diproses' },
  { value: 'selesai', label: '✅ Selesai' },
  { value: 'ditolak', label: '❌ Ditolak' },
]
const statusColors: Record<string, string> = {
  diterima: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  diproses: 'bg-blue-100 text-blue-700 border-blue-300',
  selesai: 'bg-green-100 text-green-700 border-green-300',
  ditolak: 'bg-red-100 text-red-700 border-red-300',
}

export default function LaporanSampahAdmin() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => { setLoading(true); setData(await laporanSampahService.getAll() as any[]); setLoading(false) }
  useEffect(() => { load() }, [])

  const openTindak = (row: any) => { setForm({ ...row }); setModal(true) }
  const closeModal = () => { setModal(false); setForm(null) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      await laporanSampahService.updateStatus(form.id, form.status, form.catatan_admin || '')
      toast.success('Status laporan diperbarui!')
      closeModal(); load()
    } catch (err: any) { toast.error(err.message) }
    setSaving(false)
  }

  const handleDelete = async (row: any) => { await laporanSampahService.delete(row.id); toast.success('Dihapus'); load() }

  return (
    <div>
      <CrudTable title="Laporan Sampah Ilegal" data={data} loading={loading}
        onEdit={openTindak} onDelete={handleDelete}
        searchKeys={['nama', 'lokasi']} emptyIcon="🗑️"
        columns={[
          { key: 'nama', label: 'Pelapor', render: row => <span className="font-semibold text-sm">{row.nama}</span> },
          { key: 'lokasi', label: 'Lokasi', render: row => <span className="text-sm">{row.lokasi}</span> },
          { key: 'deskripsi', label: 'Deskripsi', render: row => <p className="text-xs text-gray-500 max-w-xs truncate">{row.deskripsi}</p> },
          { key: 'foto', label: 'Foto', render: row => row.foto ? <a href={row.foto} target="_blank" rel="noreferrer" className="text-xs text-[#2E7D32] underline">Lihat</a> : <span className="text-xs text-gray-400">-</span> },
          { key: 'status', label: 'Status', render: row => <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusColors[row.status] || ''}`}>{row.status}</span> },
          { key: 'created_at', label: 'Dilaporkan', render: row => <span className="text-xs text-gray-400">{row.created_at ? new Date(row.created_at).toLocaleDateString('id-ID') : '-'}</span> },
        ]}
      />

      {form && (
        <Modal open={modal} onClose={closeModal} title="⚠️ Tindak Lanjut Laporan Sampah">
          <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-xl">
            <p className="font-bold text-sm">Lokasi: {form.lokasi}</p>
            <p className="text-gray-600 text-sm mt-1">{form.deskripsi}</p>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <FormField label="Update Status" required>
              <Select value={form.status} onChange={e => setForm((p: any) => ({ ...p, status: e.target.value }))} options={statusOpts} />
            </FormField>
            <FormField label="Catatan Tindak Lanjut">
              <Textarea value={form.catatan_admin || ''} onChange={e => setForm((p: any) => ({ ...p, catatan_admin: e.target.value }))}
                placeholder="Tindakan yang sudah/akan dilakukan..." rows={4} />
            </FormField>
            <FormActions onCancel={closeModal} loading={saving} submitLabel="Simpan" />
          </form>
        </Modal>
      )}
    </div>
  )
}
