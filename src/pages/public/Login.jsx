import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, HOME_BY_ROLE } from "../../context/AuthContext.jsx";

const DEMO = [
  ["Admin", "admin@restaurant.es", "Admin@1234"],
  ["HQ Manager", "hq@restaurant.es", "Hq@1234"],
  ["Manchester Manager", "manager.manchester@restaurant.es", "Manager@1234"],
  ["London Manager", "manager.london@restaurant.es", "Manager@1234"],
  ["Manchester Waiter", "waiter.manchester@restaurant.es", "Waiter@1234"],
  ["Manchester Cashier", "cashier.manchester@restaurant.es", "Cashier@1234"],
  ["Manchester Kitchen", "kitchen.manchester@restaurant.es", "Kitchen@1234"],
  ["Customer", "customer@restaurant.es", "Customer@1234"],
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = await login(email, password);
      navigate(HOME_BY_ROLE[user.role] || "/menu");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mb-6 text-sm text-slate-500">Sign in to your account.</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
            />
          </div>
          <button
            disabled={busy}
            className="w-full rounded-lg bg-orange-500 px-4 py-2.5 font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          No account?{" "}
          <Link to="/register" className="font-semibold text-orange-600">
            Create one
          </Link>
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
        <p className="mb-2 font-semibold text-slate-700">Demo accounts (click to fill)</p>
        <div className="grid grid-cols-2 gap-2">
          {DEMO.map(([label, e, p]) => (
            <button
              key={e}
              onClick={() => {
                setEmail(e);
                setPassword(p);
              }}
              className="rounded-lg border border-slate-200 px-3 py-2 text-left hover:bg-slate-50"
            >
              <span className="font-medium text-slate-800">{label}</span>
              <br />
              <span className="text-xs text-slate-400">{e}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
