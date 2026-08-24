import { MentorshipRepository } from "@/repositories/mentorship.repository";
import { invalidateAlumniDashboardCache } from "@/utils/invalidate-alumni-cache";
import { invalidateStudentDashboardCache } from "@/utils/invalidate-student-cache";
import { notifyUser } from "@/lib/socket";

export const AcceptMentorshipService = async (mentorshipId: string, alumniId: string) => {
  const mentorshipRepository = new MentorshipRepository();

  try {
    const response = await mentorshipRepository.accept(mentorshipId, alumniId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to accept mentorship invite" };

    await Promise.all([
      invalidateAlumniDashboardCache(alumniId),
      invalidateStudentDashboardCache(response.fromStudentId),
    ]);

    notifyUser(response.fromStudentId, "student:refresh", {
      targets: ["my-mentors"],
      message: "An alumni has accepted your mentorship request!",
    });

    notifyUser(alumniId, "alumni:refresh", {
      targets: ["your-mentees", "manage-mentorships"],
      message: "Mentorship request accepted!",
    });

    return { status: "success", code: 200, message: "Successfully accept a mentorship" };
  } catch (error) {
    console.error("AcceptMentorshipService", error);
    return { status: "error", code: 500, message: "Unable to accept a mentorship" };
  }
};
