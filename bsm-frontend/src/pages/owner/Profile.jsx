import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProfile, updateProfile } from "../../api/profile.api";

export default function Profile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [loading, setLoading] = useState(true);

  /* ===== LOAD PROFILE ===== */
  async function fetchProfile() {
    try {
      const data = await getProfile();

      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || ""
      });

      // sync user cho header
      localStorage.setItem("user", JSON.stringify(data));
    } catch {
      toast.error("Không tải được thông tin cá nhân");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  /* ===== UPDATE ===== */
 async function handleSubmit(e) {
  e.preventDefault();

  try {
    await updateProfile({
      name: form.name,
      phone: form.phone
    });

    // 🔥 cập nhật localStorage
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("user")),
        name: form.name
      })
    );

    // 🔥 báo cho DashboardLayout reload user
    window.dispatchEvent(new Event("user-updated"));

    toast.success("Cập nhật thông tin thành công");
  } catch {
    toast.error("Cập nhật thất bại");
  }
}

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center
                      text-slate-500">
        Đang tải thông tin...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-extrabold text-slate-800">
        Thông tin cá nhân
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-md p-8 space-y-6"
      >
        {/* NAME */}
        <div>
          <label className="text-sm text-slate-600">
            Họ và tên
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-xl mt-1"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm text-slate-600">
            Email
          </label>
          <input
            value={form.email}
            disabled
            className="w-full border bg-gray-100 px-4 py-3
                       rounded-xl mt-1 cursor-not-allowed"
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="text-sm text-slate-600">
            Số điện thoại
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-xl mt-1"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700
                     text-white px-6 py-3 rounded-xl
                     font-semibold disabled:opacity-60"
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
}
