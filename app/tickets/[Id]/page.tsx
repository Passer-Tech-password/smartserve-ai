import { getTicket } from "@/lib/tickets";
import type { Ticket } from "@/lib/tickets";

type TicketWithExtras = Ticket & {
  priority?: "low" | "medium" | "high";
  customerId?: string;
};

type PageProps = {
  params: {
    ticketId: string;
  };
};

export default async function TicketPage({ params }: PageProps) {
  const ticket = (await getTicket(params.ticketId)) as TicketWithExtras | null;

  if (!ticket) return <div>Ticket not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">{ticket.title}</h1>

      {ticket.status && <p>Status: {ticket.status}</p>}

      {ticket.priority && <p>Priority: {ticket.priority}</p>}

      {ticket.customerId && <p>Customer ID: {ticket.customerId}</p>}
    </div>
  );
}
