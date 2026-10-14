import { Router } from "express";
import mentorshipController from "@/controllers/mentorship.controller";
import authMiddleware from "@/middlewares/auth-middleware";
import { permittedRole } from "@/middlewares/rbac-middleware";
import { RoleType } from "@/generated/prisma/enums";
import { validateSchema } from "@/middlewares/validate-schema";
import { acceptMentorshipInviteSchema, declineMentorshipInviteSchema, sendMentorshipInviteSchema, recognizeAlumniSchema, setRecognitionVisibilitySchema } from "@/schema/mentorship";

const router = Router();

router.get("/v1/view-my-mentorship-invites", authMiddleware.execute, permittedRole([RoleType.ALUMNI]), mentorshipController.viewAllMentorshipInvites);
router.get("/v1/get-my-mentees", authMiddleware.execute, permittedRole([RoleType.ALUMNI]), mentorshipController.getMyMentees);
router.get("/v1/get-mentorship-requests", authMiddleware.execute, permittedRole([RoleType.ALUMNI]), mentorshipController.getMentorshipRequests);
router.get("/v1/get-my-mentors", authMiddleware.execute, permittedRole([RoleType.STUDENT]), mentorshipController.getMyMentors);
router.get("/v1/student-mentors/:studentId", authMiddleware.execute, permittedRole([RoleType.ALUMNI, RoleType.STUDENT, RoleType.ADMIN]), mentorshipController.getStudentMentors);
router.get("/v1/get-recognition/:alumniId", authMiddleware.execute, permittedRole([RoleType.STUDENT]), mentorshipController.getMentorRecognition);
router.post("/v1/accept-mentorship", authMiddleware.execute, permittedRole([RoleType.ALUMNI]), validateSchema(acceptMentorshipInviteSchema),mentorshipController.acceptMentorship);
router.delete("/v1/decline-mentorship", authMiddleware.execute, permittedRole([RoleType.ALUMNI]), validateSchema(declineMentorshipInviteSchema), mentorshipController.declineMentorship);
router.post("/v1/send-mentorship-invite", authMiddleware.execute, permittedRole([RoleType.STUDENT]), validateSchema(sendMentorshipInviteSchema), mentorshipController.sendMentorshipInvite);
router.delete("/v1/end-mentorship", authMiddleware.execute, permittedRole([RoleType.ALUMNI, RoleType.STUDENT]), validateSchema(declineMentorshipInviteSchema), mentorshipController.endMentorship);
router.post("/v1/recognize-alumni", authMiddleware.execute, permittedRole([RoleType.STUDENT]), validateSchema(recognizeAlumniSchema), mentorshipController.recognizeAlumni);
router.patch("/v1/recognition/:recognitionId/visibility", authMiddleware.execute, permittedRole([RoleType.ALUMNI]), validateSchema(setRecognitionVisibilitySchema), mentorshipController.setRecognitionVisibility);

export default router;