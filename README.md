# Restaurant MIS — Frontend

React single-page app for the restaurant Management Information System. Role-aware
UI for customers, waiters, kitchen, cashier, managers and admins.

**Stack:** React 19 · Vite · React Router · Axios · TailwindCSS v4

## Setup

```bash
npm install
cp .env.example .env       # set VITE_API_URL to the backend URL
npm run dev                # http://localhost:5173
```

Requires the [backend](../restaurant-mis-backend) running (default
`http://localhost:4000`).

### Environment

| Var | Description |
|-----|-------------|
| `VITE_API_URL` | Base URL of the backend API (no trailing `/api`) |

## Features by role

| Role | What they can do |
|------|------------------|
| **Customer** | Browse menu, add to cart, checkout delivery (simulated online payment), view own orders |
| **Waiter** | View/cycle tables, open dine-in orders, serve ready items |
| **Kitchen** | See the prep queue, mark items preparing → ready |
| **Cashier** | Settle dine-in orders (cash/card), view recent payments |
| **Manager** | Dashboard KPIs, manage menu/categories/tables, all orders, sales reports |
| **Admin** | Everything + user management (create staff, assign roles) |

After login users are redirected to their role's home. Routes are guarded by
`<ProtectedRoute allow={[...]}>`; the JWT is stored in `localStorage` and attached
to every request by an axios interceptor.

## Demo accounts

Use the buttons on the login screen, or:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@restaurant.es` | `Admin@1234` |
| Manager | `manager@restaurant.es` | `Manager@1234` |
| Waiter | `waiter@restaurant.es` | `Waiter@1234` |
| Cashier | `cashier@restaurant.es` | `Cashier@1234` |
| Kitchen | `kitchen@restaurant.es` | `Kitchen@1234` |
| Customer | `customer@restaurant.es` | `Customer@1234` |

## Build & deploy

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build
```

Deploy to Vercel/Netlify; set `VITE_API_URL` to your deployed backend URL.
