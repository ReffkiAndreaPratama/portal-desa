import { useEffect, useState } from 'react'
import { CrudTable } from '../components/CrudTable'
import Modal from '../components/Modal'
import { FormField, Input, FormActions, ImagePreview } from '../components/FormField'
import { perangkatService } from '../../lib/db'
import toast from 'react-hot-toast'

const empty = { id: 0, jabatan: '', nama: '', foto: '', kontak: '', urutan: 1 }

export default function PerangkatAdmin() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const isEdit = form.id !== 0

  const load = async () => { setLoading(true); setData(await perangkatService.getAll() as any[]); setLoading(false) }
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm({ ...empty, urutan: data.length + 1 }); setModal(true) }
  const openEdit = (row: any) => { setForm(row); setModal(true) }
  const closeModal = () => { setModal(false); setForm(empty) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      isEdit ? await perangkatService.update(form.id, form) : await perangkatService.create(form)
      toast.success(isEdit ? 'Data diperbarui!' : 'Perangkat ditambahkan!')
      closeModal(); load()
    } catch (err: any) { toast.error(err.message) }
    setSaving(false)
  }

  const handleDelete = async (row: any) => { await perangkatService.delete(row.id); toast.success('Dihapus'); load() }
  const f = (key: string) => (e: any) => setForm(p => ({ ...p, [key]: e.target.value }))

  return (
    <div>
      <CrudTable title="Perangkat Desa" data={data} loading={loading} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
        searchKeys={['nama', 'jabatan']} addLabel="Tambah Perangkat" emptyIcon="👤"
        columns={[
          { key: 'foto', label: 'Foto', render: row => <img src={row.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.nama)}&background=2E7D32&color=fff`} alt="" className="w-10 h-10 rounded-full border-2 border-[#2E7D32]" /> },
          { key: 'nama', label: 'Nama', render: row => <span className="font-bold">{row.nama}</span> },
          { key: 'jabatan', label: 'Jabatan', render: row => <span className="text-xs font-semibold text-[#2E7D32]">{row.jabatan}</span> },
          { key: 'kontak', label: 'Kontak' },
          { key: 'urutan', label: 'Urutan', render: row => <span className="font-bold text-gray-500">#{row.urutan}</span> },
        ]}
      />

      <Modal open={modal} onClose={closeModal} title={isEdit ? '✏️ Edit Perangkat' : '➕ Tambah Perangkat'}>
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Jabatan" required><Input value={form.jabatan} onChange={f('jabatan')} required placeholder="Kepala Desa / Sekretaris / dst..." /></FormField>
          <FormField label="Nama Lengkap" required><Input value={form.nama} onChange={f('nama')} required /></FormField>
          <FormField label="Nomor HP / WhatsApp" required><Input value={form.kontak} onChange={f('kontak')} required placeholder="081234567890" /></FormField>
          <FormField label="URL Foto" hint="Kosongkan untuk generate otomatis dari nama">
            <Input value={form.foto} onChange={f('foto')} placeholder="https://..." />
            <ImagePreview src={form.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.nama)}&background=2E7D32&color=fff&size=200`} className="mt-2 w-20 h-20 rounded-full mx-auto" />
          </FormField>
          <FormField label="Urutan Tampil"><Input type="number" value={form.urutan} onChange={f('urutan')} min="1" /></FormField>
          <FormActions onCancel={closeModal} loading={saving} submitLabel={isEdit ? 'Update' : 'Tambah'} />
        </form>
      </Modal>
    </div>
  )
}
