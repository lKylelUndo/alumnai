import { AlumniRepository } from "@/repositories/alumni.repository";
import { deleteImage, getPublicIdFromUrl } from "@/lib/cloudinary";

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
