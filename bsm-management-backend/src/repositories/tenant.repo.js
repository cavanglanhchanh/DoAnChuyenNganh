import sql from "mssql";
import { poolPromise } from "../config/db.js";

/**
 * tìm tenant theo email
 */

export async function findTenantByEmail(email) {
  const pool = await poolPromise;

  const result = await pool.request()
    .input("email", sql.NVarChar, email)
    .query(`
      SELECT id, name, email, phone
      FROM users
      WHERE email = @email
        AND role = 'TENANT'
    `);

  return result.recordset[0];
}

/**
 * tạo tenant mới
 */
export async function createTenant({ name, email, phone }) {
  const pool = await poolPromise;

  const result = await pool.request()
    .input("name", sql.NVarChar, name)
    .input("email", sql.NVarChar, email)
    .input("phone", sql.NVarChar, phone)
    .query(`
      INSERT INTO users (name, email, role, phone, password)
      OUTPUT INSERTED.id
      VALUES (@name, @email, 'TENANT', @phone, '123456')
    `);

  return result.recordset[0].id;
}

/**
 * gán tenant vào phòng
 */
export async function assignTenantToRoom(roomId, tenantId, startDate) {
  const pool = await poolPromise;

  await pool.request()
    .input("room_id", sql.Int, roomId)
    .input("tenant_id", sql.Int, tenantId)
    .input("start_date", sql.Date, startDate)
    .query(`
      INSERT INTO tenant_rooms (room_id, tenant_id, start_date)
      VALUES (@room_id, @tenant_id, @start_date)
    `);

  await pool.request()
    .input("room_id", sql.Int, roomId)
    .query(`
      UPDATE rooms
      SET status = 'OCCUPIED'
      WHERE id = @room_id
    `);
}
