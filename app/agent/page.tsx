import DashboardLayout from "@/components/DashboardLayout";
import TicketTable from "@/components/TicketTable";

export default function AgentDashboard() {
  return (
    <DashboardLayout role="agent">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Agent Dashboard</h1>

      {/* Agent Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Assigned Tickets</p>
          <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">12</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Resolved Today</p>
          <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">7</p>
        </div>
      </div>

      {/* My Tickets */}
      <TicketTable />
    </DashboardLayout>
  );
}
