import studentController from "@/controllers/student.controller"
import { RoleType } from "@/generated/prisma/enums"
import authMiddleware from "@/middlewares/auth-middleware"
import { permittedRole } from "@/middlewares/rbac-middleware"
import { Router } from "express"

const router = Router()

router.get("/v1/get-dashboard-stats", authMiddleware.execute, permittedRole([RoleType.STUDENT]), studentController.getDashboardStats)
router.get("/v1/find-mentors", authMiddleware.execute, permittedRole([RoleType.STUDENT]), studentController.findMentors)

export default router