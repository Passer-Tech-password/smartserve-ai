export default function TicketTable() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow mt-6 overflow-x-auto transition-colors">
      <table className="w-full text-sm text-gray-700 dark:text-gray-300">
        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
          <tr>
            <th className="text-left p-3">Customer</th>
            <th className="text-left p-3">Issue</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Priority</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-gray-200 dark:border-gray-700">
            <td className="p-3">John</td>
            <td className="p-3">Payment Failed</td>
            <td className="p-3 text-orange-600 dark:text-orange-400">Open</td>
            <td className="p-3 text-red-600 dark:text-red-400">High</td>
          </tr>

          <tr className="border-t border-gray-200 dark:border-gray-700">
            <td className="p-3">Amina</td>
            <td className="p-3">Login Issue</td>
            <td className="p-3 text-green-600 dark:text-green-400">Resolved</td>
            <td className="p-3 text-blue-600 dark:text-blue-400">Medium</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
