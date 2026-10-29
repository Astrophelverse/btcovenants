import { Link } from '@tanstack/react-router'
import {
  BadgeCheck,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  UserCheck,
  Wallet,
  Bitcoin,
} from 'lucide-react'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { SignOutDialog } from '@/components/sign-out-dialog'
import { useCovenantStore } from '@/stores/covenant-store'
import { Badge } from '@/components/ui/badge'

type NavUserProps = {
  user?: {
    name: string
    email: string
    avatar: string
  }
}

export function NavUser({ user: _userProp }: NavUserProps) {
  const { isMobile } = useSidebar()
  const [open, setOpen] = useDialogState()
  const { currentUser, activePersonaKey, switchPersona } = useCovenantStore()

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <Avatar className='h-8 w-8 rounded-lg border border-border bg-muted'>
                  <AvatarFallback className='rounded-lg text-xs font-bold text-foreground'>
                    {currentUser.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-start text-sm leading-tight'>
                  <div className='flex items-center gap-1.5'>
                    <span className='truncate font-semibold'>{currentUser.username}</span>
                    <Badge variant='outline' className='px-1 py-0 text-[10px] uppercase font-mono'>
                      {currentUser.role}
                    </Badge>
                  </div>
                  <span className='truncate text-xs font-mono text-muted-foreground'>
                    {currentUser.balance_btc.toFixed(4)} BTC
                  </span>
                </div>
                <ChevronsUpDown className='ms-auto size-4' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-(--radix-dropdown-menu-trigger-width) min-w-64 rounded-lg border border-border bg-popover'
              side={isMobile ? 'bottom' : 'right'}
              align='end'
              sideOffset={4}
            >
              <DropdownMenuLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-2 py-2 text-start text-sm'>
                  <Avatar className='h-8 w-8 rounded-lg border border-border bg-muted'>
                    <AvatarFallback className='rounded-lg font-bold'>
                      {currentUser.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-start text-sm leading-tight'>
                    <span className='truncate font-semibold'>{currentUser.username}</span>
                    <span className='truncate text-xs text-muted-foreground'>{currentUser.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Instant Persona Switcher for Reviewing / Demo */}
              <DropdownMenuLabel className='text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1'>
                Demo Persona Switcher
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => switchPersona('alice')}
                  className={activePersonaKey === 'alice' ? 'bg-accent font-semibold' : ''}
                >
                  <UserCheck className='mr-2 h-4 w-4' />
                  <span>Alice (Buyer)</span>
                  {activePersonaKey === 'alice' && (
                    <Badge variant='secondary' className='ml-auto text-[10px]'>Active</Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => switchPersona('satoshi')}
                  className={activePersonaKey === 'satoshi' ? 'bg-accent font-semibold' : ''}
                >
                  <Bitcoin className='mr-2 h-4 w-4' />
                  <span>Satoshi (Provider)</span>
                  {activePersonaKey === 'satoshi' && (
                    <Badge variant='secondary' className='ml-auto text-[10px]'>Active</Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => switchPersona('arbiter')}
                  className={activePersonaKey === 'arbiter' ? 'bg-accent font-semibold' : ''}
                >
                  <BadgeCheck className='mr-2 h-4 w-4' />
                  <span>Arbiter (Support Key)</span>
                  {activePersonaKey === 'arbiter' && (
                    <Badge variant='secondary' className='ml-auto text-[10px]'>Active</Badge>
                  )}
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to='/wallet'>
                    <Wallet className='mr-2 h-4 w-4' />
                    <span>Vault & UTXOs</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to='/settings'>
                    <CreditCard className='mr-2 h-4 w-4' />
                    <span>Preferences</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant='destructive'
                onClick={() => setOpen(true)}
              >
                <LogOut className='mr-2 h-4 w-4' />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
