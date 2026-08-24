import { MentorshipRepository } from "@/repositories/mentorship.repository";
import { invalidateAlumniDashboardCache } from "@/utils/invalidate-alumni-cache";
import { invalidateStudentDashboardCache } from "@/utils/invalidate-student-cache";
import { notifyUser } from "@/lib/socket";

export const DeclineMentorshipService = async (mentorshipId: string, alumniId: string) => {
  const mentorshipRepository = new MentorshipRepository();

  try {
    const response = await mentorshipRepository.decline(mentorshipId, alumniId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to decline mentorship invite" };

    await Promise.all([
      invalidateAlumniDashboardCache(alumniId),
      invalidateStudentDashboardCache(response.fromStudentId),
    ]);

    notifyUser(response.fromStudentId, "student:refresh", {
      targets: ["my-mentors"],
      message: "An alumni has declined your mentorship request.",
    });

    notifyUser(alumniId, "alumni:refresh", {
      targets: ["manage-mentorships"],
    });

    return { status: "success", code: 200, message: "Successfully decline a mentorship invite" };
  } catch (error) {
    console.error("DeclineMentorshipService", error);
    return { status: "error", code: 500, message: "Unable to decline a mentorship" };
  }
};
