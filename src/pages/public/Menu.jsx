import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { money } from "../../lib/format.js";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const cart = useCart();
  const { user } = useAuth();
  const canOrder = !user || user.role === "CUSTOMER";

  useEffect(() => {
    Promise.all([api.get("/menu"), api.get("/categories")])
      .then(([m, c]) => {
        setItems(m.data);
        setCategories(c.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const visible =
    active === "ALL" ? items : items.filter((i) => i.categoryId === active);

  if (loading) return <p className="text-slate-400">Loading menu…</p>;

  return (
    <div>
      <h1 className="mb-1 text-3xl font-bold text-slate-900">Our Menu</h1>
      <p className="mb-6 text-slate-500">
        Authentic Spanish cuisine — order for delivery or dine in.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActive("ALL")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            active === "ALL"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              active === c.id
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <div
            key={item.id}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="font-semibold text-slate-900">{item.name}</h3>
              <span className="whitespace-nowrap font-bold text-orange-600">
                {money(item.price)}
              </span>
            </div>
            <p className="mb-1 text-xs uppercase tracking-wide text-slate-400">
              {item.category?.name}
            </p>
            <p className="mb-4 flex-1 text-sm text-slate-500">
              {item.description || "—"}
            </p>
            {canOrder &&
              (item.available ? (
                <button
                  onClick={() => cart.add(item)}
                  className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  Add to cart
                </button>
              ) : (
                <span className="rounded-lg bg-slate-100 px-3 py-2 text-center text-sm font-medium text-slate-400">
                  Unavailable
                </span>
              ))}
          </div>
        ))}
        {visible.length === 0 && (
          <p className="text-slate-400">No items in this category.</p>
        )}
      </div>
    </div>
  );
}
