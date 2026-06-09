import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  required?: boolean
  children: ReactNode
  hint?: string
}

export function FormField({ label, required, children, hint }: FieldProps) {
  return (
    <div>
      <label className="block font-bold text-sm mb-1 text-[#212121]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

const inputCls = 'w-full px-3 py-2.5 border-2 border-[#212121] rounded-xl font-medium text-sm outline-none focus:border-[#2E7D32] bg-white transition-colors'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number
}
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
}

export function Input(props: InputProps) {
  return <input {...props} className={`${inputCls} ${props.className || ''}`} />
}

export function Textarea({ rows = 3, ...props }: TextAreaProps) {
  return <textarea {...props} rows={rows} className={`${inputCls} resize-none ${props.className || ''}`} />
}

export function Select({ options, ...props }: SelectProps) {
  return (
    <select {...props} className={`${inputCls} ${props.className || ''}`}>
      <option value="">-- Pilih --</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

export function FormActions({ onCancel, loading, submitLabel = 'Simpan' }: {
  onCancel: () => void
  loading?: boolean
  submitLabel?: string
}) {
  return (
    <div className="flex gap-3 pt-2">
      <button type="button" onClick={onCancel}
        className="flex-1 py-2.5 border-2 border-[#212121] rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
        Batal
      </button>
      <button type="submit" disabled={loading}
        className="flex-1 py-2.5 bg-[#2E7D32] text-white border-2 border-[#212121] rounded-xl font-bold text-sm shadow-[3px_3px_0_#212121] hover:shadow-[5px_5px_0_#212121] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-60">
        {loading ? '⏳ Menyimpan...' : `💾 ${submitLabel}`}
      </button>
    </div>
  )
}

export function ImagePreview({ src, className = '' }: { src: string; className?: string }) {
  if (!src) return null
  return (
    <img src={src} alt="Preview"
      className={`rounded-xl border-2 border-gray-200 object-cover ${className}`}
      onError={e => (e.currentTarget.style.display = 'none')} />
  )
}
