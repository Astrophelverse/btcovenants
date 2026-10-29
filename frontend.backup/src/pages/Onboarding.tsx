import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bitcoin, Check, ArrowRight, Wallet, User } from 'lucide-react'
import { useAuthStore } from '../store/auth'
import api from '../lib/api'
import { toast } from 'sonner'

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, setUser } = useAuthStore()
  const [step, setStep] = useState<'username' | 'wallet'>('username')
  const [username, setUsername] = useState('')
  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  async function checkUsername(val: string) {
    setUsername(val)
    setAvailable(null)
    if (val.length < 3) return
    setChecking(true)
    try {
      const { data } = await api.get(`/auth/check-username/${val}`)
      setAvailable(data.available)
    } catch { setAvailable(false) }
    finally { setChecking(false) }
  }

  async function handleUsername() {
    if (!available) return
    setLoading(true)
    try {
      await api.post('/auth/onboarding/username', { username })
      setUser({ username, onboarded: false })
      setStep('wallet')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Username taken')
    } finally { setLoading(false) }
  }

  function handleSkipWallet() {
    setUser({ onboarded: true })
    toast.success('Welcome to BTCovenants!')
    navigate('/dashboard')
  }

  function handleConnectWallet() {
    setUser({ wallet_connected: true, onboarded: true })
    toast.success('Wallet connected!')
    navigate('/dashboard')
  }

  return (
    <div className="noise min-h-screen flex items-center justify-center px-4 relative" style={{ background: 'oklch(0.04 0.005 260)' }}>
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, oklch(0.75 0.18 145 / 0.05), transparent)' }} />

      <div className="relative z-10 w-full max-w-sm">
        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {['username', 'wallet'].map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                style={{
                  background: step === s || (s === 'username' && step === 'wallet') ? 'oklch(0.75 0.18 145)' : 'oklch(0.1 0.01 260)',
                  color: step === s || (s === 'username' && step === 'wallet') ? 'oklch(0.04 0.005 260)' : 'oklch(0.4 0.01 260)',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.65rem',
                }}>
                {s === 'username' && step === 'wallet' ? <Check size={12} /> : i + 1}
              </div>
              {i === 0 && <div className="w-8 h-px" style={{ background: step === 'wallet' ? 'oklch(0.75 0.18 145)' : 'oklch(0.15 0.01 260)' }} />}
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'oklch(0.07 0.008 260)', border: '1px solid oklch(0.14 0.01 260)' }}>
          {step === 'username' ? (
            <>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'oklch(0.75 0.18 145 / 0.1)', border: '1px solid oklch(0.75 0.18 145 / 0.2)' }}>
                <User size={20} style={{ color: 'oklch(0.75 0.18 145)' }} />
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.1rem', color: 'oklch(0.95 0.01 260)', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                CHOOSE YOUR USERNAME
              </h1>
              <p style={{ color: 'oklch(0.45 0.01 260)', fontSize: '0.85rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                This is your identity on BTCovenants. Other users will invite you to deals using this name.
              </p>
              <div className="mb-6">
                <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'oklch(0.5 0.01 260)', letterSpacing: '0.12em', display: 'block', marginBottom: '0.5rem' }}>USERNAME</label>
                <div className="relative">
                  <input
                    value={username}
                    onChange={e => checkUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="satoshi"
                    maxLength={20}
                    style={{
                      width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', borderRadius: '8px',
                      background: 'oklch(0.05 0.006 260)',
                      border: `1px solid ${available === true ? 'oklch(0.75 0.18 145 / 0.5)' : available === false ? 'oklch(0.65 0.2 25 / 0.5)' : 'oklch(0.14 0.01 260)'}`,
                      color: 'oklch(0.95 0.01 260)', fontSize: '0.875rem', outline: 'none',
                    }}
                  />
                  {username.length >= 3 && (
                    <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>
                      {checking ? (
                        <div style={{ width: '12px', height: '12px', border: '2px solid oklch(0.4 0.01 260)', borderTopColor: 'oklch(0.75 0.18 145)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                      ) : available === true ? (
                        <Check size={14} style={{ color: 'oklch(0.75 0.18 145)' }} />
                      ) : available === false ? (
                        <span style={{ color: 'oklch(0.65 0.2 25)', fontSize: '12px' }}>✕</span>
                      ) : null}
                    </div>
                  )}
                </div>
                {username.length >= 3 && !checking && (
                  <p style={{ fontSize: '0.75rem', marginTop: '0.4rem', color: available ? 'oklch(0.75 0.18 145)' : 'oklch(0.65 0.2 25)' }}>
                    {available ? `✓ ${username} is available` : `✕ ${username} is taken`}
                  </p>
                )}
                <p style={{ fontSize: '0.72rem', color: 'oklch(0.35 0.01 260)', marginTop: '0.4rem' }}>
                  3–20 characters, letters, numbers, underscores only
                </p>
              </div>
              <button onClick={handleUsername} disabled={!available || loading}
                style={{
                  width: '100%', padding: '0.875rem', borderRadius: '8px', border: 'none',
                  background: available ? 'oklch(0.75 0.18 145)' : 'oklch(0.12 0.01 260)',
                  color: available ? 'oklch(0.04 0.005 260)' : 'oklch(0.35 0.01 260)',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem',
                  letterSpacing: '0.1em', cursor: available ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                }}>
                {loading ? 'SAVING...' : <>CONTINUE <ArrowRight size={14} /></>}
              </button>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'oklch(0.75 0.18 145 / 0.1)', border: '1px solid oklch(0.75 0.18 145 / 0.2)' }}>
                <Wallet size={20} style={{ color: 'oklch(0.75 0.18 145)' }} />
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.1rem', color: 'oklch(0.95 0.01 260)', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                CONNECT WALLET
              </h1>
              <p style={{ color: 'oklch(0.45 0.01 260)', fontSize: '0.85rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                Connect your Bitcoin wallet to fund escrows and receive payments. Your wallet was already generated — connect an existing one or use it.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { name: 'XVERSE', desc: 'Bitcoin & Stacks wallet' },
                  { name: 'LEATHER', desc: 'Stacks ecosystem wallet' },
                  { name: 'ALBY', desc: 'Lightning & Bitcoin wallet' },
                ].map(w => (
                  <button key={w.name} onClick={handleConnectWallet}
                    style={{
                      width: '100%', padding: '0.875rem 1rem', borderRadius: '10px',
                      background: 'oklch(0.05 0.006 260)', border: '1px solid oklch(0.14 0.01 260)',
                      color: 'oklch(0.85 0.01 260)', cursor: 'pointer', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'oklch(0.75 0.18 145 / 0.4)'; e.currentTarget.style.background = 'oklch(0.08 0.009 260)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'oklch(0.14 0.01 260)'; e.currentTarget.style.background = 'oklch(0.05 0.006 260)' }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'oklch(0.75 0.18 145 / 0.1)', border: '1px solid oklch(0.75 0.18 145 / 0.2)' }}>
                      <Bitcoin size={14} style={{ color: 'oklch(0.75 0.18 145)' }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: '0.08em', fontWeight: 700 }}>{w.name}</p>
                      <p style={{ fontSize: '0.72rem', color: 'oklch(0.4 0.01 260)' }}>{w.desc}</p>
                    </div>
                    <ArrowRight size={14} style={{ color: 'oklch(0.4 0.01 260)', marginLeft: 'auto' }} />
                  </button>
                ))}
              </div>
              <button onClick={handleSkipWallet}
                style={{
                  width: '100%', padding: '0.75rem', borderRadius: '8px',
                  border: '1px solid oklch(0.14 0.01 260)', background: 'transparent',
                  color: 'oklch(0.4 0.01 260)', fontFamily: 'var(--font-display)',
                  fontSize: '0.75rem', letterSpacing: '0.08em', cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'oklch(0.25 0.01 260)'; e.currentTarget.style.color = 'oklch(0.65 0.01 260)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'oklch(0.14 0.01 260)'; e.currentTarget.style.color = 'oklch(0.4 0.01 260)' }}
              >
                SKIP FOR NOW
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
