import { prisma } from "@/lib/prisma";

export class CollaborationRepository {
  async getAllInvites(id: string) {
    return await prisma.collaboration.findMany({
      where: { toStudentId: id },
      include: {
        fromAlumni: {
          select: { id: true, email: true, profile: true },
        },
      },
    });
  }
}
