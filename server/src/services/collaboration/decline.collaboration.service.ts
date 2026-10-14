import { CollaborationRepository } from "@/repositories/collaboration.repository";
import { AlumniRepository } from "@/repositories/alumni.repository";
import { StudentRepository } from "@/repositories/student.repository";
import { ProfileRepository } from "@/repositories/profile.repository";
import { ENV } from "@/config/env";
import { notifyPeer } from "@/services/mail/notify";
import { prisma } from "@/lib/prisma";

export const DeclineCollaborationService = async (collaborationId: string) => {
  const collaborationRepository = new CollaborationRepository();
  const alumniRepository = new AlumniRepository();
  const studentRepository = new StudentRepository();
  const profileRepository = new ProfileRepository();

  try {
    const response = await collaborationRepository.decline(collaborationId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to decline a collaboration" };

    await Promise.all([
      alumniRepository.invalidateCache(response.fromAlumniId),
      studentRepository.invalidateCache(response.toStudentId),
      // View-profile relation sections ride the profile cache: clear it so
      // the removed collaboration disappears without waiting out the TTL.
      profileRepository.invalidateCache(),
    ]);

    // One batched lookup covers both recipients; if it fails, notifyPeer
    // falls back to its own per-user lookup.
    const recipients = await prisma.user
      .findMany({
        where: { id: { in: [response.fromAlumniId, response.toStudentId] } },
        select: { id: true, email: true },
      })
      .catch(() => null);
    const emailOf = (id: string) =>
      recipients?.find((recipient) => recipient.id === id)?.email ?? null;

    await notifyPeer({
      service: "DeclineCollaborationService",
      userId: response.fromAlumniId,
      to: emailOf(response.fromAlumniId),
      event: "alumni:refresh",
      targets: ["stats", "your-collaborations"],
      message: "A student has declined your collaboration invite.",
      template: "request-update.html",
      emailData: {
        title: "Collaboration request declined",
        message: "A student has declined your collaboration request. Sign in to view it.",
        backToLoginURL: `${ENV.FRONTEND_URL}/login`,
      },
      subject: "Your collaboration request was declined",
    });

    await notifyPeer({
      service: "DeclineCollaborationService",
      userId: response.toStudentId,
      to: emailOf(response.toStudentId),
      event: "student:refresh",
      targets: ["collaboration-invites", "your-collaborations"],
      message: "You declined a collaboration invite.",
      template: "request-update.html",
      emailData: {
        title: "Collaboration request declined",
        message: "Your collaboration request has been declined. Sign in to view it.",
        backToLoginURL: `${ENV.FRONTEND_URL}/login`,
      },
      subject: "Collaboration request declined",
    });

    return { status: "success", code: 200, message: "Successfully decline a collaboration" };
  } catch (error) {
    console.error("DeclineCollaborationService", error);
    return { status: "error", code: 500, message: "Unable to decline a collaboration" };
  }
};
