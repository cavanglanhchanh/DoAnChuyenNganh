const API_URL = "http://localhost:5000/api/houses";

export async function createHouseApi(data) {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
}

function getAuthHeader() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Chưa đăng nhập");
  return { Authorization: `Bearer ${token}` };
}

export async function getHouses() {
  const res = await fetch(API_URL, {
    headers: getAuthHeader()
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Lỗi lấy nhà trọ");
  return data;
}
