import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getRoomsByHouse, createRoom, deleteRoom } from "../../api/room.api";

const API_HOUSES = "http://localhost:5000/api/houses";
const PAGE_SIZE = 8;

export default function Rooms() {
  const [houses, setHouses] = useState([]);
  const [selectedHouseId, setSelectedHouseId] = useState(null);

  const [allRooms, setAllRooms] = useState([]);
  const [visibleRooms, setVisibleRooms] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const loaderRef = useRef(null);

  /* ================= INIT HOUSE ================= */
  useEffect(() => {
    const urlHouseId = searchParams.get("houseId");
    const savedHouseId = localStorage.getItem("selectedHouseId");

    if (urlHouseId) {
      setSelectedHouseId(urlHouseId);
      localStorage.setItem("selectedHouseId", urlHouseId);
    } else if (savedHouseId) {
      setSelectedHouseId(savedHouseId);
      setSearchParams({ houseId: savedHouseId });
    }
  }, []);

  /* ================= FETCH HOUSES ================= */
  useEffect(() => {
    async function fetchHouses() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(API_HOUSES, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setHouses(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchHouses();
  }, []);

  /* ================= FETCH ROOMS ================= */
  useEffect(() => {
    if (!selectedHouseId) return;

    async function fetchRooms() {
      try {
        setLoading(true);
        const data = await getRoomsByHouse(selectedHouseId);

        setAllRooms(data);
        setVisibleRooms(data.slice(0, PAGE_SIZE));
        setPage(1);
      } catch (err) {
        setError("Không thể tải danh sách phòng");
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, [selectedHouseId]);

  /* ================= INFINITE SCROLL ================= */
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [visibleRooms, allRooms]);

  function loadMore() {
    const nextPage = page + 1;
    const nextRooms = allRooms.slice(0, nextPage * PAGE_SIZE);

    if (nextRooms.length !== visibleRooms.length) {
      setVisibleRooms(nextRooms);
      setPage(nextPage);
    }
  }

  /* ================= HANDLERS ================= */
  function handleChangeHouse(e) {
    const id = e.target.value;
    setSelectedHouseId(id);
    localStorage.setItem("selectedHouseId", id);
    setSearchParams({ houseId: id });
  }

  async function handleAddRoom() {
    if (!selectedHouseId) return alert("Vui lòng chọn nhà");

    const houseId = Number(selectedHouseId);
    const house = houses.find((h) => h.id === houseId);

    if (!house) return alert("Không tìm thấy nhà");
    if (allRooms.length >= house.total_rooms)
      return alert("Đã đạt giới hạn số phòng");

    try {
      await createRoom({
        house_id: houseId,
        room_name: `Phòng ${allRooms.length + 1}`,
        room_price: 0,
        electric_price: 0,
        water_price: 0
      });

      const data = await getRoomsByHouse(houseId);
      setAllRooms(data);
      setVisibleRooms(data.slice(0, page * PAGE_SIZE));
    } catch (err) {
      alert(err.message || "Không thể tạo phòng");
    }
  }

  async function handleDeleteRoom(id) {
    if (!window.confirm("Xóa phòng này?")) return;

    await deleteRoom(id);
    const data = await getRoomsByHouse(selectedHouseId);
    setAllRooms(data);
    setVisibleRooms(data.slice(0, page * PAGE_SIZE));
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold">Quản lý phòng</h1>
            <p className="text-slate-500 text-sm">
              Chọn nhà để xem danh sách phòng
            </p>
          </div>

          <div className="flex gap-3">
            <select
              value={selectedHouseId || ""}
              onChange={handleChangeHouse}
              className="px-4 py-2 rounded-full border"
            >
              <option value="" disabled>
                -- Chọn nhà --
              </option>
              {houses.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleAddRoom}
              disabled={!selectedHouseId}
              className="bg-indigo-500 text-white px-5 py-2 rounded-full font-semibold"
            >
              ➕ Thêm phòng
            </button>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        )}

        {/* ROOM LIST */}
        {!loading && visibleRooms.length > 0 && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-3xl shadow-md p-6"
                >
                  <div className="flex justify-between mb-3">
                    <h3 className="font-bold">🛏 {room.room_name}</h3>
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        room.status === "OCCUPIED"
                          ? "bg-rose-100 text-rose-600"
                          : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      {room.status === "OCCUPIED" ? "Đã thuê" : "Trống"}
                    </span>
                  </div>

                  <p className="text-sm mb-4">
                    Giá phòng: {room.room_price || 0} đ
                  </p>

                  {/* ACTIONS */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/rooms/${room.id}`)}
                      className="flex-1 bg-indigo-50 text-indigo-600 py-2 rounded-xl font-semibold"
                    >
                      Chi tiết
                    </button>

                    <button
                      onClick={() =>
                        navigate("/room-bill", { state: { room } })
                      }
                      className="flex-1 bg-emerald-50 text-emerald-600 py-2 rounded-xl font-semibold"
                    >
                      💰 Tính tiền
                    </button>

                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="flex-1 bg-rose-50 text-rose-600 py-2 rounded-xl font-semibold"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {visibleRooms.length < allRooms.length && (
              <div ref={loaderRef} className="h-16 flex justify-center items-center">
                <span className="text-slate-400 text-sm">Đang tải thêm...</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
