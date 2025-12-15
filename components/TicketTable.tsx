export default function TicketTable() {
  return (
    <div className="bg-white rounded-xl shadow mt-6 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">Customer</th>
            <th className="text-left p-3">Issue</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Priority</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-3">John</td>
            <td className="p-3">Payment Failed</td>
            <td className="p-3 text-orange-600">Open</td>
            <td className="p-3 text-red-600">High</td>
          </tr>

          <tr className="border-t">
            <td className="p-3">Amina</td>
            <td className="p-3">Login Issue</td>
            <td className="p-3 text-green-600">Resolved</td>
            <td className="p-3 text-blue-600">Medium</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
