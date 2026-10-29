import { createFileRoute } from '@tanstack/react-router'
import { DlcCalculator } from '@/features/dlc'

export const Route = createFileRoute('/_authenticated/dlc-calculator/')({
  component: DlcCalculator,
})
