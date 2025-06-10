import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PaymentStatusMp from "./pages/payment-status-mp";
import { ActivateAccount } from "./pages/ActivateAccount";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/payment-status-mp" element={<PaymentStatusMp />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/activate" element={<ActivateAccount />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
