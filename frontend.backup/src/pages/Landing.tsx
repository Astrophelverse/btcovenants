import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Zap, Lock, Globe, ChevronRight, Bitcoin, ArrowRight } from 'lucide-react'

// Animated grid beam that sweeps across the background
function BeamLayer() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      {/* Static grid */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      {/* Radial fade from center */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, oklch(0.04 0.005 260) 70%)',
        }}
      />
      {/* Green glow orb top */}
      <div
        className="absolute animate-pulse-glow"
        style={{
          top: '-10%', left: '30%',
          width: '600px', height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, oklch(0.75 0.18 145 / 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      {/* Orange glow orb bottom right */}
      <div
        className="absolute"
        style={{
          bottom: '10%', right: '10%',
          width: '400px', height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, oklch(0.72 0.18 55 / 0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Sweeping beam */}
      <div
        style={{
          position: 'absolute',
          top: '20%', left: 0,
          width: '2px', height: '300px',
          background: 'linear-gradient(180deg, transparent, oklch(0.75 0.18 145 / 0.6), transparent)',
          animation: 'beam-move 8s linear infinite',
          animationDelay: '2s',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%', left: 0,
          width: '2px', height: '200px',
          background: 'linear-gradient(180deg, transparent, oklch(0.72 0.18 55 / 0.4), transparent)',
          animation: 'beam-move 12s linear infinite',
          animationDelay: '5s',
        }}
      />
    </div>
  )
}

// Stat card
function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div
      className="relative overflow-hidden rounded-xl p-6"
      style={{
        background: 'oklch(0.07 0.008 260)',
        border: '1px solid oklch(0.15 0.01 260)',
      }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full"
        style={{ background: 'radial-gradient(oklch(0.75 0.18 145 / 0.08), transparent)', filter: 'blur(20px)' }} />
      <p style={{ color: 'oklch(0.5 0.01 260)', fontSize: '0.75rem', letterSpacing: '0.1em', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>{label}</p>
      <p style={{ color: 'oklch(0.95 0.01 260)', fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginTop: '0.5rem' }}>{value}</p>
      {sub && <p style={{ color: 'oklch(0.75 0.18 145)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{sub}</p>}
    </div>
  )
}

// Feature card
function FeatureCard({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-xl p-6 transition-all duration-300 cursor-default"
      style={{
        background: hovered ? 'oklch(0.09 0.01 260)' : 'oklch(0.07 0.008 260)',
        border: `1px solid ${hovered ? 'oklch(0.75 0.18 145 / 0.4)' : 'oklch(0.15 0.01 260)'}`,
        boxShadow: hovered ? '0 0 30px oklch(0.75 0.18 145 / 0.1)' : 'none',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
    >
      <div className="mb-4 inline-flex rounded-lg p-2"
        style={{ background: 'oklch(0.75 0.18 145 / 0.1)', border: '1px solid oklch(0.75 0.18 145 / 0.2)' }}>
        <Icon size={20} style={{ color: 'oklch(0.75 0.18 145)' }} />
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color: 'oklch(0.95 0.01 260)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>{title}</h3>
      <p style={{ color: 'oklch(0.5 0.01 260)', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
    </div>
  )
}

// How it works step
function Step({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="relative flex gap-4">
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ background: 'oklch(0.75 0.18 145 / 0.15)', border: '1px solid oklch(0.75 0.18 145 / 0.4)', color: 'oklch(0.75 0.18 145)', fontFamily: 'var(--font-display)' }}>
          {num}
        </div>
        {num !== '05' && <div className="w-px flex-1 mt-2" style={{ background: 'oklch(0.15 0.01 260)', minHeight: '40px' }} />}
      </div>
      <div className="pb-8">
        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, color: 'oklch(0.95 0.01 260)', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>{title}</h4>
        <p style={{ color: 'oklch(0.5 0.01 260)', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
      </div>
    </div>
  )
}

export default function Landing() {
  return (
    <div className="noise relative min-h-screen" style={{ background: 'oklch(0.04 0.005 260)' }}>
      <BeamLayer />

      {/* NAV */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5" style={{ borderBottom: '1px solid oklch(0.12 0.01 260)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'oklch(0.75 0.18 145 / 0.15)', border: '1px solid oklch(0.75 0.18 145 / 0.3)' }}>
            <Bitcoin size={16} style={{ color: 'oklch(0.75 0.18 145)' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'oklch(0.95 0.01 260)', letterSpacing: '0.1em' }}>
            BTCOVENANTS
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['About', 'How it works', 'Docs'].map((item) => (
            <Link
              key={item}
              to={item === 'Docs' ? '/docs' : `#${item.toLowerCase().replace(/ /g, '-')}`}
              style={{ color: 'oklch(0.5 0.01 260)', fontSize: '0.875rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'oklch(0.95 0.01 260)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'oklch(0.5 0.01 260)')}
            >
              {item.toUpperCase()}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" style={{
            padding: '0.5rem 1.25rem', borderRadius: '8px', fontSize: '0.8rem',
            fontFamily: 'var(--font-display)', letterSpacing: '0.08em',
            color: 'oklch(0.5 0.01 260)', border: '1px solid oklch(0.15 0.01 260)',
            textDecoration: 'none', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'oklch(0.25 0.015 260)'; e.currentTarget.style.color = 'oklch(0.95 0.01 260)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'oklch(0.15 0.01 260)'; e.currentTarget.style.color = 'oklch(0.5 0.01 260)' }}
          >LOGIN</Link>
          <Link to="/signup" style={{
            padding: '0.5rem 1.25rem', borderRadius: '8px', fontSize: '0.8rem',
            fontFamily: 'var(--font-display)', letterSpacing: '0.08em',
            background: 'oklch(0.75 0.18 145)', color: 'oklch(0.04 0.005 260)',
            textDecoration: 'none', fontWeight: 700, transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'oklch(0.85 0.18 145)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'oklch(0.75 0.18 145)' }}
          >GET STARTED</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-28 pb-24">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8"
          style={{ background: 'oklch(0.75 0.18 145 / 0.08)', border: '1px solid oklch(0.75 0.18 145 / 0.2)' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: 'oklch(0.75 0.18 145)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: 'oklch(0.75 0.18 145)', letterSpacing: '0.15em' }}>BITCOIN-NATIVE ESCROW</span>
        </div>

        <h1 className="animate-flicker" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          maxWidth: '900px',
          color: 'oklch(0.95 0.01 260)',
          textShadow: '0 0 60px oklch(0.75 0.18 145 / 0.2)',
        }}>
          TRUSTLESS<br />
          <span style={{ color: 'oklch(0.75 0.18 145)', textShadow: '0 0 40px oklch(0.75 0.18 145 / 0.5)' }}>ESCROW</span>
          <br />ON BITCOIN
        </h1>

        <p style={{
          color: 'oklch(0.5 0.01 260)', fontSize: '1.1rem',
          maxWidth: '560px', lineHeight: 1.7, marginTop: '1.5rem', marginBottom: '2.5rem',
        }}>
          Lock funds in a Bitcoin multisig contract. Both parties sign. Funds release automatically.
          No banks. No middlemen. No price surprises.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/signup" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.875rem 2rem', borderRadius: '10px',
            background: 'oklch(0.75 0.18 145)', color: 'oklch(0.04 0.005 260)',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem',
            letterSpacing: '0.1em', textDecoration: 'none', transition: 'all 0.2s',
            boxShadow: '0 0 30px oklch(0.75 0.18 145 / 0.3)',
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 50px oklch(0.75 0.18 145 / 0.5)'; e.currentTarget.style.background = 'oklch(0.85 0.18 145)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 30px oklch(0.75 0.18 145 / 0.3)'; e.currentTarget.style.background = 'oklch(0.75 0.18 145)' }}
          >
            OPEN A DEAL <ArrowRight size={16} />
          </Link>
          <Link to="/docs" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.875rem 2rem', borderRadius: '10px',
            border: '1px solid oklch(0.2 0.01 260)', color: 'oklch(0.7 0.01 260)',
            fontFamily: 'var(--font-display)', fontSize: '0.85rem',
            letterSpacing: '0.1em', textDecoration: 'none', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'oklch(0.35 0.01 260)'; e.currentTarget.style.color = 'oklch(0.95 0.01 260)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'oklch(0.2 0.01 260)'; e.currentTarget.style.color = 'oklch(0.7 0.01 260)' }}
          >
            READ DOCS <ChevronRight size={16} />
          </Link>
        </div>

        {/* Terminal mockup */}
        <div className="mt-16 w-full max-w-2xl rounded-xl overflow-hidden animate-float"
          style={{ border: '1px solid oklch(0.15 0.01 260)', background: 'oklch(0.06 0.007 260)' }}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid oklch(0.12 0.01 260)', background: 'oklch(0.05 0.006 260)' }}>
            <div className="w-3 h-3 rounded-full" style={{ background: 'oklch(0.65 0.2 25)' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: 'oklch(0.72 0.18 55)' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: 'oklch(0.75 0.18 145)' }} />
            <span style={{ color: 'oklch(0.35 0.01 260)', fontSize: '0.75rem', fontFamily: 'var(--font-display)', marginLeft: '0.5rem', letterSpacing: '0.05em' }}>btcovenants — escrow terminal</span>
          </div>
          <div className="p-6 text-left font-mono text-sm space-y-2">
            {[
              { prefix: '$', text: 'create-deal --amount $1000 --timeline 30d', color: 'oklch(0.75 0.18 145)' },
              { prefix: '✓', text: 'Deal created · BTC locked at $95,420 · Escrow: bc1q4x...3f7k', color: 'oklch(0.5 0.01 260)' },
              { prefix: '$', text: 'sign --role buyer', color: 'oklch(0.75 0.18 145)' },
              { prefix: '✓', text: 'Buyer signed · Waiting for provider...', color: 'oklch(0.5 0.01 260)' },
              { prefix: '$', text: 'sign --role provider && mark-done', color: 'oklch(0.75 0.18 145)' },
              { prefix: '✓', text: 'Both signed · Releasing 0.01047 BTC to provider ⚡', color: 'oklch(0.75 0.18 145)' },
            ].map((line, i) => (
              <div key={i} className="flex gap-3">
                <span style={{ color: line.color, flexShrink: 0 }}>{line.prefix}</span>
                <span style={{ color: line.prefix === '$' ? 'oklch(0.8 0.01 260)' : 'oklch(0.5 0.01 260)' }}>{line.text}</span>
              </div>
            ))}
            <div className="flex gap-3">
              <span style={{ color: 'oklch(0.75 0.18 145)' }}>$</span>
              <span style={{ color: 'oklch(0.8 0.01 260)' }}>
                <span className="animate-pulse" style={{ display: 'inline-block', width: '8px', height: '14px', background: 'oklch(0.75 0.18 145)', verticalAlign: 'middle' }} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative z-10 px-8 pb-20" id="about">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Volume" value="$0" sub="MVP launching soon" />
          <StatCard label="Deals Closed" value="0" sub="Be the first" />
          <StatCard label="Avg Fee" value="< 1%" sub="Lowest in market" />
          <StatCard label="Settlement" value="⚡ Fast" sub="Via Lightning" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 px-8 pb-24" id="how-it-works">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: 'oklch(0.75 0.18 145)', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>WHY BTCOVENANTS</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900, color: 'oklch(0.95 0.01 260)', letterSpacing: '-0.02em' }}>
              BUILT ON BITCOIN.<br />
              <span style={{ color: 'oklch(0.75 0.18 145)' }}>NOT PROMISES.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard icon={Lock} title="2-OF-3 MULTISIG" desc="Funds locked in a Taproot multisig. Both parties must sign to release. Support key only activates on disputes." />
            <FeatureCard icon={Zap} title="LIGHTNING PAYOUTS" desc="Service provider receives funds instantly via Lightning Network. Near-zero fees. No waiting for block confirmations." />
            <FeatureCard icon={Shield} title="DLC PRICE ORACLE" desc="Agree on USD value, pay in BTC. Discreet Log Contracts ensure $1,000 agreed = $1,000 received regardless of price." />
            <FeatureCard icon={Globe} title="BTC IDENTITY" desc="Every user gets a username mapped to their Bitcoin wallet. Human-readable, on-chain verifiable." />
            <FeatureCard icon={Bitcoin} title="TRANSPARENT FEES" desc="Platform fee, network fee, and exact amount provider receives — all shown before a single sat moves." />
            <FeatureCard icon={ChevronRight} title="SUPPORT AS FALLBACK" desc="Disputes are rare. When they happen, support co-signs the resolution. They can never move funds alone." />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: 'oklch(0.75 0.18 145)', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>THE FLOW</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900, color: 'oklch(0.95 0.01 260)', letterSpacing: '-0.02em' }}>HOW IT WORKS</h2>
          </div>
          <div className="max-w-md mx-auto">
            <Step num="01" title="CREATE A DEAL" desc="Describe the work, set the USD amount and timeline. Both parties sign digitally." />
            <Step num="02" title="CONNECT & FUND" desc="Buyer connects wallet. Platform checks balance. BTC gets locked in multisig escrow." />
            <Step num="03" title="WORK GETS DONE" desc="Service provider delivers. Timeline tracked on-chain." />
            <Step num="04" title="BOTH CONFIRM" desc="Buyer marks done. Provider co-signs. DLC oracle calculates exact BTC at settlement." />
            <Step num="05" title="FUNDS RELEASED" desc="Provider receives exactly what was agreed — in BTC, at today's price. Instant via Lightning." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-8 pb-24">
        <div className="max-w-3xl mx-auto rounded-2xl p-12 text-center relative overflow-hidden"
          style={{ background: 'oklch(0.07 0.008 260)', border: '1px solid oklch(0.15 0.01 260)' }}>
          <div className="absolute inset-0 grid-bg-sm opacity-20" />
          <div className="absolute inset-0 rounded-2xl" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, oklch(0.75 0.18 145 / 0.06), transparent)' }} />
          <div className="relative z-10">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900, color: 'oklch(0.95 0.01 260)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              READY TO TRANSACT<br />
              <span style={{ color: 'oklch(0.75 0.18 145)' }}>WITHOUT TRUST?</span>
            </h2>
            <p style={{ color: 'oklch(0.5 0.01 260)', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Sign up in 30 seconds. No KYC. No bank. Just Bitcoin.
            </p>
            <Link to="/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.875rem 2.5rem', borderRadius: '10px',
              background: 'oklch(0.75 0.18 145)', color: 'oklch(0.04 0.005 260)',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem',
              letterSpacing: '0.1em', textDecoration: 'none',
              boxShadow: '0 0 40px oklch(0.75 0.18 145 / 0.4)',
            }}>
              START NOW <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 px-8 py-8" style={{ borderTop: '1px solid oklch(0.12 0.01 260)' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bitcoin size={14} style={{ color: 'oklch(0.75 0.18 145)' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', color: 'oklch(0.35 0.01 260)', letterSpacing: '0.1em' }}>BTCOVENANTS</span>
          </div>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Docs', 'Support'].map(item => (
              <Link key={item} to={item === 'Docs' ? '/docs' : '#'}
                style={{ color: 'oklch(0.35 0.01 260)', fontSize: '0.75rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'oklch(0.75 0.18 145)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'oklch(0.35 0.01 260)')}
              >{item}</Link>
            ))}
          </div>
          <p style={{ color: 'oklch(0.25 0.01 260)', fontSize: '0.7rem', fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>
            © 2025 BTCOVENANTS · BITCOIN ONLY
          </p>
        </div>
      </footer>
    </div>
  )
}
