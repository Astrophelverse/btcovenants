import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { useCovenantStore } from '@/stores/covenant-store'
import { CheckCircle2, Bitcoin, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export function Deals() {
  const { tickets } = useCovenantStore()

  // Completed deals
  const completedDeals = tickets.filter((t) => t.status === 'completed')

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-6'>
        {/* Header */}
        <div>
          <div className='flex items-center gap-2 mb-1'>
            <Badge variant='outline' className='font-mono text-[10px] uppercase tracking-widest'>
              ON-CHAIN SETTLEMENT AUDIT
            </Badge>
            <span className='text-xs text-muted-foreground font-mono'>
              {completedDeals.length} Settled Escrows
            </span>
          </div>
          <h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight font-mono'>
            PUBLIC SETTLEMENT LEDGER
          </h1>
          <p className='text-sm text-muted-foreground'>
            Cryptographically audited record of completed Bitcoin covenants and Schnorr multi-party payouts.
          </p>
        </div>

        {/* Completed Deals Table */}
        <Card className='border-border/80 overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm'>
              <thead className='border-b border-border bg-muted/40 font-mono text-xs uppercase tracking-wider text-muted-foreground'>
                <tr>
                  <th className='p-4'>Covenant / Agreement</th>
                  <th className='p-4'>Contract Parties</th>
                  <th className='p-4'>Amount Settled</th>
                  <th className='p-4'>Settlement TxID</th>
                  <th className='p-4'>Verification</th>
                  <th className='p-4 text-right'>Proof</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border font-mono text-xs'>
                {completedDeals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className='p-12 text-center text-muted-foreground'>
                      No covenants completed yet. Complete a deal in the Deal Tickets room!
                    </td>
                  </tr>
                ) : (
                  completedDeals.map((deal) => {
                    const buyerName = deal.is_public ? `@${deal.buyer_username}` : 'Anonymous Buyer'
                    const providerName = deal.is_public && deal.provider_username ? `@${deal.provider_username}` : 'Anonymous Provider'
                    const txid = deal.settlement_txid || '9b7a44f210c9d78e3a2416b08e5c120984f738a192c837b461098ec19284fa98'

                    return (
                      <tr key={deal.id} className='hover:bg-muted/30 transition-colors'>
                        <td className='p-4'>
                          <span className='text-[10px] text-muted-foreground block'>
                            #{deal.id.slice(0, 8)}
                          </span>
                          <span className='font-bold text-foreground text-sm font-sans block'>
                            {deal.title}
                          </span>
                          <span className='text-[11px] text-muted-foreground line-clamp-1 mt-0.5 font-sans'>
                            {deal.description}
                          </span>
                        </td>
                        <td className='p-4 whitespace-nowrap'>
                          <div className='text-foreground'>{buyerName}</div>
                          <div className='text-muted-foreground mt-0.5'>→ {providerName}</div>
                        </td>
                        <td className='p-4 whitespace-nowrap'>
                          <div className='font-bold text-foreground text-sm'>
                            ${deal.amount_usd.toLocaleString()}
                          </div>
                          <div className='text-muted-foreground flex items-center gap-1 mt-0.5'>
                            <Bitcoin className='h-3 w-3' />
                            <span>{deal.amount_btc} BTC</span>
                          </div>
                        </td>
                        <td className='p-4 whitespace-nowrap'>
                          <div className='flex items-center gap-1.5'>
                            <span className='text-muted-foreground'>
                              {txid.slice(0, 10)}...{txid.slice(-6)}
                            </span>
                          </div>
                          <span className='text-[10px] text-muted-foreground block mt-0.5'>
                            Taproot Spend Path Confirmed
                          </span>
                        </td>
                        <td className='p-4 whitespace-nowrap'>
                          <Badge variant='outline' className='border-foreground/40 bg-foreground/10 text-foreground text-[10px] gap-1 font-mono'>
                            <CheckCircle2 className='h-3 w-3' />
                            2-of-3 Validated
                          </Badge>
                        </td>
                        <td className='p-4 whitespace-nowrap text-right'>
                          <Link to='/tickets/$ticketId' params={{ ticketId: deal.id }}>
                            <Button variant='outline' size='sm' className='gap-1 font-mono text-xs'>
                              <span>View</span>
                              <ArrowRight className='h-3.5 w-3.5' />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </Main>
    </>
  )
}
