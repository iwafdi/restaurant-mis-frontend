import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { money } from "../../lib/format.js";

export default function Cart() {
  const cart = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Your cart</h1>
        <p className="mb-6 text-slate-500">Your cart is empty.</p>
        <Link
          to="/menu"
          className="rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600"
        >
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Your cart</h1>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {cart.items.map((i) => (
          <div
            key={i.menuItemId}
            className="flex items-center gap-4 border-b border-slate-100 p-4 last:border-0"
          >
            <div className="flex-1">
              <p className="font-medium text-slate-900">{i.name}</p>
              <p className="text-sm text-slate-500">{money(i.price)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => cart.setQuantity(i.menuItemId, i.quantity - 1)}
                className="h-8 w-8 rounded-lg bg-slate-100 font-bold text-slate-700 hover:bg-slate-200"
              >
                −
              </button>
              <span className="w-8 text-center font-medium">{i.quantity}</span>
              <button
                onClick={() => cart.setQuantity(i.menuItemId, i.quantity + 1)}
                className="h-8 w-8 rounded-lg bg-slate-100 font-bold text-slate-700 hover:bg-slate-200"
              >
                +
              </button>
            </div>
            <div className="w-24 text-right font-semibold text-slate-900">
              {money(i.price * i.quantity)}
            </div>
            <button
              onClick={() => cart.remove(i.menuItemId)}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
        <span className="text-lg font-semibold text-slate-700">Total</span>
        <span className="text-2xl font-bold text-orange-600">
          {money(cart.total)}
        </span>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={cart.clear}
          className="rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-700 hover:bg-slate-200"
        >
          Clear cart
        </button>
        <button
          onClick={() => navigate("/checkout")}
          className="rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
