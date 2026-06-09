import { useEffect, useState } from 'react'
import { CrudTable } from '../components/CrudTable'
import Modal from '../components/Modal'
import { FormField, Textarea, Select, FormActions } from '../components/FormField'
import { aspirasiService } from '../../lib/db'
import toast from 'react-hot-toast'
import { MessageSquare } from 'lucide-react'

const statusOpts = [
  { value: 'diterima', label: '📬 Diterima' },
  { value: 'diproses', label: '⏳ Diproses' },
  { value: 'selesai', label: '✅ Selesai' },
]

const statusColors: Record<string, string> = {
  diterima: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  diproses: 'bg-blue-100 text-blue-700 border-blue-300',
  selesai: 'bg-green-100 text-green-700 border-green-300',
}

export default function AspirasiAdmin() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => { setLoading(true); setData(await aspirasiService.getAll() as any[]); setLoading(false) }
  useEffect(() => { load() }, [])

  const openReply = (row: any) => { setForm({ ...row }); setModal(true) }
  const closeModal = () => { setModal(false); setForm(null) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      await aspirasiService.updateStatus(form.id, form.status, form.balasan || '')
      toast.success('Status aspirasi diperbarui!')
      closeModal(); load()
    } catch (err: any) { toast.error(err.message) }
    setSaving(false)
  }

  const handleDelete = async (row: any) => { await aspirasiService.delete(row.id); toast.success('Dihapus'); load() }

  const newCount = data.filter(d => d.status === 'diterima').length

  return (
    <div>
      {newCount > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border-2 border-yellow-400 rounded-xl flex items-center gap-2 text-sm font-medium text-yellow-800">
          <MessageSquare size={16} /> Ada <strong>{newCount}</strong> aspirasi baru yang belum diproses
        </div>
      )}
      <CrudTable title="Aspirasi Masyarakat" data={data} loading={loading}
        onEdit={openReply} onDelete={handleDelete}
        searchKeys={['nama', 'kategori', 'pesan']} emptyIcon="💬"
        columns={[
          { key: 'nama', label: 'Nama', render: row => <span className="font-semibold text-sm">{row.anonim ? '🎭 Anonim' : row.nama}</span> },
          { key: 'kategori', label: 'Kategori', render: row => <span className="text-xs bg-[#E8F5E9] text-[#2E7D32] border border-[#66BB6A] px-2 py-0.5 rounded-full font-semibold">{row.kategori}</span> },
          { key: 'pesan', label: 'Pesan', render: row => <p className="text-sm text-gray-600 max-w-xs truncate">{row.pesan}</p> },
          { key: 'status', label: 'Status', render: row => <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusColors[row.status] || ''}`}>{row.status}</span> },
          { key: 'created_at', label: 'Tanggal', render: row => <span className="text-xs text-gray-400">{row.created_at ? new Date(row.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '-'}</span> },
        ]}
      />

      {form && (
        <Modal open={modal} onClose={closeModal} title="📬 Tindak Lanjut Aspirasi">
          <div className="mb-4 p-4 bg-[#F1F8E9] border-2 border-[#2E7D32] rounded-xl">
            <p className="font-bold text-sm mb-1">{form.anonim ? '🎭 Anonim' : form.nama} — <span className="text-[#2E7D32]">{form.kategori}</span></p>
            <p className="text-gray-600 text-sm italic">"{form.pesan}"</p>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <FormField label="Update Status" required>
              <Select value={form.status} onChange={e => setForm((p: any) => ({ ...p, status: e.target.value }))}
                options={statusOpts} />
            </FormField>
            <FormField label="Balasan / Catatan Admin" hint="Balasan ini akan ditampilkan kepada warga">
              <Textarea value={form.balasan || ''} onChange={e => setForm((p: any) => ({ ...p, balasan: e.target.value }))}
                placeholder="Tuliskan balasan atau tindak lanjut..." rows={4} />
            </FormField>
            <FormActions onCancel={closeModal} loading={saving} submitLabel="Simpan Status" />
          </form>
        </Modal>
      )}
    </div>
  )
}
