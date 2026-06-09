import { useEffect, useState } from 'react'
import { CrudTable } from '../components/CrudTable'
import Modal from '../components/Modal'
import { FormField, Input, Textarea, Select, FormActions } from '../components/FormField'
import { agendaService } from '../../lib/db'
import toast from 'react-hot-toast'

const kategoris = ['Pemerintahan', 'Kesehatan', 'Sosial', 'KKN', 'Pendidikan', 'Pertanian', 'Lainnya']
const empty = { id: 0, judul: '', tanggal: '', jam: '', lokasi: '', kategori: 'Pemerintahan', deskripsi: '' }

const kategoriColors: Record<string, string> = {
  Pemerintahan: 'bg-blue-100 text-blue-700', Kesehatan: 'bg-red-100 text-red-700',
  Sosial: 'bg-green-100 text-green-700', KKN: 'bg-orange-100 text-orange-700',
}

export default function AgendaAdmin() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const isEdit = form.id !== 0

  const load = async () => { setLoading(true); setData(await agendaService.getAll() as any[]); setLoading(false) }
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm({ ...empty, tanggal: new Date().toISOString().slice(0, 10), jam: '08.00 WIB' }); setModal(true) }
  const openEdit = (row: any) => { setForm(row); setModal(true) }
  const closeModal = () => { setModal(false); setForm(empty) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      isEdit ? await agendaService.update(form.id, form) : await agendaService.create(form)
      toast.success(isEdit ? 'Agenda diperbarui!' : 'Agenda ditambahkan!')
      closeModal(); load()
    } catch (err: any) { toast.error(err.message) }
    setSaving(false)
  }

  const handleDelete = async (row: any) => { await agendaService.delete(row.id); toast.success('Dihapus'); load() }
  const f = (key: string) => (e: any) => setForm(p => ({ ...p, [key]: e.target.value }))

  return (
    <div>
      <CrudTable title="Agenda & Kalender Desa" data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
        searchKeys={['judul', 'lokasi']} addLabel="Tambah Agenda" emptyIcon="📅"
        columns={[
          { key: 'judul', label: 'Judul', render: row => <span className="font-semibold text-sm">{row.judul}</span> },
          { key: 'tanggal', label: 'Tanggal', render: row => <span className="text-xs font-bold">{new Date(row.tanggal).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</span> },
          { key: 'jam', label: 'Jam' },
          { key: 'lokasi', label: 'Lokasi' },
          { key: 'kategori', label: 'Kategori', render: row => <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${kategoriColors[row.kategori] || 'bg-gray-100 text-gray-700'}`}>{row.kategori}</span> },
        ]}
      />

      <Modal open={modal} onClose={closeModal} title={isEdit ? '✏️ Edit Agenda' : '➕ Tambah Agenda'}>
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Judul Kegiatan" required><Input value={form.judul} onChange={f('judul')} required /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Tanggal" required><Input type="date" value={form.tanggal} onChange={f('tanggal')} required /></FormField>
            <FormField label="Jam" required><Input value={form.jam} onChange={f('jam')} placeholder="08.00 WIB" required /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Lokasi" required><Input value={form.lokasi} onChange={f('lokasi')} required placeholder="Balai Desa..." /></FormField>
            <FormField label="Kategori" required><Select value={form.kategori} onChange={f('kategori')} options={kategoris.map(k => ({ value: k, label: k }))} /></FormField>
          </div>
          <FormField label="Deskripsi"><Textarea value={form.deskripsi} onChange={f('deskripsi')} rows={3} placeholder="Keterangan tambahan..." /></FormField>
          <FormActions onCancel={closeModal} loading={saving} submitLabel={isEdit ? 'Update' : 'Tambah'} />
        </form>
      </Modal>
    </div>
  )
}
