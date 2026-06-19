import authMiddleware from "@/middlewares/auth-middleware";
import { Router } from "express";

const router = Router();

router.post("/v1/view-my-mentorship-invites", authMiddleware.execute);
router.post("/v1/accept-mentorship", authMiddleware.execute);
router.delete("/v1/decline-mentorship", authMiddleware.execute);
router.post("/v1/send-mentorship-invite", authMiddleware.execute);

export default router;