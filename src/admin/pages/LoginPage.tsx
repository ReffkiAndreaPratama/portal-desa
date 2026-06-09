import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import { Lock, Mail, Eye, EyeOff, Leaf } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAdmin()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const ok = await login(email, password)
    if (ok) navigate('/admin/dashboard')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <Leaf key={i} className="absolute text-[#2E7D32]" size={40}
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, transform: `rotate(${Math.random() * 360}deg)` }} />
        ))}
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-[#2E7D32] border-4 border-[#212121] rounded-2xl shadow-[6px_6px_0_#212121] flex items-center justify-center mb-4">
            <span className="text-white font-black text-3xl">T</span>
          </div>
          <h1 className="text-2xl font-black text-[#212121]">Portal Admin</h1>
          <p className="text-gray-500 font-medium">Desa Talang Marap</p>
        </div>

        {/* Card */}
        <div className="bg-white border-4 border-[#212121] rounded-3xl shadow-[8px_8px_0_#212121] p-8">
          <h2 className="text-xl font-black mb-6 text-center">Masuk ke Dashboard</h2>



          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold text-sm mb-1">Email Admin</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@desa.id"
                  required
                  className="w-full pl-9 pr-4 py-3 border-3 border-[#212121] rounded-xl font-medium outline-none focus:border-[#2E7D32] bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-sm mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-10 py-3 border-3 border-[#212121] rounded-xl font-medium outline-none focus:border-[#2E7D32] bg-white"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full brutal-btn bg-[#2E7D32] text-white py-3 rounded-xl font-black text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Memproses...' : '🔐 Masuk'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Portal Admin Desa Talang Marap<br/>
            KKN UNIB Periode 108 Kelompok 146
          </p>
        </div>
      </div>
    </div>
  )
}
