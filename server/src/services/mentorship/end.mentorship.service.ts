import { MentorshipRepository } from "@/repositories/mentorship.repository";
import { invalidateAlumniDashboardCache } from "@/utils/invalidate-alumni-cache";
import { invalidateStudentDashboardCache } from "@/utils/invalidate-student-cache";
import { notifyUser } from "@/lib/socket";

export const EndMentorshipService = async (mentorshipId: string) => {
  const mentorshipRepository = new MentorshipRepository();

  try {
    const response = await mentorshipRepository.end(mentorshipId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to end mentorship" };

    await Promise.all([
      invalidateAlumniDashboardCache(response.toAlumniId),
      invalidateStudentDashboardCache(response.fromStudentId),
    ]);

    notifyUser(response.fromStudentId, "student:refresh", {
      targets: ["my-mentors"],
      message: "One of your mentorships has ended.",
    });

    notifyUser(response.toAlumniId, "alumni:refresh", {
      targets: ["your-mentees"],
      message: "One of your mentorships has ended.",
    });

    return { status: "success", code: 200, message: "Successfully end mentorship" };
  } catch (error) {
    console.error("EndMentorshipService", error);
    return { status: "error", code: 500, message: "Unable to end mentorship" };
  }
};
