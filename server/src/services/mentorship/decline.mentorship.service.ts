import { MentorshipRepository } from "@/repositories/mentorship.repository";

export const DeclineMentorshipService = async (mentorshipId: string) => {
  const mentorshipRepository = new MentorshipRepository();

  try {
    const response = await mentorshipRepository.decline(mentorshipId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to decline mentorship invite" };

    return { status: "success", code: 200, message: "Successfully decline a mentorship invite" };
  } catch (error) {
    console.error("DeclineMentorshipService", error);
    return { status: "error", code: 500, message: "Unable to decline a mentorship" };
  }
};
