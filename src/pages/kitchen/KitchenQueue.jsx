import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import { dateTime } from "../../lib/format.js";

// Items the kitchen still has to act on.
const ACTIVE_ITEM = ["PENDING", "PREPARING"];

export default function KitchenQueue() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    api
      .get("/orders")
      .then((res) => {
        const active = res.data.filter((o) => {
          if (["COMPLETED", "CANCELLED"].includes(o.status)) return false;
          // Delivery must be paid before the kitchen sees it.
          if (o.type === "DELIVERY" && o.payment?.status !== "PAID") return false;
          return o.items.some((it) => ACTIVE_ITEM.includes(it.status));
        });
        setOrders(active);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 6000);
    return () => clearInterval(t);
  }, []);

  async function setItem(orderId, itemId, status) {
    await api.put(`/orders/${orderId}/items/${itemId}/status`, { status });
    load();
  }

  if (loading) return <p className="text-slate-400">Loading queue…</p>;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Kitchen Queue</h1>
      <p className="mb-6 text-slate-500">
        Prepare items, then mark them ready for the waiter / delivery.
      </p>

      {orders.length === 0 ? (
        <p className="text-slate-400">Nothing to cook right now. 🎉</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((o) => (
            <div
              key={o.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{o.orderNumber}</p>
                  <p className="text-xs text-slate-400">
                    {o.type.replace("_", "-")}
                    {o.table ? ` · Table #${o.table.number}` : ""} ·{" "}
                    {dateTime(o.createdAt)}
                  </p>
                </div>
                <StatusBadge status={o.status} />
              </div>

              <ul className="space-y-2">
                {o.items.map((it) => (
                  <li
                    key={it.id}
                    className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 p-2"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {it.quantity} × {it.menuItem?.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {it.status === "PENDING" && (
                        <button
                          onClick={() => setItem(o.id, it.id, "PREPARING")}
                          className="rounded bg-amber-500 px-2 py-1 text-xs font-semibold text-white hover:bg-amber-600"
                        >
                          Start
                        </button>
                      )}
                      {it.status === "PREPARING" && (
                        <button
                          onClick={() => setItem(o.id, it.id, "READY")}
                          className="rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                          Ready
                        </button>
                      )}
                      {(it.status === "READY" || it.status === "SERVED") && (
                        <StatusBadge status={it.status} />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
