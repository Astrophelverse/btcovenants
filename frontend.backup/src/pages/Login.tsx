import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bitcoin, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../store/auth'
import api from '../lib/api'
import { toast } from 'sonner'

export default function Login() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      setAuth(data.token, data.user)
      toast.success('Welcome back')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="noise min-h-screen flex items-center justify-center px-4 relative" style={{ background: 'oklch(0.04 0.005 260)' }}>
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, oklch(0.75 0.18 145 / 0.05), transparent)' }} />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'oklch(0.75 0.18 145 / 0.15)', border: '1px solid oklch(0.75 0.18 145 / 0.3)' }}>
            <Bitcoin size={18} style={{ color: 'oklch(0.75 0.18 145)' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'oklch(0.95 0.01 260)', letterSpacing: '0.12em' }}>
            BTCOVENANTS
          </span>
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'oklch(0.07 0.008 260)', border: '1px solid oklch(0.14 0.01 260)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.25rem', color: 'oklch(0.95 0.01 260)', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            SIGN IN
          </h1>
          <p style={{ color: 'oklch(0.45 0.01 260)', fontSize: '0.85rem', marginBottom: '2rem' }}>
            Enter your credentials to access your escrow vault.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'oklch(0.5 0.01 260)', letterSpacing: '0.12em', display: 'block', marginBottom: '0.5rem' }}>
                EMAIL
              </label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                style={{
                  width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
                  background: 'oklch(0.05 0.006 260)', border: '1px solid oklch(0.14 0.01 260)',
                  color: 'oklch(0.95 0.01 260)', fontSize: '0.875rem', outline: 'none',
                  fontFamily: 'var(--font-body)',
                }}
                onFocus={e => (e.target.style.borderColor = 'oklch(0.75 0.18 145 / 0.5)')}
                onBlur={e => (e.target.style.borderColor = 'oklch(0.14 0.01 260)')}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'oklch(0.5 0.01 260)', letterSpacing: '0.12em', display: 'block', marginBottom: '0.5rem' }}>
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'} required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', borderRadius: '8px',
                    background: 'oklch(0.05 0.006 260)', border: '1px solid oklch(0.14 0.01 260)',
                    color: 'oklch(0.95 0.01 260)', fontSize: '0.875rem', outline: 'none',
                    fontFamily: 'var(--font-body)',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'oklch(0.75 0.18 145 / 0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'oklch(0.14 0.01 260)')}
                />
                <button type="button" onClick={() => setShow(!show)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'oklch(0.4 0.01 260)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '0.875rem', borderRadius: '8px', border: 'none',
                background: loading ? 'oklch(0.55 0.14 145)' : 'oklch(0.75 0.18 145)',
                color: 'oklch(0.04 0.005 260)', fontFamily: 'var(--font-display)',
                fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                marginTop: '0.5rem',
                boxShadow: '0 0 20px oklch(0.75 0.18 145 / 0.2)',
              }}
            >
              {loading ? 'SIGNING IN...' : <>{`SIGN IN`} <ArrowRight size={14} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'oklch(0.4 0.01 260)' }}>
            No account?{' '}
            <Link to="/signup" style={{ color: 'oklch(0.75 0.18 145)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              SIGN UP
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
