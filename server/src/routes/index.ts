import { Router } from "express";
import authRoutes from "@/routes/auth.routes";
import adminRoutes from "@/routes/admin.routes";
import profileRoutes from "@/routes/profile.routes";
import skillRoutes from "@/routes/skill.routes";
import collaborationRoutes from "@/routes/collaboration.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/profile", profileRoutes);
router.use("/skill", skillRoutes);
router.use("/collaboration", collaborationRoutes);

export default router;
