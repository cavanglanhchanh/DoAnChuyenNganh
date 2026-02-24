import {
  getAllClients,
  createClient,
  updateClient,
  deleteClient
} from "../repositories/client.repo.js";

export async function getAllClientsService() {
  return await getAllClients();
}

export async function createClientService(data) {
  await createClient(data);
}

export async function updateClientService(id, data) {
  await updateClient(id, data);
}
export async function deleteClientService(id) {
  // 👈 GỌI ĐÚNG HÀM REPO
  await deleteClient(id);
}