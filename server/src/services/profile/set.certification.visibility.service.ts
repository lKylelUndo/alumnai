import { CertificateRepository } from "@/repositories/certificate.repository";

export const SetCertificationVisibilityService = async (
  certificationId: string,
  userId: string,
  isVisible: boolean
) => {
  const certificateRepository = new CertificateRepository();

  try {
    if (!certificationId)
      return { status: "error", code: 400, message: "Certification ID is required" };

    const result = await certificateRepository.setVisibility(certificationId, userId, isVisible);

    if (!result)
      return { status: "error", code: 404, message: "Certification not found" };

    return {
      status: "success",
      code: 200,
      message: "Certification visibility updated successfully",
      data: result,
    };
  } catch (error) {
    console.error("SetCertificationVisibilityService", error);
    return { status: "error", code: 500, message: "Unable to update certification visibility" };
  }
};
