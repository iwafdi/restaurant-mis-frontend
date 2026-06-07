import StatusBadge from "./StatusBadge.jsx";
import { money, dateTime } from "../lib/format.js";

// Generic order card. Pass `children` to render role-specific action controls.
export default function OrderCard({ order, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-slate-900">{order.orderNumber}</p>
          <p className="text-xs text-slate-400">{dateTime(order.createdAt)}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={order.status} />
          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {order.type.replace("_", "-")}
          </span>
        </div>
      </div>

      {order.table && (
        <p className="mb-1 text-sm text-slate-500">Table #{order.table.number}</p>
      )}
      {order.deliveryAddress && (
        <p className="mb-1 text-sm text-slate-500">📍 {order.deliveryAddress}</p>
      )}
      {order.customer && (
        <p className="mb-1 text-sm text-slate-500">👤 {order.customer.name}</p>
      )}

      <ul className="my-3 divide-y divide-slate-100 border-y border-slate-100">
        {order.items?.map((it) => (
          <li key={it.id} className="flex justify-between py-1.5 text-sm">
            <span className="text-slate-700">
              {it.quantity} × {it.menuItem?.name}
            </span>
            <div className="flex items-center gap-2">
              <StatusBadge status={it.status} />
              <span className="w-20 text-right font-medium text-slate-600">
                {money(Number(it.unitPrice) * it.quantity)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">
          {order.payment ? (
            <StatusBadge status={order.payment.status} />
          ) : (
            <span className="text-xs text-slate-400">No payment</span>
          )}
        </span>
        <span className="text-lg font-bold text-slate-900">
          {money(order.total)}
        </span>
      </div>

      {children && <div className="mt-4 border-t border-slate-100 pt-4">{children}</div>}
    </div>
  );
}
