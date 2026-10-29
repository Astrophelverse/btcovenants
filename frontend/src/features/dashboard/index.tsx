import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { CovenantOverview } from './components/covenant-overview'
import { RecentCovenants } from './components/recent-covenants'
import { CreateTicketDialog } from '@/features/tickets/components/create-ticket-dialog'
import { useCovenantStore } from '@/stores/covenant-store'
import {
  Bitcoin,
  ShieldCheck,
  Wallet,
  Zap,
  Lock,
  Scale,
  RefreshCw,
  Plus,
  ArrowRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'

export function Dashboard() {
  const {
    btcPrice,
    btcPriceChange24h,
    feeRates,
    currentUser,
    tickets,
    simulatePriceTick,
    activePersonaKey,
    switchPersona,
  } = useCovenantStore()

  const [ticking, setTicking] = useState(false)

  const handleTick = () => {
    setTicking(true)
    simulatePriceTick()
    setTimeout(() => setTicking(false), 500)
  }

  const activeTickets = tickets.filter((t) => ['pending', 'active', 'funded'].includes(t.status))
  const completedTickets = tickets.filter((t) => t.status === 'completed')
  const totalLockedBtc = activeTickets.reduce((sum, t) => sum + t.amount_btc, 0)
  const totalLockedUsd = activeTickets.reduce((sum, t) => sum + t.amount_usd, 0)

  return (
    <>
      {/* Top Header */}
      <Header>
        <div className='flex items-center gap-2 me-auto'>
          {/* Live BTC Price Pill */}
          <div className='flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-muted/60 font-mono text-xs'>
            <Bitcoin className='h-3.5 w-3.5 text-foreground' />
            <span className='font-bold'>${btcPrice.toLocaleString()}</span>
            <span className='text-[10px] text-muted-foreground'>+{btcPriceChange24h}%</span>
          </div>

          {/* Mempool Gas Indicator */}
          <div className='hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md border border-border bg-muted/40 font-mono text-xs text-muted-foreground'>
            <Zap className='h-3 w-3' />
            <span>{feeRates.economyFee} sat/vB</span>
          </div>

          {/* Quick Persona Switcher */}
          <div className='hidden md:flex items-center gap-1 ml-2 text-xs font-mono'>
            <span className='text-muted-foreground'>Persona:</span>
            <button
              onClick={() => switchPersona(activePersonaKey === 'alice' ? 'satoshi' : 'alice')}
              className='px-2 py-0.5 rounded border border-border hover:bg-muted font-bold transition-colors'
            >
              @{currentUser.username} ({currentUser.role})
            </button>
          </div>
        </div>

        <Search />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      {/* Main Content */}
      <Main>
        <div className='mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <Badge variant='outline' className='font-mono text-[10px] uppercase tracking-widest'>
                BITCOIN COVENANT PROTOCOL
              </Badge>
              <span className='text-xs text-muted-foreground font-mono'>v2.4 TAPROOT</span>
            </div>
            <h1 className='text-3xl font-extrabold tracking-tight font-mono'>
              ESCROW COMMAND
            </h1>
            <p className='text-sm text-muted-foreground mt-0.5'>
              Trustless Bitcoin 2-of-3 multisig escrows with Discreet Log Contract (DLC) price peg.
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={handleTick}
              className='gap-1.5 font-mono text-xs'
              title='Simulate real-time CoinGecko price volatility'
            >
              <RefreshCw className={`h-3.5 w-3.5 ${ticking ? 'animate-spin' : ''}`} />
              Tick Price
            </Button>
            <CreateTicketDialog>
              <Button size='sm' className='gap-1.5 font-mono text-xs uppercase tracking-wider'>
                <Plus className='h-3.5 w-3.5' />
                New Deal Ticket
              </Button>
            </CreateTicketDialog>
          </div>
        </div>

        {/* Top 4 Metric Cards */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6'>
          {/* BTC Price */}
          <Card className='border-border/80'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-xs font-mono uppercase tracking-wider text-muted-foreground'>
                Bitcoin Index
              </CardTitle>
              <Bitcoin className='h-4 w-4 text-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold font-mono'>${btcPrice.toLocaleString()}</div>
              <p className='text-xs text-muted-foreground mt-1'>
                CoinGecko Oracle · +{btcPriceChange24h}% (24h)
              </p>
            </CardContent>
          </Card>

          {/* Active Escrow TVL */}
          <Card className='border-border/80'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-xs font-mono uppercase tracking-wider text-muted-foreground'>
                Covenants TVL Locked
              </CardTitle>
              <Lock className='h-4 w-4 text-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold font-mono'>
                ${totalLockedUsd.toLocaleString()}
              </div>
              <p className='text-xs text-muted-foreground font-mono mt-1'>
                {totalLockedBtc.toFixed(4)} BTC in Taproot contracts
              </p>
            </CardContent>
          </Card>

          {/* Active Vault Balance */}
          <Card className='border-border/80'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-xs font-mono uppercase tracking-wider text-muted-foreground'>
                My Vault Balance
              </CardTitle>
              <Wallet className='h-4 w-4 text-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold font-mono'>
                {currentUser.balance_btc.toFixed(4)} BTC
              </div>
              <p className='text-xs text-muted-foreground font-mono mt-1'>
                ≈ ${(currentUser.balance_btc * btcPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </p>
            </CardContent>
          </Card>

          {/* Completed Deals */}
          <Card className='border-border/80'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-xs font-mono uppercase tracking-wider text-muted-foreground'>
                Settlement Health
              </CardTitle>
              <ShieldCheck className='h-4 w-4 text-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold font-mono'>100% On-Chain</div>
              <p className='text-xs text-muted-foreground mt-1'>
                {completedTickets.length} settled deals · 0 disputes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Live Mempool Fee Banner */}
        <div className='p-3.5 mb-6 rounded-lg border border-border bg-card flex flex-wrap items-center justify-between gap-3 text-xs font-mono'>
          <div className='flex items-center gap-2'>
            <Zap className='h-4 w-4 text-foreground' />
            <span className='font-bold uppercase tracking-wider'>Mempool Network Gas (Sat/vByte):</span>
          </div>
          <div className='flex items-center gap-6'>
            <div>
              <span className='text-muted-foreground'>ECONOMY: </span>
              <span className='font-bold'>{feeRates.economyFee} sat/vB</span>
              <span className='text-muted-foreground text-[10px] ml-1'>(~${((feeRates.economyFee * 200 / 1e8) * btcPrice).toFixed(2)})</span>
            </div>
            <div>
              <span className='text-muted-foreground'>STANDARD: </span>
              <span className='font-bold'>{feeRates.hourFee} sat/vB</span>
              <span className='text-muted-foreground text-[10px] ml-1'>(~${((feeRates.hourFee * 200 / 1e8) * btcPrice).toFixed(2)})</span>
            </div>
            <div>
              <span className='text-muted-foreground'>FASTEST: </span>
              <span className='font-bold'>{feeRates.fastestFee} sat/vB</span>
              <span className='text-muted-foreground text-[10px] ml-1'>(~${((feeRates.fastestFee * 200 / 1e8) * btcPrice).toFixed(2)})</span>
            </div>
          </div>
          <div className='text-muted-foreground text-[11px]'>
            Via Esplora Testnet & Mempool.space
          </div>
        </div>

        {/* Charts and Streams Grid */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-7 mb-6'>
          {/* Escrow TVL Growth */}
          <Card className='lg:col-span-4 border-border/80'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='font-mono tracking-tight'>COVENANT VOLUME SETTLED</CardTitle>
                  <CardDescription className='text-xs'>
                    Monthly cumulative USD value released across 2-of-3 Taproot escrows.
                  </CardDescription>
                </div>
                <Badge variant='outline' className='font-mono text-xs'>
                  Monthly
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='pl-2'>
              <CovenantOverview />
            </CardContent>
          </Card>

          {/* Recent Deals & Tickets Stream */}
          <Card className='lg:col-span-3 border-border/80 flex flex-col'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='font-mono tracking-tight'>LIVE DEAL TICKETS</CardTitle>
                  <CardDescription className='text-xs'>
                    Real-time covenant status and counterparty state.
                  </CardDescription>
                </div>
                <Link to='/tickets' className='text-xs font-mono underline hover:text-foreground text-muted-foreground'>
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent className='flex-1'>
              <RecentCovenants />
            </CardContent>
          </Card>
        </div>

        {/* DLC Volatility Protection Card */}
        <Card className='border-border/80 bg-muted/20'>
          <CardContent className='p-6'>
            <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
              <div className='space-y-1 max-w-2xl'>
                <div className='flex items-center gap-2'>
                  <Scale className='h-4 w-4' />
                  <span className='font-mono font-bold text-sm tracking-wide'>
                    DISCREET LOG CONTRACT (DLC) PRICE STABILITY ARCHITECTURE
                  </span>
                </div>
                <p className='text-xs text-muted-foreground leading-relaxed'>
                  How does BTCovenants prevent price risk? When Alice agrees to pay Satoshi $4,500, that exact USD value is locked into the oracle settlement adaptor. Whether Bitcoin jumps to $150,000 or drops to $50,000 during delivery, Satoshi always receives exactly $4,500 worth of Bitcoin upon release.
                </p>
              </div>
              <div className='flex items-center gap-3 shrink-0'>
                <Link to='/dlc-calculator'>
                  <Button variant='outline' className='font-mono text-xs gap-1.5'>
                    <Scale className='h-3.5 w-3.5' />
                    Test DLC Simulator
                    <ArrowRight className='h-3.5 w-3.5' />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
