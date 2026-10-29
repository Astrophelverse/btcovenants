import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { CreateTicketDialog } from './components/create-ticket-dialog'
import { useCovenantStore } from '@/stores/covenant-store'
import {
  Bitcoin,
  CheckCircle2,
  Clock,
  Lock,
  Plus,
  Search as SearchIcon,
  ArrowRight,
  ShieldAlert,
  Copy,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

export function Tickets() {
  const { tickets, currentUser } = useCovenantStore()
  const [filterTab, setFilterTab] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Escrow address copied to clipboard')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredTickets = tickets.filter((t) => {
    // Filter by tab
    if (filterTab !== 'all' && t.status !== filterTab) return false

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchesTitle = t.title.toLowerCase().includes(q)
      const matchesId = t.id.toLowerCase().includes(q)
      const matchesBuyer = t.buyer_username.toLowerCase().includes(q)
      const matchesProvider = t.provider_username?.toLowerCase().includes(q)
      if (!matchesTitle && !matchesId && !matchesBuyer && !matchesProvider) return false
    }

    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant='outline' className='border-foreground/50 bg-foreground/10 text-foreground font-mono text-[10px] gap-1'>
            <CheckCircle2 className='h-3 w-3' />
            Completed
          </Badge>
        )
      case 'funded':
        return (
          <Badge variant='default' className='bg-foreground text-background font-mono text-[10px] gap-1'>
            <Lock className='h-3 w-3' />
            Funded
          </Badge>
        )
      case 'active':
        return (
          <Badge variant='secondary' className='border border-border font-mono text-[10px] gap-1'>
            <Clock className='h-3 w-3' />
            Signing
          </Badge>
        )
      case 'disputed':
        return (
          <Badge variant='destructive' className='font-mono text-[10px] gap-1'>
            <ShieldAlert className='h-3 w-3' />
            Dispute
          </Badge>
        )
      default:
        return (
          <Badge variant='outline' className='text-muted-foreground font-mono text-[10px]'>
            Pending
          </Badge>
        )
    }
  }

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-6'>
        {/* Header Title & Actions */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <Badge variant='outline' className='font-mono text-[10px] uppercase tracking-widest'>
                BITCOIN ESCROW REGISTRY
              </Badge>
              <span className='text-xs text-muted-foreground font-mono'>
                {tickets.length} Registered Covenants
              </span>
            </div>
            <h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight font-mono'>
              DEAL TICKETS
            </h1>
            <p className='text-sm text-muted-foreground'>
              Cryptographic escrow agreements locked in 2-of-3 Taproot Schnorr multisig contracts.
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <CreateTicketDialog>
              <Button className='gap-2 font-mono uppercase text-xs tracking-wider'>
                <Plus className='h-4 w-4' />
                Create Deal Ticket
              </Button>
            </CreateTicketDialog>
          </div>
        </div>

        {/* Search & Tabs Controls */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-3'>
          <Tabs value={filterTab} onValueChange={setFilterTab} className='w-full md:w-auto'>
            <TabsList className='grid grid-cols-5 w-full md:w-auto font-mono text-xs'>
              <TabsTrigger value='all'>All ({tickets.length})</TabsTrigger>
              <TabsTrigger value='pending'>
                Pending ({tickets.filter((t) => t.status === 'pending').length})
              </TabsTrigger>
              <TabsTrigger value='active'>
                Signing ({tickets.filter((t) => t.status === 'active').length})
              </TabsTrigger>
              <TabsTrigger value='funded'>
                Funded ({tickets.filter((t) => t.status === 'funded').length})
              </TabsTrigger>
              <TabsTrigger value='completed'>
                Settled ({tickets.filter((t) => t.status === 'completed').length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className='relative w-full md:w-72'>
            <SearchIcon className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search title, username, or id...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-9 font-mono text-xs'
            />
          </div>
        </div>

        {/* Tickets Table / List */}
        <Card className='border-border/80 overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm'>
              <thead className='border-b border-border bg-muted/40 font-mono text-xs uppercase tracking-wider text-muted-foreground'>
                <tr>
                  <th className='p-4'>Covenant / Title</th>
                  <th className='p-4'>Parties</th>
                  <th className='p-4'>Locked Value</th>
                  <th className='p-4'>Taproot Address</th>
                  <th className='p-4'>Status</th>
                  <th className='p-4 text-right'>Action</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className='p-12 text-center text-muted-foreground font-mono'>
                      No covenants found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((t) => {
                    const isMyDeal = t.buyer_id === currentUser.id || t.provider_id === currentUser.id
                    return (
                      <tr
                        key={t.id}
                        className='hover:bg-muted/30 transition-colors group'
                      >
                        {/* Title and ID */}
                        <td className='p-4 max-w-xs'>
                          <div className='flex items-center gap-2'>
                            <span className='font-mono text-xs text-muted-foreground'>
                              #{t.id.slice(0, 8)}
                            </span>
                            {isMyDeal && (
                              <Badge variant='outline' className='text-[9px] px-1 py-0 uppercase font-mono'>
                                Mine
                              </Badge>
                            )}
                          </div>
                          <Link
                            to='/tickets/$ticketId'
                            params={{ ticketId: t.id }}
                            className='font-semibold text-foreground hover:underline block truncate mt-0.5'
                          >
                            {t.title}
                          </Link>
                          <p className='text-xs text-muted-foreground line-clamp-1 mt-0.5'>
                            {t.description}
                          </p>
                        </td>

                        {/* Parties */}
                        <td className='p-4 whitespace-nowrap font-mono text-xs'>
                          <div className='text-foreground'>
                            Buyer: <span className='text-muted-foreground'>@{t.buyer_username}</span>
                          </div>
                          <div className='text-foreground mt-0.5'>
                            Provider:{' '}
                            <span className='text-muted-foreground'>
                              {t.provider_username ? `@${t.provider_username}` : 'Open Invitation'}
                            </span>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className='p-4 whitespace-nowrap font-mono'>
                          <div className='font-bold text-foreground'>
                            ${t.amount_usd.toLocaleString()}
                          </div>
                          <div className='text-xs text-muted-foreground flex items-center gap-1 mt-0.5'>
                            <Bitcoin className='h-3 w-3' />
                            <span>{t.amount_btc} BTC</span>
                          </div>
                        </td>

                        {/* Escrow Address */}
                        <td className='p-4 whitespace-nowrap font-mono text-xs'>
                          <div className='flex items-center gap-1.5'>
                            <span className='text-muted-foreground'>
                              {t.escrow_address.slice(0, 10)}...{t.escrow_address.slice(-6)}
                            </span>
                            <button
                              onClick={() => handleCopy(t.escrow_address, t.id)}
                              className='p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground'
                              title='Copy Taproot escrow address'
                            >
                              {copiedId === t.id ? (
                                <Check className='h-3.5 w-3.5 text-foreground' />
                              ) : (
                                <Copy className='h-3.5 w-3.5' />
                              )}
                            </button>
                          </div>
                          <span className='text-[10px] text-muted-foreground'>2-of-3 Taproot Multisig</span>
                        </td>

                        {/* Status */}
                        <td className='p-4 whitespace-nowrap'>
                          {getStatusBadge(t.status)}
                        </td>

                        {/* Action */}
                        <td className='p-4 whitespace-nowrap text-right'>
                          <Link to='/tickets/$ticketId' params={{ ticketId: t.id }}>
                            <Button variant='outline' size='sm' className='gap-1 font-mono text-xs'>
                              <span>Open Room</span>
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
