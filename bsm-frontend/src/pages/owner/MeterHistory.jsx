// src/pages/MeterHistory.jsx
import { useEffect, useState } from "react";
import { getMeterHistory } from "../../api/meter.api";
import { getHouses } from "../../api/house.api";

export default function MeterHistory() {
  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState("");
  const [houseId, setHouseId] = useState("");

  const [houses, setHouses] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    getHouses().then(setHouses);
  }, []);

  useEffect(() => {
    fetchData();
  }, [year, month, houseId]);

  async function fetchData() {
    const res = await getMeterHistory({
      year,
      month,
      houseId
    });
    setData(res);
  }

  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

        {/* ===== HEADER ===== */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            Lịch sử điện nước
          </h1>
          <p className="text-slate-500 text-sm">
            Theo dõi chỉ số điện, nước theo năm và tháng
          </p>
        </div>

        {/* ===== FILTER ===== */}
        <div
          className="bg-white/90 backdrop-blur rounded-3xl shadow-md
                     p-6 flex flex-wrap gap-4 items-end"
        >
          {/* YEAR */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-500">
              Năm
            </label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border border-slate-300 px-4 py-2 rounded-xl
                         focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              {Array.from({ length: 6 }, (_, i) => currentYear - 3 + i).map(
                (y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                )
              )}
            </select>
          </div>

          {/* MONTH – DROPDOWN */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-500">
              Tháng
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border border-slate-300 px-4 py-2 rounded-xl
                         focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              <option value="">Tất cả tháng</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  Tháng {m}
                </option>
              ))}
            </select>
          </div>

          {/* HOUSE */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-500">
              Nhà trọ
            </label>
            <select
              value={houseId}
              onChange={(e) => setHouseId(e.target.value)}
              className="border border-slate-300 px-4 py-2 rounded-xl
                         focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              <option value="">Tất cả nhà</option>
              {houses.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ===== TABLE ===== */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-4 text-left font-semibold">Nhà</th>
                <th className="p-4 text-left font-semibold">Phòng</th>
                <th className="p-4 text-center font-semibold">Tháng</th>
                <th className="p-4 text-right font-semibold">Điện cũ</th>
                <th className="p-4 text-right font-semibold">Điện mới</th>
                <th className="p-4 text-right font-semibold">Điện dùng</th>
                <th className="p-4 text-center font-semibold">Nước</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {data.map((i, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50 transition"
                >
                  <td className="p-4 font-medium text-slate-800">
                    {i.house_name}
                  </td>

                  <td className="p-4 text-slate-600">
                    {i.room_name}
                  </td>

                  <td className="p-4 text-center text-slate-500">
                    {i.month}
                  </td>

                  <td className="p-4 text-right">
                    {i.electric_old ?? "—"}
                  </td>

                  <td className="p-4 text-right">
                    {i.electric_new ?? "—"}
                  </td>

                  <td className="p-4 text-right font-semibold text-indigo-600">
                    {i.electric_used ?? "—"}
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold
                                 bg-indigo-50 text-indigo-600"
                    >
                      {i.water_type === "METER"
                        ? i.water_used != null
                          ? `${i.water_used} m³`
                          : "—"
                        : i.people_count
                        ? `${i.people_count} người`
                        : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.length === 0 && (
            <div className="p-10 text-center text-slate-500">
              Không có dữ liệu cho bộ lọc đã chọn
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
