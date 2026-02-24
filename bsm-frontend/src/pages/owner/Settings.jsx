import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Settings() {
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    electric_price: 0,

    water_type: "METER", // METER | PERSON
    water_price: 0,
    water_price_per_person: 0,

    trash_fee: 0,
    service_fee: 0,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  /* ===== FETCH SETTINGS ===== */
  async function fetchSettings() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setForm(data);
    } catch {
      toast.error("Không tải được cài đặt");
    } finally {
      setLoading(false);
    }
  }

  /* ===== SAVE SETTINGS ===== */
  async function saveSettings() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/settings", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      toast.success("Đã lưu cài đặt chung");
    } catch {
      toast.error("Không thể lưu cài đặt");
    }
  }

  if (loading) return <div className="text-center py-20">Đang tải...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold mb-1">Cài đặt chung</h2>
        <p className="text-gray-500 text-sm">
          Thiết lập giá dịch vụ áp dụng cho toàn bộ phòng
        </p>
      </div>

      {/* ELECTRIC */}
      <div className="card space-y-4">
        <h3 className="font-semibold text-lg">⚡ Giá điện</h3>

        <div>
          <label className="block text-sm mb-1">Giá mỗi kWh (đ)</label>
          <input
            type="number"
            className="input max-w-xs"
            value={form.electric_price}
            onChange={(e) =>
              setForm({ ...form, electric_price: Number(e.target.value) })
            }
          />
        </div>
      </div>

      {/* WATER */}
      <div className="card space-y-4">
        <h3 className="font-semibold text-lg">💧 Giá nước</h3>

        <div className="flex gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={form.water_type === "METER"}
              onChange={() => setForm({ ...form, water_type: "METER" })}
            />
            Theo đồng hồ
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={form.water_type === "PERSON"}
              onChange={() => setForm({ ...form, water_type: "PERSON" })}
            />
            Theo đầu người
          </label>
        </div>

        {form.water_type === "METER" && (
          <div>
            <label className="block text-sm mb-1">
              Giá mỗi m³ nước (đ)
            </label>
            <input
              type="number"
              className="input max-w-xs"
              value={form.water_price}
              onChange={(e) =>
                setForm({ ...form, water_price: Number(e.target.value) })
              }
            />
          </div>
        )}

        {form.water_type === "PERSON" && (
          <div>
            <label className="block text-sm mb-1">
              Giá mỗi người / tháng (đ)
            </label>
            <input
              type="number"
              className="input max-w-xs"
              value={form.water_price_per_person}
              onChange={(e) =>
                setForm({
                  ...form,
                  water_price_per_person: Number(e.target.value),
                })
              }
            />
          </div>
        )}
      </div>

      {/* OTHER FEES */}
      <div className="card space-y-4">
        <h3 className="font-semibold text-lg">🧾 Phí khác</h3>

        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm mb-1">Tiền rác (đ / tháng)</label>
            <input
              type="number"
              className="input"
              value={form.trash_fee}
              onChange={(e) =>
                setForm({ ...form, trash_fee: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Phí dịch vụ (đ / tháng)</label>
            <input
              type="number"
              className="input"
              value={form.service_fee}
              onChange={(e) =>
                setForm({ ...form, service_fee: Number(e.target.value) })
              }
            />
          </div>

        </div>
      </div>

      {/* SAVE */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          className="btn-primary px-8"
        >
          Lưu cài đặt
        </button>
      </div>
    </div>
  );
}
