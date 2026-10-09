import { CollaborationRepository } from "@/repositories/collaboration.repository";
import { AlumniRepository } from "@/repositories/alumni.repository";
import { StudentRepository } from "@/repositories/student.repository";
import { AdminRepository } from "@/repositories/admin.repository";
import { ChatRepository } from "@/repositories/chat.repository";
import { ENV } from "@/config/env";
import { notifyPeer } from "@/services/mail/notify";
import { prisma } from "@/lib/prisma";

export const EndCollaborationService = async (collaborationId: string) => {
  const collaborationRepository = new CollaborationRepository();
  const alumniRepository = new AlumniRepository();
  const studentRepository = new StudentRepository();
  const adminRepository = new AdminRepository();
  const chatRepository = new ChatRepository();

  try {
    const response = await collaborationRepository.end(collaborationId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to end a collaboration" };

    await Promise.all([
      alumniRepository.invalidateCache(response.fromAlumniId),
      studentRepository.invalidateCache(response.toStudentId),
      adminRepository.invalidateCache(["dashboard-stats"]),
      chatRepository.invalidateCache([response.fromAlumniId, response.toStudentId]),
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
      service: "EndCollaborationService",
      userId: response.toStudentId,
      to: emailOf(response.toStudentId),
      event: "student:refresh",
      targets: ["your-collaborations"],
      message: `One of your collaboration has ended.`,
      template: "request-update.html",
      emailData: {
        title: "Collaboration ended",
        message: "One of your collaborations has ended. Sign in to view it.",
        backToLoginURL: `${ENV.FRONTEND_URL}/login`,
      },
      subject: "A collaboration has ended",
    });

    await notifyPeer({
      service: "EndCollaborationService",
      userId: response.fromAlumniId,
      to: emailOf(response.fromAlumniId),
      event: "alumni:refresh",
      targets: ["stats", "your-collaborations"],
      message: `One of your collaboration has ended.`,
      template: "request-update.html",
      emailData: {
        title: "Collaboration ended",
        message: "One of your collaborations has ended. Sign in to view it.",
        backToLoginURL: `${ENV.FRONTEND_URL}/login`,
      },
      subject: "A collaboration has ended",
    });

    return { status: "success", code: 200, message: "Successfully end a collaboration" };
  } catch (error) {
    console.error("EndCollaborationService", error);
    return { status: "error", code: 500, message: "Unable to end a collaboration" };
  }
};
