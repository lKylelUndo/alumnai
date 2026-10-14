import { CertificateRepository } from "@/repositories/certificate.repository";

export const DeleteCertificationService = async (certificationId: string, userId: string) => {
  const certificateRepository = new CertificateRepository();

  try {
    if (!certificationId)
      return { status: "error", code: 400, message: "Certification ID is required" };

    const deleted = await certificateRepository.deleteOne(certificationId, userId);

    if (!deleted)
      return { status: "error", code: 404, message: "Certification not found" };

    return {
      status: "success",
      code: 200,
      message: "Certification deleted successfully",
      data: { id: deleted.id },
    };
  } catch (error) {
    console.error("DeleteCertificationService", error);
    return { status: "error", code: 500, message: "Unable to delete certification" };
  }
};
