import collaborationController from "@/controllers/collaboration.controller";
import authMiddleware from "@/middlewares/auth-middleware";
import { validateSchema } from "@/middlewares/validate-schema";
import { acceptCollaborationInviteSchema, sendCollaborationInviteSchema } from "@/schema/collaboration";
import { Router } from "express";

const router = Router();

router.post("/v1/view-my-collab-invites", authMiddleware.execute, collaborationController.viewAllCollaborationInvites);
router.post("/v1/accept-collab", authMiddleware.execute, validateSchema(acceptCollaborationInviteSchema), collaborationController.acceptCollaboration);
router.delete("/v1/decline-collab", authMiddleware.execute, collaborationController.declineCollaboration);
router.post("/v1/send-collab-invite", authMiddleware.execute, validateSchema(sendCollaborationInviteSchema), collaborationController.sendCollaborationInvite);

export default router;