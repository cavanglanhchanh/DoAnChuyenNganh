import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateHouseModal from "../../components/modals/CreateHouseModal";

const API_URL = "http://localhost:5000/api/houses";

export default function Home() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingHouse, setEditingHouse] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMyHouses();
  }, []);

  async function fetchMyHouses() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHouses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /* ================= DELETE HOUSE ================= */
  async function handleDeleteHouse(houseId) {
    if (!window.confirm("Bạn có chắc muốn xóa nhà trọ này?")) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/${houseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMyHouses();
    } catch (err) {
      alert("Xóa nhà thất bại");
    }
  }

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] bg-gradient-to-br from-indigo-50 to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        {/* ===== HEADER ===== */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800">
              Nhà trọ của bạn
            </h1>
            <p className="text-slate-500 text-sm">
              Quản lý danh sách nhà trọ và các phòng bên trong
            </p>
          </div>

          <button
            onClick={() => {
              setEditingHouse(null);
              setShowModal(true);
            }}
            className="bg-indigo-500 hover:bg-indigo-600 text-white
                       px-6 py-3 rounded-full font-semibold shadow-md
                       transition active:scale-95"
          >
            + Thêm nhà trọ
          </button>
        </div>

        {/* ===== EMPTY STATE ===== */}
        {houses.length === 0 && (
          <div className="bg-white/80 backdrop-blur rounded-3xl shadow-md p-14 text-center max-w-xl mx-auto">
            <div className="text-6xl mb-4">🏡</div>
            <h2 className="text-2xl font-bold mb-2 text-slate-800">
              Chưa có nhà trọ nào
            </h2>
            <p className="text-slate-500 mb-8">
              Tạo nhà trọ đầu tiên để bắt đầu quản lý phòng và khách thuê.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-500 text-white px-8 py-3 rounded-full
                         font-semibold shadow hover:bg-indigo-600 transition"
            >
              + Tạo nhà trọ
            </button>
          </div>
        )}

        {/* ===== LIST ===== */}
        {houses.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {houses.map((house) => {
              const percent =
                house.total_rooms > 0
                  ? Math.round(
                      (house.created_rooms / house.total_rooms) * 100
                    )
                  : 0;

              return (
                <div
                  key={house.id}
                  className="group relative bg-white rounded-3xl shadow-md
                             border border-slate-100 p-6
                             hover:-translate-y-1 hover:shadow-xl transition"
                >
                  {/* ACTIONS */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => {
                        setEditingHouse(house);
                        setShowModal(true);
                      }}
                      className="px-3 py-1.5 rounded-full text-xs
                                 bg-indigo-50 text-indigo-600
                                 hover:bg-indigo-100"
                    >
                      ✏️ Sửa
                    </button>

                    <button
                      onClick={() => handleDeleteHouse(house.id)}
                      className="px-3 py-1.5 rounded-full text-xs
                                 bg-rose-50 text-rose-600
                                 hover:bg-rose-100"
                    >
                      🗑 Xóa
                    </button>
                  </div>

                  {/* TITLE */}
                  <h3 className="text-lg font-bold text-slate-800 mb-1">
                    🏘 {house.name}
                  </h3>

                  <p className="text-slate-500 text-sm mb-5 line-clamp-2">
                    📍 {house.address}
                  </p>

                  {/* PROGRESS */}
                  <div className="mb-5">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Phòng đã tạo</span>
                      <span>
                        {house.created_rooms}/{house.total_rooms}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold
                      ${
                        percent === 100
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-indigo-100 text-indigo-600"
                      }`}
                    >
                      {percent === 100 ? "Đủ phòng" : "Đang thêm"}
                    </span>

                    <button
                      onClick={() =>
                        navigate(`/rooms?houseId=${house.id}`)
                      }
                      className="text-indigo-600 font-semibold text-sm
                                 hover:underline"
                    >
                      Quản lý →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===== MODAL ===== */}
        {showModal && (
          <CreateHouseModal
            house={editingHouse}
            onClose={() => {
              setShowModal(false);
              setEditingHouse(null);
            }}
            onSuccess={() => {
              setShowModal(false);
              setEditingHouse(null);
              fetchMyHouses();
            }}
          />
        )}
      </div>
    </div>
  );
}
