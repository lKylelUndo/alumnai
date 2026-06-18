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

  async send(data: SendCollaborationInviteInputTypes) {
    
  }
}
