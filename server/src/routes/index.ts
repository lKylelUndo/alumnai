import { Router } from "express";
import authRoutes from "@/routes/auth.routes";
import adminRoutes from "@/routes/admin.routes";
import alumniRoutes from "@/routes/alumni.routes";
import mentorRoutes from "@/routes/mentor.routes";
import profileRoutes from "@/routes/profile.routes";
import skillRoutes from "@/routes/skill.routes";
import collaborationRoutes from "@/routes/collaboration.routes";
import mentorshipRoutes from "@/routes/mentorship.routes";
import aiRoutes from "@/routes/ai.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/admin", alumniRoutes);
router.use("/admin", mentorRoutes);
router.use("/profile", profileRoutes);
router.use("/skill", skillRoutes);
router.use("/collaboration", collaborationRoutes);
router.use("/mentorship", mentorshipRoutes);
router.use("/ai", aiRoutes);

export default router;

