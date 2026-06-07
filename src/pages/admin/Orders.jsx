import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import OrderCard from "../../components/OrderCard.jsx";

const STATUSES = ["", "PENDING", "PREPARING", "READY", "SERVED", "COMPLETED", "CANCELLED"];
const TYPES = ["", "DINE_IN", "DELIVERY", "TAKEAWAY"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    const params = {};
    if (status) params.status = status;
    if (type) params.type = type;
    api
      .get("/orders", { params })
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, type]);

  async function setOrderStatus(id, value) {
    await api.put(`/orders/${id}/status`, { status: value });
    load();
  }

  async function remove(id) {
    if (!confirm("Delete/cancel this order?")) return;
    await api.delete(`/orders/${id}`);
    load();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">All Orders</h1>

      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s || "All statuses"}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2"
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t ? t.replace("_", "-") : "All types"}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="text-slate-400">No orders match.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o}>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={o.status}
                  onChange={(e) => setOrderStatus(o.id, e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                >
                  {STATUSES.filter(Boolean).map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <button
                  onClick={() => remove(o.id)}
                  className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </OrderCard>
          ))}
        </div>
      )}
    </div>
  );
}
