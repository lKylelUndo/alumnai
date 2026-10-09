import { Router } from "express";
import chatController from "@/controllers/chat.controller";
import authMiddleware from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { RoleType } from "@/generated/prisma/enums";
import { validateSchema } from "@/middlewares/validate-schema";
import { sendMessageSchema } from "@/schema/chat";

const router = Router();

router.get("/v1/conversations", authMiddleware.execute, permittedRole([RoleType.ALUMNI, RoleType.STUDENT]), chatController.getUserConversations);
router.get("/v1/messages/:conversationId", authMiddleware.execute, permittedRole([RoleType.ALUMNI, RoleType.STUDENT]), chatController.getConversationMessages);
router.post("/v1/send-message",authMiddleware.execute, permittedRole([RoleType.ALUMNI, RoleType.STUDENT]), validateSchema(sendMessageSchema), chatController.sendMessage);

export default router;
