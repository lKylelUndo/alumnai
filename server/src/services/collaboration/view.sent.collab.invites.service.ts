import { CollaborationRepository } from "@/repositories/collaboration.repository";

export const ViewSentCollabInvitesService = async (userId: string) => {
  const collaborationRepository = new CollaborationRepository();

  try {
    if (!userId)
      return { status: "error", message: "User ID is required", code: 400, data: [] };

    const invites = await collaborationRepository.getPendingInvitesSentByAlumni(userId);

    const data = invites.map((invite) => ({
      collaborationId: invite.id,
      toStudentId: invite.toStudent.id,
      studentName: invite.toStudent.profile?.fullName || "Unknown student",
      profilePicture: invite.toStudent.profile?.profilePicture ?? null,
      track: invite.toStudent.profile?.work_field ?? null,
      yearLevel: invite.toStudent.profile?.yearLevel ?? null,
      message: invite.message_details,
      status: "PENDING" as const,
      createdAt: invite.createdAt.toISOString(),
    }));

    return {
      status: "success",
      message: "Sent collaboration invites fetched successfully",
      code: 200,
      data,
    };
  } catch (error) {
    console.error("ViewSentCollabInvitesService", error);
    return {
      status: "error",
      message: "Failed to fetch sent collaboration invites",
      code: 500,
      data: [],
    };
  }
};
