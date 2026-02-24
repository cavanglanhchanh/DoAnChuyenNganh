// src/routes/profile.routes.js
import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  getProfile,
  updateProfile
} from "../controllers/profile.controller.js";

const router = express.Router();

/**
 * GET /api/profile
 */
router.get("/", verifyToken, getProfile);

/**
 * PUT /api/profile
 */
router.put("/", verifyToken, updateProfile);

export default router;
