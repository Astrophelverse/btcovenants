import { Link } from 'react-router-dom'
import { Bitcoin, ArrowLeft } from 'lucide-react'

const sections = [
  {
    id: 'overview', title: 'What is BTCovenants?',
    content: 'BTCovenants is a Bitcoin-native escrow platform for services and physical delivery. Buyers and service providers lock funds in a Bitcoin multisig contract. Funds release automatically when both parties confirm completion. No banks. No intermediaries. No price surprises.',
  },
  {
    id: 'how-it-works', title: 'How It Works',
    content: '1. Create a deal ticket with description, USD amount, and timeline.\n2. Both parties sign the deal digitally.\n3. Buyer funds the escrow — BTC equivalent locked at current price.\n4. Service is delivered.\n5. Both parties mark done.\n6. Funds released via Lightning to provider.',
  },
  {
    id: 'price-stability', title: 'Price Stability (DLC)',
    content: 'We use Discreet Log Contracts (DLCs) to guarantee price stability. When a deal is created for $1,000, that USD value is locked. At settlement, the oracle calculates exactly how much BTC equals $1,000 at the current rate. The provider always receives the agreed dollar value — regardless of Bitcoin price movement.',
  },
  {
    id: 'fees', title: 'Fee Structure',
    content: 'Under $50: Free\n$50–$250: $2.00 flat\n$250+: 1%\n\nNetwork fees (Bitcoin transaction fees) are shown separately before any payment is made. We always use the economy fee rate to keep costs minimal.',
  },
  {
    id: 'multisig', title: 'Escrow Security',
    content: 'Every escrow uses a 2-of-3 Taproot multisig. The three keys are: (1) Buyer, (2) Service Provider, (3) BTCovenants Support. In the normal flow, buyer + provider sign — support is never involved. Support\'s key is only activated during disputes. Support cannot move funds alone.',
  },
  {
    id: 'disputes', title: 'Disputes',
    content: 'If a dispute arises, either party can open a support ticket. Support reviews the deal, evidence, and communications. Support co-signs the resolution with either buyer or provider (2-of-3 satisfied). Funds are released according to the ruling.',
  },
  {
    id: 'privacy', title: 'Privacy Policy',
    content: 'We collect only what is necessary: email address, username, and Bitcoin wallet address. We do not sell your data to third parties. Deal contents are stored on our servers for dispute resolution purposes. Completed deals can be set to anonymous — your username will not appear publicly.',
  },
  {
    id: 'terms', title: 'Terms of Service',
    content: 'BTCovenants is a platform for legitimate service transactions only. By using this platform you agree not to use it for illegal activities. Escrow funds are held in Bitcoin multisig — BTCovenants does not hold custody of your funds at any time. We are not responsible for losses due to lost wallet keys.',
  },
]

export default function Docs() {
  return (
    <div className="noise min-h-screen" style={{ background: 'oklch(0.04 0.005 260)' }}>
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center gap-4 px-8 py-5" style={{ borderBottom: '1px solid oklch(0.12 0.01 260)' }}>
        <Link to="/" style={{ color: 'oklch(0.4 0.01 260)', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.8rem' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'oklch(0.75 0.18 145)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'oklch(0.4 0.01 260)')}>
          <ArrowLeft size={14} /> BACK
        </Link>
        <div className="flex items-center gap-2">
          <Bitcoin size={14} style={{ color: 'oklch(0.75 0.18 145)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', color: 'oklch(0.95 0.01 260)', letterSpacing: '0.1em' }}>BTCOVENANTS DOCS</span>
        </div>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-8 py-12">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: 'oklch(0.95 0.01 260)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          DOCUMENTATION
        </h1>
        <p style={{ color: 'oklch(0.45 0.01 260)', fontSize: '1rem', marginBottom: '3rem', lineHeight: 1.6 }}>
          Everything you need to know about BTCovenants — how it works, fees, security, and legal.
        </p>

        {/* Quick nav */}
        <div className="flex flex-wrap gap-2 mb-10">
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} style={{
              padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.7rem',
              fontFamily: 'var(--font-display)', letterSpacing: '0.05em', textDecoration: 'none',
              background: 'oklch(0.07 0.008 260)', border: '1px solid oklch(0.13 0.01 260)',
              color: 'oklch(0.5 0.01 260)', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = 'oklch(0.75 0.18 145)'; e.currentTarget.style.borderColor = 'oklch(0.75 0.18 145 / 0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'oklch(0.5 0.01 260)'; e.currentTarget.style.borderColor = 'oklch(0.13 0.01 260)' }}
            >{s.title}</a>
          ))}
        </div>

        <div className="space-y-8">
          {sections.map(s => (
            <div key={s.id} id={s.id} className="rounded-xl p-6" style={{ background: 'oklch(0.07 0.008 260)', border: '1px solid oklch(0.13 0.01 260)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color: 'oklch(0.95 0.01 260)', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                {s.title.toUpperCase()}
              </h2>
              <p style={{ color: 'oklch(0.55 0.01 260)', fontSize: '0.9rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {s.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
