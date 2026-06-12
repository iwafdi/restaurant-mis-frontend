import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { money } from "../../lib/format.js";

export default function Checkout() {
  const cart = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");

  useEffect(() => {
    api.get("/public/branches").then((res) => {
      setBranches(res.data);
      if (res.data.length > 0) setBranchId(res.data[0].id);
    }).catch(() => setBranches([]));
  }, []);

  if (loading) return null;
  // Must be a logged-in customer to place a delivery order.
  if (!user) return <Navigate to="/login" replace />;
  if (cart.items.length === 0) return <Navigate to="/cart" replace />;

  async function placeOrder(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      // 1. Create the delivery order.
      const orderRes = await api.post("/orders", {
        type: "DELIVERY",
        branchId,
        deliveryAddress: address,
        items: cart.items.map((i) => ({
          menuItemId: i.menuItemId,
          quantity: i.quantity,
        })),
      });
      // 2. Simulate paying online (required before the kitchen sees it).
      await api.post("/payments", {
        orderId: orderRes.data.id,
        method: "ONLINE",
      });
      cart.clear();
      navigate("/orders", { state: { justOrdered: orderRes.data.orderNumber } });
    } catch (err) {
      setError(err.response?.data?.error || "Could not place order");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Checkout</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 font-semibold text-slate-800">Order summary</h2>
        {cart.items.map((i) => (
          <div key={i.menuItemId} className="flex justify-between py-1 text-sm">
            <span className="text-slate-600">
              {i.quantity} × {i.name}
            </span>
            <span className="font-medium">{money(i.price * i.quantity)}</span>
          </div>
        ))}
        <div className="mt-3 flex justify-between border-t border-slate-100 pt-3 font-bold">
          <span>Total</span>
          <span className="text-orange-600">{money(cart.total)}</span>
        </div>
      </div>

      <form
        onSubmit={placeOrder}
        className="rounded-2xl border border-slate-200 bg-white p-5"
      >
        <label className="mb-1 block text-sm font-medium text-slate-700">Branch</label>
        <select
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
          className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
        >
          {branches.map((b) => (
            <option key={b.id} value={b.id}>{b.name} — {b.city}</option>
          ))}
        </select>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Delivery address
        </label>
        <textarea
          required
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Street, building, city…"
          className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
        />

        <div className="mb-4 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-500">
          💳 Payment is simulated — clicking below pays online and sends your
          order to the kitchen.
        </div>

        <div className="flex justify-between gap-3">
          <Link
            to="/cart"
            className="rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-700 hover:bg-slate-200"
          >
            Back to cart
          </Link>
          <button
            disabled={busy || !branchId}
            className="rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {busy ? "Placing order…" : `Pay ${money(cart.total)} & order`}
          </button>
        </div>
      </form>
    </div>
  );
}
