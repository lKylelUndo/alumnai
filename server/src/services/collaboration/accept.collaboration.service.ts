import { CollaborationRepository } from "@/repositories/collaboration.repository";
import { MentorshipRepository } from "@/repositories/mentorship.repository";
import { AlumniRepository } from "@/repositories/alumni.repository";
import { StudentRepository } from "@/repositories/student.repository";
import { AdminRepository } from "@/repositories/admin.repository";
import { ChatRepository } from "@/repositories/chat.repository";
import { ProfileRepository } from "@/repositories/profile.repository";
import { ENV } from "@/config/env";
import { notifyPeer } from "@/services/mail/notify";
import { DeclineMentorshipService } from "@/services/mentorship/decline.mentorship.service";
import { prisma } from "@/lib/prisma";

export const AcceptCollaborationService = async (collaborationId: string) => {
  const collaborationRepository = new CollaborationRepository();
  const mentorshipRepository = new MentorshipRepository();
  const alumniRepository = new AlumniRepository();
  const studentRepository = new StudentRepository();
  const adminRepository = new AdminRepository();
  const chatRepository = new ChatRepository();
  const profileRepository = new ProfileRepository();

  try {
    // Fetch the invite first so the pair guard runs before anything mutates.
    const collaboration = await prisma.collaboration.findUnique({ where: { id: collaborationId } });

    // One ACTIVE relationship per pair: this pending collaboration may only
    // turn ACTIVE while no ACTIVE mentorship exists between the same users.
    const activeMentorship = collaboration
      ? await mentorshipRepository.findActiveBetween(collaboration.toStudentId, collaboration.fromAlumniId)
      : null;

    if (activeMentorship)
      return {
        status: "error",
        code: 400,
        message: "An active mentorship already exists between you. End it before accepting this collaboration.",
      };

    const response = await collaborationRepository.accept(collaborationId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to accept a collaboration" };

    await Promise.all([
      alumniRepository.invalidateCache(response.fromAlumniId),
      studentRepository.invalidateCache(response.toStudentId),
      adminRepository.invalidateCache(["dashboard-stats"]),
      chatRepository.invalidateCache([response.fromAlumniId, response.toStudentId]),
      // View-profile relation sections ride the profile cache: clear it so
      // the new collaboration appears without waiting out the TTL.
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
      service: "AcceptCollaborationService",
      userId: response.fromAlumniId,
      to: emailOf(response.fromAlumniId),
      event: "alumni:refresh",
      targets: ["stats", "your-collaborations"],
      message: "A student has accepted your collaboration invite!",
      template: "request-update.html",
      emailData: {
        title: "Collaboration request accepted",
        message: "A student has accepted your collaboration request. Sign in to view it.",
        backToLoginURL: `${ENV.FRONTEND_URL}/login`,
      },
      subject: "Your collaboration request was accepted",
    });

    await notifyPeer({
      service: "AcceptCollaborationService",
      userId: response.toStudentId,
      to: emailOf(response.toStudentId),
      event: "student:refresh",
      targets: ["collaboration-invites", "your-collaborations"],
      message: "You accepted a collaboration invite.",
      template: "request-update.html",
      emailData: {
        title: "Collaboration request accepted",
        message: "Your collaboration request has been accepted. Sign in to view it.",
        backToLoginURL: `${ENV.FRONTEND_URL}/login`,
      },
      subject: "Collaboration request accepted",
    });

    // Rival auto-decline: this pair's PENDING mentorship request loses to the
    // collaboration just accepted. Reuses DeclineMentorshipService — the exact
    // path the decline endpoint calls — so cache invalidation and both
    // notifyPeer refreshes behave identically. Best-effort: a failed or absent
    // rival decline must never fail the already-completed accept.
    try {
      const rivalMentorship = await mentorshipRepository.findPendingBetween(
        response.toStudentId,
        response.fromAlumniId,
      );

      if (rivalMentorship) {
        const decline = await DeclineMentorshipService(rivalMentorship.id, response.fromAlumniId);

        if (decline.status === "error")
          console.warn("AcceptCollaborationService", "rival mentorship auto-decline failed:", decline.message);
      }
    } catch (error) {
      console.error("AcceptCollaborationService", "rival mentorship auto-decline errored:", error);
    }

    return { status: "success", code: 200, message: "Successfully accept a collaboration" };
  } catch (error) {
    console.error("AcceptCollaborationService", error);
    return { status: "error", code: 500, message: "Unable to accept a collaboration" };
  }
};
