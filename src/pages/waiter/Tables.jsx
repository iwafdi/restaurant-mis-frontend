import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import StatusBadge from "../../components/StatusBadge.jsx";

const NEXT_STATUS = { AVAILABLE: "RESERVED", RESERVED: "OCCUPIED", OCCUPIED: "AVAILABLE" };

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  function load() {
    api.get("/tables").then((res) => setTables(res.data)).finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function cycleStatus(table) {
    await api.put(`/tables/${table.id}`, { status: NEXT_STATUS[table.status] });
    load();
  }

  if (loading) return <p className="text-slate-400">Loading tables…</p>;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Tables</h1>
      <p className="mb-6 text-slate-500">
        Tap a status to cycle it, or start a dine-in order on an open table.
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {tables.map((t) => (
          <div
            key={t.id}
            className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <span className="text-3xl font-bold text-slate-900">#{t.number}</span>
            <span className="mb-3 text-sm text-slate-400">
              Seats {t.capacity}
            </span>
            <button onClick={() => cycleStatus(t)} className="mb-3">
              <StatusBadge status={t.status} />
            </button>
            <button
              disabled={t.status === "OCCUPIED"}
              onClick={() => navigate(`/waiter/new?tableId=${t.id}`)}
              className="w-full rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              {t.status === "OCCUPIED" ? "In use" : "New order"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
