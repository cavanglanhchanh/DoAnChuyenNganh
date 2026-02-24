import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";

import {
  findTenantByEmailController,
  assignTenantToRoomController,
  removeTenantFromRoomController
} from "../controllers/tenant.controller.js";

const router = express.Router();

// 🔍 tìm người thuê theo email
router.get("/find-by-email", verifyToken, findTenantByEmailController);

// ➕ gán người thuê
router.post(
  "/rooms/:id/assign-tenant",
  verifyToken,
  assignTenantToRoomController
);

// 🚪 trả phòng
router.post(
  "/rooms/:id/remove-tenant",
  verifyToken,
  removeTenantFromRoomController
);

export default router;
