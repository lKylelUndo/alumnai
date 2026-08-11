import { MentorshipRepository } from "@/repositories/mentorship.repository";
import { invalidateAlumniDashboardCache } from "@/utils/invalidate-alumni-cache";

export const AcceptMentorshipService = async (mentorshipId: string) => {
  const mentorshipRepository = new MentorshipRepository();

  try {
    const response = await mentorshipRepository.accept(mentorshipId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to accept mentorship invite" };

    await invalidateAlumniDashboardCache(response.toAlumniId);

    return { status: "success", code: 200, message: "Successfully accept a mentorship" };
  } catch (error) {
    console.error("AcceptMentorshipService", error);
    return { status: "error", code: 500, message: "Unable to accept a mentorship" };
  }
};
