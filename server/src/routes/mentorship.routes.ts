import { Router } from "express";
import mentorshipController from "@/controllers/mentorship.controller";
import authMiddleware from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { RoleType } from "@/generated/prisma/enums";
import { validateSchema } from "@/middlewares/validate-schema";
import { acceptMentorshipInviteSchema, declineMentorshipInviteSchema, sendMentorshipInviteSchema } from "@/schema/mentorship";

const router = Router();

router.get("/v1/view-my-mentorship-invites", authMiddleware.execute, permittedRole([RoleType.ALUMNI]), mentorshipController.viewAllMentorshipInvites);
router.post("/v1/accept-mentorship", authMiddleware.execute, permittedRole([RoleType.ALUMNI]), validateSchema(acceptMentorshipInviteSchema),mentorshipController.acceptMentorship);
router.delete("/v1/decline-mentorship", authMiddleware.execute, permittedRole([RoleType.ALUMNI]), validateSchema(declineMentorshipInviteSchema), mentorshipController.declineMentorship);
router.post("/v1/send-mentorship-invite", authMiddleware.execute, permittedRole([RoleType.STUDENT]), validateSchema(sendMentorshipInviteSchema), mentorshipController.sendMentorshipInvite);
router.delete("/v1/end-mentorship", authMiddleware.execute, permittedRole([RoleType.ALUMNI, RoleType.DEAN]), mentorshipController.endMentorship);

export default router;