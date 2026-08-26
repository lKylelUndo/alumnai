import { MentorshipRepository } from "@/repositories/mentorship.repository";
import { SendMentorshipInviteTypes } from "@/schema/mentorship";
import { AlumniRepository } from "@/repositories/alumni.repository";
import { StudentRepository } from "@/repositories/student.repository";
import { notifyUser } from "@/lib/socket";

export const SendMentorshipInviteService = async (userId: string, data: SendMentorshipInviteTypes) => {
  const mentorshipRepository = new MentorshipRepository();
  const alumniRepository = new AlumniRepository();
  const studentRepository = new StudentRepository();

  try {
    const alreadyInvited = await mentorshipRepository.findIfInviteExisted(userId, data.toAlumniId);

    if (alreadyInvited)
      return { status: "error", code: 400, message: "Already sent a mentorship invite" };

    const response = await mentorshipRepository.send(userId, data);

    if (!response)
      return { status: "error", code: 400, message: "Failed to send mentorship invite" };

    await Promise.all([
      studentRepository.invalidateCache(userId, ["find-mentors", "dashboard-stats"]),
      alumniRepository.invalidateCache(data.toAlumniId),
    ]);

    notifyUser(data.toAlumniId, "alumni:refresh", {
      targets: ["manage-mentorships"],
      message: "You have received a new mentorship request!",
    });

    return { status: "success", code: 200, message: "Successfully send mentorship invite" };
  } catch (error) {
    console.error("SendMentorshipInviteService", error);
    return { status: "error", code: 500, message: "Unable to send mentorship invite" };
  }
};
