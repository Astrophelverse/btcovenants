import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Ticket, X, ArrowRight, DollarSign, Clock } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import { useAuthStore } from '../store/auth'
import api from '../lib/api'
import { toast } from 'sonner'

const STATUS_COLORS: any = {
  pending:   { bg: 'oklch(0.72 0.18 55 / 0.12)',  border: 'oklch(0.72 0.18 55 / 0.25)',  text: 'oklch(0.72 0.18 55)' },
  active:    { bg: 'oklch(0.6 0.18 260 / 0.12)',  border: 'oklch(0.6 0.18 260 / 0.25)',  text: 'oklch(0.7 0.15 260)' },
  funded:    { bg: 'oklch(0.75 0.18 145 / 0.12)', border: 'oklch(0.75 0.18 145 / 0.25)', text: 'oklch(0.75 0.18 145)' },
  completed: { bg: 'oklch(0.75 0.18 145 / 0.08)', border: 'oklch(0.75 0.18 145 / 0.15)', text: 'oklch(0.6 0.14 145)' },
  disputed:  { bg: 'oklch(0.65 0.2 25 / 0.12)',   border: 'oklch(0.65 0.2 25 / 0.25)',   text: 'oklch(0.65 0.2 25)' },
}

function CreateTicketModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { user } = useAuthStore()
  const [form, setForm] = useState({ title: '', description: '', amount_usd: '', timeline_days: '7', provider_username: '', is_public: true })
  const [fees, setFees] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (form.amount_usd && parseFloat(form.amount_usd) > 0) {
      api.post('/wallet/estimate-fees', { amount_usd: parseFloat(form.amount_usd) }).then(r => setFees(r.data)).catch(() => {})
    }
  }, [form.amount_usd])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    try {
      const { data } = await api.post('/tickets/create', {
        ...form,
        amount_usd: parseFloat(form.amount_usd),
        timeline_days: parseInt(form.timeline_days),
        buyer_id: user.id,
        buyer_username: user.username || user.email,
      })
      toast.success('Deal ticket created!')
      onCreated()
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to create ticket')
    } finally { setLoading(false) }
  }

  const inputStyle = {
    width: '100%', padding: '0.625rem 0.875rem', borderRadius: '8px',
    background: 'oklch(0.05 0.006 260)', border: '1px solid oklch(0.14 0.01 260)',
    color: 'oklch(0.95 0.01 260)', fontSize: '0.875rem', outline: 'none', fontFamily: 'var(--font-body)',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0.04 0.005 260 / 0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: 'oklch(0.07 0.008 260)', border: '1px solid oklch(0.15 0.01 260)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid oklch(0.12 0.01 260)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 700, color: 'oklch(0.95 0.01 260)', letterSpacing: '0.08em' }}>CREATE DEAL TICKET</span>
          <button onClick={onClose} style={{ color: 'oklch(0.4 0.01 260)', background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'oklch(0.5 0.01 260)', letterSpacing: '0.12em', display: 'block', marginBottom: '0.4rem' }}>DEAL TITLE</label>
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Build me an app that does X" style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'oklch(0.75 0.18 145 / 0.5)')} onBlur={e => (e.target.style.borderColor = 'oklch(0.14 0.01 260)')} />
          </div>
          <div>
            <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'oklch(0.5 0.01 260)', letterSpacing: '0.12em', display: 'block', marginBottom: '0.4rem' }}>DESCRIPTION</label>
            <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe exactly what you need..." rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={e => (e.target.style.borderColor = 'oklch(0.75 0.18 145 / 0.5)')} onBlur={e => (e.target.style.borderColor = 'oklch(0.14 0.01 260)')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'oklch(0.5 0.01 260)', letterSpacing: '0.12em', display: 'block', marginBottom: '0.4rem' }}>AMOUNT (USD)</label>
              <input required type="number" min="1" value={form.amount_usd} onChange={e => setForm({ ...form, amount_usd: e.target.value })} placeholder="1000" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'oklch(0.75 0.18 145 / 0.5)')} onBlur={e => (e.target.style.borderColor = 'oklch(0.14 0.01 260)')} />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'oklch(0.5 0.01 260)', letterSpacing: '0.12em', display: 'block', marginBottom: '0.4rem' }}>TIMELINE (DAYS)</label>
              <input required type="number" min="1" value={form.timeline_days} onChange={e => setForm({ ...form, timeline_days: e.target.value })} placeholder="7" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'oklch(0.75 0.18 145 / 0.5)')} onBlur={e => (e.target.style.borderColor = 'oklch(0.14 0.01 260)')} />
            </div>
          </div>
          <div>
            <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'oklch(0.5 0.01 260)', letterSpacing: '0.12em', display: 'block', marginBottom: '0.4rem' }}>INVITE PROVIDER (USERNAME OR EMAIL)</label>
            <input value={form.provider_username} onChange={e => setForm({ ...form, provider_username: e.target.value })} placeholder="satoshi" style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'oklch(0.75 0.18 145 / 0.5)')} onBlur={e => (e.target.style.borderColor = 'oklch(0.14 0.01 260)')} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_public} onChange={e => setForm({ ...form, is_public: e.target.checked })} style={{ accentColor: 'oklch(0.75 0.18 145)' }} />
            <span style={{ fontSize: '0.8rem', color: 'oklch(0.5 0.01 260)' }}>Public deal — show username on completed deals board</span>
          </label>

          {/* Fee breakdown */}
          {fees && (
            <div className="rounded-xl p-4 space-y-2" style={{ background: 'oklch(0.05 0.006 260)', border: '1px solid oklch(0.12 0.01 260)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'oklch(0.4 0.01 260)', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>FEE BREAKDOWN</p>
              {[
                { label: 'Deal amount', val: `$${fees.deal_amount_usd}` },
                { label: 'Platform fee', val: fees.platform_fee_usd === 0 ? 'FREE' : `$${fees.platform_fee_usd}` },
                { label: 'Network fee', val: `~$${fees.network_fee_usd} (${fees.network_fee_sats} sats)` },
                { label: 'Total from you', val: `$${fees.total_from_buyer?.toFixed(2)}`, bold: true },
                { label: 'Provider receives', val: fees.provider_receives, green: true },
              ].map(row => (
                <div key={row.label} className="flex justify-between">
                  <span style={{ fontSize: '0.78rem', color: 'oklch(0.45 0.01 260)' }}>{row.label}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: row.bold ? 700 : 400, color: row.green ? 'oklch(0.75 0.18 145)' : row.bold ? 'oklch(0.9 0.01 260)' : 'oklch(0.65 0.01 260)' }}>{row.val}</span>
                </div>
              ))}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '0.875rem', borderRadius: '8px', border: 'none',
            background: loading ? 'oklch(0.55 0.14 145)' : 'oklch(0.75 0.18 145)',
            color: 'oklch(0.04 0.005 260)', fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: '0.8rem', letterSpacing: '0.1em', cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          }}>
            {loading ? 'CREATING...' : <>CREATE DEAL <ArrowRight size={14} /></>}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Tickets() {
  const { user } = useAuthStore()
  const [tickets, setTickets] = useState<any[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [filter, setFilter] = useState<string>('all')

  async function loadTickets() {
    if (!user?.id) return
    try { const { data } = await api.get(`/tickets/user/${user.id}`); setTickets(data) } catch {}
  }

  useEffect(() => { loadTickets() }, [user])

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter)

  return (
    <AppLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'oklch(0.75 0.18 145)', letterSpacing: '0.2em', marginBottom: '0.35rem' }}>ESCROW</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, color: 'oklch(0.95 0.01 260)', letterSpacing: '-0.01em' }}>TICKETS</h1>
          </div>
          <button onClick={() => setShowCreate(true)} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.625rem 1.25rem', borderRadius: '8px',
            background: 'oklch(0.75 0.18 145)', color: 'oklch(0.04 0.005 260)',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.7rem',
            letterSpacing: '0.1em', border: 'none', cursor: 'pointer',
            boxShadow: '0 0 20px oklch(0.75 0.18 145 / 0.25)',
          }}>
            <Plus size={13} /> NEW TICKET
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'pending', 'active', 'funded', 'completed', 'disputed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '0.4rem 0.875rem', borderRadius: '6px', border: 'none', cursor: 'pointer', transition: 'all 0.15s',
              background: filter === f ? 'oklch(0.75 0.18 145 / 0.15)' : 'oklch(0.07 0.008 260)',
              borderColor: filter === f ? 'oklch(0.75 0.18 145 / 0.3)' : 'oklch(0.12 0.01 260)',
              color: filter === f ? 'oklch(0.75 0.18 145)' : 'oklch(0.4 0.01 260)',
              fontFamily: 'var(--font-display)', fontSize: '0.65rem', letterSpacing: '0.1em',
            }}>{f.toUpperCase()}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl py-20 text-center" style={{ background: 'oklch(0.07 0.008 260)', border: '1px solid oklch(0.12 0.01 260)' }}>
            <Ticket size={32} style={{ color: 'oklch(0.2 0.01 260)', margin: '0 auto 1rem' }} />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', color: 'oklch(0.3 0.01 260)', letterSpacing: '0.12em' }}>NO TICKETS</p>
            <p style={{ fontSize: '0.8rem', color: 'oklch(0.25 0.01 260)', marginTop: '0.5rem' }}>Create your first deal ticket to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(t => {
              const sc = STATUS_COLORS[t.status] || STATUS_COLORS.pending
              return (
                <Link key={t.id} to={`/tickets/${t.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="rounded-xl p-5 transition-all duration-150" style={{ background: 'oklch(0.07 0.008 260)', border: '1px solid oklch(0.12 0.01 260)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'oklch(0.75 0.18 145 / 0.25)'; e.currentTarget.style.background = 'oklch(0.085 0.009 260)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'oklch(0.12 0.01 260)'; e.currentTarget.style.background = 'oklch(0.07 0.008 260)' }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, color: 'oklch(0.9 0.01 260)' }}>{t.title}</span>
                          <span style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.6rem', fontFamily: 'var(--font-display)', letterSpacing: '0.08em', background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}>{t.status.toUpperCase()}</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'oklch(0.4 0.01 260)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span style={{ fontSize: '0.72rem', color: 'oklch(0.4 0.01 260)' }}>{t.provider_username ? `Provider: ${t.provider_username}` : 'Awaiting provider'}</span>
                          <span style={{ fontSize: '0.72rem', color: 'oklch(0.35 0.01 260)' }}>{t.timeline_days}d timeline</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1rem', color: 'oklch(0.75 0.18 145)' }}>${t.amount_usd}</p>
                        <p style={{ fontSize: '0.7rem', color: 'oklch(0.4 0.01 260)', marginTop: '0.2rem' }}>{t.amount_btc ? `${t.amount_btc} BTC` : '—'}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
      {showCreate && <CreateTicketModal onClose={() => setShowCreate(false)} onCreated={loadTickets} />}
    </AppLayout>
  )
}
