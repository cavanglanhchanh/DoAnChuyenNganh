// src/api/invoice.api.js
const API_URL = "http://localhost:5000/api/invoices";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Chưa đăng nhập");

  return {
    Authorization: `Bearer ${token}`
  };
}

export async function getInvoicesByMonth(month, houseId) {
  const params = new URLSearchParams({ month });
  if (houseId) params.append("houseId", houseId);

  const res = await fetch(
    `${API_URL}?${params.toString()}`,
    { headers: getAuthHeader() }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Lỗi lấy danh sách hóa đơn");
  }

  return data;
}

export async function getInvoiceById(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeader()
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Lỗi tải hóa đơn");
  return data;
}
export async function markInvoicePaid(id) {
  const res = await fetch(`${API_URL}/${id}/pay`, {
    method: "PUT",
    headers: getAuthHeader()
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Không thể cập nhật hóa đơn");
  }

  return data;
}
