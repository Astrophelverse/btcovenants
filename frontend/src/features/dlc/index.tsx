import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { useCovenantStore } from '@/stores/covenant-store'
import { ShieldCheck, AlertCircle, Info } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function DlcCalculator() {
  const { btcPrice } = useCovenantStore()

  const [contractUsd, setContractUsd] = useState(2500)
  const [agreementPrice, setAgreementPrice] = useState(btcPrice)
  const [settlementPrice, setSettlementPrice] = useState(120000)

  // Calculations
  const lockedBtc = Number((contractUsd / agreementPrice).toFixed(8))
  const lockedSats = Math.round(lockedBtc * 1e8)

  const providerSatsAtSettlement = Math.round((contractUsd / settlementPrice) * 1e8)
  const providerBtcAtSettlement = Number((providerSatsAtSettlement / 1e8).toFixed(8))
  const providerReceivedUsd = Number(((providerSatsAtSettlement / 1e8) * settlementPrice).toFixed(2))

  // Without DLC: provider receives lockedBtc regardless of price
  const withoutDlcUsdValue = Number((lockedBtc * settlementPrice).toFixed(2))
  const differenceUsd = Number((withoutDlcUsdValue - contractUsd).toFixed(2))

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-6 max-w-5xl'>
        {/* Title */}
        <div>
          <div className='flex items-center gap-2 mb-1'>
            <Badge variant='outline' className='font-mono text-[10px] uppercase tracking-widest'>
              PRICE STABILITY PROTOCOL
            </Badge>
            <span className='text-xs text-muted-foreground font-mono'>
              Discreet Log Contracts (DLCs)
            </span>
          </div>
          <h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight font-mono'>
            DLC VOLATILITY SHIELD SIMULATOR
          </h1>
          <p className='text-sm text-muted-foreground'>
            Simulate Bitcoin market volatility and verify how Discreet Log Contracts guarantee exact USD payouts to service providers.
          </p>
        </div>

        {/* Interactive Controls Card */}
        <Card className='border-border/80'>
          <CardHeader>
            <CardTitle className='font-mono text-sm tracking-tight'>
              CONTRACT PARAMETERS & MARKET SIMULATION
            </CardTitle>
            <CardDescription className='text-xs font-mono'>
              Adjust the contract value and drag the Bitcoin settlement price to observe oracle adaptor execution.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6 font-mono text-xs'>
            <div className='grid gap-6 md:grid-cols-3'>
              {/* Agreed Contract USD */}
              <div className='space-y-2'>
                <Label className='text-muted-foreground uppercase text-[10px]'>
                  Agreed Deal Value (USD)
                </Label>
                <div className='relative'>
                  <span className='absolute left-3 top-2.5 text-muted-foreground'>$</span>
                  <Input
                    type='number'
                    min='100'
                    step='100'
                    className='pl-7 font-mono font-bold'
                    value={contractUsd}
                    onChange={(e) => setContractUsd(Math.max(1, parseFloat(e.target.value) || 0))}
                  />
                </div>
                <p className='text-[10px] text-muted-foreground'>Contracted scope amount</p>
              </div>

              {/* Agreement BTC Price */}
              <div className='space-y-2'>
                <Label className='text-muted-foreground uppercase text-[10px]'>
                  BTC Price at Agreement
                </Label>
                <div className='relative'>
                  <span className='absolute left-3 top-2.5 text-muted-foreground'>$</span>
                  <Input
                    type='number'
                    className='pl-7 font-mono'
                    value={agreementPrice}
                    onChange={(e) => setAgreementPrice(Math.max(1000, parseFloat(e.target.value) || 1000))}
                  />
                </div>
                <p className='text-[10px] text-muted-foreground'>Oracle price when escrow locked</p>
              </div>

              {/* Settlement BTC Price */}
              <div className='space-y-2'>
                <Label className='text-muted-foreground uppercase text-[10px]'>
                  Simulated Price at Delivery
                </Label>
                <div className='relative'>
                  <span className='absolute left-3 top-2.5 text-muted-foreground'>$</span>
                  <Input
                    type='number'
                    className='pl-7 font-mono font-bold'
                    value={settlementPrice}
                    onChange={(e) => setSettlementPrice(Math.max(1000, parseFloat(e.target.value) || 1000))}
                  />
                </div>
                <div className='flex gap-1.5 pt-1'>
                  <button
                    onClick={() => setSettlementPrice(55000)}
                    className='px-1.5 py-0.5 rounded border border-border text-[9px] hover:bg-muted'
                  >
                    $55k (-42%)
                  </button>
                  <button
                    onClick={() => setSettlementPrice(agreementPrice)}
                    className='px-1.5 py-0.5 rounded border border-border text-[9px] hover:bg-muted'
                  >
                    Flat (0%)
                  </button>
                  <button
                    onClick={() => setSettlementPrice(140000)}
                    className='px-1.5 py-0.5 rounded border border-border text-[9px] hover:bg-muted'
                  >
                    $140k (+47%)
                  </button>
                </div>
              </div>
            </div>

            {/* Slider */}
            <div className='space-y-2 pt-2'>
              <div className='flex justify-between text-[11px]'>
                <span className='text-muted-foreground'>Delivery Price Range ($40k to $180k):</span>
                <span className='font-bold text-foreground'>${settlementPrice.toLocaleString()}/BTC</span>
              </div>
              <input
                type='range'
                min='40000'
                max='180000'
                step='1000'
                value={settlementPrice}
                onChange={(e) => setSettlementPrice(parseInt(e.target.value))}
                className='w-full accent-foreground cursor-pointer'
              />
            </div>
          </CardContent>
        </Card>

        {/* Results Comparison Grid */}
        <div className='grid gap-6 md:grid-cols-2'>
          {/* WITH BTCovenants DLC Shield */}
          <Card className='border-foreground/50 bg-foreground/5'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <CardTitle className='font-mono text-sm tracking-tight flex items-center gap-2'>
                  <ShieldCheck className='h-4 w-4 text-foreground' />
                  WITH BTCOVENANTS DLC
                </CardTitle>
                <Badge variant='outline' className='font-mono text-[10px]'>
                  Guaranteed
                </Badge>
              </div>
              <CardDescription className='text-xs font-mono'>
                Exact agreed USD value delivered to the provider.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3 font-mono text-xs'>
              <div className='p-3 rounded-lg border border-border bg-card space-y-1.5'>
                <div className='flex justify-between text-muted-foreground'>
                  <span>Provider Receives:</span>
                  <span className='font-bold text-foreground text-sm'>
                    ${providerReceivedUsd.toLocaleString()}
                  </span>
                </div>
                <div className='flex justify-between text-muted-foreground'>
                  <span>Payout Satoshis:</span>
                  <span className='font-bold text-foreground'>
                    {providerSatsAtSettlement.toLocaleString()} SATS ({providerBtcAtSettlement} BTC)
                  </span>
                </div>
                <div className='flex justify-between text-muted-foreground'>
                  <span>Price Slippage:</span>
                  <span className='font-bold text-foreground'>$0.00 (0.00%)</span>
                </div>
              </div>
              <p className='text-[11px] text-muted-foreground leading-relaxed'>
                ✓ Neither party suffers volatility risk. The provider can pay rent, team salaries, and hardware costs without fearing a Bitcoin dip.
              </p>
            </CardContent>
          </Card>

          {/* WITHOUT DLC (Raw Native BTC) */}
          <Card className='border-border/80'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <CardTitle className='font-mono text-sm tracking-tight flex items-center gap-2 text-muted-foreground'>
                  <AlertCircle className='h-4 w-4' />
                  TRADITIONAL ESCROW (NO DLC)
                </CardTitle>
                <Badge variant='outline' className='font-mono text-[10px] text-muted-foreground'>
                  Volatile
                </Badge>
              </div>
              <CardDescription className='text-xs font-mono'>
                Raw satoshis released without volatility protection.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3 font-mono text-xs'>
              <div className='p-3 rounded-lg border border-border bg-muted/30 space-y-1.5'>
                <div className='flex justify-between text-muted-foreground'>
                  <span>Provider Receives:</span>
                  <span className='font-bold text-foreground text-sm'>
                    ${withoutDlcUsdValue.toLocaleString()}
                  </span>
                </div>
                <div className='flex justify-between text-muted-foreground'>
                  <span>Payout Satoshis:</span>
                  <span>{lockedSats.toLocaleString()} SATS ({lockedBtc} BTC)</span>
                </div>
                <div className='flex justify-between text-muted-foreground'>
                  <span>Price Discrepancy:</span>
                  <span className={differenceUsd >= 0 ? 'text-foreground' : 'text-muted-foreground'}>
                    {differenceUsd >= 0 ? `+$${differenceUsd.toLocaleString()}` : `-$${Math.abs(differenceUsd).toLocaleString()}`}
                  </span>
                </div>
              </div>
              <p className='text-[11px] text-muted-foreground leading-relaxed'>
                ⚠️ If Bitcoin crashes by 40% during development, the service provider loses thousands of dollars of value, often leading to abandoned milestones or disputes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Technical Explainer */}
        <Card className='border-border/80'>
          <CardHeader>
            <CardTitle className='font-mono text-sm tracking-tight flex items-center gap-2'>
              <Info className='h-4 w-4' />
              HOW THE DLC SCHNORR ORACLE WORKS
            </CardTitle>
          </CardHeader>
          <CardContent className='font-mono text-xs space-y-3 text-muted-foreground leading-relaxed'>
            <p>
              1. <b>Pre-Committed CETs (Contract Execution Transactions):</b> When the covenant is initialized, the buyer and provider pre-sign a discrete curve of payout distributions corresponding to discrete price buckets ($50k, $51k... $150k).
            </p>
            <p>
              2. <b>Schnorr Adaptor Signatures:</b> The transactions are locked with point additions from an oracle public key. The oracle never holds any Bitcoin funds and has zero ability to steal or confiscate.
            </p>
            <p>
              3. <b>Attestation & Settlement:</b> At milestone completion, the CoinGecko / Mempool oracle publishes a single cryptographic scalar <code className='text-foreground'>s</code> for the current price, which automatically decrypts exactly one valid execution transaction.
            </p>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
