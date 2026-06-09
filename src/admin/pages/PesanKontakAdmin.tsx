import { useEffect, useState } from 'react'
import { CrudTable } from '../components/CrudTable'
import Modal from '../components/Modal'
import { pesanKontakService } from '../../lib/db'
import toast from 'react-hot-toast'
import { Mail, Trash2 } from 'lucide-react'

export default function PesanKontakAdmin() {
  const [data, setData]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)

  const load = async () => {
    setLoading(true)
    setData(await pesanKontakService.getAll() as any[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const handleRead = async (row: any) => {
    setSelected(row)
    if (!row.sudah_dibaca) {
      await pesanKontakService.markRead(row.id)
      load()
    }
  }

  const handleDelete = async (row: any) => {
    await pesanKontakService.delete(row.id)
    toast.success('Pesan dihapus')
    load()
  }

  const belumDibaca = data.filter(d => !d.sudah_dibaca).length

  return (
    <div>
      {belumDibaca > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border-2 border-blue-400 rounded-xl flex items-center gap-2 text-sm font-medium text-blue-800">
          <Mail size={16} /> Ada <strong>{belumDibaca}</strong> pesan baru yang belum dibaca
        </div>
      )}

      <CrudTable
        title="Pesan Masuk (Kontak)"
        data={data}
        loading={loading}
        onEdit={handleRead}
        onDelete={handleDelete}
        searchKeys={['nama', 'email', 'subjek']}
        emptyIcon="✉️"
        columns={[
          {
            key: 'sudah_dibaca', label: '', width: '30px',
            render: row => (
              <div className={`w-2 h-2 rounded-full ${!row.sudah_dibaca ? 'bg-blue-500' : 'bg-gray-300'}`} title={row.sudah_dibaca ? 'Sudah dibaca' : 'Belum dibaca'} />
            )
          },
          { key: 'nama',    label: 'Nama',   render: row => <span className={`font-${row.sudah_dibaca ? 'medium' : 'black'} text-sm`}>{row.nama}</span> },
          { key: 'email',   label: 'Email',  render: row => <a href={`mailto:${row.email}`} className="text-xs text-[#2E7D32] hover:underline">{row.email}</a> },
          { key: 'subjek',  label: 'Subjek', render: row => <span className="text-sm">{row.subjek}</span> },
          { key: 'pesan',   label: 'Pesan',  render: row => <p className="text-xs text-gray-500 max-w-xs truncate">{row.pesan}</p> },
          {
            key: 'created_at', label: 'Waktu',
            render: row => <span className="text-xs text-gray-400">{row.created_at ? new Date(row.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '-'}</span>
          },
          {
            key: 'sudah_dibaca', label: 'Status',
            render: row => (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${row.sudah_dibaca ? 'bg-gray-100 text-gray-500 border-gray-300' : 'bg-blue-100 text-blue-700 border-blue-300'}`}>
                {row.sudah_dibaca ? 'Dibaca' : '🔵 Baru'}
              </span>
            )
          },
        ]}
      />

      {/* Detail Modal */}
      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title="✉️ Detail Pesan">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Nama', value: selected.nama },
                { label: 'Email', value: selected.email },
                { label: 'Subjek', value: selected.subjek },
                { label: 'Waktu', value: selected.created_at ? new Date(selected.created_at).toLocaleString('id-ID') : '-' },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-xs text-gray-400 font-medium">{f.label}</p>
                  <p className="font-bold text-sm">{f.value}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">Pesan</p>
              <div className="p-4 bg-[#F1F8E9] border-2 border-[#2E7D32] rounded-xl text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selected.pesan}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subjek}`}
                className="flex-1 py-2.5 bg-[#2E7D32] text-white border-2 border-[#212121] rounded-xl font-bold text-sm text-center shadow-[3px_3px_0_#212121] hover:shadow-[5px_5px_0_#212121] transition-all">
                📧 Balas via Email
              </a>
              <button onClick={() => { setSelected(null); handleDelete(selected) }}
                className="px-4 py-2.5 bg-red-100 text-red-600 border-2 border-red-300 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
