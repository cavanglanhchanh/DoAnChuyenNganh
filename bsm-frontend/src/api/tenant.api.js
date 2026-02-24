const API_URL = "http://localhost:5000/api/clients";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getTenants() {
  const res = await fetch(API_URL, {
    headers: getAuthHeader(),
  });

  if (!res.ok) {
    throw new Error("Fetch tenants failed");
  }

  return res.json();
}

export async function getTenantById(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });

  if (!res.ok) throw new Error();
  return res.json();
}

export async function createTenant(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error();
  return res.json();
}

export async function updateTenant(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error();
  return res.json();
}

export async function deleteTenant(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  if (!res.ok) throw new Error();
}
