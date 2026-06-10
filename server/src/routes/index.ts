import { Router } from "express";
import authRoutes from "@/routes/auth.routes";
import adminRoutes from "@/routes/admin.routes";
import profileRoutes from "@/routes/profile.routes"

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/profile", profileRoutes);

export default router;
