import { MentorshipRepository } from "@/repositories/mentorship.repository";
import { AlumniRepository } from "@/repositories/alumni.repository";
import { StudentRepository } from "@/repositories/student.repository";
import { AdminRepository } from "@/repositories/admin.repository";
import { ChatRepository } from "@/repositories/chat.repository";
import { notifyUser } from "@/lib/socket";

export const EndMentorshipService = async (mentorshipId: string) => {
  const mentorshipRepository = new MentorshipRepository();
  const alumniRepository = new AlumniRepository();
  const studentRepository = new StudentRepository();
  const adminRepository = new AdminRepository();
  const chatRepository = new ChatRepository();

  try {
    const response = await mentorshipRepository.end(mentorshipId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to end mentorship" };

    await Promise.all([
      alumniRepository.invalidateCache(response.toAlumniId),
      studentRepository.invalidateCache(response.fromStudentId),
      adminRepository.invalidateCache(["dashboard-stats", "top-mentors"]),
      chatRepository.invalidateCache([response.toAlumniId, response.fromStudentId]),
    ]);

    notifyUser(response.fromStudentId, "student:refresh", {
      targets: ["my-mentors"],
      message: "One of your mentorships has ended.",
    });

    notifyUser(response.toAlumniId, "alumni:refresh", {
      targets: ["stats", "manage-mentorships", "your-mentees"],
      message: "One of your mentorships has ended.",
    });

    return { status: "success", code: 200, message: "Successfully ended mentorship" };
  } catch (error) {
    console.error("EndMentorshipService", error);
    return { status: "error", code: 500, message: "Unable to end mentorship" };
  }
};
