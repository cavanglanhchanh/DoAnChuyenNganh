const API_URL = "http://localhost:5000/api/revenue";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Chưa đăng nhập");
  return { Authorization: `Bearer ${token}` };
}



export async function getRevenue({ year, month, houseId }) {
  const params = new URLSearchParams({ year });
  if (month) params.append("month", month);
  if (houseId) params.append("houseId", houseId);

  const res = await fetch(`${API_URL}?${params}`, {
    headers: getAuthHeader()
  });

  return res.json();
}

export async function getRevenueSummary(year, houseId) {
  const params = new URLSearchParams({ year });
  if (houseId) params.append("houseId", houseId);

  const res = await fetch(`${API_URL}/summary?${params}`, {
    headers: getAuthHeader()
  });

  return res.json();
}

export async function getRevenueByRoom(year, month, houseId) {
  const params = new URLSearchParams({ year, month });
  if (houseId) params.append("houseId", houseId);

  const res = await fetch(`${API_URL}/by-room?${params}`, {
    headers: getAuthHeader()
  });

  return res.json();
}
