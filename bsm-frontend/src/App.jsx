import { Routes, Route } from "react-router-dom";

/* ===== PAGES ===== */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/owner/Home";
import Rooms from "./pages/owner/Rooms";
import RoomDetail from "./pages/owner/RoomDetail";
import RoomBill from "./pages/owner/RoomBill";
import Settings from "./pages/owner/Settings";
import Tenants from "./pages/owner/Tenants";
import Invoices from "./pages/owner/Invoices";
import InvoiceDetail from "./pages/owner/InvoiceDetail";
import Revenue from "./pages/owner/Revenue";
import MeterHistory from "./pages/owner/MeterHistory";
import Profile from "./pages/owner/Profile";
import ChangePassword from "./pages/owner/ChangePassword";
/* ===== LAYOUT ===== */
import DashboardLayout from "./layouts/DashboardLayout";

export default function App() {
  return (
    <Routes>
      {/* ===== AUTH ===== */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ===== DASHBOARD ===== */}
      <Route element={<DashboardLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id" element={<RoomDetail />} />
        <Route path="/room-bill" element={<RoomBill />} />
        <Route path="/tenants" element={<Tenants />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/invoices/:id" element={<InvoiceDetail />} />
        <Route path="/revenue" element={<Revenue />} />
        <Route path="/meters" element={<MeterHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>
    </Routes>
  );
}
