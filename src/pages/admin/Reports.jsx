import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { money } from "../../lib/format.js";

export default function Reports() {
  const [data, setData] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  function load() {
    const params = {};
    if (from) params.from = new Date(from).toISOString();
    if (to) params.to = new Date(to + "T23:59:59").toISOString();
    api.get("/reports/sales", { params }).then((res) => setData(res.data));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maxRevenue = data
    ? Math.max(1, ...data.byDay.map((d) => d.revenue))
    : 1;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Sales Reports</h1>

      <div className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <button
          onClick={load}
          className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800"
        >
          Apply
        </button>
      </div>

      {!data ? (
        <p className="text-slate-400">Loading…</p>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Total revenue</p>
              <p className="mt-1 text-2xl font-bold text-orange-600">
                {money(data.totalRevenue)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Payments</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {data.paymentCount}
              </p>
            </div>
            {Object.entries(data.byMethod).map(([m, v]) => (
              <div key={m} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">{m}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{money(v)}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 font-semibold text-slate-800">Revenue by day</h2>
            {data.byDay.length === 0 ? (
              <p className="text-slate-400">No sales in this range.</p>
            ) : (
              <div className="space-y-2">
                {data.byDay.map((d) => (
                  <div key={d.date} className="flex items-center gap-3">
                    <span className="w-24 text-sm text-slate-500">{d.date}</span>
                    <div className="h-6 flex-1 rounded bg-slate-100">
                      <div
                        className="h-6 rounded bg-orange-400"
                        style={{ width: `${(d.revenue / maxRevenue) * 100}%` }}
                      />
                    </div>
                    <span className="w-28 text-right text-sm font-medium text-slate-700">
                      {money(d.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
