import { useEffect, useState } from 'react'
import { CrudTable } from '../components/CrudTable'
import Modal from '../components/Modal'
import { FormField, Input, FormActions } from '../components/FormField'
import { statistikService } from '../../lib/db'
import toast from 'react-hot-toast'

const empty = { id: 0, tahun: new Date().getFullYear(), penduduk: 0, kk: 0, laki_laki: 0, perempuan: 0, umkm: 0 }

export default function StatistikAdmin() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const isEdit = form.id !== 0

  const load = async () => { setLoading(true); setData(await statistikService.getAll() as any[]); setLoading(false) }
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(empty); setModal(true) }
  const openEdit = (row: any) => { setForm(row); setModal(true) }
  const closeModal = () => { setModal(false); setForm(empty) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      isEdit ? await statistikService.update(form.id, form) : await statistikService.create(form)
      toast.success('Data statistik disimpan!')
      closeModal(); load()
    } catch (err: any) { toast.error(err.message) }
    setSaving(false)
  }

  const handleDelete = async (row: any) => { await statistikService.delete(row.id); toast.success('Dihapus'); load() }
  const f = (key: string) => (e: any) => setForm(p => ({ ...p, [key]: Number(e.target.value) }))

  return (
    <div>
      <div className="mb-4 p-3 bg-blue-50 border-2 border-blue-300 rounded-xl text-xs font-medium text-blue-800">
        ℹ️ Data statistik tahunan ini digunakan untuk grafik tren di halaman Data/Dashboard publik.
      </div>
      <CrudTable title="Data Statistik Tahunan" data={data} loading={loading}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
        emptyIcon="📊"
        columns={[
          { key: 'tahun', label: 'Tahun', render: row => <span className="font-black text-[#2E7D32] text-lg">{row.tahun}</span> },
          { key: 'penduduk', label: 'Penduduk', render: row => <span className="font-bold">{row.penduduk?.toLocaleString()}</span> },
          { key: 'kk', label: 'KK', render: row => <span className="font-bold">{row.kk?.toLocaleString()}</span> },
          { key: 'laki_laki', label: 'Laki-laki', render: row => <span>{row.laki_laki?.toLocaleString()}</span> },
          { key: 'perempuan', label: 'Perempuan', render: row => <span>{row.perempuan?.toLocaleString()}</span> },
          { key: 'umkm', label: 'UMKM', render: row => <span className="font-bold">{row.umkm}</span> },
        ]}
      />

      <Modal open={modal} onClose={closeModal} title={isEdit ? `✏️ Edit Data ${form.tahun}` : '➕ Tambah Data Tahunan'}>
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Tahun" required><Input type="number" value={form.tahun} onChange={f('tahun')} min="2000" max="2100" required /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Total Penduduk" required><Input type="number" value={form.penduduk} onChange={f('penduduk')} min="0" required /></FormField>
            <FormField label="Jumlah KK" required><Input type="number" value={form.kk} onChange={f('kk')} min="0" required /></FormField>
            <FormField label="Laki-laki" required><Input type="number" value={form.laki_laki} onChange={f('laki_laki')} min="0" required /></FormField>
            <FormField label="Perempuan" required><Input type="number" value={form.perempuan} onChange={f('perempuan')} min="0" required /></FormField>
            <FormField label="Jumlah UMKM"><Input type="number" value={form.umkm} onChange={f('umkm')} min="0" /></FormField>
          </div>
          <FormActions onCancel={closeModal} loading={saving} submitLabel={isEdit ? 'Update' : 'Tambah'} />
        </form>
      </Modal>
    </div>
  )
}
