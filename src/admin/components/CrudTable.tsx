import { useState, type ReactNode } from 'react'
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

export interface Column<T> {
  key: keyof T | string
  label: string
  render?: (row: T) => ReactNode
  width?: string
}

interface Props<T> {
  title: string
  data: T[]
  columns: Column<T>[]
  onAdd?: () => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  loading?: boolean
  searchKeys?: (keyof T)[]
  addLabel?: string
  emptyIcon?: string
}

export function CrudTable<T extends { id: number | string }>({
  title, data, columns, onAdd, onEdit, onDelete,
  loading, searchKeys, addLabel = 'Tambah Baru', emptyIcon = '📋'
}: Props<T>) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null)
  const PER_PAGE = 10

  const filtered = search && searchKeys
    ? data.filter(row =>
        searchKeys.some(key =>
          String((row as any)[key]).toLowerCase().includes(search.toLowerCase())
        )
      )
    : data

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const confirmDelete = (row: T) => setDeleteTarget(row)
  const handleDelete = () => {
    if (deleteTarget) { onDelete?.(deleteTarget); setDeleteTarget(null) }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <h2 className="font-black text-xl text-[#212121]">{title}</h2>
          <span className="bg-[#E8F5E9] text-[#2E7D32] border-2 border-[#2E7D32] px-2 py-0.5 rounded-full text-xs font-black">{data.length}</span>
        </div>
        <div className="flex gap-2">
          {searchKeys && (
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder="Cari..."
                className="pl-8 pr-3 py-2 border-2 border-[#212121] rounded-xl text-sm font-medium outline-none focus:border-[#2E7D32] w-48"
              />
            </div>
          )}
          {onAdd && (
            <button onClick={onAdd}
              className="flex items-center gap-1.5 bg-[#2E7D32] text-white px-4 py-2 rounded-xl font-bold text-sm border-2 border-[#212121] shadow-[3px_3px_0_#212121] hover:shadow-[5px_5px_0_#212121] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
              <Plus size={15} /> {addLabel}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border-4 border-[#212121] rounded-2xl shadow-[4px_4px_0_#212121] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-gray-500 text-sm font-medium">Memuat data...</p>
          </div>
        ) : paged.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <div className="text-5xl mb-2">{emptyIcon}</div>
            <p className="font-bold">{search ? 'Tidak ditemukan' : 'Belum ada data'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#2E7D32] text-white">
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider w-10">#</th>
                  {columns.map(col => (
                    <th key={String(col.key)} className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider"
                      style={{ width: col.width }}>
                      {col.label}
                    </th>
                  ))}
                  {(onEdit || onDelete) && (
                    <th className="px-4 py-3 text-center text-xs font-black uppercase tracking-wider w-24">Aksi</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paged.map((row, i) => (
                  <tr key={row.id} className="hover:bg-[#F1F8E9] transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-400 font-bold">{(page - 1) * PER_PAGE + i + 1}</td>
                    {columns.map(col => (
                      <td key={String(col.key)} className="px-4 py-3 text-sm">
                        {col.render ? col.render(row) : String((row as any)[col.key] ?? '-')}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {onEdit && (
                            <button onClick={() => onEdit(row)}
                              className="w-7 h-7 bg-blue-100 text-blue-600 border-2 border-blue-300 rounded-lg flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all">
                              <Edit2 size={12} />
                            </button>
                          )}
                          {onDelete && (
                            <button onClick={() => confirmDelete(row)}
                              className="w-7 h-7 bg-red-100 text-red-600 border-2 border-red-300 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t-2 border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-medium">
              {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} dari {filtered.length}
            </p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="w-7 h-7 rounded-lg border-2 border-gray-300 flex items-center justify-center disabled:opacity-40 hover:border-[#2E7D32] hover:text-[#2E7D32] transition-all">
                <ChevronLeft size={12} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg border-2 text-xs font-black transition-all ${
                    p === page ? 'bg-[#2E7D32] text-white border-[#2E7D32]' : 'border-gray-300 hover:border-[#2E7D32]'
                  }`}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-7 h-7 rounded-lg border-2 border-gray-300 flex items-center justify-center disabled:opacity-40 hover:border-[#2E7D32] hover:text-[#2E7D32] transition-all">
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white border-4 border-[#212121] rounded-2xl shadow-[8px_8px_0_#212121] p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">⚠️</div>
              <h3 className="font-black text-lg">Hapus Data?</h3>
              <p className="text-gray-500 text-sm mt-1">Data yang dihapus tidak bisa dikembalikan.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 border-3 border-[#212121] rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                Batal
              </button>
              <button onClick={handleDelete}
                className="flex-1 py-2.5 bg-red-500 text-white border-3 border-red-700 rounded-xl font-bold text-sm shadow-[3px_3px_0_#991b1b] hover:shadow-[5px_5px_0_#991b1b] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
