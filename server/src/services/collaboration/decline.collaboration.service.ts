import { CollaborationRepository } from "@/repositories/collaboration.repository";
import { invalidateAlumniDashboardCache } from "@/utils/invalidate-alumni-cache";
import { invalidateStudentDashboardCache } from "@/utils/invalidate-student-cache";
import { notifyUser } from "@/lib/socket";

export const DeclineCollaborationService = async (collaborationId: string) => {
  const collaborationRepository = new CollaborationRepository();

  try {
    const response = await collaborationRepository.decline(collaborationId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to decline a collaboration" };

    await Promise.all([
      invalidateAlumniDashboardCache(response.fromAlumniId),
      invalidateStudentDashboardCache(response.toStudentId),
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
