import { ENV } from "@/config/env";
import { redis } from "@/lib/redis";
import { MentorshipRepository } from "@/repositories/mentorship.repository";
import { SendMentorshipInviteTypes } from "@/schema/mentorship";
import { invalidateAlumniDashboardCache } from "@/utils/invalidate-alumni-cache";
import { invalidateStudentDashboardCache } from "@/utils/invalidate-student-cache";
import { notifyUser } from "@/lib/socket";

export const SendMentorshipInviteService = async (userId: string, data: SendMentorshipInviteTypes) => {
  const mentorshipRepository = new MentorshipRepository();

  try {
    const alreadyInvited = await mentorshipRepository.findIfInviteExisted(userId, data.toAlumniId);

    if (alreadyInvited)
      return { status: "error", code: 400, message: "Already sent a mentorship invite" };

    const response = await mentorshipRepository.send(userId, data);

    if (!response)
      return { status: "error", code: 400, message: "Failed to send mentorship invite" };

    await Promise.all([
      redis.del(`${ENV.STUDENT_REDIS_KEY}find-mentors-${userId}`),
      invalidateAlumniDashboardCache(data.toAlumniId),
      invalidateStudentDashboardCache(userId),
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

