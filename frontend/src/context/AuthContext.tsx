import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authApi } from '../api/client'
import type { AuthUser } from '../types'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ep_token'))
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem('ep_token'))

  useEffect(() => {
    if (!token) { setIsLoading(false); return }
    authApi.me()
      .then(({ user }) => setUser(user))
      .catch(() => { localStorage.removeItem('ep_token'); setToken(null) })
      .finally(() => setIsLoading(false))
  }, [token])

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password)
    localStorage.setItem('ep_token', res.token)
    setToken(res.token)
    setUser(res.user)
  }

  const register = async (email: string, password: string) => {
    const res = await authApi.register(email, password)
    localStorage.setItem('ep_token', res.token)
    setToken(res.token)
    setUser(res.user)
  }

  const logout = () => {
    localStorage.removeItem('ep_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
