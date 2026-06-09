import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../../lib/db'
import toast from 'react-hot-toast'

interface AdminUser { email: string; role?: string }

interface AdminContextType {
  user: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AdminContext = createContext<AdminContextType>({} as AdminContextType)

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService.getSession().then(session => {
      if (session) {
        const stored = localStorage.getItem('admin_user')
        if (stored) setUser(JSON.parse(stored))
      }
      setLoading(false)
    })
  }, [])

  const login = async (email: string, password: string) => {
    const { user: u, error } = await authService.signIn(email, password)
    if (error || !u) {
      toast.error(error || 'Login gagal')
      return false
    }
    const adminUser = { email: (u as any).email || email, role: 'admin' }
    setUser(adminUser)
    localStorage.setItem('admin_user', JSON.stringify(adminUser))
    localStorage.setItem('admin_session', JSON.stringify({ user: adminUser }))
    toast.success('Login berhasil!')
    return true
  }

  const logout = async () => {
    await authService.signOut()
    setUser(null)
    localStorage.removeItem('admin_user')
    localStorage.removeItem('admin_session')
    toast.success('Berhasil logout')
  }

  return (
    <AdminContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
