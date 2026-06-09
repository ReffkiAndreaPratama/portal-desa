import { useEffect, useState } from 'react'
import { CrudTable } from '../components/CrudTable'
import Modal from '../components/Modal'
import { FormField, Input, Select, FormActions, ImagePreview } from '../components/FormField'
import { anggotaKKNService } from '../../lib/db'
import toast from 'react-hot-toast'

const posisiOpts = ['Ketua', 'Sekretaris', 'Bendahara', 'Anggota']
const empty = { id: 0, nama: '', prodi: '', fakultas: '', posisi: 'Anggota', foto: '', nim: '' }

export default function KKNAnggotaAdmin() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const isEdit = form.id !== 0

  const load = async () => { setLoading(true); setData(await anggotaKKNService.getAll() as any[]); setLoading(false) }
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(empty); setModal(true) }
  const openEdit = (row: any) => { setForm(row); setModal(true) }
  const closeModal = () => { setModal(false); setForm(empty) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      isEdit ? await anggotaKKNService.update(form.id, form) : await anggotaKKNService.create(form)
      toast.success(isEdit ? 'Data diperbarui!' : 'Anggota ditambahkan!')
      closeModal(); load()
    } catch (err: any) { toast.error(err.message) }
    setSaving(false)
  }

  const handleDelete = async (row: any) => { await anggotaKKNService.delete(row.id); toast.success('Dihapus'); load() }
  const f = (key: string) => (e: any) => setForm(p => ({ ...p, [key]: e.target.value }))

  return (
    <div>
      <CrudTable title="Anggota KKN Periode 108 Kelompok 146" data={data} loading={loading}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
        searchKeys={['nama', 'prodi', 'fakultas']} addLabel="Tambah Anggota" emptyIcon="🎓"
        columns={[
          { key: 'foto', label: 'Foto', render: row => <img src={row.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.nama)}&background=2E7D32&color=fff`} alt="" className="w-10 h-10 rounded-full border-2 border-[#2E7D32]" /> },
          { key: 'nama', label: 'Nama', render: row => <div><p className="font-bold text-sm">{row.nama}</p><p className="text-xs text-gray-400">{row.nim}</p></div> },
          { key: 'prodi', label: 'Prodi', render: row => <span className="text-xs">{row.prodi}</span> },
          { key: 'fakultas', label: 'Fakultas', render: row => <span className="text-xs">{row.fakultas}</span> },
          { key: 'posisi', label: 'Posisi', render: row => <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${row.posisi !== 'Anggota' ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-gray-100 text-gray-600 border-gray-300'}`}>{row.posisi}</span> },
        ]}
      />

      <Modal open={modal} onClose={closeModal} title={isEdit ? '✏️ Edit Anggota KKN' : '➕ Tambah Anggota KKN'}>
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Nama Lengkap" required><Input value={form.nama} onChange={f('nama')} required /></FormField>
          <FormField label="NIM" required><Input value={form.nim} onChange={f('nim')} required placeholder="G1A021..." /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Program Studi" required><Input value={form.prodi} onChange={f('prodi')} required /></FormField>
            <FormField label="Fakultas" required><Input value={form.fakultas} onChange={f('fakultas')} required /></FormField>
          </div>
          <FormField label="Posisi" required>
            <Select value={form.posisi} onChange={f('posisi')} options={posisiOpts.map(k => ({ value: k, label: k }))} />
          </FormField>
          <FormField label="URL Foto" hint="Kosongkan untuk generate otomatis">
            <Input value={form.foto} onChange={f('foto')} placeholder="https://..." />
            <ImagePreview src={form.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.nama)}&background=2E7D32&color=fff&size=200`} className="mt-2 w-20 h-20 rounded-full mx-auto" />
          </FormField>
          <FormActions onCancel={closeModal} loading={saving} submitLabel={isEdit ? 'Update' : 'Tambah'} />
        </form>
      </Modal>
    </div>
  )
}
