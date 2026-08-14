import { ENV } from "@/config/env";
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

  async accept(id: string, alumniId: string) {
    return await prisma.mentorship.update({
      where: { id, toAlumniId: alumniId },
      data: { status: "ACTIVE" },
    });
  }

  async decline(id: string, alumniId: string) {
    return await prisma.mentorship.delete({
      where: { id, toAlumniId: alumniId },
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

  async end(id: string) {
    return await prisma.mentorship.update({
      where: { id },
      data: { status: "INACTIVE" },
    });
  }
}
