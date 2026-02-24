import {
  findTenantByEmail,
  createTenant,
  assignTenantToRoom
} from "../repositories/tenant.repo.js";

import sql, { poolPromise } from "../config/db.js";

/* ===============================
   GÁN NGƯỜI THUÊ
================================ */
export async function assignTenantService(roomId, payload) {
  let tenantId;

  // ===== ĐÃ CÓ TÀI KHOẢN =====
  if (payload.tenantType === "EXISTING") {
    const tenant = await findTenantByEmail(payload.email);
    if (!tenant) {
      throw new Error("Không tìm thấy người thuê");
    }
    tenantId = tenant.id;
  }

  // ===== CHƯA CÓ TÀI KHOẢN =====
  if (payload.tenantType === "NEW") {
    if (!payload.name || !payload.email) {
      throw new Error("Thiếu thông tin người thuê");
    }

    // Kiểm tra email đã tồn tại - nếu có thì dùng người đó
    const existingTenant = await findTenantByEmail(payload.email);
    if (existingTenant) {
      tenantId = existingTenant.id;
    } else {
      // Email chưa tồn tại - tạo mới
      tenantId = await createTenant({
        name: payload.name,
        email: payload.email,
        phone: payload.phone
      });
    }
  }

  await assignTenantToRoom(roomId, tenantId, payload.start_date);
}

/* ===============================
   TÌM NGƯỜI THUÊ THEO EMAIL
================================ */
export async function findTenantByEmailService(email) {
  const tenant = await findTenantByEmail(email);
  if (!tenant) {
    throw new Error("Không tìm thấy người thuê");
  }
  return tenant;
}

/* ===============================
   TRẢ PHÒNG
================================ */
export async function removeTenantFromRoomService(ownerId, roomId) {
  const pool = await poolPromise;

  const currentTenant = await pool.request()
    .input("room_id", sql.Int, roomId)
    .query(`
      SELECT TOP 1 *
      FROM tenant_rooms
      WHERE room_id = @room_id
        AND end_date IS NULL
    `);

  if (currentTenant.recordset.length === 0) {
    throw new Error("Phòng này không có người thuê");
  }

  await pool.request()
    .input("room_id", sql.Int, roomId)
    .query(`
      UPDATE tenant_rooms
      SET end_date = GETDATE()
      WHERE room_id = @room_id
        AND end_date IS NULL
    `);

  await pool.request()
    .input("room_id", sql.Int, roomId)
    .input("owner_id", sql.Int, ownerId)
    .query(`
      UPDATE rooms
      SET status = 'EMPTY'
      WHERE id = @room_id
        AND owner_id = @owner_id
    `);
}
