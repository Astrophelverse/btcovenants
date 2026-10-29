import { createFileRoute } from '@tanstack/react-router'
import { Deals } from '@/features/deals'

export const Route = createFileRoute('/_authenticated/deals/')({
  component: Deals,
})
