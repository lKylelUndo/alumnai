import { AlumniRepository } from "@/repositories/alumni.repository";
import { deleteImage, getPublicIdFromUrl } from "@/lib/cloudinary";
import { sendNotificationEmail } from "@/services/mail/notify";

export const RejectAlumniRequestService = async (studentId: string) => {
  const alumniRepository = new AlumniRepository();
  try {
    const result = await alumniRepository.rejectAlumniRequest(studentId);

    if (!result) {
      return { status: "error", code: 404, message: "User or request not found" };
    }

    if (result.request?.documentUrl) {
      const publicId = getPublicIdFromUrl(result.request.documentUrl);
      if (publicId) {
        // Housekeeping: a failed cleanup must not fail a completed rejection.
        try {
          await deleteImage(publicId);
        } catch (error) {
          console.warn("[RejectAlumniRequestService] Document cleanup failed:", error);
        }
      }
    }

    await alumniRepository.invalidateCache(result.user.id, ["alumni-requests"]);

    // Best-effort: a failed notice must not fail a completed rejection.
    await sendNotificationEmail({
      service: "RejectAlumniRequestService",
      to: result.user.email,
      template: "request-rejected.html",
      data: { requestType: "alumni status request" },
      subject: "Update on your alumni status request",
    });

    return {
      status: "success",
      code: 200,
      message: `Alumni status request rejected for Student ID: ${studentId}`,
      data: result.user,
    };
  } catch (error) {
    console.error("RejectAlumniRequestService", error);
    return { status: "error", code: 500, message: "Unable to reject alumni request" };
  }
};
