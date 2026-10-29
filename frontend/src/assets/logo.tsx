import { type SVGProps } from 'react'
import { cn } from '@/lib/utils'

export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      id='btcovenants-logo'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      height='24'
      width='24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={cn('size-6', className)}
      {...props}
    >
      <title>BTCovenants</title>
      <path d='M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c3.5-.777 2.696-5.5-1.025-6.155m-1.025 6.155-4.323-.762m5.348-5.393L9.633 4.02m-3.774 14.027 1.776-10.088m0 0 4.323.762m-6.099 9.326L4.084 17.73m3.774-14.027L6.082 3.39' />
    </svg>
  )
}
