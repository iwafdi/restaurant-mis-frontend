import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { money } from "../../lib/format.js";

function Stat({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${accent || "text-slate-900"}`}>
        {value}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const [kpi, setKpi] = useState(null);

  useEffect(() => {
    api.get("/reports/dashboard").then((res) => setKpi(res.data));
  }, []);

  if (!kpi) return <p className="text-slate-400">Loading dashboard…</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Orders today" value={kpi.ordersToday} />
        <Stat
          label="Revenue today"
          value={money(kpi.revenueToday)}
          accent="text-orange-600"
        />
        <Stat label="Active orders" value={kpi.activeOrders} accent="text-amber-600" />
        <Stat label="Completed orders" value={kpi.completedOrders} accent="text-emerald-600" />
        <Stat
          label="Tables occupied"
          value={`${kpi.tables.occupied} / ${kpi.tables.total}`}
        />
        <Stat label="Menu items" value={kpi.menuItems} />
        <Stat label="Customers" value={kpi.customers} />
        <Stat
          label="Total revenue"
          value={money(kpi.revenueTotal)}
          accent="text-orange-600"
        />
      </div>
    </div>
  );
}
