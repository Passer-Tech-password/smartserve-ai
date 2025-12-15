import { getTicket } from "@/lib/tickets";

export default async function TicketPage({ params }: any) {
  const ticket = await getTicket(params.ticketId);

  if (!ticket) return <div>Ticket not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">{ticket.title}</h1>
      <p>Status: {ticket.status}</p>
      <p>Priority: {ticket.priority}</p>
      <p>Customer ID: {ticket.customerId}</p>
    </div>
  );
}
// +// File: smartserve/app/tickets/[ticketId]/page.tsx