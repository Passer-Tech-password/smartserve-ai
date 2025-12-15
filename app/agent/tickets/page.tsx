import DashboardLayout from "@/components/DashboardLayout";
import TicketList from "@/components/TicketList";

export default function AgentTicketsPage() {
  return (
    <DashboardLayout role="agent">
      <h1 className="text-2xl font-bold mb-6">My Assigned Tickets</h1>
      <TicketList role="agent" />
    </DashboardLayout>
  );
}
