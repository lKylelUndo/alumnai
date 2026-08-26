import { CollaborationRepository } from "@/repositories/collaboration.repository";
import { AlumniRepository } from "@/repositories/alumni.repository";
import { StudentRepository } from "@/repositories/student.repository";
import { notifyUser } from "@/lib/socket";

export const DeclineCollaborationService = async (collaborationId: string) => {
  const collaborationRepository = new CollaborationRepository();
  const alumniRepository = new AlumniRepository();
  const studentRepository = new StudentRepository();

  try {
    const response = await collaborationRepository.decline(collaborationId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to decline a collaboration" };

    await Promise.all([
      alumniRepository.invalidateCache(response.fromAlumniId),
      studentRepository.invalidateCache(response.toStudentId),
    ]);

    notifyUser(response.fromAlumniId, "alumni:refresh", {
      targets: ["your-collaborations"],
      message: "A student has declined your collaboration invite."
    });

    return { status: "success", code: 200, message: "Successfully decline a collaboration" };
  } catch (error) {
    console.error("DeclineCollaborationService", error);
    return { status: "error", code: 500, message: "Unable to decline a collaboration" };
  }
};
