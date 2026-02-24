// src/routes/user.routes.js
import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { changePassword } from "../controllers/user.controller.js";

const router = express.Router();

router.put("/change-password", verifyToken, changePassword);

export default router;
