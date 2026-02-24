import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import houseRoutes from "./routes/house.route.js";
import tenantRoutes from "./routes/tenant.routes.js";
import meterRoutes from "./routes/meter.routes.js";
import clientRoutes from "./routes/client.routes.js";
import roomRoutes from "./routes/room.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import revenueRoutes from "./routes/revenue.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import userRoutes from "./routes/user.routes.js";



dotenv.config();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// ===== ROUTES =====
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/users", userRoutes);
app.use("/api/houses", houseRoutes);
app.use("/api/rooms", roomRoutes);   
app.use("/api/tenants", tenantRoutes);
app.use("/api", meterRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api", invoiceRoutes);
app.use("/api", revenueRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/houses", houseRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/meters", meterRoutes);

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
