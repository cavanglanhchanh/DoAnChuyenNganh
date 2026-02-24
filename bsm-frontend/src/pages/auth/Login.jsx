import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/auth.api";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login({ phone, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Đăng nhập thành công!");
      setTimeout(() => navigate("/home"), 600);
    } catch (err) {
      toast.error(err?.message || "Sai số điện thoại hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        {/* LOGO */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
            BSM
          </div>
          <h1 className="text-lg font-semibold">
            Nhà trọ · Ký túc xá · Chung cư
          </h1>
          <p className="text-sm text-gray-500">
            Hệ thống quản lý chuyên nghiệp
          </p>
        </div>

        {/* TITLE */}
        <h2 className="text-xl font-bold text-center mb-6">
          Đăng nhập tài khoản
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* PHONE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* LINKS */}
        <div className="flex justify-between mt-6 text-sm">
          <Link to="/register" className="text-indigo-600 hover:underline">
            Tạo tài khoản
          </Link>
          <button className="text-gray-500 hover:text-indigo-600">
            Quên mật khẩu?
          </button>
        </div>

      </div>
    </div>
  );
}
