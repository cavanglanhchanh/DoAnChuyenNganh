import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RoomBill() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const room = state?.room;

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center
                      bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="bg-white rounded-3xl shadow-md p-10 text-center">
          <p className="mb-6 text-slate-600">Không có dữ liệu phòng</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-indigo-500 text-white rounded-xl font-semibold"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  /* ===== TIME ===== */
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const monthStr = `${year}-${String(month).padStart(2, "0")}`;

  /* ===== STATE ===== */
  const [oldElectric, setOldElectric] = useState(0);
  const [newElectric, setNewElectric] = useState(0);

  const [oldWater, setOldWater] = useState(0);
  const [newWater, setNewWater] = useState(0);

  const [waterType, setWaterType] = useState(room.water_type || "METER");
  const [peopleCount, setPeopleCount] = useState(room.people_count || 1);
  const [serviceFee, setServiceFee] = useState(0);

  const [saving, setSaving] = useState(false);

  /* ===== CALC ===== */
  const electricUsed = Math.max(newElectric - oldElectric, 0);
  const electricCost = electricUsed * room.electric_price;

  const waterUsed =
    waterType === "METER"
      ? Math.max(newWater - oldWater, 0)
      : 0;

  const waterCost =
    waterType === "PERSON"
      ? peopleCount * (room.water_price_per_person || 0)
      : waterUsed * room.water_price;

  const total =
    room.room_price +
    electricCost +
    waterCost +
    Number(serviceFee);

  const money = (n) => n.toLocaleString("vi-VN") + " đ";

  /* ===== SAVE BILL ===== */
  async function handleSaveInvoice() {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          room_id: room.id,
          month: monthStr,

          electric_old: oldElectric,
          electric_new: newElectric,
          water_old: oldWater,
          water_new: newWater,

          room_price: room.room_price,
          electric_used: electricUsed,
          water_used: waterUsed,
          electric_cost: electricCost,
          water_cost: waterCost,
          total_amount: total,
        }),
      });

      if (!res.ok) throw new Error("Lưu hóa đơn thất bại");

      alert("✅ Đã lưu hóa đơn");
      navigate(-1);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  /* ===== UI ===== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            🧾 Hóa đơn phòng {room.room_name}
          </h1>
          <p className="text-slate-500 text-sm">
            Tháng {monthStr}
          </p>
        </div>

        {/* ROOM PRICE */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-md p-6">
          <p className="text-slate-600">
            🏠 Tiền phòng
          </p>
          <p className="text-2xl font-bold text-slate-800">
            {money(room.room_price)}
          </p>
        </div>

        {/* ELECTRIC */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-md p-6 space-y-3">
          <h2 className="font-semibold text-lg">⚡ Điện</h2>
          <input
            type="number"
            placeholder="Số cũ"
            onChange={(e) => setOldElectric(+e.target.value)}
            className="w-full px-4 py-2 border rounded-xl"
          />
          <input
            type="number"
            placeholder="Số mới"
            onChange={(e) => setNewElectric(+e.target.value)}
            className="w-full px-4 py-2 border rounded-xl"
          />
          <p className="text-right font-semibold">
            = {money(electricCost)}
          </p>
        </div>

        {/* WATER */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-md p-6 space-y-3">
          <h2 className="font-semibold text-lg">🚰 Nước</h2>

          <select
            value={waterType}
            onChange={(e) => setWaterType(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl"
          >
            <option value="METER">Theo đồng hồ</option>
            <option value="PERSON">Theo người</option>
          </select>

          {waterType === "METER" && (
            <>
              <input
                type="number"
                placeholder="Số cũ"
                onChange={(e) => setOldWater(+e.target.value)}
                className="w-full px-4 py-2 border rounded-xl"
              />
              <input
                type="number"
                placeholder="Số mới"
                onChange={(e) => setNewWater(+e.target.value)}
                className="w-full px-4 py-2 border rounded-xl"
              />
            </>
          )}

          {waterType === "PERSON" && (
            <input
              type="number"
              min={1}
              value={peopleCount}
              onChange={(e) => setPeopleCount(+e.target.value)}
              className="w-full px-4 py-2 border rounded-xl"
            />
          )}

          <p className="text-right font-semibold">
            = {money(waterCost)}
          </p>
        </div>

        {/* SERVICE */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-md p-6 space-y-3">
          <h2 className="font-semibold text-lg">🧹 Dịch vụ</h2>
          <input
            type="number"
            placeholder="Tiền dịch vụ"
            onChange={(e) => setServiceFee(+e.target.value)}
            className="w-full px-4 py-2 border rounded-xl"
          />
        </div>

        {/* TOTAL */}
        <div className="bg-indigo-600 text-white rounded-3xl p-8 shadow-lg">
          <p className="text-sm opacity-80">Tổng tiền cần thu</p>
          <p className="text-3xl font-extrabold mt-1">
            {money(total)}
          </p>
        </div>

        {/* SAVE */}
        <button
          onClick={handleSaveInvoice}
          disabled={saving}
          className="w-full bg-emerald-500 hover:bg-emerald-600
                     text-white py-3 rounded-xl font-bold transition"
        >
          💾 {saving ? "Đang lưu..." : "Lưu hóa đơn"}
        </button>
      </div>
    </div>
  );
}
