import { ENV } from "@/config/env";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
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

  async getActiveCollaborations(studentUserId: string) {
    const cacheKey = `${ENV.STUDENT_REDIS_KEY}collaborations-${studentUserId}`;

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const collaborations = await prisma.collaboration.findMany({
      where: {
        toStudentId: studentUserId,
        status: "ACTIVE",
      },
      include: {
        fromAlumni: {
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
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const formatted = collaborations.map((collab) => ({
      fromAlumniId: collab.fromAlumni.id,
      collaborationId: collab.id,
      fullName: collab.fromAlumni.profile?.fullName || "Alumni Collaborator",
      workField: collab.fromAlumni.profile?.work_field || "General",
      companyName: collab.fromAlumni.profile?.companyName || null,
      currentPosition: collab.fromAlumni.profile?.current_position || null,
      status: collab.status,
      profilePicture: collab.fromAlumni.profile?.profilePicture ?? null,
      message: collab.message_details,
    }));

    await redis.set(cacheKey, JSON.stringify(formatted), "PX", 1000 * 60 * 5);

    return formatted;
  }

  async getPendingInvites(studentUserId: string) {
    const cacheKey = `${ENV.STUDENT_REDIS_KEY}collab-requests-${studentUserId}`;

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const invites = await prisma.collaboration.findMany({
      where: {
        toStudentId: studentUserId,
        status: "PENDING",
      },
      include: {
        fromAlumni: {
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
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = invites.map((invite) => ({
      fromAlumniId: invite.fromAlumni.id,
      collaborationId: invite.id,
      fullName: invite.fromAlumni.profile?.fullName || "Alumni Collaborator",
      workField: invite.fromAlumni.profile?.work_field || "General",
      companyName: invite.fromAlumni.profile?.companyName || null,
      currentPosition: invite.fromAlumni.profile?.current_position || null,
      status: invite.status,
      profilePicture: invite.fromAlumni.profile?.profilePicture ?? null,
      message: invite.message_details,
    }));

    await redis.set(cacheKey, JSON.stringify(formatted), "PX", 1000 * 60 * 5);

    return formatted;
  }
}
