import { MentorshipRepository } from "@/repositories/mentorship.repository";
import { AlumniRepository } from "@/repositories/alumni.repository";
import { StudentRepository } from "@/repositories/student.repository";
import { notifyUser } from "@/lib/socket";

export const DeclineMentorshipService = async (mentorshipId: string, alumniId: string) => {
  const mentorshipRepository = new MentorshipRepository();
  const alumniRepository = new AlumniRepository();
  const studentRepository = new StudentRepository();

  try {
    const response = await mentorshipRepository.decline(mentorshipId, alumniId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to decline mentorship invite" };

    await Promise.all([
      alumniRepository.invalidateCache(alumniId),
      studentRepository.invalidateCache(response.fromStudentId),
    ]);

    notifyUser(response.fromStudentId, "student:refresh", {
      targets: ["my-mentors"],
      message: "An alumni has declined your mentorship request.",
    });

    notifyUser(alumniId, "alumni:refresh", {
      targets: ["stats", "manage-mentorships"],
    });

    return { status: "success", code: 200, message: "Successfully decline a mentorship invite" };
  } catch (error) {
    console.error("DeclineMentorshipService", error);
    return { status: "error", code: 500, message: "Unable to decline a mentorship" };
  }
};
