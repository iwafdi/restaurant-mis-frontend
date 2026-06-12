import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

// Role-aware navigation links.
const LINKS_BY_ROLE = {
  ADMIN: [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/orders", label: "Orders" },
    { to: "/admin/menu", label: "Menu" },
    { to: "/admin/tables", label: "Tables" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/reports", label: "Reports" },
  ],
  BRANCH_MANAGER: [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/orders", label: "Orders" },
    { to: "/admin/menu", label: "Menu" },
    { to: "/admin/tables", label: "Tables" },
    { to: "/admin/reports", label: "Reports" },
  ],
  HEADQUARTERS_MANAGER: [
    { to: "/hq", label: "HQ Dashboard" },
    { to: "/hq/branches", label: "Branches" },
    { to: "/admin/menu", label: "Menu" },
  ],
  WAITER: [
    { to: "/waiter/tables", label: "Tables" },
    { to: "/waiter/new", label: "New Order" },
    { to: "/waiter/board", label: "Order Board" },
  ],
  KITCHEN: [{ to: "/kitchen", label: "Kitchen Queue" }],
  CASHIER: [{ to: "/cashier", label: "Payments" }],
  CUSTOMER: [
    { to: "/menu", label: "Menu" },
    { to: "/orders", label: "My Orders" },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const cart = useCart();
  const navigate = useNavigate();

  const links = user ? LINKS_BY_ROLE[user.role] || [] : [];

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <Link to="/menu" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="text-xl">🍽️</span>
          <span>Le Restaurant</span>
        </Link>

        <nav className="flex flex-1 flex-wrap items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/admin" || l.to === "/hq"}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm font-medium ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Cart shortcut for customers */}
        {user?.role === "CUSTOMER" && (
          <Link
            to="/cart"
            className="relative rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            🛒 Cart
            {cart.count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">
                {cart.count}
              </span>
            )}
          </Link>
        )}

        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:block">
              {user.name}{" "}
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-600">
                {user.role}
              </span>
            </span>
            <button
              onClick={handleLogout}
              className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-md bg-orange-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-600"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
