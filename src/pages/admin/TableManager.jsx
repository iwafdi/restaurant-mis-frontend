import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import StatusBadge from "../../components/StatusBadge.jsx";

const EMPTY = { number: "", capacity: "" };

export default function TableManager() {
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  function load() {
    api.get("/tables").then((r) => setTables(r.data));
  }
  useEffect(() => {
    load();
  }, []);

  async function addTable(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/tables", {
        number: Number(form.number),
        capacity: Number(form.capacity),
      });
      setForm(EMPTY);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not add table");
    }
  }

  async function setStatus(id, status) {
    await api.put(`/tables/${id}`, { status });
    load();
  }

  async function remove(id) {
    if (!confirm("Delete this table?")) return;
    try {
      await api.delete(`/tables/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not delete table");
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Table Manager</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={addTable}
        className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Table number
          </label>
          <input
            required
            type="number"
            min="1"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
            className="w-32 rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Capacity
          </label>
          <input
            required
            type="number"
            min="1"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            className="w-32 rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <button className="rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600">
          Add table
        </button>
      </form>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {tables.map((t) => (
          <div
            key={t.id}
            className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <span className="text-3xl font-bold text-slate-900">#{t.number}</span>
            <span className="mb-2 text-sm text-slate-400">Seats {t.capacity}</span>
            <div className="mb-3">
              <StatusBadge status={t.status} />
            </div>
            <select
              value={t.status}
              onChange={(e) => setStatus(t.id, e.target.value)}
              className="mb-2 w-full rounded-lg border border-slate-300 px-2 py-1 text-sm"
            >
              <option>AVAILABLE</option>
              <option>OCCUPIED</option>
              <option>RESERVED</option>
            </select>
            <button
              onClick={() => remove(t.id)}
              className="text-sm font-medium text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
