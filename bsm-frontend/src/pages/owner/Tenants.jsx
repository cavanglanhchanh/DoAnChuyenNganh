import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingTenant, setEditingTenant] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const emptyForm = { name: "", email: "", phone: "" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchTenants();
  }, []);

  async function fetchTenants() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/clients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTenants(data);
    } catch {
      toast.error("Không tải được danh sách khách thuê");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    if (!form.name || !form.phone) {
      return toast.error("Vui lòng nhập tên và SĐT");
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/clients", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Đã thêm khách thuê");
      setShowAddModal(false);
      setForm(emptyForm);
      fetchTenants();
    } catch {
      toast.error("Thêm khách thuê thất bại");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Bạn chắc chắn muốn xóa khách thuê này?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/clients/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      toast.success("Đã xóa khách thuê");
      setTenants((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      toast.error(err.message || "Xóa thất bại");
    }
  }

  function openEditModal(tenant) {
    setEditingTenant(tenant);
    setForm({
      name: tenant.name,
      email: tenant.email || "",
      phone: tenant.phone || "",
    });
  }

  async function handleUpdate() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/clients/${editingTenant.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error();
      toast.success("Cập nhật thành công");
      setEditingTenant(null);
      setForm(emptyForm);
      fetchTenants();
    } catch {
      toast.error("Cập nhật thất bại");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-gradient-to-br from-indigo-50 via-white to-pink-50
                      text-slate-500">
        Đang tải danh sách...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800">
              Khách thuê
            </h2>
            <p className="text-sm text-slate-500">
              Quản lý danh sách khách thuê
            </p>
          </div>

          <button
            onClick={() => {
              setForm(emptyForm);
              setShowAddModal(true);
            }}
            className="bg-indigo-500 hover:bg-indigo-600
                       text-white px-6 py-2 rounded-full font-semibold"
          >
            + Thêm khách
          </button>
        </div>

        {/* GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tenants.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl shadow-md p-6 text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-full
                              bg-gradient-to-br from-indigo-500 to-pink-500
                              text-white flex items-center justify-center
                              text-xl font-bold mb-3">
                {t.name?.charAt(0)?.toUpperCase()}
              </div>

              <h3 className="font-semibold text-lg">{t.name}</h3>
              <p className="text-sm text-slate-500">{t.email || "—"}</p>
              <p className="text-sm text-slate-500 mb-4">{t.phone}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => openEditModal(t)}
                  className="flex-1 bg-indigo-100 text-indigo-600
                             py-2 rounded-xl font-semibold"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="flex-1 bg-rose-100 text-rose-600
                             py-2 rounded-xl font-semibold"
                >
                  🗑 Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAddModal && (
          <Modal
            title="➕ Thêm khách thuê"
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAdd}
            form={form}
            setForm={setForm}
            submitText="Thêm khách"
          />
        )}

        {editingTenant && (
          <Modal
            title="✏️ Chỉnh sửa thông tin khách thuê"
            onClose={() => setEditingTenant(null)}
            onSubmit={handleUpdate}
            form={form}
            setForm={setForm}
            submitText="Lưu thay đổi"
          />
        )}
      </div>
    </div>
  );
}

/* ===== MODAL ===== */
function Modal({ title, onClose, onSubmit, form, setForm, submitText }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm
                    flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl
                      p-6 w-full max-w-md space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">
          {title}
        </h3>

        <div>
          <label className="text-sm text-slate-600">
            Tên khách thuê
          </label>
          <input
            className="w-full px-4 py-2 border rounded-xl mt-1"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm text-slate-600">
            Email
          </label>
          <input
            className="w-full px-4 py-2 border rounded-xl mt-1"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm text-slate-600">
            Số điện thoại
          </label>
          <input
            className="w-full px-4 py-2 border rounded-xl mt-1"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-xl"
          >
            Hủy
          </button>
          <button
            onClick={onSubmit}
            className="px-5 py-2 bg-indigo-500 text-white rounded-xl"
          >
            {submitText}
          </button>
        </div>
      </div>
    </div>
  );
}
