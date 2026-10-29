import { useEffect, useState } from 'react'
import { Bitcoin, Copy, CheckCheck } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import { useAuthStore } from '../store/auth'
import api from '../lib/api'

export default function Profile() {
  const { user } = useAuthStore()
  const [balance, setBalance] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (user?.btc_address) {
      api.get(`/wallet/balance/${user.btc_address}`).then(r => setBalance(r.data)).catch(() => {})
    }
  }, [user])

  function copyAddr() {
    if (user?.btc_address) { navigator.clipboard.writeText(user.btc_address); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  return (
    <AppLayout>
      <div className="p-8 max-w-2xl">
        <div className="mb-8">
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'oklch(0.75 0.18 145)', letterSpacing: '0.2em', marginBottom: '0.35rem' }}>ACCOUNT</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, color: 'oklch(0.95 0.01 260)' }}>PROFILE</h1>
        </div>

        {/* Avatar + name */}
        <div className="rounded-2xl p-6 mb-4" style={{ background: 'oklch(0.07 0.008 260)', border: '1px solid oklch(0.13 0.01 260)' }}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
              style={{ background: 'oklch(0.75 0.18 145 / 0.15)', border: '2px solid oklch(0.75 0.18 145 / 0.3)', fontFamily: 'var(--font-display)', color: 'oklch(0.75 0.18 145)' }}>
              {(user?.username || user?.email)?.[0]?.toUpperCase()}
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 900, color: 'oklch(0.95 0.01 260)', letterSpacing: '0.05em' }}>
                {user?.username || 'unnamed'}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'oklch(0.45 0.01 260)', marginTop: '0.2rem' }}>{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Wallet */}
        <div className="rounded-2xl p-6 mb-4" style={{ background: 'oklch(0.07 0.008 260)', border: '1px solid oklch(0.13 0.01 260)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Bitcoin size={15} style={{ color: 'oklch(0.75 0.18 145)' }} />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: 'oklch(0.5 0.01 260)', letterSpacing: '0.12em' }}>BITCOIN WALLET</p>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl mb-4" style={{ background: 'oklch(0.05 0.006 260)', border: '1px solid oklch(0.12 0.01 260)' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'oklch(0.7 0.01 260)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.btc_address || 'No wallet connected'}
            </p>
            <button onClick={copyAddr} style={{ color: copied ? 'oklch(0.75 0.18 145)' : 'oklch(0.4 0.01 260)', background: 'none', border: 'none', cursor: 'pointer' }}>
              {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
            </button>
          </div>
          {balance && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-4 text-center" style={{ background: 'oklch(0.075 0.009 260)', border: '1px solid oklch(0.12 0.01 260)' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 900, color: 'oklch(0.75 0.18 145)' }}>{balance.total_btc.toFixed(6)}</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'oklch(0.4 0.01 260)', letterSpacing: '0.1em', marginTop: '0.25rem' }}>BTC</p>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'oklch(0.075 0.009 260)', border: '1px solid oklch(0.12 0.01 260)' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 900, color: 'oklch(0.85 0.01 260)' }}>${balance.usd_value?.toFixed(2)}</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'oklch(0.4 0.01 260)', letterSpacing: '0.1em', marginTop: '0.25rem' }}>USD VALUE</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
