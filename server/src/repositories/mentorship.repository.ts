import { ENV } from "@/config/env";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
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
      where: {
        fromStudentId,
        toAlumniId,
        status: { in: ["PENDING", "ACTIVE"] },
      },
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

  async getActiveMentors(studentUserId: string) {
    const cacheKey = `${ENV.STUDENT_REDIS_KEY}mentors-${studentUserId}`;

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const mentorships = await prisma.mentorship.findMany({
      where: {
        fromStudentId: studentUserId,
        status: "ACTIVE",
      },
      include: {
        toAlumni: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                fullName: true,
                profilePicture: true,
                work_field: true,
                companyName: true,
                current_position: true,
                graduatedYear: true,
              },
            },
            receivedRecognitions: {
              where: {
                fromStudentId: studentUserId,
              },
              select: {
                id: true,
                message: true,
                createdAt: true,
                updatedAt: true,
              },
              take: 1,
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const formatted = mentorships.map((mentorship) => ({
      toAlumniId: mentorship.toAlumni.id,
      mentorshipRecordId: mentorship.id,
      fullName: mentorship.toAlumni.profile?.fullName || "Alumni Mentor",
      workField: mentorship.toAlumni.profile?.work_field || "General",
      companyName: mentorship.toAlumni.profile?.companyName || null,
      currentPosition: mentorship.toAlumni.profile?.current_position || null,
      status: mentorship.status,
      profilePicture: mentorship.toAlumni.profile?.profilePicture ?? null,
      message: mentorship.message_details,
      recognition: mentorship.toAlumni.receivedRecognitions?.[0] || null,
    }));

    await redis.set(cacheKey, JSON.stringify(formatted), "PX", 1000 * 60 * 5);

    return formatted;
  }
}
