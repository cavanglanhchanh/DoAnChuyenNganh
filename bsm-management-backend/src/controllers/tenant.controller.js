import {
  assignTenantService,
  findTenantByEmailService,
  removeTenantFromRoomService
} from "../services/tenant.service.js";

/* =========================
   TÌM NGƯỜI THUÊ THEO EMAIL
========================= */
export async function findTenantByEmailController(req, res) {
  try {
    const { email } = req.query;
    const tenant = await findTenantByEmailService(email);
    res.json(tenant);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

/* =========================
   GÁN NGƯỜI THUÊ VÀO PHÒNG
========================= */
export async function assignTenantToRoomController(req, res) {
  try {
    const roomId = req.params.id;
    await assignTenantService(roomId, req.body);
    res.json({ message: "Gán người thuê thành công" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

/* =========================
   TRẢ PHÒNG
========================= */
export async function removeTenantFromRoomController(req, res) {
  try {
    const ownerId = req.user.id;
    const roomId = req.params.id;

    await removeTenantFromRoomService(ownerId, roomId);

    res.json({ message: "Trả phòng thành công" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
