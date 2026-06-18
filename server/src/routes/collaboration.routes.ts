import collaborationController from "@/controllers/collaboration.controller";
import { validateSchema } from "@/middlewares/validate-schema";
import { sendCollaborationInviteSchema, viewAllCollabInviteSchema } from "@/schema/collaboration";
import { Router } from "express";

const router = Router();

router.post("/v1/view-my-collab-invites", validateSchema(viewAllCollabInviteSchema), collaborationController.viewAllCollaborationInvites);
router.post("/v1/accept-collaboration", collaborationController.acceptCollaboration);
router.delete("/v1/decline-collaboration", collaborationController.declineCollaboration);
router.post("/v1/send-collaboration-invite", validateSchema(sendCollaborationInviteSchema), collaborationController.sendCollaborationInvite);

export default router;