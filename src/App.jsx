import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Login from "./pages/public/Login.jsx";
import Register from "./pages/public/Register.jsx";
import Menu from "./pages/public/Menu.jsx";
import Cart from "./pages/public/Cart.jsx";
import Checkout from "./pages/public/Checkout.jsx";

import MyOrders from "./pages/customer/MyOrders.jsx";

import Tables from "./pages/waiter/Tables.jsx";
import NewOrder from "./pages/waiter/NewOrder.jsx";
import OrderBoard from "./pages/waiter/OrderBoard.jsx";

import KitchenQueue from "./pages/kitchen/KitchenQueue.jsx";
import CashierPayments from "./pages/cashier/Payments.jsx";

import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminOrders from "./pages/admin/Orders.jsx";
import MenuManager from "./pages/admin/MenuManager.jsx";
import TableManager from "./pages/admin/TableManager.jsx";
import Users from "./pages/admin/Users.jsx";
import Reports from "./pages/admin/Reports.jsx";
import HqDashboard from "./pages/hq/Dashboard.jsx";
import HqBranches from "./pages/hq/Branches.jsx";

const STAFF_MGMT = ["ADMIN", "BRANCH_MANAGER"];

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public */}
        <Route index element={<Navigate to="/menu" replace />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Customer */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute allow={["CUSTOMER"]}>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        {/* Waiter */}
        <Route
          path="/waiter/tables"
          element={
            <ProtectedRoute allow={["WAITER", ...STAFF_MGMT]}>
              <Tables />
            </ProtectedRoute>
          }
        />
        <Route
          path="/waiter/new"
          element={
            <ProtectedRoute allow={["WAITER", ...STAFF_MGMT]}>
              <NewOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/waiter/board"
          element={
            <ProtectedRoute allow={["WAITER", ...STAFF_MGMT]}>
              <OrderBoard />
            </ProtectedRoute>
          }
        />

        {/* Kitchen */}
        <Route
          path="/kitchen"
          element={
            <ProtectedRoute allow={["KITCHEN", ...STAFF_MGMT]}>
              <KitchenQueue />
            </ProtectedRoute>
          }
        />

        {/* Cashier */}
        <Route
          path="/cashier"
          element={
            <ProtectedRoute allow={["CASHIER", ...STAFF_MGMT]}>
              <CashierPayments />
            </ProtectedRoute>
          }
        />

        {/* Admin / Manager */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allow={STAFF_MGMT}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allow={STAFF_MGMT}>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute allow={["ADMIN", "BRANCH_MANAGER", "HEADQUARTERS_MANAGER"]}>
              <MenuManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tables"
          element={
            <ProtectedRoute allow={STAFF_MGMT}>
              <TableManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allow={["ADMIN"]}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allow={STAFF_MGMT}>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Headquarters */}
        <Route
          path="/hq"
          element={
            <ProtectedRoute allow={["HEADQUARTERS_MANAGER", "ADMIN"]}>
              <HqDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hq/branches"
          element={
            <ProtectedRoute allow={["HEADQUARTERS_MANAGER", "ADMIN"]}>
              <HqBranches />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/menu" replace />} />
      </Route>
    </Routes>
  );
}
