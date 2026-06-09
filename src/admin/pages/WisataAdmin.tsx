import { useEffect, useState } from 'react'
import { CrudTable } from '../components/CrudTable'
import Modal from '../components/Modal'
import { FormField, Input, Textarea, Select, FormActions, ImagePreview } from '../components/FormField'
import { wisataService } from '../../lib/db'
import toast from 'react-hot-toast'
import { Star } from 'lucide-react'

const empty = { id: 0, nama: '', kategori: 'Alam', foto: '', deskripsi: '', fasilitas: '', harga: '', jam_operasional: '', maps: '', rating: 4.5, pengunjung: '', published: true }

export default function WisataAdmin() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const isEdit = form.id !== 0

  const load = async () => { setLoading(true); setData(await wisataService.getAll() as any[]); setLoading(false) }
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(empty); setModal(true) }
  const openEdit = (row: any) => {
    setForm({ ...row, fasilitas: Array.isArray(row.fasilitas) ? row.fasilitas.join(', ') : row.fasilitas })
    setModal(true)
  }
  const closeModal = () => { setModal(false); setForm(empty) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...form, fasilitas: typeof form.fasilitas === 'string' ? form.fasilitas.split(',').map(s => s.trim()).filter(Boolean) : form.fasilitas }
      isEdit ? await wisataService.update(form.id, payload) : await wisataService.create(payload)
      toast.success(isEdit ? 'Wisata diperbarui!' : 'Wisata ditambahkan!')
      closeModal(); load()
    } catch (err: any) { toast.error(err.message) }
    setSaving(false)
  }

  const handleDelete = async (row: any) => { await wisataService.delete(row.id); toast.success('Dihapus'); load() }
  const f = (key: string) => (e: any) => setForm(p => ({ ...p, [key]: e.target.value }))

  return (
    <div>
      <CrudTable title="Manajemen Wisata" data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
        searchKeys={['nama', 'kategori']} addLabel="Tambah Wisata" emptyIcon="🏞️"
        columns={[
          { key: 'foto', label: 'Foto', render: row => row.foto ? <img src={row.foto} alt="" className="w-10 h-10 rounded-lg object-cover border-2 border-gray-200" /> : <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">🏞️</div> },
          { key: 'nama', label: 'Nama', render: row => <span className="font-semibold">{row.nama}</span> },
          { key: 'kategori', label: 'Kategori', render: row => <span className="text-xs bg-green-100 text-green-700 border border-green-300 px-2 py-0.5 rounded-full font-semibold">{row.kategori}</span> },
          { key: 'harga', label: 'Harga' },
          { key: 'rating', label: 'Rating', render: row => <span className="flex items-center gap-1 text-xs font-bold"><Star size={12} className="text-yellow-500 fill-yellow-500" /> {row.rating}</span> },
          { key: 'pengunjung', label: 'Pengunjung' },
        ]}
      />

      <Modal open={modal} onClose={closeModal} title={isEdit ? '✏️ Edit Wisata' : '➕ Tambah Wisata'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Nama Wisata" required><Input value={form.nama} onChange={f('nama')} required placeholder="Nama destinasi..." /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Kategori" required>
              <Select value={form.kategori} onChange={f('kategori')} options={['Alam', 'Budaya', 'Agrowisata', 'Buatan'].map(k => ({ value: k, label: k }))} />
            </FormField>
            <FormField label="Rating" required><Input type="number" step="0.1" min="1" max="5" value={form.rating} onChange={f('rating')} required /></FormField>
          </div>
          <FormField label="URL Foto"><Input value={form.foto} onChange={f('foto')} placeholder="https://..." /><ImagePreview src={form.foto} className="mt-2 h-24 w-full" /></FormField>
          <FormField label="Deskripsi" required><Textarea value={form.deskripsi} onChange={f('deskripsi')} rows={3} required /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Harga" required><Input value={form.harga} onChange={f('harga')} placeholder="Rp 10.000/orang" required /></FormField>
            <FormField label="Pengunjung/Bulan"><Input value={form.pengunjung} onChange={f('pengunjung')} placeholder="500+/bulan" /></FormField>
          </div>
          <FormField label="Jam Operasional" required><Input value={form.jam_operasional} onChange={f('jam_operasional')} placeholder="07.00 - 17.00 WIB" required /></FormField>
          <FormField label="Fasilitas" hint="Pisahkan dengan koma: Parkir, Toilet, Warung"><Input value={form.fasilitas as string} onChange={f('fasilitas')} placeholder="Parkir, Toilet, Warung, Guide" /></FormField>
          <FormField label="Link Google Maps"><Input value={form.maps} onChange={f('maps')} placeholder="https://maps.google.com/..." /></FormField>
          <FormActions onCancel={closeModal} loading={saving} submitLabel={isEdit ? 'Update' : 'Tambah'} />
        </form>
      </Modal>
    </div>
  )
}
