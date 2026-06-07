import { Navigate } from "react-router-dom";
import { useAuth, HOME_BY_ROLE } from "../context/AuthContext.jsx";

// Guards a route. `allow` is an optional list of roles permitted to view it.
export default function ProtectedRoute({ allow, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allow && !allow.includes(user.role)) {
    // Logged in but wrong role → send to their own home.
    return <Navigate to={HOME_BY_ROLE[user.role] || "/menu"} replace />;
  }

  return children;
}
