import { useEffect, useState } from "react";
import api from "../../api/axios.js";

const EMPTY = { name: "", city: "", address: "", phone: "" };

export default function HqBranches() {
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  function load() {
    api.get("/branches").then((res) => setBranches(res.data));
  }
  useEffect(() => {
    load();
  }, []);

  async function createBranch(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/branches", form);
      setForm(EMPTY);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not create branch");
    }
  }

  async function remove(id) {
    if (!confirm("Delete this branch?")) return;
    try {
      await api.delete(`/branches/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not delete branch");
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Branches</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <form
        onSubmit={createBranch}
        className="mb-6 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <input required placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-lg border border-slate-300 px-3 py-2" />
        <input required placeholder="City" value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="rounded-lg border border-slate-300 px-3 py-2" />
        <input placeholder="Address" value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="rounded-lg border border-slate-300 px-3 py-2" />
        <input placeholder="Phone" value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="rounded-lg border border-slate-300 px-3 py-2" />
        <button className="rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600">
          Add branch
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">City</th>
              <th className="px-4 py-2 text-right">Staff</th>
              <th className="px-4 py-2 text-right">Tables</th>
              <th className="px-4 py-2 text-right">Orders</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {branches.map((b) => (
              <tr key={b.id} className="border-t border-slate-100">
                <td className="px-4 py-2 font-medium text-slate-800">{b.name}</td>
                <td className="px-4 py-2 text-slate-500">{b.city}</td>
                <td className="px-4 py-2 text-right">{b._count?.users ?? 0}</td>
                <td className="px-4 py-2 text-right">{b._count?.tables ?? 0}</td>
                <td className="px-4 py-2 text-right">{b._count?.orders ?? 0}</td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => remove(b.id)}
                    className="text-sm font-medium text-red-500 hover:text-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
