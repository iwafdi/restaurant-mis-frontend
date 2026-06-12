import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { money } from "../../lib/format.js";

function Stat({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${accent || "text-slate-900"}`}>{value}</p>
    </div>
  );
}

export default function HqDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/headquarters/dashboard").then((res) => setData(res.data));
  }, []);

  if (!data) return <p className="text-slate-400">Loading chain dashboard…</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Headquarters Dashboard</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Branches" value={data.branchCount} />
        <Stat label="Total orders" value={data.totalOrders} />
        <Stat label="Revenue today" value={money(data.revenueToday)} accent="text-orange-600" />
        <Stat label="Total revenue" value={money(data.revenueTotal)} accent="text-orange-600" />
      </div>

      <h2 className="mb-3 text-lg font-semibold text-slate-800">Branch comparison</h2>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2">Branch</th>
              <th className="px-4 py-2">City</th>
              <th className="px-4 py-2 text-right">Orders</th>
              <th className="px-4 py-2 text-right">Completed</th>
              <th className="px-4 py-2 text-right">Revenue</th>
              <th className="px-4 py-2 text-right">Avg order</th>
              <th className="px-4 py-2 text-right">Table use</th>
            </tr>
          </thead>
          <tbody>
            {data.branches.map((b) => (
              <tr key={b.branchId} className="border-t border-slate-100">
                <td className="px-4 py-2 font-medium text-slate-800">{b.name}</td>
                <td className="px-4 py-2 text-slate-500">{b.city}</td>
                <td className="px-4 py-2 text-right">{b.orderCount}</td>
                <td className="px-4 py-2 text-right">{b.completedCount}</td>
                <td className="px-4 py-2 text-right font-semibold text-orange-600">{money(b.revenue)}</td>
                <td className="px-4 py-2 text-right">{money(b.avgOrderValue)}</td>
                <td className="px-4 py-2 text-right">{Math.round(b.tableUtilization * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
