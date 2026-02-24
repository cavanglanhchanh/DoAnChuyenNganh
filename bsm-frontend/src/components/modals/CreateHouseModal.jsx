import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/houses";

export default function CreateHouseModal({ house, onClose, onSuccess }) {
  const isEdit = Boolean(house);

  const createdRooms = house?.created_rooms || 0;

  const [form, setForm] = useState({
    name: "",
    address: "",
    totalRooms: 1,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (house) {
      setForm({
        name: house.name,
        address: house.address,
        totalRooms: house.total_rooms,
      });
    }
  }, [house]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: Number.isNaN(Number(value)) ? value : Number(value),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (isEdit && form.totalRooms < createdRooms) {
      setError(
        `Giới hạn phòng không được nhỏ hơn ${createdRooms} (đã tạo)`
      );
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        isEdit ? `${API_URL}/${house.id}` : API_URL,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isEdit ? "Chỉnh sửa nhà trọ" : "Tạo nhà trọ"}
        </h2>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 px-4 py-2 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium">Tên nhà</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full mt-1 rounded-xl border px-4 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Địa chỉ</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="w-full mt-1 rounded-xl border px-4 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Giới hạn số phòng
            </label>

            <input
              type="number"
              name="totalRooms"
              min={createdRooms}
              value={form.totalRooms}
              onChange={handleChange}
              className="w-full mt-1 rounded-xl border px-4 py-2"
            />

            {isEdit && (
              <p className="text-xs text-gray-500 mt-1">
                Đã tạo: <b>{createdRooms}</b> phòng
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border rounded-xl py-2"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white rounded-xl py-2
                         font-semibold hover:bg-indigo-700"
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
