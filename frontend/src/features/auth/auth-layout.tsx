import { Bitcoin } from 'lucide-react'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='container grid h-svh max-w-none items-center justify-center bg-background'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:p-8'>
        <div className='mb-6 flex items-center justify-center gap-2'>
          <div className='h-9 w-9 rounded-lg border border-border bg-muted flex items-center justify-center text-foreground'>
            <Bitcoin className='h-5 w-5' />
          </div>
          <div className='flex flex-col'>
            <h1 className='text-xl font-bold font-mono tracking-tight leading-none'>BTCOVENANTS</h1>
            <span className='text-[10px] font-mono text-muted-foreground uppercase tracking-widest'>
              Bitcoin Native Escrow
            </span>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
