import { Router } from "express";
import authRoutes from "@/routes/auth.routes";
import adminRoutes from "@/routes/admin.routes";
import alumniRoutes from "@/routes/alumni.routes";
import studentRoutes from "@/routes/student.routes";
import profileRoutes from "@/routes/profile.routes";
import skillRoutes from "@/routes/skill.routes";
import collaborationRoutes from "@/routes/collaboration.routes";
import mentorshipRoutes from "@/routes/mentorship.routes";
import aiRoutes from "@/routes/ai.routes";
import chatRoutes from "@/routes/chat.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/alumni", alumniRoutes);
router.use("/student", studentRoutes);
router.use("/profile", profileRoutes);
router.use("/skill", skillRoutes);
router.use("/collaboration", collaborationRoutes);
router.use("/mentorship", mentorshipRoutes);
router.use("/ai", aiRoutes);
router.use("/chat", chatRoutes);

export default router;
