import { useEffect, useState } from 'react'
import { CrudTable } from '../components/CrudTable'
import Modal from '../components/Modal'
import { FormField, Input, FormActions } from '../components/FormField'
import { dataSampahService } from '../../lib/db'
import toast from 'react-hot-toast'

const empty = { id: 0, bulan: '', total: 0, organik: 0, anorganik: 0, b3: 0 }

export default function DataSampahAdmin() {
  const [data, setData]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]   = useState(false)
  const [form, setForm]     = useState(empty)
  const [saving, setSaving] = useState(false)
  const isEdit = form.id !== 0

  const load = async () => {
    setLoading(true)
    setData(await dataSampahService.getAll() as any[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openAdd  = () => { setForm({ ...empty, bulan: new Date().toISOString().slice(0, 7) }); setModal(true) }
  const openEdit = (row: any) => { setForm(row); setModal(true) }
  const closeModal = () => { setModal(false); setForm(empty) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      isEdit
        ? await dataSampahService.update(form.id, form)
        : await dataSampahService.create(form)
      toast.success(isEdit ? 'Data diperbarui!' : 'Data ditambahkan!')
      closeModal(); load()
    } catch (err: any) { toast.error(err.message) }
    setSaving(false)
  }

  const handleDelete = async (row: any) => {
    await dataSampahService.delete(row.id)
    toast.success('Data dihapus')
    load()
  }

  const f = (key: string) => (e: any) => setForm(p => ({ ...p, [key]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }))

  return (
    <div>
      <div className="mb-4 p-3 bg-green-50 border-2 border-[#2E7D32] rounded-xl text-xs font-medium text-[#2E7D32]">
        ♻️ Data ini ditampilkan di halaman <strong>SiTARA Dashboard</strong> sebagai statistik sampah bulanan desa.
        Data terbaru (bulan terkini) yang akan ditampilkan.
      </div>

      <CrudTable
        title="Data Sampah Bulanan"
        data={data}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        addLabel="Input Data Bulan Ini"
        emptyIcon="♻️"
        columns={[
          { key: 'bulan', label: 'Bulan', render: row => <span className="font-black text-[#2E7D32]">{row.bulan}</span> },
          { key: 'total', label: 'Total (kg)', render: row => <span className="font-bold">{(row.total || 0).toLocaleString()} kg</span> },
          { key: 'organik', label: 'Organik (kg)', render: row => <span className="text-green-700 font-semibold">{(row.organik || 0).toLocaleString()} kg</span> },
          { key: 'anorganik', label: 'Anorganik (kg)', render: row => <span className="text-blue-700 font-semibold">{(row.anorganik || 0).toLocaleString()} kg</span> },
          { key: 'b3', label: 'B3 (kg)', render: row => <span className="text-red-600 font-semibold">{(row.b3 || 0).toLocaleString()} kg</span> },
          {
            key: 'organik', label: '% Organik',
            render: row => {
              const pct = row.total ? Math.round((row.organik / row.total) * 100) : 0
              return (
                <div className="w-20">
                  <div className="flex justify-between text-xs font-bold mb-0.5"><span>{pct}%</span></div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#2E7D32] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            }
          },
        ]}
      />

      <Modal open={modal} onClose={closeModal} title={isEdit ? '✏️ Edit Data Sampah' : '➕ Input Data Sampah Bulanan'}>
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Bulan" required hint="Format: YYYY-MM (contoh: 2025-06)">
            <Input type="month" value={form.bulan} onChange={f('bulan')} required />
          </FormField>
          <div className="p-3 bg-[#F1F8E9] border-2 border-[#2E7D32] rounded-xl text-xs text-gray-600">
            💡 Masukkan berat sampah dalam satuan <strong>kilogram (kg)</strong>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Total Sampah (kg)" required>
              <Input type="number" min="0" value={form.total} onChange={f('total')} required />
            </FormField>
            <FormField label="Organik (kg)" required>
              <Input type="number" min="0" value={form.organik} onChange={f('organik')} required />
            </FormField>
            <FormField label="Anorganik (kg)" required>
              <Input type="number" min="0" value={form.anorganik} onChange={f('anorganik')} required />
            </FormField>
            <FormField label="B3 - Bahan Berbahaya (kg)" required>
              <Input type="number" min="0" value={form.b3} onChange={f('b3')} required />
            </FormField>
          </div>
          {/* Auto validasi */}
          {form.total > 0 && (form.organik + form.anorganik + form.b3) !== form.total && (
            <div className="p-2 bg-yellow-50 border border-yellow-400 rounded-lg text-xs text-yellow-700 font-medium">
              ⚠️ Organik + Anorganik + B3 = {form.organik + form.anorganik + form.b3} kg,
              tidak sama dengan Total ({form.total} kg). Pastikan datanya benar.
            </div>
          )}
          <FormActions onCancel={closeModal} loading={saving} submitLabel={isEdit ? 'Update' : 'Simpan Data'} />
        </form>
      </Modal>
    </div>
  )
}
