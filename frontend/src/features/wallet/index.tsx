import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { useCovenantStore } from '@/stores/covenant-store'
import {
  Copy,
  Check,
  Eye,
  EyeOff,
  Send,
  ArrowDownToLine,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

export function WalletView() {
  const { currentUser, btcPrice, faucetDeposit, switchPersona, activePersonaKey } = useCovenantStore()
  const [showWif, setShowWif] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [sendOpen, setSendOpen] = useState(false)
  const [sendForm, setSendForm] = useState({ toAddr: '', amountBtc: '' })

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(label)
    toast.success(`${label} copied to clipboard`)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleFaucet = () => {
    faucetDeposit(0.1)
    toast.success('Deposited +0.10 BTC to your Taproot vault!')
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(sendForm.amountBtc)
    if (!amt || amt <= 0) {
      toast.error('Invalid amount')
      return
    }
    if (amt > currentUser.balance_btc) {
      toast.error('Insufficient vault balance')
      return
    }
    faucetDeposit(-amt)
    setSendOpen(false)
    toast.success(`Sent ${amt} BTC to ${sendForm.toAddr.slice(0, 14)}...`)
    setSendForm({ toAddr: '', amountBtc: '' })
  }

  const mockUtxos = [
    {
      txid: '7f9c81b2039e14a8b7c65019284fa981c2409847e129841c9b31d8f760e12',
      vout: 0,
      amount_btc: (currentUser.balance_btc * 0.65).toFixed(6),
      sats: Math.round(currentUser.balance_btc * 0.65 * 1e8),
      confirmations: 142,
    },
    {
      txid: '3a189f4710c9d78e3a2416b08e5c120984f738a192c837b461098ec19284fa98',
      vout: 1,
      amount_btc: (currentUser.balance_btc * 0.35).toFixed(6),
      sats: Math.round(currentUser.balance_btc * 0.35 * 1e8),
      confirmations: 48,
    },
  ]

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
                TAPROOT VAULT MANAGEMENT
              </Badge>
              <span className='text-xs text-muted-foreground font-mono'>
                BIP86 Key-Path Spend Ready
              </span>
            </div>
            <h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight font-mono'>
              BITCOIN VAULT & UTXOS
            </h1>
            <p className='text-sm text-muted-foreground'>
              Manage native SegWit / Taproot keys, sign multisig covenant trees, and inspect unspent outputs.
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              onClick={handleFaucet}
              className='gap-2 font-mono text-xs uppercase'
            >
              <ArrowDownToLine className='h-4 w-4' />
              Faucet (+0.10 BTC)
            </Button>
            <Dialog open={sendOpen} onOpenChange={setSendOpen}>
              <DialogTrigger asChild>
                <Button className='gap-2 font-mono text-xs uppercase'>
                  <Send className='h-4 w-4' />
                  Send Bitcoin
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-md border border-border bg-card'>
                <DialogHeader>
                  <DialogTitle className='font-mono'>SEND BITCOIN</DialogTitle>
                  <DialogDescription className='text-xs font-mono'>
                    Broadcast Taproot transaction with mempool fee optimization.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSend} className='space-y-4 pt-2 font-mono text-xs'>
                  <div className='space-y-1.5'>
                    <Label htmlFor='to' className='text-muted-foreground uppercase text-[10px]'>
                      Destination Address
                    </Label>
                    <Input
                      id='to'
                      required
                      placeholder='tb1p... or bc1p...'
                      value={sendForm.toAddr}
                      onChange={(e) => setSendForm({ ...sendForm, toAddr: e.target.value })}
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <Label htmlFor='amt' className='text-muted-foreground uppercase text-[10px]'>
                      Amount (BTC)
                    </Label>
                    <Input
                      id='amt'
                      required
                      type='number'
                      step='any'
                      placeholder='0.05'
                      value={sendForm.amountBtc}
                      onChange={(e) => setSendForm({ ...sendForm, amountBtc: e.target.value })}
                    />
                    <p className='text-[10px] text-muted-foreground'>
                      Available: {currentUser.balance_btc.toFixed(6)} BTC
                    </p>
                  </div>
                  <DialogFooter className='pt-2'>
                    <Button type='button' variant='outline' onClick={() => setSendOpen(false)}>
                      Cancel
                    </Button>
                    <Button type='submit'>Broadcast Transaction</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Vault Balance Cards */}
        <div className='grid gap-4 sm:grid-cols-3'>
          <Card className='border-border/80'>
            <CardHeader className='pb-2'>
              <CardTitle className='font-mono text-xs uppercase tracking-wider text-muted-foreground'>
                Total Vault Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold font-mono text-foreground'>
                {currentUser.balance_btc.toFixed(6)} BTC
              </div>
              <p className='text-xs text-muted-foreground font-mono mt-1'>
                ≈ ${(currentUser.balance_btc * btcPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </p>
            </CardContent>
          </Card>

          <Card className='border-border/80'>
            <CardHeader className='pb-2'>
              <CardTitle className='font-mono text-xs uppercase tracking-wider text-muted-foreground'>
                Confirmed Satoshis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold font-mono text-foreground'>
                {Math.round(currentUser.balance_btc * 1e8).toLocaleString()} SATS
              </div>
              <p className='text-xs text-muted-foreground mt-1'>
                Full chain confirmation on 2 UTXOs
              </p>
            </CardContent>
          </Card>

          <Card className='border-border/80'>
            <CardHeader className='pb-2'>
              <CardTitle className='font-mono text-xs uppercase tracking-wider text-muted-foreground'>
                Active Persona
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-xl font-bold font-mono text-foreground'>
                @{currentUser.username}
              </div>
              <div className='flex items-center gap-2 mt-1'>
                <Badge variant='outline' className='font-mono text-[10px] uppercase'>
                  {currentUser.role}
                </Badge>
                <button
                  onClick={() => switchPersona(activePersonaKey === 'alice' ? 'satoshi' : 'alice')}
                  className='text-xs text-muted-foreground underline hover:text-foreground font-mono'
                >
                  Switch to {activePersonaKey === 'alice' ? 'Satoshi' : 'Alice'}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cryptographic Keys Console */}
        <Card className='border-border/80'>
          <CardHeader>
            <CardTitle className='font-mono text-sm tracking-tight'>
              CRYPTOGRAPHIC KEY VAULT
            </CardTitle>
            <CardDescription className='text-xs font-mono'>
              Public and private Schnorr keys used for mutual 2-of-3 Taproot escrow signing.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4 font-mono text-xs'>
            {/* Taproot Address */}
            <div className='p-3.5 rounded-lg border border-border bg-muted/30 space-y-1.5'>
              <div className='flex items-center justify-between text-muted-foreground text-[10px] uppercase'>
                <span>Native Taproot Address (Bech32m)</span>
                <span>BIP350</span>
              </div>
              <div className='flex items-center justify-between gap-2'>
                <span className='font-bold text-foreground break-all'>
                  {currentUser.btc_address}
                </span>
                <button
                  onClick={() => copyToClipboard(currentUser.btc_address, 'Address')}
                  className='p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground shrink-0'
                >
                  {copiedKey === 'Address' ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
                </button>
              </div>
            </div>

            {/* Public Key */}
            <div className='p-3.5 rounded-lg border border-border bg-muted/30 space-y-1.5'>
              <div className='flex items-center justify-between text-muted-foreground text-[10px] uppercase'>
                <span>Compressed Public Key (Schnorr 32-byte X-Only)</span>
                <span>BIP340</span>
              </div>
              <div className='flex items-center justify-between gap-2'>
                <span className='font-bold text-foreground break-all'>
                  {currentUser.public_key}
                </span>
                <button
                  onClick={() => copyToClipboard(currentUser.public_key, 'Public Key')}
                  className='p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground shrink-0'
                >
                  {copiedKey === 'Public Key' ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
                </button>
              </div>
            </div>

            {/* Private Key WIF */}
            <div className='p-3.5 rounded-lg border border-border bg-muted/30 space-y-1.5'>
              <div className='flex items-center justify-between text-muted-foreground text-[10px] uppercase'>
                <span>Private Key (WIF) — Stored In-Browser Only</span>
                <button
                  onClick={() => setShowWif(!showWif)}
                  className='hover:text-foreground flex items-center gap-1 text-[10px]'
                >
                  {showWif ? <EyeOff className='h-3 w-3' /> : <Eye className='h-3 w-3' />}
                  {showWif ? 'Hide' : 'Reveal'}
                </button>
              </div>
              <div className='flex items-center justify-between gap-2'>
                <span className='font-bold text-foreground break-all'>
                  {showWif ? currentUser.wif : '••••••••••••••••••••••••••••••••••••••••••••••••••'}
                </span>
                {showWif && (
                  <button
                    onClick={() => copyToClipboard(currentUser.wif, 'Private Key')}
                    className='p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground shrink-0'
                  >
                    {copiedKey === 'Private Key' ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
                  </button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* UTXO Inspector Table */}
        <Card className='border-border/80 overflow-hidden'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='font-mono text-sm tracking-tight'>
                  UNSPENT TRANSACTION OUTPUTS (UTXOS)
                </CardTitle>
                <CardDescription className='text-xs font-mono'>
                  Outputs available to fund new deal tickets and covenant multisigs.
                </CardDescription>
              </div>
              <Badge variant='outline' className='font-mono text-xs'>
                {mockUtxos.length} UTXOs
              </Badge>
            </div>
          </CardHeader>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-sm font-mono text-xs'>
              <thead className='border-b border-border bg-muted/40 uppercase tracking-wider text-muted-foreground'>
                <tr>
                  <th className='p-3.5'>Transaction Hash</th>
                  <th className='p-3.5'>VOUT</th>
                  <th className='p-3.5'>Satoshis</th>
                  <th className='p-3.5'>BTC Amount</th>
                  <th className='p-3.5'>Confirmations</th>
                  <th className='p-3.5 text-right'>Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {mockUtxos.map((u, i) => (
                  <tr key={i} className='hover:bg-muted/30 transition-colors'>
                    <td className='p-3.5 text-muted-foreground font-mono'>
                      {u.txid.slice(0, 16)}...{u.txid.slice(-8)}
                    </td>
                    <td className='p-3.5'>{u.vout}</td>
                    <td className='p-3.5 font-bold'>{u.sats.toLocaleString()} SATS</td>
                    <td className='p-3.5'>{u.amount_btc} BTC</td>
                    <td className='p-3.5 text-muted-foreground'>{u.confirmations} blocks</td>
                    <td className='p-3.5 text-right'>
                      <Badge variant='outline' className='text-[10px] font-mono'>
                        Spendable
                      </Badge>
                    </td>
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
