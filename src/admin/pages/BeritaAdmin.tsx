import { useEffect, useState } from 'react'
import { CrudTable } from '../components/CrudTable'
import Modal from '../components/Modal'
import { FormField, Input, Textarea, Select, FormActions, ImagePreview } from '../components/FormField'
import { beritaService } from '../../lib/db'
import toast from 'react-hot-toast'

const kategoris = ['Pemerintahan', 'KKN', 'Lingkungan', 'Pertanian', 'Kesehatan', 'UMKM', 'Pendidikan', 'Sosial']
const empty = { id: 0, judul: '', kategori: '', tanggal: '', penulis: '', foto: '', ringkasan: '', konten: '', views: 0, published: true }

export default function BeritaAdmin() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const isEdit = form.id !== 0

  const load = async () => {
    setLoading(true)
    const d = await beritaService.getAll()
    setData(Array.isArray(d) ? d : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm({ ...empty, tanggal: new Date().toISOString().slice(0, 10) }); setModal(true) }
  const openEdit = (row: any) => { setForm(row); setModal(true) }
  const closeModal = () => { setModal(false); setForm(empty) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (isEdit) {
        await beritaService.update(form.id, form)
        toast.success('Berita berhasil diperbarui!')
      } else {
        await beritaService.create(form)
        toast.success('Berita berhasil ditambahkan!')
      }
      closeModal()
      load()
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan')
    }
    setSaving(false)
  }

  const handleDelete = async (row: any) => {
    try {
      await beritaService.delete(row.id)
      toast.success('Berita dihapus')
      load()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const f = (key: string) => (e: any) => setForm(p => ({ ...p, [key]: e.target.value }))

  return (
    <div>
      <CrudTable
        title="Manajemen Berita"
        data={data}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        searchKeys={['judul', 'kategori', 'penulis']}
        addLabel="Tambah Berita"
        emptyIcon="📰"
        columns={[
          {
            key: 'foto', label: 'Foto', width: '60px',
            render: row => row.foto ? <img src={row.foto} alt="" className="w-10 h-10 rounded-lg object-cover border-2 border-gray-200" /> : <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">📰</div>
          },
          { key: 'judul', label: 'Judul', render: row => <span className="font-semibold text-sm line-clamp-1">{row.judul}</span> },
          {
            key: 'kategori', label: 'Kategori',
            render: row => <span className="text-xs bg-[#E8F5E9] text-[#2E7D32] border border-[#66BB6A] px-2 py-0.5 rounded-full font-semibold">{row.kategori}</span>
          },
          { key: 'tanggal', label: 'Tanggal', render: row => <span className="text-xs text-gray-500">{row.tanggal}</span> },
          { key: 'penulis', label: 'Penulis', render: row => <span className="text-xs">{row.penulis}</span> },
          { key: 'views', label: 'Views', render: row => <span className="text-xs font-bold text-gray-500">👁 {row.views ?? 0}</span> },
          {
            key: 'published', label: 'Status',
            render: row => <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${row.published !== false ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-500 border-gray-300'}`}>
              {row.published !== false ? 'Publish' : 'Draft'}
            </span>
          },
        ]}
      />

      <Modal open={modal} onClose={closeModal} title={isEdit ? '✏️ Edit Berita' : '➕ Tambah Berita'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Judul Berita" required>
            <Input value={form.judul} onChange={f('judul')} placeholder="Judul berita..." required />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Kategori" required>
              <Select value={form.kategori} onChange={f('kategori')} required
                options={kategoris.map(k => ({ value: k, label: k }))} />
            </FormField>
            <FormField label="Tanggal" required>
              <Input type="date" value={form.tanggal} onChange={f('tanggal')} required />
            </FormField>
          </div>
          <FormField label="Penulis" required>
            <Input value={form.penulis} onChange={f('penulis')} placeholder="Nama penulis..." required />
          </FormField>
          <FormField label="URL Foto" hint="Masukkan URL gambar atau link Google Drive">
            <Input value={form.foto} onChange={f('foto')} placeholder="https://..." />
            <ImagePreview src={form.foto} className="mt-2 h-28 w-full" />
          </FormField>
          <FormField label="Ringkasan" required>
            <Textarea value={form.ringkasan} onChange={f('ringkasan')} placeholder="Ringkasan singkat berita..." rows={2} required />
          </FormField>
          <FormField label="Konten Lengkap" required>
            <Textarea value={form.konten} onChange={f('konten')} placeholder="Isi lengkap berita..." rows={5} required />
          </FormField>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="pub" checked={form.published !== false}
              onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} className="w-4 h-4 accent-[#2E7D32]" />
            <label htmlFor="pub" className="text-sm font-medium">Publish sekarang</label>
          </div>
          <FormActions onCancel={closeModal} loading={saving} submitLabel={isEdit ? 'Update' : 'Tambah'} />
        </form>
      </Modal>
    </div>
  )
}
