import { Router } from "express";
import authRoutes from "@/routes/auth.routes";
import adminRoutes from "@/routes/admin.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);

export default router;
