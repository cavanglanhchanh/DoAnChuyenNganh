// src/api/meter.api.js
const API_URL = "http://localhost:5000/api/meters";

function getAuthHeader() {
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  };
}

export async function getMeterHistory(params) {
  const query = new URLSearchParams(params).toString();

  const res = await fetch(`${API_URL}?${query}`, {
    headers: getAuthHeader()
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}
