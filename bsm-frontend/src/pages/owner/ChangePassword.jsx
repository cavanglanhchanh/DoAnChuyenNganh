// src/pages/ChangePassword.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import { changePassword } from "../../api/user.api";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    /* ===== VALIDATE ===== */
    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("Vui lòng nhập đầy đủ thông tin");
    }

    if (newPassword.length < 6) {
      return toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp");
    }

    try {
      setLoading(true);

      await changePassword({
        oldPassword,
        newPassword
      });

      toast.success("Đổi mật khẩu thành công");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(
        err?.message || "Không thể đổi mật khẩu, vui lòng thử lại"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-lg w-full max-w-md p-8 space-y-5"
      >
        <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
          🔐 Đổi mật khẩu
        </h1>

        <input
          type="password"
          placeholder="Mật khẩu hiện tại"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="password"
          placeholder="Xác nhận mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500"
        />

        <button
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700
                     text-white py-3 rounded-xl font-semibold
                     transition disabled:opacity-60"
        >
          {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
        </button>
      </form>
    </div>
  );
}
