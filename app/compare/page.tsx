

// =====================================================
// 3. COMPARE PLANS SECTION
// =====================================================
export function ComparePlans() {
return (
<div className="py-20 px-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
<h2 className="text-3xl font-bold mb-10 text-center">Compare Plans</h2>


<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr>
<th className="p-4 border-b">Feature</th>
<th className="p-4 border-b">Starter</th>
<th className="p-4 border-b">Pro</th>
<th className="p-4 border-b">Enterprise</th>
</tr>
</thead>
<tbody>
<tr>
<td className="p-4 border-b">AI Responses</td>
<td className="p-4 border-b">Basic</td>
<td className="p-4 border-b">Advanced</td>
<td className="p-4 border-b">Full Suite</td>
</tr>
<tr>
<td className="p-4 border-b">Ticket Limit</td>
<td className="p-4 border-b">500</td>
<td className="p-4 border-b">5,000</td>
<td className="p-4 border-b">Unlimited</td>
</tr>
</tbody>
</table>
</div>
</div>
);
}