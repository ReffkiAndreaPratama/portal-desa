import { useEffect, useState } from 'react'
import { CrudTable } from '../components/CrudTable'
import Modal from '../components/Modal'
import { FormField, Input, Textarea, Select, FormActions, ImagePreview } from '../components/FormField'
import { umkmService } from '../../lib/db'
import toast from 'react-hot-toast'

const empty = { id: 0, nama: '', kategori: 'Makanan', foto: '', deskripsi: '', harga: '', kontak: '', pemilik: '', stok: 'Tersedia', lokasi: '', published: true }
const kategoris = ['Makanan', 'Minuman', 'Kerajinan', 'Kesehatan', 'Pertanian', 'Lainnya']
const stokOpts = ['Tersedia', 'Terbatas', 'Habis']

export default function UMKMAdmin() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const isEdit = form.id !== 0

  const load = async () => { setLoading(true); setData(await umkmService.getAll() as any[]); setLoading(false) }
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(empty); setModal(true) }
  const openEdit = (row: any) => { setForm(row); setModal(true) }
  const closeModal = () => { setModal(false); setForm(empty) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      isEdit ? await umkmService.update(form.id, form) : await umkmService.create(form)
      toast.success(isEdit ? 'UMKM diperbarui!' : 'UMKM ditambahkan!')
      closeModal(); load()
    } catch (err: any) { toast.error(err.message) }
    setSaving(false)
  }

  const handleDelete = async (row: any) => { await umkmService.delete(row.id); toast.success('Dihapus'); load() }
  const f = (key: string) => (e: any) => setForm(p => ({ ...p, [key]: e.target.value }))

  return (
    <div>
      <CrudTable title="Manajemen UMKM" data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
        searchKeys={['nama', 'pemilik', 'kategori']} addLabel="Tambah UMKM" emptyIcon="🛍️"
        columns={[
          { key: 'foto', label: 'Foto', render: row => row.foto ? <img src={row.foto} alt="" className="w-10 h-10 rounded-lg object-cover border-2 border-gray-200" /> : <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">🛍️</div> },
          { key: 'nama', label: 'Produk', render: row => <div><p className="font-semibold text-sm">{row.nama}</p><p className="text-gray-400 text-xs">{row.pemilik}</p></div> },
          { key: 'kategori', label: 'Kategori', render: row => <span className="text-xs bg-purple-100 text-purple-700 border border-purple-300 px-2 py-0.5 rounded-full font-semibold">{row.kategori}</span> },
          { key: 'harga', label: 'Harga', render: row => <span className="text-xs font-bold text-[#2E7D32]">{row.harga}</span> },
          { key: 'lokasi', label: 'Lokasi' },
          { key: 'stok', label: 'Stok', render: row => <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${row.stok === 'Tersedia' ? 'bg-green-100 text-green-700 border-green-300' : row.stok === 'Terbatas' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'bg-red-100 text-red-700 border-red-300'}`}>{row.stok}</span> },
        ]}
      />

      <Modal open={modal} onClose={closeModal} title={isEdit ? '✏️ Edit UMKM' : '➕ Tambah UMKM'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Nama Produk" required><Input value={form.nama} onChange={f('nama')} required placeholder="Nama produk..." /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Kategori" required><Select value={form.kategori} onChange={f('kategori')} options={kategoris.map(k => ({ value: k, label: k }))} /></FormField>
            <FormField label="Stok"><Select value={form.stok} onChange={f('stok')} options={stokOpts.map(k => ({ value: k, label: k }))} /></FormField>
          </div>
          <FormField label="URL Foto"><Input value={form.foto} onChange={f('foto')} placeholder="https://..." /><ImagePreview src={form.foto} className="mt-2 h-24 w-full" /></FormField>
          <FormField label="Deskripsi" required><Textarea value={form.deskripsi} onChange={f('deskripsi')} rows={3} required /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Harga" required><Input value={form.harga} onChange={f('harga')} placeholder="Rp 50.000 - Rp 150.000" required /></FormField>
            <FormField label="Nomor WA Penjual" required><Input value={form.kontak} onChange={f('kontak')} placeholder="6281234567890" required /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Nama Pemilik" required><Input value={form.pemilik} onChange={f('pemilik')} required /></FormField>
            <FormField label="Lokasi (Dusun)" required><Input value={form.lokasi} onChange={f('lokasi')} placeholder="Dusun I" required /></FormField>
          </div>
          <FormActions onCancel={closeModal} loading={saving} submitLabel={isEdit ? 'Update' : 'Tambah'} />
        </form>
      </Modal>
    </div>
  )
}
