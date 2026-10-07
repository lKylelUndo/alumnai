import { ENV } from "@/config/env";
import { CollaborationRepository } from "@/repositories/collaboration.repository";
import { SendCollaborationInviteInputTypes } from "@/schema/collaboration";
import { AlumniRepository } from "@/repositories/alumni.repository";
import { StudentRepository } from "@/repositories/student.repository";
import { MentorshipRepository } from "@/repositories/mentorship.repository";
import { notifyUser } from "@/lib/socket";

export const SendCollaborationInviteService = async (userId: string, data: SendCollaborationInviteInputTypes) => {
  const collaborationRepository = new CollaborationRepository();
  const alumniRepository = new AlumniRepository();
  const studentRepository = new StudentRepository();
  const mentorshipRepository = new MentorshipRepository();

  try {
    const alreadyInvited = await collaborationRepository.findInviteIfExisted(userId, data.toStudentId);

    if (alreadyInvited)
      return { status: "error", code: 400, message: "You already sent an invitation" };

    const pendingMentorship = await mentorshipRepository.findPendingBetween(data.toStudentId, userId);

    if (pendingMentorship)
      return {
        status: "error",
        code: 400,
        message: "This student already has a pending mentorship request with you. Accept or decline it first.",
      };

    const response = await collaborationRepository.send(userId, data);

    if (Object.keys(response).length === 0)
      return { status: "error", code: 400, message: "Failed to send an invitation" };

    await Promise.all([
      alumniRepository.invalidateCache(userId, ["find-collaborators", "dashboard-stats"]),
      studentRepository.invalidateCache(data.toStudentId),
    ]);

    notifyUser(data.toStudentId, "student:refresh", {
      targets: ["collaboration-invites", "stats"],
      message: "You have received a new collaboration invite!"
    });

    return { status: "success", code: 200, message: "Successfully send an invitation" };
  } catch (error) {
    console.error("SendCollaborationInviteService", error);
    return { status: "error", code: 500, message: "Unable to send an invitation" };
  }
};
