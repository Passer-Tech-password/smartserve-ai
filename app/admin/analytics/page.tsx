import DashboardLayout from "@/components/DashboardLayout";

export default function AnalyticsPage() {
  return (
    <DashboardLayout role="admin">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Analytics</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition-colors">
        <p className="text-gray-500 dark:text-gray-400">
          Analytics dashboard is coming soon.
        </p>
      </div>
    </DashboardLayout>
  );
}
