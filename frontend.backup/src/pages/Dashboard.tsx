import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Ticket, CheckSquare, Bitcoin, Zap, ArrowRight, TrendingUp } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import { useAuthStore } from '../store/auth'
import api from '../lib/api'

function StatCard({ label, value, sub, icon: Icon, accent = false }: any) {
  return (
    <div className="rounded-xl p-5 relative overflow-hidden"
      style={{ background: 'oklch(0.07 0.008 260)', border: `1px solid ${accent ? 'oklch(0.75 0.18 145 / 0.25)' : 'oklch(0.13 0.01 260)'}` }}>
      {accent && <div className="absolute inset-0 rounded-xl" style={{ background: 'radial-gradient(ellipse at top right, oklch(0.75 0.18 145 / 0.06), transparent)' }} />}
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'oklch(0.4 0.01 260)', letterSpacing: '0.15em' }}>{label}</span>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: accent ? 'oklch(0.75 0.18 145 / 0.12)' : 'oklch(0.1 0.01 260)', border: `1px solid ${accent ? 'oklch(0.75 0.18 145 / 0.2)' : 'oklch(0.15 0.01 260)'}` }}>
            <Icon size={13} style={{ color: accent ? 'oklch(0.75 0.18 145)' : 'oklch(0.4 0.01 260)' }} />
          </div>
        </div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, color: accent ? 'oklch(0.75 0.18 145)' : 'oklch(0.95 0.01 260)' }}>{value}</p>
        {sub && <p style={{ fontSize: '0.72rem', color: 'oklch(0.4 0.01 260)', marginTop: '0.25rem' }}>{sub}</p>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const [btcPrice, setBtcPrice] = useState<number | null>(null)
  const [balance, setBalance] = useState<any>(null)
  const [tickets, setTickets] = useState<any[]>([])
  const [fees, setFees] = useState<any>(null)

  useEffect(() => {
    api.get('/wallet/price').then(r => setBtcPrice(r.data.btc_usd)).catch(() => {})
    api.get('/wallet/fees').then(r => setFees(r.data)).catch(() => {})
    if (user?.id) {
      api.get(`/tickets/user/${user.id}`).then(r => setTickets(r.data)).catch(() => {})
    }
    if (user?.btc_address) {
      api.get(`/wallet/balance/${user.btc_address}`).then(r => setBalance(r.data)).catch(() => {})
    }
  }, [user])

  const openTickets = tickets.filter(t => ['pending', 'active', 'funded'].includes(t.status))
  const completedDeals = tickets.filter(t => t.status === 'completed')

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'oklch(0.75 0.18 145)', letterSpacing: '0.2em', marginBottom: '0.35rem' }}>DASHBOARD</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, color: 'oklch(0.95 0.01 260)', letterSpacing: '-0.01em' }}>
              GM, {(user?.username || 'ANON').toUpperCase()} ⚡
            </h1>
          </div>
          <Link to="/tickets" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.625rem 1.25rem', borderRadius: '8px',
            background: 'oklch(0.75 0.18 145)', color: 'oklch(0.04 0.005 260)',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.7rem',
            letterSpacing: '0.1em', textDecoration: 'none',
            boxShadow: '0 0 20px oklch(0.75 0.18 145 / 0.25)',
          }}>
            NEW DEAL <ArrowRight size={13} />
          </Link>
        </div>
// 
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="BTC PRICE" value={btcPrice ? `$${btcPrice.toLocaleString()}` : '...'} sub="Live via CoinGecko" icon={TrendingUp} accent />
          <StatCard label="WALLET BALANCE" value={balance ? `${balance.total_btc.toFixed(6)} BTC` : '—'} sub={balance ? `≈ $${balance.usd_value?.toFixed(2)}` : 'Connect wallet'} icon={Bitcoin} />
          <StatCard label="OPEN TICKETS" value={openTickets.length} sub="Active escrows" icon={Ticket} />
          <StatCard label="DEALS DONE" value={completedDeals.length} sub="Completed" icon={CheckSquare} />
        </div>

        {/* Live network fee banner */}
        {fees && (
          <div className="rounded-xl p-4 mb-8 flex items-center gap-4 flex-wrap"
            style={{ background: 'oklch(0.07 0.008 260)', border: '1px solid oklch(0.13 0.01 260)' }}>
            <div className="flex items-center gap-2">
              <Zap size={14} style={{ color: 'oklch(0.75 0.18 145)' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'oklch(0.5 0.01 260)', letterSpacing: '0.1em' }}>NETWORK FEES (SAT/VBYTE)</span>
            </div>
            {[
              { label: 'ECONOMY', val: fees.rates?.economyFee },
              { label: 'HOUR', val: fees.rates?.hourFee },
              { label: 'FAST', val: fees.rates?.fastestFee },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-1.5">
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'oklch(0.4 0.01 260)', letterSpacing: '0.1em' }}>{f.label}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 700, color: 'oklch(0.85 0.01 260)' }}>{f.val}</span>
              </div>
            ))}
            <span style={{ fontSize: '0.72rem', color: 'oklch(0.35 0.01 260)', marginLeft: 'auto' }}>via mempool.space</span>
          </div>
        )}

        {/* Recent tickets */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid oklch(0.13 0.01 260)' }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid oklch(0.1 0.01 260)', background: 'oklch(0.065 0.007 260)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: 'oklch(0.6 0.01 260)', letterSpacing: '0.12em' }}>RECENT TICKETS</span>
            <Link to="/tickets" style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'oklch(0.75 0.18 145)', textDecoration: 'none', letterSpacing: '0.08em' }}>VIEW ALL →</Link>
          </div>
          {tickets.length === 0 ? (
            <div className="py-16 text-center">
              <Ticket size={28} style={{ color: 'oklch(0.25 0.01 260)', margin: '0 auto 1rem' }} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', color: 'oklch(0.35 0.01 260)', letterSpacing: '0.1em' }}>NO TICKETS YET</p>
              <p style={{ fontSize: '0.8rem', color: 'oklch(0.3 0.01 260)', marginTop: '0.4rem' }}>Create your first deal to get started</p>
            </div>
          ) : (
            <div>
              {tickets.slice(0, 5).map((t, i) => (
                <Link key={t.id} to={`/tickets/${t.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="flex items-center justify-between px-5 py-4 transition-colors"
                    style={{ borderBottom: i < tickets.length - 1 ? '1px solid oklch(0.09 0.009 260)' : 'none', background: 'oklch(0.07 0.008 260)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0.09 0.01 260)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'oklch(0.07 0.008 260)')}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'oklch(0.75 0.18 145 / 0.1)', border: '1px solid oklch(0.75 0.18 145 / 0.2)' }}>
                        <Ticket size={13} style={{ color: 'oklch(0.75 0.18 145)' }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', color: 'oklch(0.85 0.01 260)', letterSpacing: '0.03em' }}>{t.title}</p>
                        <p style={{ fontSize: '0.7rem', color: 'oklch(0.4 0.01 260)' }}>{t.provider_username ? `with ${t.provider_username}` : 'awaiting provider'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, color: 'oklch(0.85 0.01 260)' }}>${t.amount_usd}</span>
                      <span style={{
                        fontFamily: 'var(--font-display)', fontSize: '0.6rem', letterSpacing: '0.08em',
                        padding: '0.2rem 0.6rem', borderRadius: '4px',
                        background: t.status === 'completed' ? 'oklch(0.75 0.18 145 / 0.15)' : t.status === 'disputed' ? 'oklch(0.65 0.2 25 / 0.15)' : 'oklch(0.72 0.18 55 / 0.12)',
                        color: t.status === 'completed' ? 'oklch(0.75 0.18 145)' : t.status === 'disputed' ? 'oklch(0.65 0.2 25)' : 'oklch(0.72 0.18 55)',
                        border: `1px solid ${t.status === 'completed' ? 'oklch(0.75 0.18 145 / 0.2)' : t.status === 'disputed' ? 'oklch(0.65 0.2 25 / 0.2)' : 'oklch(0.72 0.18 55 / 0.2)'}`,
                      }}>{t.status.toUpperCase()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
