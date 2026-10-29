import { useEffect, useState } from 'react'
import { CheckSquare } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import api from '../lib/api'

export default function Deals() {
  const [deals, setDeals] = useState<any[]>([])

  useEffect(() => { api.get('/deals/completed').then(r => setDeals(r.data)).catch(() => {}) }, [])

  return (
    <AppLayout>
      <div className="p-8">
        <div className="mb-8">
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'oklch(0.75 0.18 145)', letterSpacing: '0.2em', marginBottom: '0.35rem' }}>HISTORY</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, color: 'oklch(0.95 0.01 260)', letterSpacing: '-0.01em' }}>COMPLETED DEALS</h1>
        </div>
        {deals.length === 0 ? (
          <div className="rounded-xl py-20 text-center" style={{ background: 'oklch(0.07 0.008 260)', border: '1px solid oklch(0.12 0.01 260)' }}>
            <CheckSquare size={32} style={{ color: 'oklch(0.2 0.01 260)', margin: '0 auto 1rem' }} />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', color: 'oklch(0.3 0.01 260)', letterSpacing: '0.12em' }}>NO COMPLETED DEALS YET</p>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid oklch(0.13 0.01 260)' }}>
            {deals.map((d, i) => (
              <div key={d.id} className="flex items-center justify-between px-5 py-4"
                style={{ background: 'oklch(0.07 0.008 260)', borderBottom: i < deals.length - 1 ? '1px solid oklch(0.1 0.01 260)' : 'none' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: 'oklch(0.85 0.01 260)', fontWeight: 700 }}>{d.title}</p>
                  <p style={{ fontSize: '0.72rem', color: 'oklch(0.4 0.01 260)', marginTop: '0.2rem' }}>
                    {d.buyer} → {d.provider}
                  </p>
                </div>
                <div className="text-right">
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 900, color: 'oklch(0.75 0.18 145)' }}>${d.amount_usd}</p>
                  <p style={{ fontSize: '0.7rem', color: 'oklch(0.35 0.01 260)', marginTop: '0.2rem' }}>COMPLETED</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
