import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Plus, Bitcoin, Shield, Calculator } from 'lucide-react'
import { useCovenantStore } from '@/stores/covenant-store'
import { calculatePlatformFee, usdToBtc } from '@/lib/mock-covenants'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

interface CreateTicketDialogProps {
  children?: React.ReactNode
}

export function CreateTicketDialog({ children }: CreateTicketDialogProps) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { btcPrice, feeRates, createTicket } = useCovenantStore()

  const [form, setForm] = useState({
    title: '',
    description: '',
    amountUsd: '1500',
    timelineDays: '14',
    providerUsername: 'satoshi_dev',
    isPublic: true,
  })

  const numericAmount = parseFloat(form.amountUsd) || 0
  const btcEquivalent = usdToBtc(numericAmount, btcPrice)
  const platformFeeUsd = calculatePlatformFee(numericAmount)
  const networkFeeSats = feeRates.economyFee * 200
  const networkFeeUsd = Number(((networkFeeSats / 1e8) * btcPrice).toFixed(2))
  const totalBuyerUsd = numericAmount + platformFeeUsd + networkFeeUsd

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error('Please enter a deal title')
      return
    }
    if (numericAmount <= 0) {
      toast.error('Amount must be greater than 0')
      return
    }

    const created = createTicket({
      title: form.title,
      description: form.description || 'Milestones agreed in cryptographic covenant contract.',
      amount_usd: numericAmount,
      timeline_days: parseInt(form.timelineDays) || 7,
      provider_username: form.providerUsername || undefined,
      is_public: form.isPublic,
    })

    toast.success(`Covenant Ticket #${created.id.slice(0, 8)} Created!`, {
      description: `Taproot 2-of-3 escrow initiated. Address: ${created.escrow_address.slice(0, 20)}...`,
    })

    setOpen(false)
    navigate({ to: '/tickets/$ticketId', params: { ticketId: created.id } })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className='gap-2 font-mono uppercase text-xs tracking-wider'>
            <Plus className='h-4 w-4' />
            Create Deal Ticket
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[620px] border border-border bg-card'>
        <DialogHeader>
          <div className='flex items-center gap-2'>
            <div className='p-2 rounded-lg border border-border bg-muted'>
              <Bitcoin className='h-5 w-5' />
            </div>
            <div>
              <DialogTitle className='font-mono tracking-tight'>INITIATE COVENANT DEAL</DialogTitle>
              <DialogDescription className='text-xs'>
                Creates a trustless 2-of-3 Taproot escrow with Discreet Log Contract price stability.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4 pt-2'>
          <div className='space-y-1.5'>
            <Label htmlFor='title' className='text-xs font-mono uppercase tracking-wider text-muted-foreground'>
              Deal Title
            </Label>
            <Input
              id='title'
              required
              placeholder='e.g., Full-Stack Lightning Payment Gateway Integration'
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className='font-medium'
            />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='desc' className='text-xs font-mono uppercase tracking-wider text-muted-foreground'>
              Contract Deliverables & Scope
            </Label>
            <Textarea
              id='desc'
              rows={3}
              placeholder='Describe clear milestones, acceptance criteria, and technical deliverables...'
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <Label htmlFor='amount' className='text-xs font-mono uppercase tracking-wider text-muted-foreground'>
                Contract Value (USD)
              </Label>
              <div className='relative'>
                <span className='absolute left-3 top-2.5 text-xs font-mono text-muted-foreground'>$</span>
                <Input
                  id='amount'
                  type='number'
                  min='1'
                  step='any'
                  className='pl-7 font-mono'
                  value={form.amountUsd}
                  onChange={(e) => setForm({ ...form, amountUsd: e.target.value })}
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='timeline' className='text-xs font-mono uppercase tracking-wider text-muted-foreground'>
                Timeline (Days)
              </Label>
              <Input
                id='timeline'
                type='number'
                min='1'
                max='365'
                className='font-mono'
                value={form.timelineDays}
                onChange={(e) => setForm({ ...form, timelineDays: e.target.value })}
              />
            </div>
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='provider' className='text-xs font-mono uppercase tracking-wider text-muted-foreground'>
              Target Provider Username (Optional)
            </Label>
            <Input
              id='provider'
              placeholder='e.g., satoshi_dev (or leave blank for public bounty)'
              value={form.providerUsername}
              onChange={(e) => setForm({ ...form, providerUsername: e.target.value })}
              className='font-mono'
            />
          </div>

          <div className='flex items-center justify-between p-3 rounded-lg border border-border bg-muted/40'>
            <div className='space-y-0.5'>
              <Label className='text-xs font-semibold'>Public Discovery Listing</Label>
              <p className='text-[11px] text-muted-foreground'>
                Show this deal on the public completed board upon cryptographic settlement.
              </p>
            </div>
            <Switch
              checked={form.isPublic}
              onCheckedChange={(checked) => setForm({ ...form, isPublic: checked })}
            />
          </div>

          {/* Cryptographic Fee Breakdown & DLC Price Lock Card */}
          <div className='p-3.5 rounded-lg border border-border bg-muted/30 space-y-2 text-xs'>
            <div className='flex items-center justify-between font-mono font-bold border-b border-border pb-1.5'>
              <span className='flex items-center gap-1.5'>
                <Calculator className='h-3.5 w-3.5' />
                DISCREET LOG CONTRACT & ESCROW CALCULATION
              </span>
              <span>1 BTC = ${btcPrice.toLocaleString()}</span>
            </div>
            <div className='grid grid-cols-2 gap-2 pt-1 font-mono'>
              <div className='text-muted-foreground'>Locked BTC Escrow:</div>
              <div className='text-right font-bold text-foreground'>{btcEquivalent} BTC</div>

              <div className='text-muted-foreground'>Platform Fee:</div>
              <div className='text-right'>${platformFeeUsd.toFixed(2)}</div>

              <div className='text-muted-foreground'>Network Miner Fee:</div>
              <div className='text-right'>{networkFeeSats.toLocaleString()} sats (~${networkFeeUsd})</div>

              <div className='text-muted-foreground border-t border-border pt-1 font-bold'>Total from Buyer:</div>
              <div className='text-right border-t border-border pt-1 font-bold'>${totalBuyerUsd.toFixed(2)}</div>
            </div>
            <p className='text-[10px] text-muted-foreground border-t border-border/50 pt-1'>
              🛡️ <b>DLC Volatility Protection:</b> At settlement, the oracle adjusts satoshis to guarantee provider receives exactly ${numericAmount.toLocaleString()} worth of BTC regardless of price movement.
            </p>
          </div>

          <DialogFooter className='pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type='submit' className='gap-2 font-mono uppercase text-xs'>
              <Shield className='h-3.5 w-3.5' />
              Sign & Lock Taproot Escrow
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
