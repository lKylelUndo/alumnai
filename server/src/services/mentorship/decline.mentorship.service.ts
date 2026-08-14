import { MentorshipRepository } from "@/repositories/mentorship.repository";
import { invalidateAlumniDashboardCache } from "@/utils/invalidate-alumni-cache";

export const DeclineMentorshipService = async (mentorshipId: string, alumniId: string) => {
  const mentorshipRepository = new MentorshipRepository();

  try {
    const response = await mentorshipRepository.decline(mentorshipId, alumniId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to decline mentorship invite" };

    await invalidateAlumniDashboardCache(alumniId);

    return { status: "success", code: 200, message: "Successfully decline a mentorship invite" };
  } catch (error) {
    console.error("DeclineMentorshipService", error);
    return { status: "error", code: 500, message: "Unable to decline a mentorship" };
  }
};
