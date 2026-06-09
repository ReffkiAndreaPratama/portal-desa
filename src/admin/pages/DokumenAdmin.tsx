import { useEffect, useState } from 'react'
import { CrudTable } from '../components/CrudTable'
import Modal from '../components/Modal'
import { FormField, Input, Select, FormActions } from '../components/FormField'
import { dokumenService } from '../../lib/db'
import toast from 'react-hot-toast'

const kategoris = ['Perencanaan', 'Keuangan', 'Profil', 'Peraturan', 'Laporan', 'Data', 'Lainnya']
const empty = { id: 0, nama: '', kategori: 'Laporan', tanggal: '', ukuran: '', tipe: 'PDF', url: '' }

export default function DokumenAdmin() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const isEdit = form.id !== 0

  const load = async () => { setLoading(true); setData(await dokumenService.getAll() as any[]); setLoading(false) }
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm({ ...empty, tanggal: new Date().toISOString().slice(0, 10) }); setModal(true) }
  const openEdit = (row: any) => { setForm(row); setModal(true) }
  const closeModal = () => { setModal(false); setForm(empty) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      isEdit ? await dokumenService.update(form.id, form) : await dokumenService.create(form)
      toast.success(isEdit ? 'Dokumen diperbarui!' : 'Dokumen ditambahkan!')
      closeModal(); load()
    } catch (err: any) { toast.error(err.message) }
    setSaving(false)
  }

  const handleDelete = async (row: any) => { await dokumenService.delete(row.id); toast.success('Dihapus'); load() }
  const f = (key: string) => (e: any) => setForm(p => ({ ...p, [key]: e.target.value }))

  return (
    <div>
      <CrudTable title="Arsip Dokumen Desa" data={data} loading={loading}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
        searchKeys={['nama', 'kategori']} addLabel="Upload Dokumen" emptyIcon="📄"
        columns={[
          { key: 'tipe', label: '', width: '50px', render: row => <div className="w-9 h-9 bg-red-100 border-2 border-red-300 rounded-lg flex items-center justify-center text-xs font-black text-red-600">{row.tipe}</div> },
          { key: 'nama', label: 'Nama Dokumen', render: row => <span className="font-semibold text-sm">{row.nama}</span> },
          { key: 'kategori', label: 'Kategori', render: row => <span className="text-xs bg-[#E8F5E9] text-[#2E7D32] border border-[#66BB6A] px-2 py-0.5 rounded-full font-semibold">{row.kategori}</span> },
          { key: 'tanggal', label: 'Tanggal', render: row => <span className="text-xs text-gray-500">{row.tanggal}</span> },
          { key: 'ukuran', label: 'Ukuran' },
          { key: 'url', label: 'Link', render: row => row.url ? <a href={row.url} target="_blank" rel="noreferrer" className="text-xs text-[#2E7D32] underline font-semibold">Buka</a> : <span className="text-xs text-gray-400">-</span> },
        ]}
      />

      <Modal open={modal} onClose={closeModal} title={isEdit ? '✏️ Edit Dokumen' : '➕ Upload Dokumen'}>
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Nama Dokumen" required><Input value={form.nama} onChange={f('nama')} required placeholder="RPJMDes 2025-2031..." /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Kategori" required><Select value={form.kategori} onChange={f('kategori')} options={kategoris.map(k => ({ value: k, label: k }))} /></FormField>
            <FormField label="Tipe File"><Select value={form.tipe} onChange={f('tipe')} options={['PDF', 'DOCX', 'XLSX', 'ZIP'].map(k => ({ value: k, label: k }))} /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Tanggal" required><Input type="date" value={form.tanggal} onChange={f('tanggal')} required /></FormField>
            <FormField label="Ukuran File"><Input value={form.ukuran} onChange={f('ukuran')} placeholder="2.4 MB" /></FormField>
          </div>
          <FormField label="URL Download" hint="Link Google Drive, atau Supabase Storage">
            <Input value={form.url} onChange={f('url')} placeholder="https://drive.google.com/..." />
          </FormField>
          <FormActions onCancel={closeModal} loading={saving} submitLabel={isEdit ? 'Update' : 'Tambah'} />
        </form>
      </Modal>
    </div>
  )
}
