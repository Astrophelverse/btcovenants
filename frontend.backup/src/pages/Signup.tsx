import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bitcoin, Eye, EyeOff, ArrowRight, Copy, CheckCheck } from 'lucide-react'
import { useAuthStore } from '../store/auth'
import api from '../lib/api'
import { toast } from 'sonner'

export default function Signup() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [step, setStep] = useState<'form' | 'seed'>('form')
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [seedPhrase, setSeedPhrase] = useState('')
  const [copied, setCopied] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [pendingAuth, setPendingAuth] = useState<{ token: string; user: any } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/signup', { email: form.email, password: form.password })
      setSeedPhrase(data.seed_phrase || 'your-wallet-key-will-appear-here')
      setPendingAuth({ token: data.token, user: data.user })
      setStep('seed')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(seedPhrase)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleContinue() {
    if (!confirmed) { toast.error('Please confirm you saved your key'); return }
    if (pendingAuth) {
      setAuth(pendingAuth.token, pendingAuth.user)
      navigate('/onboarding')
    }
  }

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
    background: 'oklch(0.05 0.006 260)', border: '1px solid oklch(0.14 0.01 260)',
    color: 'oklch(0.95 0.01 260)', fontSize: '0.875rem', outline: 'none',
    fontFamily: 'var(--font-body)',
  }

  return (
    <div className="noise min-h-screen flex items-center justify-center px-4 relative" style={{ background: 'oklch(0.04 0.005 260)' }}>
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, oklch(0.75 0.18 145 / 0.05), transparent)' }} />

      <div className="relative z-10 w-full max-w-sm">
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
          {step === 'form' ? (
            <>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.25rem', color: 'oklch(0.95 0.01 260)', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                CREATE ACCOUNT
              </h1>
              <p style={{ color: 'oklch(0.45 0.01 260)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                Your wallet is generated automatically on signup.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'oklch(0.5 0.01 260)', letterSpacing: '0.12em', display: 'block', marginBottom: '0.5rem' }}>EMAIL</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = 'oklch(0.75 0.18 145 / 0.5)')}
                    onBlur={e => (e.target.style.borderColor = 'oklch(0.14 0.01 260)')} />
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'oklch(0.5 0.01 260)', letterSpacing: '0.12em', display: 'block', marginBottom: '0.5rem' }}>PASSWORD</label>
                  <div className="relative">
                    <input type={show ? 'text' : 'password'} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 8 characters" style={{ ...inputStyle, paddingRight: '2.5rem' }}
                      onFocus={e => (e.target.style.borderColor = 'oklch(0.75 0.18 145 / 0.5)')}
                      onBlur={e => (e.target.style.borderColor = 'oklch(0.14 0.01 260)')} />
                    <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'oklch(0.4 0.01 260)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      {show ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'oklch(0.5 0.01 260)', letterSpacing: '0.12em', display: 'block', marginBottom: '0.5rem' }}>CONFIRM PASSWORD</label>
                  <input type="password" required value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} placeholder="••••••••" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = 'oklch(0.75 0.18 145 / 0.5)')}
                    onBlur={e => (e.target.style.borderColor = 'oklch(0.14 0.01 260)')} />
                </div>
                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '0.875rem', borderRadius: '8px', border: 'none',
                  background: loading ? 'oklch(0.55 0.14 145)' : 'oklch(0.75 0.18 145)',
                  color: 'oklch(0.04 0.005 260)', fontFamily: 'var(--font-display)',
                  fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em',
                  cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  marginTop: '0.5rem', boxShadow: '0 0 20px oklch(0.75 0.18 145 / 0.2)',
                }}>
                  {loading ? 'CREATING WALLET...' : <>CREATE ACCOUNT <ArrowRight size={14} /></>}
                </button>
              </form>
              <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'oklch(0.4 0.01 260)' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'oklch(0.75 0.18 145)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: '0.05em' }}>SIGN IN</Link>
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full animate-pulse-glow" style={{ background: 'oklch(0.72 0.18 55)' }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'oklch(0.72 0.18 55)', letterSpacing: '0.15em' }}>IMPORTANT</span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.1rem', color: 'oklch(0.95 0.01 260)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                SAVE YOUR WALLET KEY
              </h1>
              <p style={{ color: 'oklch(0.45 0.01 260)', fontSize: '0.82rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                This is shown <strong style={{ color: 'oklch(0.72 0.18 55)' }}>once only</strong>. If you lose it and forget your password, your wallet is gone forever. We cannot recover it.
              </p>
              <div className="rounded-xl p-4 mb-4 relative" style={{ background: 'oklch(0.05 0.006 260)', border: '1px solid oklch(0.72 0.18 55 / 0.3)' }}>
                <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'oklch(0.85 0.01 260)', wordBreak: 'break-all', lineHeight: 1.7 }}>
                  {seedPhrase}
                </p>
                <button onClick={handleCopy} style={{
                  position: 'absolute', top: '0.75rem', right: '0.75rem',
                  background: 'oklch(0.09 0.01 260)', border: '1px solid oklch(0.15 0.01 260)',
                  color: copied ? 'oklch(0.75 0.18 145)' : 'oklch(0.4 0.01 260)',
                  borderRadius: '6px', padding: '0.375rem', cursor: 'pointer',
                }}>
                  {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
                </button>
              </div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', marginBottom: '1.5rem' }}>
                <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)}
                  style={{ width: '14px', height: '14px', marginTop: '2px', accentColor: 'oklch(0.75 0.18 145)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.8rem', color: 'oklch(0.5 0.01 260)', lineHeight: 1.5 }}>
                  I have saved my wallet key in a safe place. I understand it cannot be recovered.
                </span>
              </label>
              <button onClick={handleContinue} style={{
                width: '100%', padding: '0.875rem', borderRadius: '8px', border: 'none',
                background: confirmed ? 'oklch(0.75 0.18 145)' : 'oklch(0.12 0.01 260)',
                color: confirmed ? 'oklch(0.04 0.005 260)' : 'oklch(0.35 0.01 260)',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem',
                letterSpacing: '0.1em', cursor: confirmed ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}>
                CONTINUE TO SETUP <ArrowRight size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
