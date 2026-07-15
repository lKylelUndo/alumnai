import { MentorshipRepository } from "@/repositories/mentorship.repository";

export const ViewAllMentorshipInvitesService = async (userId: string) => {
  const mentorshipRepository = new MentorshipRepository();

  try {
    const invites = await mentorshipRepository.getAllInvites(userId);

    if (Object.keys(invites).length === 0)
      return { status: "error", code: 400, message: "There are no mentorship invites at the moment" };

    return { status: "success", code: 200, invites };
  } catch (error) {
    console.error("ViewAllMentorshipInvitesService", error);
    return { status: "error", code: 500, message: "Unable to view all mentorship invites" };
  }
};
