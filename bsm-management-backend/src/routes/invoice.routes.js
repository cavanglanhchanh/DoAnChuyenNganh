import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createInvoice,
  getInvoicesByMonth,
  getInvoiceDetail,
  markInvoicePaid,
} from "../controllers/invoice.controller.js";


const router = express.Router();

/* =========================
   CREATE INVOICE
========================= */
router.post("/invoices", authMiddleware, createInvoice);
router.get("/invoices", authMiddleware, getInvoicesByMonth);
router.get("/invoices/:id", authMiddleware, getInvoiceDetail);
router.put("/invoices/:id/pay", authMiddleware, markInvoicePaid);

export default router;
