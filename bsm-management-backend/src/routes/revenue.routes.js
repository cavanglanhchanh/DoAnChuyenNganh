import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getRevenue,
    getRevenueSummary,
    getRoomRevenue,
    getRevenueByRoom
 } from "../controllers/revenue.controller.js";

const router = express.Router();

/**
 * GET /api/revenue?year=2025&month=03
 */
router.get("/revenue", authMiddleware, getRevenue);
router.get("/revenue/rooms", authMiddleware, getRoomRevenue);
router.get("/revenue/summary", authMiddleware, getRevenueSummary);
router.get(
  "/revenue/by-room",
  authMiddleware,
  getRevenueByRoom
);

export default router;
