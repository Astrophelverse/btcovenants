import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Send, CheckCheck, Shield, Bitcoin, Lock, Clock, ArrowLeft } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import { useAuthStore } from '../store/auth'
import api from '../lib/api'
import { toast } from 'sonner'

export default function TicketView() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  async function load() {
    try {
      const { data } = await api.get(`/tickets/${id}`)
      setTicket(data)
      setMessages(data.messages || [])
    } catch { toast.error('Ticket not found'); navigate('/tickets') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [id])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function sendMsg(e: React.FormEvent) {
    e.preventDefault()
    if (!msg.trim() || !user) return
    setSending(true)
    try {
      const { data } = await api.post(`/tickets/${id}/message`, {
        sender_id: user.id, sender_username: user.username || user.email, content: msg,
      })
      setMessages(prev => [...prev, data])
      setMsg('')
    } catch { toast.error('Failed to send') }
    finally { setSending(false) }
  }

  async function handleSign() {
    if (!user || !ticket) return
    const role = ticket.buyer_id === user.id ? 'buyer' : 'provider'
    try {
      const { data } = await api.post(`/tickets/${id}/sign`, { user_id: user.id, role })
      setTicket(data)
      toast.success(`Signed as ${role}!`)
    } catch { toast.error('Sign failed') }
  }

  async function handleDone() {
    if (!user || !ticket) return
    const role = ticket.buyer_id === user.id ? 'buyer' : 'provider'
    try {
      const { data } = await api.post(`/tickets/${id}/mark-done`, { user_id: user.id, role })
      setTicket(data)
      if (data.status === 'completed') toast.success('🎉 Deal completed! Funds released.')
      else toast.success('Marked as done — waiting for other party.')
    } catch { toast.error('Failed') }
  }

  if (loading) return <AppLayout><div className="p-8 text-center" style={{ color: 'oklch(0.4 0.01 260)', fontFamily: 'var(--font-display)', letterSpacing: '0.1em', fontSize: '0.75rem' }}>LOADING...</div></AppLayout>
  if (!ticket) return null

  const isParty = ticket.buyer_id === user?.id || ticket.provider_id === user?.id
  const myRole = ticket.buyer_id === user?.id ? 'buyer' : 'provider'
  const mySigned = myRole === 'buyer' ? ticket.buyer_signed : ticket.provider_signed
  const myDone = myRole === 'buyer' ? ticket.buyer_done : ticket.provider_done

  return (
    <AppLayout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 flex items-center gap-4" style={{ borderBottom: '1px solid oklch(0.12 0.01 260)', background: 'oklch(0.055 0.007 260)' }}>
          <button onClick={() => navigate('/tickets')} style={{ color: 'oklch(0.4 0.01 260)', background: 'none', border: 'none', cursor: 'pointer' }}><ArrowLeft size={16} /></button>
          <div className="flex-1 min-w-0">
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, color: 'oklch(0.9 0.01 260)', letterSpacing: '0.03em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.title}</h1>
            <p style={{ fontSize: '0.72rem', color: 'oklch(0.4 0.01 260)' }}>
              {ticket.buyer_username} → {ticket.provider_username || 'awaiting provider'} · ${ticket.amount_usd} · {ticket.timeline_days}d
            </p>
          </div>
          <div style={{
            padding: '0.25rem 0.75rem', borderRadius: '6px', fontFamily: 'var(--font-display)', fontSize: '0.6rem', letterSpacing: '0.1em',
            background: ticket.status === 'completed' ? 'oklch(0.75 0.18 145 / 0.15)' : 'oklch(0.72 0.18 55 / 0.12)',
            color: ticket.status === 'completed' ? 'oklch(0.75 0.18 145)' : 'oklch(0.72 0.18 55)',
            border: `1px solid ${ticket.status === 'completed' ? 'oklch(0.75 0.18 145 / 0.25)' : 'oklch(0.72 0.18 55 / 0.2)'}`,
          }}>{ticket.status.toUpperCase()}</div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Chat */}
          <div className="flex-1 flex flex-col">
            {/* Notice */}
            <div className="px-6 py-2 text-center" style={{ borderBottom: '1px solid oklch(0.1 0.01 260)', background: 'oklch(0.06 0.007 260)' }}>
              <p style={{ fontSize: '0.72rem', color: 'oklch(0.35 0.01 260)' }}>
                🔒 All ticket-related discussions should stay here
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: 'oklch(0.25 0.01 260)', letterSpacing: '0.12em' }}>NO MESSAGES YET</p>
                  <p style={{ fontSize: '0.8rem', color: 'oklch(0.22 0.01 260)', marginTop: '0.4rem' }}>Start the deal discussion here</p>
                </div>
              )}
              {messages.map(m => {
                const isMe = m.sender_id === user?.id
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div style={{
                      maxWidth: '70%', padding: '0.625rem 0.875rem', borderRadius: isMe ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                      background: isMe ? 'oklch(0.75 0.18 145 / 0.15)' : 'oklch(0.09 0.01 260)',
                      border: `1px solid ${isMe ? 'oklch(0.75 0.18 145 / 0.25)' : 'oklch(0.14 0.01 260)'}`,
                    }}>
                      <p style={{ fontSize: '0.65rem', color: isMe ? 'oklch(0.65 0.14 145)' : 'oklch(0.4 0.01 260)', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                        {m.sender_username}
                      </p>
                      <p style={{ fontSize: '0.875rem', color: 'oklch(0.88 0.01 260)', lineHeight: 1.5 }}>{m.content}</p>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 p-4" style={{ borderTop: '1px solid oklch(0.12 0.01 260)' }}>
              <form onSubmit={sendMsg} className="flex gap-3">
                <input
                  value={msg} onChange={e => setMsg(e.target.value)}
                  placeholder="Type a message..."
                  style={{
                    flex: 1, padding: '0.75rem 1rem', borderRadius: '10px',
                    background: 'oklch(0.07 0.008 260)', border: '1px solid oklch(0.14 0.01 260)',
                    color: 'oklch(0.95 0.01 260)', fontSize: '0.875rem', outline: 'none',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'oklch(0.75 0.18 145 / 0.4)')}
                  onBlur={e => (e.target.style.borderColor = 'oklch(0.14 0.01 260)')}
                />
                <button type="submit" disabled={sending || !msg.trim()} style={{
                  padding: '0.75rem 1rem', borderRadius: '10px', border: 'none',
                  background: msg.trim() ? 'oklch(0.75 0.18 145)' : 'oklch(0.12 0.01 260)',
                  color: msg.trim() ? 'oklch(0.04 0.005 260)' : 'oklch(0.3 0.01 260)',
                  cursor: msg.trim() ? 'pointer' : 'not-allowed',
                }}>
                  <Send size={15} />
                </button>
              </form>
            </div>
          </div>

          {/* Side panel */}
          <div className="w-72 flex-shrink-0 overflow-y-auto" style={{ borderLeft: '1px solid oklch(0.12 0.01 260)', background: 'oklch(0.055 0.007 260)' }}>
            <div className="p-5 space-y-5">
              {/* Deal info */}
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'oklch(0.4 0.01 260)', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>DEAL INFO</p>
                <div className="space-y-2">
                  {[
                    { label: 'Amount', val: `$${ticket.amount_usd}`, icon: DollarSign },
                    { label: 'In BTC', val: `${ticket.amount_btc || '—'} BTC`, icon: Bitcoin },
                    { label: 'BTC @ Lock', val: ticket.btc_price_locked ? `$${ticket.btc_price_locked?.toLocaleString()}` : '—', icon: Lock },
                    { label: 'Timeline', val: `${ticket.timeline_days} days`, icon: Clock },
                  ].map(({ label, val, icon: Icon }) => (
                    <div key={label} className="flex justify-between items-center">
                      <span style={{ fontSize: '0.75rem', color: 'oklch(0.4 0.01 260)' }}>{label}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', color: 'oklch(0.8 0.01 260)', fontWeight: 600 }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signatures */}
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'oklch(0.4 0.01 260)', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>SIGNATURES</p>
                {[
                  { label: ticket.buyer_username || 'Buyer', signed: ticket.buyer_signed },
                  { label: ticket.provider_username || 'Provider', signed: ticket.provider_signed },
                ].map(p => (
                  <div key={p.label} className="flex items-center justify-between mb-2">
                    <span style={{ fontSize: '0.78rem', color: 'oklch(0.5 0.01 260)' }}>{p.label}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: p.signed ? 'oklch(0.75 0.18 145)' : 'oklch(0.25 0.01 260)' }} />
                      <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-display)', color: p.signed ? 'oklch(0.75 0.18 145)' : 'oklch(0.35 0.01 260)', letterSpacing: '0.08em' }}>{p.signed ? 'SIGNED' : 'PENDING'}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Escrow status */}
              {ticket.escrow_address && (
                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'oklch(0.4 0.01 260)', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>ESCROW ADDRESS</p>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'oklch(0.6 0.01 260)', wordBreak: 'break-all', lineHeight: 1.6 }}>{ticket.escrow_address}</p>
                </div>
              )}

              {/* Actions */}
              {isParty && ticket.status !== 'completed' && (
                <div className="space-y-2 pt-2">
                  {!mySigned && (
                    <button onClick={handleSign} style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none',
                      background: 'oklch(0.75 0.18 145)', color: 'oklch(0.04 0.005 260)',
                      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.7rem',
                      letterSpacing: '0.1em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    }}>
                      <Shield size={13} /> SIGN DEAL
                    </button>
                  )}
                  {ticket.buyer_signed && ticket.provider_signed && !myDone && (
                    <button onClick={handleDone} style={{
                      width: '100%', padding: '0.75rem', borderRadius: '8px',
                      border: '1px solid oklch(0.75 0.18 145 / 0.3)', background: 'transparent',
                      color: 'oklch(0.75 0.18 145)', fontFamily: 'var(--font-display)', fontWeight: 700,
                      fontSize: '0.7rem', letterSpacing: '0.1em', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    }}>
                      <CheckCheck size={13} /> MARK AS DONE
                    </button>
                  )}
                </div>
              )}

              {ticket.status === 'completed' && (
                <div className="rounded-xl p-4 text-center" style={{ background: 'oklch(0.75 0.18 145 / 0.08)', border: '1px solid oklch(0.75 0.18 145 / 0.2)' }}>
                  <CheckCheck size={20} style={{ color: 'oklch(0.75 0.18 145)', margin: '0 auto 0.5rem' }} />
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: 'oklch(0.75 0.18 145)', letterSpacing: '0.1em' }}>DEAL COMPLETE</p>
                  <p style={{ fontSize: '0.72rem', color: 'oklch(0.5 0.01 260)', marginTop: '0.25rem' }}>Funds released via Lightning ⚡</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

function DollarSign({ size, style }: any) {
  return <span style={{ ...style, fontSize: size }}>$</span>
}
