import { MentorshipRepository } from "@/repositories/mentorship.repository";
import { CollaborationRepository } from "@/repositories/collaboration.repository";
import { AlumniRepository } from "@/repositories/alumni.repository";
import { StudentRepository } from "@/repositories/student.repository";
import { AdminRepository } from "@/repositories/admin.repository";
import { ChatRepository } from "@/repositories/chat.repository";
import { ProfileRepository } from "@/repositories/profile.repository";
import { ENV } from "@/config/env";
import { notifyPeer } from "@/services/mail/notify";
import { DeclineCollaborationService } from "@/services/collaboration/decline.collaboration.service";
import { prisma } from "@/lib/prisma";

export const AcceptMentorshipService = async (mentorshipId: string, alumniId: string) => {
  const mentorshipRepository = new MentorshipRepository();
  const collaborationRepository = new CollaborationRepository();
  const alumniRepository = new AlumniRepository();
  const studentRepository = new StudentRepository();
  const adminRepository = new AdminRepository();
  const chatRepository = new ChatRepository();
  const profileRepository = new ProfileRepository();

  try {
    // Fetch the request first (scoped like the accept below) so the pair
    // guard runs before anything mutates.
    const mentorship = await prisma.mentorship.findFirst({
      where: { id: mentorshipId, toAlumniId: alumniId },
    });

    // One ACTIVE relationship per pair: this pending mentorship may only
    // turn ACTIVE while no ACTIVE collaboration exists between the same users.
    const activeCollaboration = mentorship
      ? await collaborationRepository.findActiveBetween(mentorship.toAlumniId, mentorship.fromStudentId)
      : null;

    if (activeCollaboration)
      return {
        status: "error",
        code: 400,
        message: "An active collaboration already exists between you. End it before accepting this mentorship.",
      };

    const response = await mentorshipRepository.accept(mentorshipId, alumniId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to accept mentorship invite" };

    await Promise.all([
      alumniRepository.invalidateCache(alumniId),
      studentRepository.invalidateCache(response.fromStudentId),
      adminRepository.invalidateCache(["dashboard-stats", "top-mentors"]),
      chatRepository.invalidateCache([alumniId, response.fromStudentId]),
      // View-profile relation sections ride the profile cache: clear it so
      // the new mentorship appears without waiting out the TTL.
      profileRepository.invalidateCache(),
    ]);

    // One batched lookup covers both recipients; if it fails, notifyPeer
    // falls back to its own per-user lookup.
    const recipients = await prisma.user
      .findMany({
        where: { id: { in: [response.fromStudentId, alumniId] } },
        select: { id: true, email: true },
      })
      .catch(() => null);
    const emailOf = (id: string) =>
      recipients?.find((recipient) => recipient.id === id)?.email ?? null;

    await notifyPeer({
      service: "AcceptMentorshipService",
      userId: response.fromStudentId,
      to: emailOf(response.fromStudentId),
      event: "student:refresh",
      targets: ["my-mentors"],
      message: "An alumni has accepted your mentorship request!",
      template: "request-update.html",
      emailData: {
        title: "Mentorship request accepted",
        message: "An alumni has accepted your mentorship request. Sign in to view it.",
        backToLoginURL: `${ENV.FRONTEND_URL}/login`,
      },
      subject: "Your mentorship request was accepted",
    });

    await notifyPeer({
      service: "AcceptMentorshipService",
      userId: alumniId,
      to: emailOf(alumniId),
      event: "alumni:refresh",
      targets: ["stats", "your-mentees", "manage-mentorships"],
      message: "Mentorship request accepted!",
      template: "request-update.html",
      emailData: {
        title: "Mentorship request accepted",
        message: "You accepted a mentorship request. Sign in to view it.",
        backToLoginURL: `${ENV.FRONTEND_URL}/login`,
      },
      subject: "Your mentorship request was accepted",
    });

    // Rival auto-decline: this pair's PENDING collaboration invite loses to
    // the mentorship just accepted. Reuses DeclineCollaborationService — the
    // exact path the decline endpoint calls — so cache invalidation and both
    // notifyPeer refreshes behave identically. Best-effort: a failed or absent
    // rival decline must never fail the already-completed accept.
    try {
      const rivalCollaboration = await collaborationRepository.findInviteIfExisted(
        alumniId,
        response.fromStudentId,
      );

      if (rivalCollaboration?.status === "PENDING") {
        const decline = await DeclineCollaborationService(rivalCollaboration.id);

        if (decline.status === "error")
          console.warn("AcceptMentorshipService", "rival collaboration auto-decline failed:", decline.message);
      }
    } catch (error) {
      console.error("AcceptMentorshipService", "rival collaboration auto-decline errored:", error);
    }

    return { status: "success", code: 200, message: "Successfully accept a mentorship" };
  } catch (error) {
    console.error("AcceptMentorshipService", error);
    return { status: "error", code: 500, message: "Unable to accept a mentorship" };
  }
};
