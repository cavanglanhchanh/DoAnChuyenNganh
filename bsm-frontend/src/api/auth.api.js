const API_BASE_URL = "http://localhost:5000/api/auth";

export const login = async ({ phone, password }) => {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      identifier: phone,   // ✅ QUAN TRỌNG
      password
    })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Đăng nhập thất bại");
  }

  return res.json();
};
/**
 * REGISTER
 */
export async function registerApi(user) {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Đăng ký thất bại");
  }

  return data;
}