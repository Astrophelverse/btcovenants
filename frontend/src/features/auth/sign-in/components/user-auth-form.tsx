import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Bitcoin, Loader2, LogIn, UserCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { useCovenantStore } from '@/stores/covenant-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  email: z.string().min(1, 'Please enter your email.'),
  password: z.string().min(1, 'Please enter your password.'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()
  const { switchPersona } = useCovenantStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'alice@btcovenants.org',
      password: 'password123',
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setTimeout(() => {
      auth.setUser({
        accountNo: 'ACC-BTC-001',
        email: data.email,
        role: ['user'],
        exp: Date.now() + 24 * 3600 * 1000,
      })
      auth.setAccessToken('mock-jwt-btcovenants-token')
      setIsLoading(false)
      toast.success('Logged in successfully!')
      navigate({ to: redirectTo || '/' })
    }, 400)
  }

  function handleDemoLogin(persona: 'alice' | 'satoshi') {
    setIsLoading(true)
    switchPersona(persona)
    const email = persona === 'alice' ? 'alice@btcovenants.org' : 'satoshi@nakamoto.io'
    auth.setUser({
      accountNo: persona === 'alice' ? 'ACC-ALICE-BUYER' : 'ACC-SATOSHI-DEV',
      email,
      role: [persona === 'alice' ? 'buyer' : 'provider'],
      exp: Date.now() + 24 * 3600 * 1000,
    })
    auth.setAccessToken('mock-jwt-token')
    setTimeout(() => {
      setIsLoading(false)
      toast.success(`Welcome back @${persona === 'alice' ? 'alice_buyer' : 'satoshi_dev'}!`)
      navigate({ to: redirectTo || '/' })
    }, 300)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        {/* Instant Demo Sign-In Buttons */}
        <div className='p-3 rounded-lg border border-border bg-muted/40 space-y-2 mb-1'>
          <p className='text-[11px] font-mono uppercase tracking-wider text-muted-foreground text-center'>
            1-Click Demo Profiles
          </p>
          <div className='grid grid-cols-2 gap-2'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              disabled={isLoading}
              onClick={() => handleDemoLogin('alice')}
              className='font-mono text-xs gap-1.5'
            >
              <UserCheck className='h-3.5 w-3.5' />
              Buyer Alice
            </Button>
            <Button
              type='button'
              variant='outline'
              size='sm'
              disabled={isLoading}
              onClick={() => handleDemoLogin('satoshi')}
              className='font-mono text-xs gap-1.5'
            >
              <Bitcoin className='h-3.5 w-3.5' />
              Provider Satoshi
            </Button>
          </div>
        </div>

        <div className='relative my-1'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t border-border' />
          </div>
          <div className='relative flex justify-center text-[10px] uppercase font-mono'>
            <span className='bg-card px-2 text-muted-foreground'>
              Or sign in with email
            </span>
          </div>
        </div>

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-xs font-mono uppercase'>Email or Username</FormLabel>
              <FormControl>
                <Input placeholder='alice@btcovenants.org' {...field} className='font-mono text-xs' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel className='text-xs font-mono uppercase'>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='••••••••' {...field} className='font-mono text-xs' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2 font-mono uppercase text-xs' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin h-4 w-4' /> : <LogIn className='h-4 w-4' />}
          Sign In
        </Button>
      </form>
    </Form>
  )
}
