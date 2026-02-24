import {
  createInvoiceRepo,
  getInvoicesByMonth,
  getInvoiceById,
  markInvoicePaid
} from "../repositories/invoice.repo.js";

/* =========================
   CREATE
========================= */
export async function createInvoiceService(data) {
  if (!data.room_id || !data.month) {
    throw new Error("Thiếu dữ liệu hóa đơn");
  }

  await createInvoiceRepo(data);
}

/* =========================
   LIST BY MONTH + HOUSE
========================= */
export function getInvoicesByMonthService(ownerId, month, houseId) {
  return getInvoicesByMonth(ownerId, month, houseId);
}

/* =========================
   DETAIL
========================= */
export function getInvoiceDetailService(ownerId, invoiceId) {
  return getInvoiceById(ownerId, invoiceId);
}

/* =========================
   MARK PAID
========================= */
export async function markInvoicePaidService(ownerId, invoiceId) {
  const success = await markInvoicePaid(ownerId, invoiceId);
  if (!success) {
    throw new Error("Không thể cập nhật hóa đơn");
  }
}
