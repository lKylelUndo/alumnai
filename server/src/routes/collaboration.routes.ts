import collaborationController from "@/controllers/collaboration.controller";
import { RoleType } from "@/generated/prisma/enums";
import authMiddleware from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { validateSchema } from "@/middlewares/validate-schema";
import { acceptCollaborationInviteSchema, declineCollaborationInviteSchema, sendCollaborationInviteSchema } from "@/schema/collaboration";
import { Router } from "express";

const router = Router();

router.post("/v1/view-my-collab-invites", authMiddleware.execute, permittedRole([RoleType.STUDENT]), collaborationController.viewAllCollaborationInvites);
router.post("/v1/accept-collab", authMiddleware.execute, permittedRole([RoleType.STUDENT]), validateSchema(acceptCollaborationInviteSchema), collaborationController.acceptCollaboration);
router.delete("/v1/decline-collab", authMiddleware.execute, permittedRole([RoleType.STUDENT]), validateSchema(declineCollaborationInviteSchema), collaborationController.declineCollaboration);
router.post("/v1/send-collab-invite", authMiddleware.execute, permittedRole([RoleType.ALUMNI]), validateSchema(sendCollaborationInviteSchema), collaborationController.sendCollaborationInvite);

export default router;