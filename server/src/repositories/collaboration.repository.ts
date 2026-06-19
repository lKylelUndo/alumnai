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
    return await prisma.collaboration.create({
      data: {
        fromAlumniId: userId,
        toStudentId: data.toStudentId,
        message_details: data.message_details,
        status: "PENDING",
      },
    });
  }

  async findInviteIfExisted(fromAlumniId: string, toStudentId: string) {
    return await prisma.collaboration.findFirst({
      where: {
        fromAlumniId,
        toStudentId,
      },
    });
  }

  async accept(collaborationId: string) {
    return await prisma.collaboration.update({
      where: { id: collaborationId },
      data: { status: "ACTIVE" },
    });
  }

  async decline(collaborationId: string) {
    return await prisma.collaboration.delete({
      where: { id: collaborationId },
    });
  }

  async end(collaborationId: string) {
    return await prisma.collaboration.update({
      where: { id: collaborationId },
      data: { status: "INACTIVE" },
    });
  }
}
