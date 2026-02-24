import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInvoicesByMonth } from "../../api/invoice.api";
import { getHouses } from "../../api/house.api";

export default function Invoices() {
  const navigate = useNavigate();

  const [month, setMonth] = useState("");
  const [houseId, setHouseId] = useState("");
  const [houses, setHouses] = useState([]);

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getHouses().then(setHouses);
  }, []);

  async function handleFetch() {
    try {
      setLoading(true);
      setError("");
      const data = await getInvoicesByMonth(month, houseId);
      setInvoices(data);
    } catch (err) {
      setError(err.message || "Không tải được hóa đơn");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const now = new Date();
    const m = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
    setMonth(m);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

        {/* HEADER */}
        <h1 className="text-3xl font-extrabold text-slate-800">
          Danh sách hóa đơn
        </h1>

        {/* FILTER */}
        <div className="bg-white rounded-2xl p-6 shadow flex gap-4 flex-wrap">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border rounded-xl px-4 py-2"
          />

          <select
            value={houseId}
            onChange={(e) => setHouseId(e.target.value)}
            className="border rounded-xl px-4 py-2"
          >
            <option value="">Tất cả nhà</option>
            {houses.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleFetch}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold"
          >
            Lọc
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* TABLE */}
        {!loading && invoices.length > 0 && (
          <div className="bg-white rounded-3xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left">Phòng</th>
                  <th className="p-4 text-left">Người thuê</th>
                  <th className="p-4 text-right">Tổng tiền</th>
                  <th className="p-4 text-center">Trạng thái</th>
                  <th className="p-4 text-center">Ngày tạo</th>
                  <th className="p-4 text-center">Chi tiết</th>
                </tr>
              </thead>

              <tbody>
                {invoices.map((i) => (
                  <tr key={i.id} className="border-t hover:bg-slate-50">
                    <td className="p-4">{i.room_name}</td>
                    <td className="p-4">{i.tenant_name}</td>
                    <td className="p-4 text-right font-semibold">
                      {i.total_amount.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${i.status === "PAID"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"}`}>
                        {i.status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {new Date(i.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => navigate(`/invoices/${i.id}`)}
                        className="text-indigo-600 font-semibold"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && invoices.length === 0 && (
          <p className="text-slate-500 text-center">
            Không có hóa đơn
          </p>
        )}
      </div>
    </div>
  );
}
