import { createFileRoute } from '@tanstack/react-router'
import { TicketDetail } from '@/features/tickets/detail'

export const Route = createFileRoute('/_authenticated/tickets/$ticketId')({
  component: TicketDetailRoute,
})

function TicketDetailRoute() {
  const { ticketId } = Route.useParams()
  return <TicketDetail ticketId={ticketId} />
}
