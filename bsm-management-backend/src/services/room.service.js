import {
  getRoomsByHouse,
  getRoomById,
  updateRoom,
  createRoom,
  getCurrentTenantByRoom,
  deleteRoom
} from "../repositories/room.repo.js";

export async function deleteRoomService(ownerId, roomId) {
  const success = await deleteRoom(ownerId, roomId);
  if (!success) {
    throw new Error("Không thể xóa phòng (có thể đang có người thuê)");
  }
}
export async function createRoomService(ownerId, data) {
  if (!data.room_name) {
    throw new Error("Thiếu tên phòng");
  }
  return createRoom(ownerId, data);
}
/* =========================
   DANH SÁCH PHÒNG
========================= */
export async function getRoomsByHouseService(ownerId, houseId) {
  return getRoomsByHouse(ownerId, houseId);
}

/* =========================
   CHI TIẾT PHÒNG + NGƯỜI THUÊ
========================= */
export async function getRoomDetailService(ownerId, roomId) {
  const room = await getRoomById(ownerId, roomId);
  if (!room) {
    throw new Error("Không tìm thấy phòng");
  }

  const tenant = await getCurrentTenantByRoom(roomId);

  return {
    ...room,
    tenant
  };
}

/* =========================
   UPDATE PHÒNG
========================= */
export async function updateRoomService(ownerId, roomId, data) {
  return updateRoom(ownerId, roomId, data);
}

import { assignTenantToRoomRepo } from "../repositories/room.repo.js";

export async function assignTenantService(ownerId, roomId, tenantId) {
  await assignTenantToRoomRepo(ownerId, roomId, tenantId);
}