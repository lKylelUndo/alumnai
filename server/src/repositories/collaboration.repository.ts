import { prisma } from "@/lib/prisma";
import { SendCollaborationInviteInputTypes } from "@/schema/collaboration";

export class CollaborationRepository {
  async getAllInvites(id: string) {
    return await prisma.collaboration.findMany({
      where: { toStudentId: id, status: "PENDING" },
      include: {
        fromAlumni: {
          select: { id: true, email: true, profile: true },
        },
      },
    });
  }

  async send(userId: string, data: SendCollaborationInviteInputTypes) {
    console.log("data", data);
    return await prisma.collaboration.create({
      data: {
        fromAlumniId: userId,
        toStudentId: data.toStudentId,
        message_details: data.message_details,
        status: "PENDING"
      },
    });
  }
}
