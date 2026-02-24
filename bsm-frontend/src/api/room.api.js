const API_URL = "http://localhost:5000/api/rooms";

/* =========================
   HELPERS
========================= */
function getAuthHeader() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Chưa đăng nhập");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
}

/* =========================
   API FUNCTIONS
========================= */

/** ========================
 *  LẤY DANH SÁCH PHÒNG
 ======================== */
export async function getRoomsByHouse(houseId) {
  const res = await fetch(`${API_URL}?houseId=${houseId}`, {
    headers: getAuthHeader()
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Lỗi lấy danh sách phòng");
  return data;
}

/** ========================
 *  LẤY CHI TIẾT PHÒNG
 ======================== */
export async function getRoomById(roomId) {
  const res = await fetch(`${API_URL}/${roomId}`, {
    headers: getAuthHeader()
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Lỗi lấy chi tiết phòng");
  return data;
}

/** ========================
 *  CẬP NHẬT PHÒNG
 ======================== */
export async function updateRoom(roomId, payload) {
  const res = await fetch(`${API_URL}/${roomId}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Lỗi cập nhật phòng");
  return data;
}

/** ========================
 *  ✅ THÊM PHÒNG (FIX)
 ======================== */
export async function createRoom(payload) {
  /**
   * payload BẮT BUỘC:
   * {
   *   house_id,
   *   room_name,
   *   room_price,
   *   electric_price,
   *   water_price
   * }
   */

  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Lỗi thêm phòng");
  return data;
}

/** ========================
 *  ❌ XÓA PHÒNG (MỚI)
 ======================== */
export async function deleteRoom(roomId) {
  const res = await fetch(`${API_URL}/${roomId}`, {
    method: "DELETE",
    headers: getAuthHeader()
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Lỗi xóa phòng");
  return data;
}
