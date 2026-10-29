import { createFileRoute } from '@tanstack/react-router'
import { WalletView } from '@/features/wallet'

export const Route = createFileRoute('/_authenticated/wallet/')({
  component: WalletView,
})
