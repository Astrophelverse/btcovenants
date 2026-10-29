import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBTC(sats: number): string {
  return (sats / 1e8).toFixed(8) + ' BTC'
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export function truncateAddress(addr: string): string {
  if (!addr) return ''
  return addr.slice(0, 6) + '...' + addr.slice(-4)
}
