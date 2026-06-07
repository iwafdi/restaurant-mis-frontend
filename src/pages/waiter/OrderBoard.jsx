import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import OrderCard from "../../components/OrderCard.jsx";

export default function OrderBoard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    api
      .get("/orders", { params: { type: "DINE_IN" } })
      .then((res) =>
        setOrders(
          res.data.filter((o) => !["COMPLETED", "CANCELLED"].includes(o.status))
        )
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 8000); // light polling
    return () => clearInterval(t);
  }, []);

  async function serveItem(orderId, itemId) {
    await api.put(`/orders/${orderId}/items/${itemId}/status`, { status: "SERVED" });
    load();
  }

  if (loading) return <p className="text-slate-400">Loading orders…</p>;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Order Board</h1>
      <p className="mb-6 text-slate-500">Active dine-in orders. Serve ready items.</p>

      {orders.length === 0 ? (
        <p className="text-slate-400">No active dine-in orders.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o}>
              <div className="space-y-2">
                {o.items
                  .filter((it) => it.status !== "SERVED")
                  .map((it) => (
                    <button
                      key={it.id}
                      onClick={() => serveItem(o.id, it.id)}
                      disabled={it.status !== "READY"}
                      className="w-full rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                    >
                      {it.status === "READY"
                        ? `Serve ${it.menuItem?.name}`
                        : `${it.menuItem?.name} — ${it.status.toLowerCase()}`}
                    </button>
                  ))}
                {o.items.every((it) => it.status === "SERVED") && (
                  <p className="text-center text-sm text-emerald-600">
                    All served — awaiting payment at till.
                  </p>
                )}
              </div>
            </OrderCard>
          ))}
        </div>
      )}
    </div>
  );
}
