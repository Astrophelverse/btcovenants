import { useState, useRef, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { useCovenantStore } from '@/stores/covenant-store'
import {
  ArrowLeft,
  Bitcoin,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Lock,
  Send,
  Shield,
  ShieldCheck,
  UserCheck,
  Scale,
  QrCode,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function TicketDetail({ ticketId }: { ticketId: string }) {
  const {
    getTicket,
    currentUser,
    activePersonaKey,
    switchPersona,
    joinTicket,
    signTicket,
    fundTicket,
    markDone,
    sendMessage,
    btcPrice,
  } = useCovenantStore()

  const ticket = getTicket(ticketId)
  const [copiedAddr, setCopiedAddr] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [qrOpen, setQrOpen] = useState(false)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [ticket?.messages])

  if (!ticket) {
    return (
      <>
        <Header fixed>
          <Search className='me-auto' />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </Header>
        <Main className='flex flex-col items-center justify-center py-24'>
          <h2 className='text-xl font-bold font-mono'>COVENANT NOT FOUND</h2>
          <p className='text-sm text-muted-foreground mt-1'>
            The requested deal ticket does not exist or has expired.
          </p>
          <Link to='/tickets' className='mt-4'>
            <Button variant='outline' className='gap-2 font-mono text-xs'>
              <ArrowLeft className='h-4 w-4' />
              Return to Deal Tickets
            </Button>
          </Link>
        </Main>
      </>
    )
  }

  const isBuyer = ticket.buyer_id === currentUser.id
  const isProvider = ticket.provider_id === currentUser.id
  const isParty = isBuyer || isProvider

  const myRole = isBuyer ? 'buyer' : isProvider ? 'provider' : 'guest'
  const mySigned = isBuyer ? ticket.buyer_signed : isProvider ? ticket.provider_signed : false
  const myDone = isBuyer ? ticket.buyer_done : isProvider ? ticket.provider_done : false

  const handleCopy = () => {
    navigator.clipboard.writeText(ticket.escrow_address)
    setCopiedAddr(true)
    toast.success('Taproot escrow address copied!')
    setTimeout(() => setCopiedAddr(false), 2000)
  }

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    sendMessage(ticket.id, chatInput.trim())
    setChatInput('')
  }

  const handleSimulateReply = () => {
    const counterUsername = isBuyer ? (ticket.provider_username || 'satoshi_dev') : ticket.buyer_username
    const sampleReplies = [
      'Reviewed the contract terms. Taproot script path looks good.',
      'Deliverable update: API bindings completed and tests are green.',
      'Confirmed the milestone. Ready to release payment upon final test run.',
      'Schnorr key verification passed. DLC oracle peg verified.',
    ]
    const chosen = sampleReplies[Math.floor(Math.random() * sampleReplies.length)]
    sendMessage(ticket.id, chosen)
    toast.info(`Simulated message received from @${counterUsername}`)
  }

  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-3 me-auto'>
          <Link to='/tickets'>
            <Button variant='ghost' size='sm' className='gap-1 font-mono text-xs'>
              <ArrowLeft className='h-4 w-4' />
              Back
            </Button>
          </Link>
          <Separator orientation='vertical' className='h-5' />
          <div className='flex items-center gap-2'>
            <span className='font-mono font-bold text-xs uppercase'>COVENANT #{ticket.id.slice(0, 8)}</span>
            <Badge variant='outline' className='font-mono text-[10px] uppercase'>
              {ticket.status}
            </Badge>
          </div>
        </div>

        {/* Demo Persona Switcher pill */}
        <div className='flex items-center gap-1.5 px-3 py-1 rounded-md border border-border bg-muted/40 font-mono text-xs'>
          <span className='text-muted-foreground hidden sm:inline'>Active:</span>
          <span className='font-bold'>@{currentUser.username}</span>
          <button
            onClick={() => switchPersona(activePersonaKey === 'alice' ? 'satoshi' : 'alice')}
            className='ml-1 text-[10px] underline hover:text-foreground text-muted-foreground'
            title='Switch between Alice and Satoshi to test multi-party signing'
          >
            (Switch to {activePersonaKey === 'alice' ? 'Satoshi' : 'Alice'})
          </button>
        </div>

        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-6 pb-12'>
        {/* Top Status & Deal Header */}
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-xl border border-border bg-card'>
          <div className='space-y-1.5 max-w-2xl'>
            <div className='flex items-center gap-2'>
              <Badge variant='outline' className='font-mono text-[10px] uppercase tracking-wider'>
                2-OF-3 SCHNORR TAPROOT ESCROW
              </Badge>
              {ticket.is_public && (
                <Badge variant='secondary' className='font-mono text-[10px] uppercase'>
                  Public Ledger
                </Badge>
              )}
            </div>
            <h1 className='text-2xl font-extrabold tracking-tight font-mono text-foreground'>
              {ticket.title}
            </h1>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              {ticket.description}
            </p>
          </div>

          <div className='flex flex-row lg:flex-col items-start lg:items-end justify-between gap-2 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-border'>
            <div className='text-left lg:text-right font-mono'>
              <span className='text-xs uppercase text-muted-foreground block'>Contract Value</span>
              <span className='text-3xl font-extrabold text-foreground'>
                ${ticket.amount_usd.toLocaleString()}
              </span>
              <div className='text-xs text-muted-foreground flex items-center lg:justify-end gap-1 mt-0.5'>
                <Bitcoin className='h-3.5 w-3.5' />
                <span>{ticket.amount_btc} BTC (locked @ ${ticket.btc_price_locked.toLocaleString()})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Covenant Lifecycle Progress Pipeline */}
        <Card className='border-border/80'>
          <CardHeader className='pb-3'>
            <CardTitle className='font-mono text-xs uppercase tracking-wider text-muted-foreground'>
              COVENANT EXECUTION PIPELINE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs'>
              {/* Step 1: Created */}
              <div className='p-3 rounded-lg border border-border bg-muted/30 space-y-1'>
                <div className='flex items-center justify-between'>
                  <span className='font-bold'>1. Deal Created</span>
                  <CheckCircle2 className='h-4 w-4 text-foreground' />
                </div>
                <p className='text-[11px] text-muted-foreground'>
                  By @{ticket.buyer_username}
                </p>
              </div>

              {/* Step 2: Provider Claimed */}
              <div className={`p-3 rounded-lg border ${ticket.provider_id ? 'border-border bg-muted/30' : 'border-dashed border-border/60 opacity-60'} space-y-1`}>
                <div className='flex items-center justify-between'>
                  <span className='font-bold'>2. Provider Joined</span>
                  {ticket.provider_id ? <CheckCircle2 className='h-4 w-4 text-foreground' /> : <Clock className='h-4 w-4' />}
                </div>
                <p className='text-[11px] text-muted-foreground'>
                  {ticket.provider_username ? `@${ticket.provider_username}` : 'Pending provider'}
                </p>
              </div>

              {/* Step 3: Dual Signatures */}
              <div className={`p-3 rounded-lg border ${ticket.buyer_signed && ticket.provider_signed ? 'border-border bg-muted/30' : 'border-dashed border-border/60 opacity-60'} space-y-1`}>
                <div className='flex items-center justify-between'>
                  <span className='font-bold'>3. Dual Signed</span>
                  {ticket.buyer_signed && ticket.provider_signed ? <CheckCircle2 className='h-4 w-4 text-foreground' /> : <Clock className='h-4 w-4' />}
                </div>
                <p className='text-[11px] text-muted-foreground'>
                  Buyer: {ticket.buyer_signed ? '✓' : '—'} · Provider: {ticket.provider_signed ? '✓' : '—'}
                </p>
              </div>

              {/* Step 4: Funded & Settled */}
              <div className={`p-3 rounded-lg border ${ticket.status === 'completed' ? 'border-foreground/50 bg-foreground/10' : ticket.status === 'funded' ? 'border-border bg-muted/30' : 'border-dashed border-border/60 opacity-60'} space-y-1`}>
                <div className='flex items-center justify-between'>
                  <span className='font-bold'>4. {ticket.status === 'completed' ? 'Settled & Released' : 'On-Chain Funded'}</span>
                  {ticket.status === 'completed' ? <CheckCircle2 className='h-4 w-4 text-foreground' /> : ticket.status === 'funded' ? <Lock className='h-4 w-4' /> : <Clock className='h-4 w-4' />}
                </div>
                <p className='text-[11px] text-muted-foreground'>
                  {ticket.status === 'completed' ? 'Delivered & Released' : ticket.funding_txid ? 'Locked in Taproot' : 'Awaiting deposit'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Control Panel */}
        <Card className='border-border/80 bg-muted/20'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <CardTitle className='font-mono text-xs uppercase tracking-wider text-muted-foreground'>
                ESCROW ACTIONS & KEY CONSOLE
              </CardTitle>
              <div className='flex items-center gap-2'>
                <span className='text-xs font-mono text-muted-foreground'>Current Role:</span>
                <Badge variant='outline' className='font-mono text-xs uppercase'>
                  {myRole} (@{currentUser.username})
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap items-center gap-3'>
              {/* Join as Provider (if open) */}
              {!ticket.provider_id && (
                <Button
                  onClick={() => {
                    joinTicket(ticket.id)
                    toast.success(`Joined deal #${ticket.id.slice(0, 8)} as Provider!`)
                  }}
                  className='gap-2 font-mono text-xs uppercase'
                >
                  <UserCheck className='h-4 w-4' />
                  Claim & Join as Provider
                </Button>
              )}

              {/* Sign Covenant (if party and unsigned) */}
              {isParty && !mySigned && ticket.status !== 'completed' && (
                <Button
                  onClick={() => {
                    signTicket(ticket.id, myRole as 'buyer' | 'provider')
                    toast.success(`Signed covenant with Schnorr private key as ${myRole}!`)
                  }}
                  className='gap-2 font-mono text-xs uppercase'
                >
                  <ShieldCheck className='h-4 w-4' />
                  Sign with Schnorr Private Key
                </Button>
              )}

              {/* Fund Escrow (if both signed but not yet funded) */}
              {ticket.buyer_signed && ticket.provider_signed && ticket.status === 'active' && (
                <Button
                  onClick={() => {
                    fundTicket(ticket.id)
                    toast.success(`Broadcasting ${ticket.amount_btc} BTC deposit transaction to mempool!`)
                  }}
                  className='gap-2 font-mono text-xs uppercase'
                >
                  <Lock className='h-4 w-4' />
                  Broadcast & Fund Taproot Escrow
                </Button>
              )}

              {/* Mark Done / Deliver */}
              {ticket.status === 'funded' && isParty && !myDone && (
                <Button
                  onClick={() => {
                    markDone(ticket.id, myRole as 'buyer' | 'provider')
                    if (isBuyer && ticket.provider_done) {
                      toast.success(`🎉 Escrow Completed! ${ticket.amount_btc} BTC released to @${ticket.provider_username}`)
                    } else if (isProvider) {
                      toast.success('Marked work completed! Waiting for buyer confirmation.')
                    } else {
                      toast.success('Confirmed release on your end!')
                    }
                  }}
                  className='gap-2 font-mono text-xs uppercase'
                >
                  <CheckCircle2 className='h-4 w-4' />
                  {isProvider ? 'Mark Work Complete & Request Release' : 'Confirm Fulfillment & Release Bitcoin'}
                </Button>
              )}

              {/* Completed Seal */}
              {ticket.status === 'completed' && (
                <div className='flex items-center gap-2 p-2 px-3 rounded-lg border border-foreground/30 bg-foreground/10 font-mono text-xs text-foreground'>
                  <CheckCircle2 className='h-4 w-4' />
                  <span>Escrow Settled & Funds Released. TxID: {ticket.settlement_txid?.slice(0, 16)}...</span>
                </div>
              )}

              {/* Switch Persona Fast Action */}
              <Button
                variant='outline'
                size='sm'
                onClick={() => switchPersona(activePersonaKey === 'alice' ? 'satoshi' : 'alice')}
                className='font-mono text-xs gap-1.5 ml-auto'
              >
                Switch to {activePersonaKey === 'alice' ? '@satoshi_dev (Provider)' : '@alice_buyer (Buyer)'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Two-Column Layout: Left = Cryptographic Spec, Right = Real-Time Deal Chat */}
        <div className='grid gap-6 lg:grid-cols-12'>
          {/* Left Column: Escrow Contract Details */}
          <div className='lg:col-span-5 space-y-6'>
            {/* Taproot Multisig Vault Card */}
            <Card className='border-border/80'>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='font-mono text-xs uppercase tracking-wider text-muted-foreground'>
                    2-OF-3 TAPROOT COVENANT SPEC
                  </CardTitle>
                  <Badge variant='outline' className='font-mono text-[10px]'>
                    BIP340 / BIP341
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='space-y-4 font-mono text-xs'>
                {/* Escrow Address */}
                <div className='space-y-1.5 p-3 rounded-lg border border-border bg-muted/40'>
                  <div className='flex items-center justify-between text-muted-foreground'>
                    <span className='uppercase text-[10px]'>Multisig Escrow Address</span>
                    <button
                      onClick={() => setQrOpen(true)}
                      className='hover:text-foreground flex items-center gap-1 text-[10px]'
                    >
                      <QrCode className='h-3 w-3' />
                      QR
                    </button>
                  </div>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='truncate font-bold text-foreground'>
                      {ticket.escrow_address}
                    </span>
                    <button
                      onClick={handleCopy}
                      className='p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground shrink-0'
                    >
                      {copiedAddr ? <Check className='h-3.5 w-3.5' /> : <Copy className='h-3.5 w-3.5' />}
                    </button>
                  </div>
                </div>

                {/* Key Quorum */}
                <div className='space-y-2 border-t border-border pt-3'>
                  <span className='text-[10px] uppercase text-muted-foreground block'>
                    Signer Quorum (2 Required of 3)
                  </span>
                  <div className='space-y-1.5'>
                    <div className='flex items-center justify-between p-2 rounded border border-border bg-muted/20'>
                      <span className='text-muted-foreground'>Key 1: Buyer (@{ticket.buyer_username})</span>
                      <span className='font-bold'>{ticket.buyer_signed ? 'SIGNED ✓' : 'Awaiting'}</span>
                    </div>
                    <div className='flex items-center justify-between p-2 rounded border border-border bg-muted/20'>
                      <span className='text-muted-foreground'>Key 2: Provider (@{ticket.provider_username || 'unassigned'})</span>
                      <span className='font-bold'>{ticket.provider_signed ? 'SIGNED ✓' : 'Awaiting'}</span>
                    </div>
                    <div className='flex items-center justify-between p-2 rounded border border-border bg-muted/20'>
                      <span className='text-muted-foreground'>Key 3: BTCovenants Support (Arbiter)</span>
                      <span className='text-muted-foreground'>Dispute Standby</span>
                    </div>
                  </div>
                </div>

                {/* On-Chain Transaction Hashes */}
                <div className='space-y-1.5 border-t border-border pt-3'>
                  <span className='text-[10px] uppercase text-muted-foreground block'>
                    Cryptographic Proofs
                  </span>
                  <div className='text-[11px] space-y-1'>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>Funding TxID:</span>
                      <span className='font-mono truncate max-w-[180px]'>
                        {ticket.funding_txid ? `${ticket.funding_txid.slice(0, 16)}...` : 'Pending broadcast'}
                      </span>
                    </div>
                    {ticket.settlement_txid && (
                      <div className='flex items-center justify-between'>
                        <span className='text-muted-foreground'>Settlement TxID:</span>
                        <span className='font-mono truncate max-w-[180px]'>
                          {ticket.settlement_txid.slice(0, 16)}...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* DLC Volatility Protection Details */}
            <Card className='border-border/80'>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='font-mono text-xs uppercase tracking-wider text-muted-foreground'>
                    DISCREET LOG CONTRACT (DLC) GUARANTEE
                  </CardTitle>
                  <Scale className='h-4 w-4 text-foreground' />
                </div>
              </CardHeader>
              <CardContent className='font-mono text-xs space-y-2'>
                <p className='text-muted-foreground leading-relaxed'>
                  The provider is guaranteed exactly <b className='text-foreground'>${ticket.amount_usd.toLocaleString()}</b> value at settlement. The oracle adaptor adjusts the payout satoshis automatically.
                </p>
                <div className='p-2.5 rounded border border-border bg-muted/40 space-y-1'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Price Locked:</span>
                    <span className='font-bold'>${ticket.btc_price_locked.toLocaleString()}/BTC</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Current Index:</span>
                    <span className='font-bold'>${btcPrice.toLocaleString()}/BTC</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Current Sat Value:</span>
                    <span className='font-bold'>${(ticket.amount_btc * btcPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: In-Deal Real-time Chat & Event Log */}
          <div className='lg:col-span-7 flex flex-col h-[640px] rounded-xl border border-border bg-card overflow-hidden'>
            <div className='p-4 border-b border-border bg-muted/40 flex items-center justify-between'>
              <div>
                <h3 className='font-mono text-xs uppercase font-bold tracking-wider'>
                  ENCRYPTED DEAL COMMUNICATIONS
                </h3>
                <p className='text-[11px] text-muted-foreground'>
                  All ticket discussions, milestone verification, and proof attachments stay here.
                </p>
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={handleSimulateReply}
                className='font-mono text-[11px] h-7 px-2'
                title='Simulate counterpart message'
              >
                + Sim Reply
              </Button>
            </div>

            {/* Chat Messages Stream */}
            <div className='flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs'>
              {ticket.messages.length === 0 ? (
                <div className='h-full flex flex-col items-center justify-center text-muted-foreground'>
                  <Info className='h-8 w-8 mb-2 opacity-40' />
                  <p>No messages yet in this covenant room.</p>
                </div>
              ) : (
                ticket.messages.map((m) => {
                  if (m.is_system) {
                    return (
                      <div
                        key={m.id}
                        className='p-2.5 rounded-lg border border-border bg-muted/30 text-[11px] text-muted-foreground flex items-start gap-2 my-2'
                      >
                        <Shield className='h-3.5 w-3.5 shrink-0 mt-0.5 text-foreground' />
                        <div className='space-y-0.5'>
                          <span className='font-bold text-foreground uppercase tracking-wider text-[10px]'>
                            {m.sender_username}
                          </span>
                          <p className='leading-relaxed'>{m.content}</p>
                        </div>
                      </div>
                    )
                  }

                  const isMe = m.sender_id === currentUser.id
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className='flex items-center gap-1.5 mb-1 px-1'>
                        <span className='text-[10px] font-bold text-muted-foreground'>
                          @{m.sender_username}
                        </span>
                        <span className='text-[9px] text-muted-foreground/60'>
                          {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div
                        className={`p-3 rounded-lg max-w-[85%] text-xs leading-relaxed ${
                          isMe
                            ? 'bg-foreground text-background font-medium'
                            : 'bg-muted border border-border text-foreground'
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendChat} className='p-3 border-t border-border bg-muted/20 flex gap-2'>
              <Input
                placeholder={`Type message as @${currentUser.username}...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className='font-mono text-xs'
              />
              <Button type='submit' size='sm' className='font-mono text-xs gap-1 px-3'>
                <Send className='h-3.5 w-3.5' />
                Send
              </Button>
            </form>
          </div>
        </div>

        {/* QR Code Modal Dialog */}
        <Dialog open={qrOpen} onOpenChange={setQrOpen}>
          <DialogContent className='sm:max-w-md border border-border bg-card text-center'>
            <DialogHeader>
              <DialogTitle className='font-mono'>TAPROOT ESCROW QR</DialogTitle>
              <DialogDescription className='text-xs font-mono'>
                Scan with any Bitcoin Taproot (Bech32m) wallet to deposit {ticket.amount_btc} BTC
              </DialogDescription>
            </DialogHeader>
            <div className='flex flex-col items-center justify-center py-6'>
              <div className='p-4 rounded-xl border border-border bg-white text-black'>
                {/* Clean monochrome QR visual */}
                <div className='w-48 h-48 flex items-center justify-center font-mono text-xs border-2 border-black p-2'>
                  <div className='text-center space-y-1'>
                    <Bitcoin className='h-12 w-12 mx-auto' />
                    <p className='text-[10px] font-bold break-all'>
                      {ticket.escrow_address.slice(0, 18)}...
                    </p>
                    <p className='text-[9px]'>{ticket.amount_btc} BTC</p>
                  </div>
                </div>
              </div>
              <p className='font-mono text-xs text-muted-foreground mt-4 break-all px-4'>
                {ticket.escrow_address}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </Main>
    </>
  )
}
