import { MentorshipRepository } from "@/repositories/mentorship.repository";
import { AlumniRepository } from "@/repositories/alumni.repository";
import { StudentRepository } from "@/repositories/student.repository";
import { ProfileRepository } from "@/repositories/profile.repository";
import { ENV } from "@/config/env";
import { notifyPeer } from "@/services/mail/notify";
import { prisma } from "@/lib/prisma";

export const DeclineMentorshipService = async (mentorshipId: string, alumniId: string) => {
  const mentorshipRepository = new MentorshipRepository();
  const alumniRepository = new AlumniRepository();
  const studentRepository = new StudentRepository();
  const profileRepository = new ProfileRepository();

  try {
    const response = await mentorshipRepository.decline(mentorshipId, alumniId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to decline mentorship invite" };

    await Promise.all([
      alumniRepository.invalidateCache(alumniId),
      studentRepository.invalidateCache(response.fromStudentId),
      // View-profile relation sections ride the profile cache: clear it so
      // the declined request disappears without waiting out the TTL.
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
      service: "DeclineMentorshipService",
      userId: response.fromStudentId,
      to: emailOf(response.fromStudentId),
      event: "student:refresh",
      targets: ["my-mentors"],
      message: "An alumni has declined your mentorship request.",
      template: "request-update.html",
      emailData: {
        title: "Mentorship request declined",
        message: "An alumni has declined your mentorship request. Sign in to view it.",
        backToLoginURL: `${ENV.FRONTEND_URL}/login`,
      },
      subject: "Your mentorship request was declined",
    });

    // The original realtime payload carried no message, so an empty string keeps
    // the emitted shape's behaviour identical for client toast guards.
    await notifyPeer({
      service: "DeclineMentorshipService",
      userId: alumniId,
      to: emailOf(alumniId),
      event: "alumni:refresh",
      targets: ["stats", "manage-mentorships"],
      message: "",
      template: "request-update.html",
      emailData: {
        title: "Mentorship request declined",
        message: "You declined a mentorship request. Sign in to view it.",
        backToLoginURL: `${ENV.FRONTEND_URL}/login`,
      },
      subject: "Your mentorship request was declined",
    });

    return { status: "success", code: 200, message: "Successfully decline a mentorship invite" };
  } catch (error) {
    console.error("DeclineMentorshipService", error);
    return { status: "error", code: 500, message: "Unable to decline a mentorship" };
  }
};
