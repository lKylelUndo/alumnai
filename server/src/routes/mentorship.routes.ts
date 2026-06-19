import { Router } from "express";
import mentorshipController from "@/controllers/mentorship.controller";
import authMiddleware from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { RoleType } from "@/generated/prisma/enums";

const router = Router();

router.post("/v1/view-my-mentorship-invites", authMiddleware.execute, permittedRole([RoleType.ALUMNI]), mentorshipController.viewAllMentorshipInvites);
router.post("/v1/accept-mentorship", authMiddleware.execute, permittedRole([RoleType.ALUMNI]), mentorshipController.acceptMentorship);
router.delete("/v1/decline-mentorship", authMiddleware.execute, permittedRole([RoleType.ALUMNI]), mentorshipController.declineMentorship);
router.post("/v1/send-mentorship-invite", authMiddleware.execute, permittedRole([RoleType.STUDENT]), mentorshipController.sendMentorshipInvite);

export default router;