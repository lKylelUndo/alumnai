import { CollaborationRepository } from "@/repositories/collaboration.repository";
import { invalidateAlumniDashboardCache } from "@/utils/invalidate-alumni-cache";
import { invalidateStudentDashboardCache } from "@/utils/invalidate-student-cache";

export const AcceptCollaborationService = async (collaborationId: string) => {
  const collaborationRepository = new CollaborationRepository();

  try {
    const response = await collaborationRepository.accept(collaborationId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to accept a collaboration" };

    await Promise.all([
      invalidateAlumniDashboardCache(response.fromAlumniId),
      invalidateStudentDashboardCache(response.toStudentId),
    ]);

    return { status: "success", code: 200, message: "Successfully accept a collaboration" };
  } catch (error) {
    console.error("AcceptCollaborationService", error);
    return { status: "error", code: 500, message: "Unable to accept a collaboration" };
  }
};
