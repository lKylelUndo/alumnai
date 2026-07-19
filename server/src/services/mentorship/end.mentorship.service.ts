import { MentorshipRepository } from "@/repositories/mentorship.repository";

export const EndMentorshipService = async (mentorshipId: string) => {
  const mentorshipRepository = new MentorshipRepository();

  try {
    const response = await mentorshipRepository.end(mentorshipId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to end mentorship" };

    return { status: "success", code: 200, message: "Successfully end mentorship" };
  } catch (error) {
    console.error("EndMentorshipService", error);
    return { status: "error", code: 500, message: "Unable to end mentorship" };
  }
};
