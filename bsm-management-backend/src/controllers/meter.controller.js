import { inputMeterAndCreateInvoice } from "../services/meter.service.js";
import { getMeterHistoryService } from "../services/meter.service.js";

export async function getMeterHistory(req, res) {
  try {
    const ownerId = req.user.id;
    const { year, month, roomId } = req.query;

    if (!year || !month) {
      return res.status(400).json({ message: "Thiếu year hoặc month" });
    }

    const data = await getMeterHistoryService(
      ownerId,
      Number(year),
      Number(month),
      roomId ? Number(roomId) : null   // 👈 KEY FIX
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
export async function inputMeter(req, res) {
  try {
    const roomId = req.params.id;
    await inputMeterAndCreateInvoice(roomId, req.body);
    res.json({ message: "Đã nhập điện nước & tạo hóa đơn" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
