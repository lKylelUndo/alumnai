import { Router } from "express";
import authRoutes from "@/routes/auth.routes";
import adminRoutes from "@/routes/admin.routes";
import profileRoutes from "@/routes/profile.routes";
import skillRoutes from "@/routes/skill.routes";
import collaborationRoutes from "@/routes/collaboration.routes";
import mentorshipRoutes from "@/routes/mentorship.routes";
import aiRoutes from "@/routes/ai.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/profile", profileRoutes);
router.use("/skill", skillRoutes);
router.use("/collaboration", collaborationRoutes);
router.use("/mentorship", mentorshipRoutes);
router.use("/ai", aiRoutes);

export default router;
