import { MentorshipRepository } from "@/repositories/mentorship.repository";
import { AlumniRepository } from "@/repositories/alumni.repository";
import { StudentRepository } from "@/repositories/student.repository";
import { AdminRepository } from "@/repositories/admin.repository";
import { notifyUser } from "@/lib/socket";

export const AcceptMentorshipService = async (mentorshipId: string, alumniId: string) => {
  const mentorshipRepository = new MentorshipRepository();
  const alumniRepository = new AlumniRepository();
  const studentRepository = new StudentRepository();
  const adminRepository = new AdminRepository();

  try {
    const response = await mentorshipRepository.accept(mentorshipId, alumniId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to accept mentorship invite" };

    await Promise.all([
      alumniRepository.invalidateCache(alumniId),
      studentRepository.invalidateCache(response.fromStudentId),
      adminRepository.invalidateCache(["dashboard-stats", "top-mentors"]),
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
