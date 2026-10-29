import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Lock, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useCovenantStore } from '@/stores/covenant-store'

export function RecentCovenants() {
  const { tickets } = useCovenantStore()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant='outline' className='border-foreground/40 bg-foreground/10 text-foreground text-[10px] uppercase font-mono gap-1'>
            <CheckCircle2 className='h-3 w-3' />
            Completed
          </Badge>
        )
      case 'funded':
        return (
          <Badge variant='default' className='bg-foreground text-background text-[10px] uppercase font-mono gap-1'>
            <Lock className='h-3 w-3' />
            Funded
          </Badge>
        )
      case 'active':
        return (
          <Badge variant='secondary' className='border border-border text-foreground text-[10px] uppercase font-mono gap-1'>
            <Clock className='h-3 w-3' />
            Signing
          </Badge>
        )
      case 'disputed':
        return (
          <Badge variant='destructive' className='text-[10px] uppercase font-mono gap-1'>
            <AlertTriangle className='h-3 w-3' />
            Dispute
          </Badge>
        )
      default:
        return (
          <Badge variant='outline' className='text-muted-foreground text-[10px] uppercase font-mono'>
            Pending
          </Badge>
        )
    }
  }

  return (
    <div className='space-y-4'>
      {tickets.slice(0, 5).map((t) => (
        <Link
          key={t.id}
          to='/tickets/$ticketId'
          params={{ ticketId: t.id }}
          className='flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-all text-foreground no-underline group'
        >
          <Avatar className='h-9 w-9 rounded-lg border border-border bg-muted'>
            <AvatarFallback className='text-xs font-mono font-bold'>
              {t.buyer_username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-col min-w-0'>
            <div className='flex items-center gap-2'>
              <p className='text-sm font-semibold truncate group-hover:underline'>
                {t.title}
              </p>
              <ArrowUpRight className='h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground shrink-0' />
            </div>
            <p className='text-xs text-muted-foreground truncate'>
              @{t.buyer_username} → {t.provider_username ? `@${t.provider_username}` : 'open invite'} · {t.timeline_days}d
            </p>
          </div>
          <div className='text-right shrink-0'>
            <p className='text-sm font-bold font-mono'>${t.amount_usd.toLocaleString()}</p>
            <div className='mt-1 flex justify-end'>{getStatusBadge(t.status)}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
