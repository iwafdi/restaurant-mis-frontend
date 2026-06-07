const COLORS = {
  // order / item
  PENDING: "bg-slate-100 text-slate-700",
  PREPARING: "bg-amber-100 text-amber-800",
  READY: "bg-blue-100 text-blue-800",
  SERVED: "bg-indigo-100 text-indigo-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-700",
  // table
  AVAILABLE: "bg-emerald-100 text-emerald-800",
  OCCUPIED: "bg-red-100 text-red-700",
  RESERVED: "bg-amber-100 text-amber-800",
  // payment
  PAID: "bg-emerald-100 text-emerald-800",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-slate-100 text-slate-700",
};

export default function StatusBadge({ status }) {
  const cls = COLORS[status] || "bg-slate-100 text-slate-700";
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}
    >
      {status}
    </span>
  );
}
