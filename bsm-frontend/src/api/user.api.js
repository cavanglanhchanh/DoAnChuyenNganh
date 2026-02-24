// src/api/user.api.js
const API_URL = "http://localhost:5000/api/users"; // ✅ ĐỔI user -> users

function getAuthHeader() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Chưa đăng nhập");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

export async function changePassword({ oldPassword, newPassword }) {
  const res = await fetch(`${API_URL}/change-password`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify({ oldPassword, newPassword })
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Đổi mật khẩu thất bại");
  }

  return result;
}
