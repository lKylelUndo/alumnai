import { ENV } from "@/config/env";
import { redis } from "@/lib/redis";
import { CollaborationRepository } from "@/repositories/collaboration.repository";
import { SendCollaborationInviteInputTypes } from "@/schema/collaboration";
import { invalidateAlumniDashboardCache } from "@/utils/invalidate-alumni-cache";

export const SendCollaborationInviteService = async (userId: string, data: SendCollaborationInviteInputTypes) => {
  const collaborationRepository = new CollaborationRepository();

  try {
    const alreadyInvited = await collaborationRepository.findInviteIfExisted(userId, data.toStudentId);

    if (alreadyInvited)
      return { status: "error", code: 400, message: "You already sent an invitation" };

    const response = await collaborationRepository.send(userId, data);

    if (Object.keys(response).length === 0)
      return { status: "error", code: 400, message: "Failed to send an invitation" };

    await Promise.all([
      redis.del(`${ENV.ALUMNI_REDIS_KEY}find-collaborators-${userId}`),
      invalidateAlumniDashboardCache(userId),
    ]);

    return { status: "success", code: 200, message: "Successfully send an invitation" };
  } catch (error) {
    console.error("SendCollaborationInviteService", error);
    return { status: "error", code: 500, message: "Unable to send an invitation" };
  }
};
