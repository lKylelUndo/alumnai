import { MentorshipRepository } from "@/repositories/mentorship.repository";
import { AlumniRepository } from "@/repositories/alumni.repository";
import { StudentRepository } from "@/repositories/student.repository";
import { AdminRepository } from "@/repositories/admin.repository";
import { ChatRepository } from "@/repositories/chat.repository";
import { ProfileRepository } from "@/repositories/profile.repository";
import { ENV } from "@/config/env";
import { notifyPeer } from "@/services/mail/notify";
import { prisma } from "@/lib/prisma";

export const EndMentorshipService = async (mentorshipId: string) => {
  const mentorshipRepository = new MentorshipRepository();
  const alumniRepository = new AlumniRepository();
  const studentRepository = new StudentRepository();
  const adminRepository = new AdminRepository();
  const chatRepository = new ChatRepository();
  const profileRepository = new ProfileRepository();

  try {
    const response = await mentorshipRepository.end(mentorshipId);

    if (!response)
      return { status: "error", code: 400, message: "Failed to end mentorship" };

    await Promise.all([
      alumniRepository.invalidateCache(response.toAlumniId),
      studentRepository.invalidateCache(response.fromStudentId),
      adminRepository.invalidateCache(["dashboard-stats", "top-mentors"]),
      chatRepository.invalidateCache([response.toAlumniId, response.fromStudentId]),
      // View-profile relation sections ride the profile cache: clear it so
      // the ended mentorship disappears without waiting out the TTL.
      profileRepository.invalidateCache(),
    ]);

    // One batched lookup covers both recipients; if it fails, notifyPeer
    // falls back to its own per-user lookup.
    const recipients = await prisma.user
      .findMany({
        where: { id: { in: [response.fromStudentId, response.toAlumniId] } },
        select: { id: true, email: true },
      })
      .catch(() => null);
    const emailOf = (id: string) =>
      recipients?.find((recipient) => recipient.id === id)?.email ?? null;

    await notifyPeer({
      service: "EndMentorshipService",
      userId: response.fromStudentId,
      to: emailOf(response.fromStudentId),
      event: "student:refresh",
      targets: ["my-mentors"],
      message: "One of your mentorships has ended.",
      template: "request-update.html",
      emailData: {
        title: "Mentorship ended",
        message: "One of your mentorships has ended. Sign in to view it.",
        backToLoginURL: `${ENV.FRONTEND_URL}/login`,
      },
      subject: "A mentorship has ended",
    });

    await notifyPeer({
      service: "EndMentorshipService",
      userId: response.toAlumniId,
      to: emailOf(response.toAlumniId),
      event: "alumni:refresh",
      targets: ["stats", "manage-mentorships", "your-mentees"],
      message: "One of your mentorships has ended.",
      template: "request-update.html",
      emailData: {
        title: "Mentorship ended",
        message: "One of your mentorships has ended. Sign in to view it.",
        backToLoginURL: `${ENV.FRONTEND_URL}/login`,
      },
      subject: "A mentorship has ended",
    });

    return { status: "success", code: 200, message: "Successfully ended mentorship" };
  } catch (error) {
    console.error("EndMentorshipService", error);
    return { status: "error", code: 500, message: "Unable to end mentorship" };
  }
};
