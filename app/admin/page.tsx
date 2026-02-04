import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import TicketTable from "@/components/TicketTable";

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Tickets" value="128" />
        <StatCard title="Open Tickets" value="34" />
        <StatCard title="Resolved" value="82" />
        <StatCard title="Avg Response Time" value="2m 40s" />
      </div>

      {/* Ticket Table */}
      <TicketTable />
    </DashboardLayout>
  );
}
