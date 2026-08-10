import { ENV } from "@/config/env";
import { redis } from "@/lib/redis";
import { MentorshipRepository } from "@/repositories/mentorship.repository";
import { SendMentorshipInviteTypes } from "@/schema/mentorship";

export const SendMentorshipInviteService = async (userId: string, data: SendMentorshipInviteTypes) => {
  const mentorshipRepository = new MentorshipRepository();

  try {
    const alreadyInvited = await mentorshipRepository.findIfInviteExisted(userId, data.toAlumniId);

    if (alreadyInvited)
      return { status: "error", code: 400, message: "Already sent a mentorship invite" };

    const response = await mentorshipRepository.send(userId, data);

    if (!response)
      return { status: "error", code: 400, message: "Failed to send mentorship invite" };

    // Invalidate the find-mentors cache for this student
    await redis.del(`${ENV.STUDENT_REDIS_KEY}find-mentors-${userId}`);

    return { status: "success", code: 200, message: "Successfully send mentorship invite" };
  } catch (error) {
    console.error("SendMentorshipInviteService", error);
    return { status: "error", code: 500, message: "Unable to send mentorship invite" };
  }
};

