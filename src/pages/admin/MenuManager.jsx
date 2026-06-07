import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { money } from "../../lib/format.js";

const EMPTY_ITEM = { name: "", description: "", price: "", categoryId: "" };

export default function MenuManager() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [catName, setCatName] = useState("");
  const [item, setItem] = useState(EMPTY_ITEM);
  const [error, setError] = useState("");

  function load() {
    api.get("/categories").then((r) => setCategories(r.data));
    api.get("/menu").then((r) => setItems(r.data));
  }
  useEffect(() => {
    load();
  }, []);

  async function addCategory(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/categories", { name: catName });
      setCatName("");
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not add category");
    }
  }

  async function deleteCategory(id) {
    if (!confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Category may still have items");
    }
  }

  async function addItem(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/menu", {
        name: item.name,
        description: item.description,
        price: Number(item.price),
        categoryId: item.categoryId,
      });
      setItem(EMPTY_ITEM);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not add menu item");
    }
  }

  async function toggleAvailable(it) {
    await api.put(`/menu/${it.id}`, { available: !it.available });
    load();
  }

  async function deleteItem(id) {
    if (!confirm("Delete this item?")) return;
    try {
      await api.delete(`/menu/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not delete item");
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Menu Manager</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Categories */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 font-semibold text-slate-800">Categories</h2>
          <form onSubmit={addCategory} className="mb-4 flex gap-2">
            <input
              required
              placeholder="New category"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
            />
            <button className="rounded-lg bg-orange-500 px-3 py-2 font-semibold text-white hover:bg-orange-600">
              Add
            </button>
          </form>
          <ul className="space-y-1">
            {categories.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
              >
                <span className="text-slate-700">
                  {c.name}{" "}
                  <span className="text-xs text-slate-400">
                    ({c._count?.items ?? 0})
                  </span>
                </span>
                <button
                  onClick={() => deleteCategory(c.id)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Menu items */}
        <div className="lg:col-span-2">
          <form
            onSubmit={addItem}
            className="mb-4 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2"
          >
            <input
              required
              placeholder="Item name"
              value={item.name}
              onChange={(e) => setItem({ ...item, name: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
            <input
              required
              type="number"
              step="0.01"
              min="0"
              placeholder="Price (EUR)"
              value={item.price}
              onChange={(e) => setItem({ ...item, price: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
            <input
              placeholder="Description"
              value={item.description}
              onChange={(e) => setItem({ ...item, description: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 sm:col-span-2"
            />
            <select
              required
              value={item.categoryId}
              onChange={(e) => setItem({ ...item, categoryId: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="">— category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button className="rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600">
              Add item
            </button>
          </form>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Available</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="border-t border-slate-100">
                    <td className="px-4 py-2 font-medium text-slate-800">{it.name}</td>
                    <td className="px-4 py-2 text-slate-500">{it.category?.name}</td>
                    <td className="px-4 py-2">{money(it.price)}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => toggleAvailable(it)}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          it.available
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {it.available ? "Yes" : "No"}
                      </button>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => deleteItem(it.id)}
                        className="text-sm font-medium text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
