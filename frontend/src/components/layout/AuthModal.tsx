import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

interface Props {
  onClose: () => void
}

export function AuthModal({ onClose }: Props) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') await login(email, password)
      else await register(email, password)
      onClose()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-bg-secondary border border-border-default rounded w-full max-w-sm p-6 font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-accent-amber text-sm uppercase tracking-wider">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <button onClick={onClose} className="text-text-dim hover:text-text-secondary text-lg leading-none">×</button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-text-dim text-[10px] uppercase block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-bg-primary border border-border-default text-text-primary text-xs px-3 py-2 rounded focus:outline-none focus:border-accent-amber"
            />
          </div>
          <div>
            <label className="text-text-dim text-[10px] uppercase block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-bg-primary border border-border-default text-text-primary text-xs px-3 py-2 rounded focus:outline-none focus:border-accent-amber"
            />
          </div>

          {error && <p className="text-accent-red text-[10px]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-amber text-bg-primary text-xs font-bold py-2 rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-text-dim text-[10px] mt-4 text-center">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            className="text-accent-cyan hover:underline"
          >
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
