import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient
} from "../controllers/client.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getClients);
router.post("/", authMiddleware, createClient);
router.put("/:id", authMiddleware, updateClient);
router.delete("/:id", authMiddleware, deleteClient);

export default router;
