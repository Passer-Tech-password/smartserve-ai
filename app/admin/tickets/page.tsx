import DashboardLayout from "@/components/DashboardLayout";
import TicketList from "@/components/TicketList";

export default function AdminTicketsPage() {
  return (
    <DashboardLayout role="admin">
      <h1 className="text-2xl font-bold mb-6">All Support Tickets</h1>
      <TicketList role="admin" />
    </DashboardLayout>
  );
}
