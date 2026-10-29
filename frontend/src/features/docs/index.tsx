import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import {
  Lock,
  Scale,
  Shield,
  Zap,
  Terminal,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const sections = [
  {
    id: 'overview',
    title: '1. What is BTCovenants?',
    icon: Shield,
    content:
      'BTCovenants is a Bitcoin-native escrow and settlement protocol designed for freelancing, contract engineering, and physical deliveries. Buyers and service providers lock collateral into a BIP341 Taproot 2-of-3 multisig covenant. Funds release automatically upon dual cryptographic confirmation. No centralized banks. No custody risk. No price volatility surprises.',
  },
  {
    id: 'how-it-works',
    title: '2. Contract Lifecycle & Protocol Flow',
    icon: Zap,
    content:
      '1. Deal Ticket Initiation: Buyer creates a covenant specifying deliverables, agreed USD valuation, and milestone timeline.\n2. Provider Acceptance: Service provider reviews terms and registers their compressed Schnorr public key.\n3. Mutual Digital Signing: Both parties sign the agreement with Schnorr keys, generating the 2-of-3 Taproot address.\n4. On-Chain Funding: Buyer sends Bitcoin to the Taproot address. UTXOs are locked on-chain.\n5. Milestone Delivery: Provider uploads deliverables and marks the milestone complete.\n6. Settlement Release: Buyer confirms receipt. The 2-of-3 Taproot covenant unlocks and broadcasts payout to the provider.',
  },
  {
    id: 'price-stability',
    title: '3. Discreet Log Contracts (DLC) Volatility Shield',
    icon: Scale,
    content:
      'To eliminate Bitcoin price risk during delivery, BTCovenants implements Discreet Log Contracts (DLCs). When a contract is established for $1,000, that exact USD value is locked into the oracle settlement adaptor. At settlement, the oracle attestation calculates precisely how many satoshis equal $1,000 at the current market rate. The service provider is guaranteed to receive their agreed dollar value in Bitcoin regardless of market swings.',
  },
  {
    id: 'fees',
    title: '4. Protocol Fee Schedule',
    icon: Lock,
    content:
      '• Under $50 USD: Free (0.00%)\n• $50 – $250 USD: $2.00 flat\n• $250+ USD: 1.00%\n\nBitcoin network miner fees (sat/vByte) are estimated dynamically via live Mempool.space fee rates and displayed upfront before any on-chain transaction is initiated.',
  },
  {
    id: 'multisig',
    title: '5. Taproot 2-of-3 Cryptographic Architecture',
    icon: Lock,
    content:
      'Every covenant utilizes a 2-of-3 Taproot multisig script tree with three distinct key paths:\n1. Key 1: Buyer Schnorr Key (BIP340)\n2. Key 2: Service Provider Schnorr Key (BIP340)\n3. Key 3: BTCovenants Support Arbiter Key (Dispute fallback only)\n\nIn standard execution, Buyer + Provider sign mutually. BTCovenants Support is never involved and cannot move or confiscate funds independently.',
  },
  {
    id: 'disputes',
    title: '6. Cryptographic Dispute Resolution',
    icon: Shield,
    content:
      'If a milestone dispute arises that cannot be resolved in the covenant room, either party can escalate to arbitration. BTCovenants Support reviews communications and deliverables. Support co-signs a resolution transaction with either the Buyer or Provider (satisfying the 2-of-3 quorum requirement). Funds are released according to the ruling.',
  },
]

const apiEndpoints = [
  { method: 'POST', path: '/api/auth/signup', desc: 'Register account + generate Taproot wallet' },
  { method: 'POST', path: '/api/auth/login', desc: 'Authenticate with JWT bearer token' },
  { method: 'GET', path: '/api/wallet/price', desc: 'Live BTC/USD CoinGecko oracle index' },
  { method: 'GET', path: '/api/wallet/fees', desc: 'Live Mempool.space sat/vByte fee rates' },
  { method: 'GET', path: '/api/wallet/balance/:addr', desc: 'Confirmed/unconfirmed balance via Esplora' },
  { method: 'POST', path: '/api/wallet/estimate-fees', desc: 'Full fee calculation breakdown' },
  { method: 'POST', path: '/api/tickets/create', desc: 'Create covenant deal ticket' },
  { method: 'GET', path: '/api/tickets/:id', desc: 'Get ticket metadata & message stream' },
  { method: 'POST', path: '/api/tickets/:id/join', desc: 'Claim ticket as provider' },
  { method: 'POST', path: '/api/tickets/:id/sign', desc: 'Sign covenant with Schnorr signature' },
  { method: 'POST', path: '/api/tickets/:id/mark-done', desc: 'Mark fulfillment & release multisig' },
  { method: 'POST', path: '/api/tickets/:id/message', desc: 'Send encrypted in-deal chat message' },
  { method: 'POST', path: '/api/escrow/create', desc: 'Generate 2-of-3 Taproot multisig script' },
  { method: 'GET', path: '/api/deals/completed', desc: 'Public ledger of settled covenants' },
]

export function Docs() {
  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-6 max-w-5xl'>
        {/* Header */}
        <div>
          <div className='flex items-center gap-2 mb-1'>
            <Badge variant='outline' className='font-mono text-[10px] uppercase tracking-widest'>
              DEVELOPER & PROTOCOL SPECIFICATION
            </Badge>
          </div>
          <h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight font-mono'>
            PROTOCOL DOCUMENTATION
          </h1>
          <p className='text-sm text-muted-foreground'>
            Complete architecture guide, Discreet Log Contracts, Taproot multisig specs, and REST API reference.
          </p>
        </div>

        {/* Documentation Sections */}
        <div className='space-y-4'>
          {sections.map((sec) => (
            <Card key={sec.id} className='border-border/80'>
              <CardHeader className='pb-2'>
                <CardTitle className='font-mono text-sm tracking-tight flex items-center gap-2 text-foreground'>
                  <sec.icon className='h-4 w-4' />
                  {sec.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='font-mono text-xs text-muted-foreground leading-relaxed whitespace-pre-line'>
                  {sec.content}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* API Reference Table */}
        <Card className='border-border/80 overflow-hidden'>
          <CardHeader>
            <CardTitle className='font-mono text-sm tracking-tight flex items-center gap-2'>
              <Terminal className='h-4 w-4' />
              BACKEND API REFERENCE (FASTAPI)
            </CardTitle>
            <CardDescription className='font-mono text-xs'>
              Standardized endpoints implemented in Python FastAPI backend and replicated in frontend mock engine.
            </CardDescription>
          </CardHeader>
          <div className='overflow-x-auto'>
            <table className='w-full text-left font-mono text-xs'>
              <thead className='border-b border-border bg-muted/40 uppercase tracking-wider text-muted-foreground'>
                <tr>
                  <th className='p-3.5'>Method</th>
                  <th className='p-3.5'>Endpoint</th>
                  <th className='p-3.5'>Description</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {apiEndpoints.map((ep, i) => (
                  <tr key={i} className='hover:bg-muted/30 transition-colors'>
                    <td className='p-3.5'>
                      <Badge
                        variant={ep.method === 'POST' ? 'default' : 'outline'}
                        className='text-[9px] font-mono'
                      >
                        {ep.method}
                      </Badge>
                    </td>
                    <td className='p-3.5 text-foreground font-bold'>{ep.path}</td>
                    <td className='p-3.5 text-muted-foreground'>{ep.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Main>
    </>
  )
}
