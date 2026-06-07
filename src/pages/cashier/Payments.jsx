import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import { money, dateTime } from "../../lib/format.js";

export default function Payments() {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load() {
    Promise.all([api.get("/orders", { params: { type: "DINE_IN" } }), api.get("/payments")])
      .then(([o, p]) => {
        setOrders(
          o.data.filter(
            (x) => !["COMPLETED", "CANCELLED"].includes(x.status) && !x.payment
          )
        );
        setPayments(p.data);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function pay(orderId, method) {
    setError("");
    try {
      await api.post("/payments", { orderId, method });
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Payment failed");
    }
  }

  if (loading) return <p className="text-slate-400">Loading…</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Cashier — Payments</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <h2 className="mb-3 text-lg font-semibold text-slate-800">
        Orders to settle
      </h2>
      {orders.length === 0 ? (
        <p className="mb-8 text-slate-400">No dine-in orders awaiting payment.</p>
      ) : (
        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((o) => (
            <div
              key={o.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="font-bold text-slate-900">{o.orderNumber}</p>
                <StatusBadge status={o.status} />
              </div>
              {o.table && (
                <p className="mb-2 text-sm text-slate-500">Table #{o.table.number}</p>
              )}
              <ul className="mb-3 text-sm text-slate-600">
                {o.items.map((it) => (
                  <li key={it.id} className="flex justify-between py-0.5">
                    <span>
                      {it.quantity} × {it.menuItem?.name}
                    </span>
                    <span>{money(Number(it.unitPrice) * it.quantity)}</span>
                  </li>
                ))}
              </ul>
              <p className="mb-3 text-right text-lg font-bold text-slate-900">
                {money(o.total)}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => pay(o.id, "CASH")}
                  className="flex-1 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                >
                  Pay cash
                </button>
                <button
                  onClick={() => pay(o.id, "CARD")}
                  className="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-900"
                >
                  Pay card
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="mb-3 text-lg font-semibold text-slate-800">Recent payments</h2>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2">Order</th>
              <th className="px-4 py-2">Method</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Paid at</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-slate-400">
                  No payments yet.
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="px-4 py-2 font-medium text-slate-700">
                    {p.order?.orderNumber}
                  </td>
                  <td className="px-4 py-2">{p.method}</td>
                  <td className="px-4 py-2">{money(p.amount)}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-2 text-slate-500">{dateTime(p.paidAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
