import { AlumniRepository } from "@/repositories/alumni.repository";
import { uploadImage } from "@/lib/cloudinary";

export const RequestAlumniUpgradeService = async (userId: string, documentUrl: string) => {
  const alumniRepository = new AlumniRepository();

  try {
    const existing = await alumniRepository.findExistingPendingRequest(userId);
    if (existing) {
      return {
        code: 400,
        status: "error",
        message: "You already have a pending alumni upgrade request.",
      };
    }

    // Upload to Cloudinary
    let uploadedUrl = documentUrl;
    if (documentUrl.startsWith("data:image") || documentUrl.startsWith("data:application/pdf")) {
       const uploadResult = await uploadImage(documentUrl, "alumnai-documents");
       uploadedUrl = uploadResult.secure_url;
    }

    const request = await alumniRepository.createAlumniUpgradeRequest(userId, uploadedUrl);

    return {
      code: 201,
      status: "success",
      message: "Alumni upgrade request submitted successfully",
      data: request,
    };
  } catch (error) {
    console.error("RequestAlumniUpgradeService", error);
    return { code: 500, status: "error", message: "Unable to submit alumni upgrade request" };
  }
};
