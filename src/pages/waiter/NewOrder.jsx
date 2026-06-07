import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios.js";
import { money } from "../../lib/format.js";

export default function NewOrder() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [menu, setMenu] = useState([]);
  const [tableId, setTableId] = useState(params.get("tableId") || "");
  const [lines, setLines] = useState({}); // menuItemId -> quantity
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get("/tables").then((r) => setTables(r.data));
    api.get("/menu").then((r) => setMenu(r.data.filter((m) => m.available)));
  }, []);

  function setQty(id, qty) {
    setLines((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }

  const items = useMemo(
    () => Object.entries(lines).map(([menuItemId, quantity]) => ({ menuItemId, quantity })),
    [lines]
  );
  const total = useMemo(
    () =>
      items.reduce((sum, l) => {
        const m = menu.find((x) => x.id === l.menuItemId);
        return sum + (m ? Number(m.price) * l.quantity : 0);
      }, 0),
    [items, menu]
  );

  async function submit() {
    setError("");
    if (!tableId) return setError("Select a table");
    if (items.length === 0) return setError("Add at least one item");
    setBusy(true);
    try {
      await api.post("/orders", { type: "DINE_IN", tableId, items });
      navigate("/waiter/board");
    } catch (err) {
      setError(err.response?.data?.error || "Could not create order");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">New Dine-in Order</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 max-w-xs">
        <label className="mb-1 block text-sm font-medium text-slate-700">Table</label>
        <select
          value={tableId}
          onChange={(e) => setTableId(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
        >
          <option value="">— choose —</option>
          {tables.map((t) => (
            <option key={t.id} value={t.id} disabled={t.status === "OCCUPIED"}>
              Table #{t.number} (seats {t.capacity})
              {t.status === "OCCUPIED" ? " — occupied" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {menu.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3"
          >
            <div>
              <p className="font-medium text-slate-900">{m.name}</p>
              <p className="text-sm text-orange-600">{money(m.price)}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setQty(m.id, (lines[m.id] || 0) - 1)}
                className="h-8 w-8 rounded-lg bg-slate-100 font-bold text-slate-700 hover:bg-slate-200"
              >
                −
              </button>
              <span className="w-6 text-center font-medium">{lines[m.id] || 0}</span>
              <button
                onClick={() => setQty(m.id, (lines[m.id] || 0) + 1)}
                className="h-8 w-8 rounded-lg bg-slate-100 font-bold text-slate-700 hover:bg-slate-200"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
        <span className="text-lg font-bold text-slate-900">
          Total: <span className="text-orange-600">{money(total)}</span>
        </span>
        <button
          onClick={submit}
          disabled={busy}
          className="rounded-lg bg-orange-500 px-6 py-2.5 font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
        >
          {busy ? "Creating…" : "Create order"}
        </button>
      </div>
    </div>
  );
}
