import { AlumniRepository } from "@/repositories/alumni.repository";
import { AdminRepository } from "@/repositories/admin.repository";
import { deleteImage, getPublicIdFromUrl } from "@/lib/cloudinary";

export const ApproveAlumniRequestService = async (studentId: string) => {
  const alumniRepository = new AlumniRepository();
  const adminRepository = new AdminRepository();
  try {
    const result = await alumniRepository.approveAlumniRequest(studentId);

    if (!result) {
      return { status: "error", code: 404, message: "User or request not found" };
    }

    if (result.request?.documentUrl) {
      const publicId = getPublicIdFromUrl(result.request.documentUrl);
      if (publicId) {
        await deleteImage(publicId);
      }
    }

    await Promise.all([
      alumniRepository.invalidateCache(result.updatedUser.id, ["alumni-requests"]),
      adminRepository.invalidateCache(["all-users", "dashboard-stats"]),
    ]);

    return {
      status: "success",
      code: 200,
      message: `Alumni status request approved for Student ID: ${studentId}`,
      data: result.updatedUser,
    };
  } catch (error) {
    console.error("ApproveAlumniRequestService", error);
    return { status: "error", code: 500, message: "Unable to approve alumni request" };
  }
};
