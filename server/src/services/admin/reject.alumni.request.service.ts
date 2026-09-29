import { AlumniRepository } from "@/repositories/alumni.repository";
import { deleteImage, getPublicIdFromUrl } from "@/lib/cloudinary";
import { renderTemplate } from "@/utils/template";
import { sendEmail } from "@/services/mail/mailer";

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
        await deleteImage(publicId);
      }
    }

    await alumniRepository.invalidateCache(result.user.id, ["alumni-requests"]);

    const html = renderTemplate("request-rejected.html", {
      requestType: "alumni status request",
    });

    await sendEmail({
      to: result.user.email ?? "",
      subject: "Update on your alumni status request",
      html,
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
