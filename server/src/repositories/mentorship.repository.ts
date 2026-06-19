import { prisma } from "@/lib/prisma";
import { SendMentorshipInviteTypes } from "@/schema/mentorship";

export class MentorshipRepository {
  async send(fromStudentId: string, data: SendMentorshipInviteTypes) {
    return await prisma.mentorship.create({
      data: {
        fromStudentId,
        message_details: data.message_details,
        toAlumniId: data.toAlumniId,
        status: "PENDING",
      },
    });
  }

  async accept(id: string) {
    return await prisma.mentorship.update({
      where: { id },
      data: { status: "ACTIVE" },
    });
  }

  async decline(id: string) {
    return await prisma.mentorship.delete({
      where: { id },
    });
  }

  async findIfInviteExisted(fromStudentId: string, toAlumniId: string) {
    return await prisma.mentorship.findFirst({
      where: { fromStudentId, toAlumniId, status: "PENDING" },
    });
  }

  async getAllInvites(id: string) {
    return await prisma.mentorship.findMany({
      where: { toAlumniId: id },
      include: {
        fromStudent: {
          select: { profile: true, id: true, email: true },
        },
      },
    });
  }
}
