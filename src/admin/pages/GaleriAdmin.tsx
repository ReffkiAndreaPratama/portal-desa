import { useEffect, useState } from 'react'
import { CrudTable } from '../components/CrudTable'
import Modal from '../components/Modal'
import { FormField, Input, Select, FormActions, ImagePreview } from '../components/FormField'
import { galeriService } from '../../lib/db'
import toast from 'react-hot-toast'

const kategoris = ['Wisata', 'KKN', 'Pertanian', 'Pemerintahan', 'Kesehatan', 'UMKM', 'Lingkungan', 'Sosial', 'Lainnya']
const empty = { id: 0, judul: '', kategori: 'KKN', foto: '', tanggal: '' }

export default function GaleriAdmin() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const isEdit = form.id !== 0

  const load = async () => { setLoading(true); setData(await galeriService.getAll() as any[]); setLoading(false) }
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm({ ...empty, tanggal: new Date().toISOString().slice(0, 10) }); setModal(true) }
  const openEdit = (row: any) => { setForm(row); setModal(true) }
  const closeModal = () => { setModal(false); setForm(empty) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      isEdit ? await galeriService.update(form.id, form) : await galeriService.create(form)
      toast.success(isEdit ? 'Galeri diperbarui!' : 'Foto ditambahkan!')
      closeModal(); load()
    } catch (err: any) { toast.error(err.message) }
    setSaving(false)
  }

  const handleDelete = async (row: any) => { await galeriService.delete(row.id); toast.success('Foto dihapus'); load() }
  const f = (key: string) => (e: any) => setForm(p => ({ ...p, [key]: e.target.value }))

  return (
    <div>
      <CrudTable title="Manajemen Galeri" data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
        searchKeys={['judul', 'kategori']} addLabel="Upload Foto" emptyIcon="🖼️"
        columns={[
          { key: 'foto', label: 'Foto', render: row => row.foto ? <img src={row.foto} alt="" className="w-14 h-10 rounded-lg object-cover border-2 border-gray-200" /> : <div className="w-14 h-10 bg-gray-100 rounded-lg flex items-center justify-center">🖼️</div> },
          { key: 'judul', label: 'Judul', render: row => <span className="font-semibold text-sm">{row.judul}</span> },
          { key: 'kategori', label: 'Kategori', render: row => <span className="text-xs bg-orange-100 text-orange-700 border border-orange-300 px-2 py-0.5 rounded-full font-semibold">{row.kategori}</span> },
          { key: 'tanggal', label: 'Tanggal', render: row => <span className="text-xs text-gray-500">{row.tanggal}</span> },
        ]}
      />

      <Modal open={modal} onClose={closeModal} title={isEdit ? '✏️ Edit Foto' : '➕ Tambah Foto Galeri'}>
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Judul Foto" required><Input value={form.judul} onChange={f('judul')} required placeholder="Judul foto..." /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Kategori" required><Select value={form.kategori} onChange={f('kategori')} options={kategoris.map(k => ({ value: k, label: k }))} /></FormField>
            <FormField label="Tanggal" required><Input type="date" value={form.tanggal} onChange={f('tanggal')} required /></FormField>
          </div>
          <FormField label="URL Foto" required hint="Link foto dari Google Drive, Imgur, atau server">
            <Input value={form.foto} onChange={f('foto')} required placeholder="https://..." />
            <ImagePreview src={form.foto} className="mt-2 h-40 w-full" />
          </FormField>
          <FormActions onCancel={closeModal} loading={saving} submitLabel={isEdit ? 'Update' : 'Tambah'} />
        </form>
      </Modal>
    </div>
  )
}
