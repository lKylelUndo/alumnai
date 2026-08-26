import { CollaborationRepository } from "@/repositories/collaboration.repository";
import { AlumniRepository } from "@/repositories/alumni.repository";
import { StudentRepository } from "@/repositories/student.repository";
import { AdminRepository } from "@/repositories/admin.repository";
import { ChatRepository } from "@/repositories/chat.repository";
import { notifyUser } from "@/lib/socket";

export const AcceptCollaborationService = async (collaborationId: string) => {
  const collaborationRepository = new CollaborationRepository();
  const alumniRepository = new AlumniRepository();
  const studentRepository = new StudentRepository();
  const adminRepository = new AdminRepository();
  const chatRepository = new ChatRepository();

  try {
    const response = await collaborationRepository.accept(collaborationId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to accept a collaboration" };

    await Promise.all([
      alumniRepository.invalidateCache(response.fromAlumniId),
      studentRepository.invalidateCache(response.toStudentId),
      adminRepository.invalidateCache(["dashboard-stats"]),
      chatRepository.invalidateCache([response.fromAlumniId, response.toStudentId]),
    ]);

    notifyUser(response.fromAlumniId, "alumni:refresh", {
      targets: ["your-collaborations"],
      message: "A student has accepted your collaboration invite!"
    });

    return { status: "success", code: 200, message: "Successfully accept a collaboration" };
  } catch (error) {
    console.error("AcceptCollaborationService", error);
    return { status: "error", code: 500, message: "Unable to accept a collaboration" };
  }
};
