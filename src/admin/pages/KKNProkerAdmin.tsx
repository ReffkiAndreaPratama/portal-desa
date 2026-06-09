import { useEffect, useState } from 'react'
import { CrudTable } from '../components/CrudTable'
import Modal from '../components/Modal'
import { FormField, Input, Textarea, Select, FormActions } from '../components/FormField'
import { prokerService } from '../../lib/db'
import toast from 'react-hot-toast'

const statusOpts = [
  { value: 'planned', label: '📋 Direncanakan' },
  { value: 'ongoing', label: '⏳ Sedang Berjalan' },
  { value: 'completed', label: '✅ Selesai' },
]
const empty = { id: 0, nama: '', kategori: 'Digitalisasi', deskripsi: '', status: 'planned', progress: 0, target: '', output: '', tanggal_mulai: '', tanggal_selesai: '', pic: '', icon: '📋' }
const icons = ['💻', '♻️', '📱', '🌱', '📚', '🏥', '🎓', '🛍️', '🗺️', '📋']

export default function KKNProkerAdmin() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const isEdit = form.id !== 0

  const load = async () => { setLoading(true); setData(await prokerService.getAll() as any[]); setLoading(false) }
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(empty); setModal(true) }
  const openEdit = (row: any) => { setForm(row); setModal(true) }
  const closeModal = () => { setModal(false); setForm(empty) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      isEdit ? await prokerService.update(form.id, form) : await prokerService.create(form)
      toast.success(isEdit ? 'Program diperbarui!' : 'Program ditambahkan!')
      closeModal(); load()
    } catch (err: any) { toast.error(err.message) }
    setSaving(false)
  }

  const handleDelete = async (row: any) => { await prokerService.delete(row.id); toast.success('Dihapus'); load() }
  const f = (key: string) => (e: any) => setForm(p => ({ ...p, [key]: e.target.value }))

  return (
    <div>
      <CrudTable title="Program Kerja KKN" data={data} loading={loading}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
        searchKeys={['nama', 'kategori', 'pic']} addLabel="Tambah Program" emptyIcon="📋"
        columns={[
          { key: 'icon', label: '', width: '40px', render: row => <span className="text-2xl">{row.icon}</span> },
          { key: 'nama', label: 'Program', render: row => <span className="font-bold text-sm">{row.nama}</span> },
          { key: 'kategori', label: 'Kategori', render: row => <span className="text-xs bg-[#E8F5E9] text-[#2E7D32] border border-[#66BB6A] px-2 py-0.5 rounded-full font-semibold">{row.kategori}</span> },
          { key: 'status', label: 'Status', render: row => {
            const cfg: Record<string, string> = { completed: 'bg-green-100 text-green-700 border-green-300', ongoing: 'bg-blue-100 text-blue-700 border-blue-300', planned: 'bg-yellow-100 text-yellow-700 border-yellow-300' }
            return <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cfg[row.status] || ''}`}>{row.status}</span>
          }},
          { key: 'progress', label: 'Progress', render: row => (
            <div className="w-24">
              <div className="flex justify-between text-xs font-bold mb-1"><span>{row.progress}%</span></div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-[#2E7D32] rounded-full" style={{ width: `${row.progress}%` }} /></div>
            </div>
          )},
          { key: 'pic', label: 'PIC' },
        ]}
      />

      <Modal open={modal} onClose={closeModal} title={isEdit ? '✏️ Edit Program Kerja' : '➕ Tambah Program Kerja'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex gap-3">
            <div>
              <label className="block font-bold text-sm mb-1">Ikon</label>
              <div className="flex flex-wrap gap-1">
                {icons.map(ic => (
                  <button key={ic} type="button" onClick={() => setForm(p => ({ ...p, icon: ic }))}
                    className={`w-9 h-9 rounded-lg border-2 text-xl transition-all ${form.icon === ic ? 'border-[#2E7D32] bg-[#E8F5E9]' : 'border-gray-200 hover:border-gray-400'}`}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <FormField label="Nama Program" required><Input value={form.nama} onChange={f('nama')} required /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Kategori" required><Input value={form.kategori} onChange={f('kategori')} required placeholder="Digitalisasi, Kesehatan, dll" /></FormField>
            <FormField label="Status" required><Select value={form.status} onChange={f('status')} options={statusOpts} /></FormField>
          </div>
          <FormField label="Deskripsi" required><Textarea value={form.deskripsi} onChange={f('deskripsi')} rows={3} required /></FormField>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Progress (%)"><Input type="number" min="0" max="100" value={form.progress} onChange={f('progress')} /></FormField>
            <FormField label="Tgl Mulai"><Input type="date" value={form.tanggal_mulai} onChange={f('tanggal_mulai')} /></FormField>
            <FormField label="Tgl Selesai"><Input type="date" value={form.tanggal_selesai} onChange={f('tanggal_selesai')} /></FormField>
          </div>
          <FormField label="Target"><Input value={form.target} onChange={f('target')} placeholder="50 warga terlatih..." /></FormField>
          <FormField label="Output"><Input value={form.output} onChange={f('output')} placeholder="Modul + sertifikat..." /></FormField>
          <FormField label="PIC (Penanggung Jawab)" required><Input value={form.pic} onChange={f('pic')} required /></FormField>
          <FormActions onCancel={closeModal} loading={saving} submitLabel={isEdit ? 'Update' : 'Tambah'} />
        </form>
      </Modal>
    </div>
  )
}
