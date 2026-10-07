import { CollaborationRepository } from "@/repositories/collaboration.repository";
import { AlumniRepository } from "@/repositories/alumni.repository";
import { StudentRepository } from "@/repositories/student.repository";
import { AdminRepository } from "@/repositories/admin.repository";
import { ChatRepository } from "@/repositories/chat.repository";
import { notifyUser } from "@/lib/socket";

export const EndCollaborationService = async (collaborationId: string) => {
  const collaborationRepository = new CollaborationRepository();
  const alumniRepository = new AlumniRepository();
  const studentRepository = new StudentRepository();
  const adminRepository = new AdminRepository();
  const chatRepository = new ChatRepository();

  try {
    const response = await collaborationRepository.end(collaborationId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to end a collaboration" };

    await Promise.all([
      alumniRepository.invalidateCache(response.fromAlumniId),
      studentRepository.invalidateCache(response.toStudentId),
      adminRepository.invalidateCache(["dashboard-stats"]),
      chatRepository.invalidateCache([response.fromAlumniId, response.toStudentId]),
    ]);

    notifyUser(response.toStudentId, "student:refresh", {
      targets: ["your-collaborations"],
      message: `One of your collaboration has ended.`,
    });

    notifyUser(response.fromAlumniId, "alumni:refresh", {
      targets: ["stats", "your-collaborations"],
      message: `One of your collaboration has ended.`,
    });

    return { status: "success", code: 200, message: "Successfully end a collaboration" };
  } catch (error) {
    console.error("EndCollaborationService", error);
    return { status: "error", code: 500, message: "Unable to end a collaboration" };
  }
};
