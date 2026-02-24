import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../../api/auth.api";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.password) {
      return toast.error("Vui lòng nhập đầy đủ thông tin");
    }

    if (form.password !== form.confirmPassword) {
      return toast.error("Mật khẩu nhập lại không khớp");
    }

    try {
      setLoading(true);

      await registerApi({
        name: form.name,
        phone: form.phone,
        email: `${form.phone}@bsm.local`, // cho đồ án
        password: form.password,
        role: "OWNER",
      });

      toast.success("Đăng ký thành công!");
      setTimeout(() => navigate("/"), 700);
    } catch (err) {
      toast.error(err?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
            BSM
          </div>
          <h1 className="text-xl font-bold">Đăng ký tài khoản</h1>
          <p className="text-sm text-gray-500">
            Nhà trọ · Ký túc xá · Chung cư
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="grid md:grid-cols-2 gap-4">
            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên người dùng
              </label>
              <input
                type="text"
                name="name"
                placeholder="Nguyễn Văn A"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                name="phone"
                placeholder="098xxxxxxx"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* CONFIRM */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nhập lại mật khẩu
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {loading && (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm mt-6">
          Đã có tài khoản?{" "}
          <Link to="/" className="text-indigo-600 hover:underline font-medium">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
