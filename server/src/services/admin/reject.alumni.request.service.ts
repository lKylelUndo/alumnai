import { AdminRepository } from "@/repositories/admin.repository";

export const RejectAlumniRequestService = async (studentId: string) => {
  const adminRepository = new AdminRepository();
  try {
    const result = await adminRepository.rejectAlumniRequest(studentId);

    if (!result) {
      return { status: "error", code: 404, message: "User or request not found" };
    }

    return {
      status: "success",
      code: 200,
      message: `Alumni status request rejected for Student ID: ${studentId}`,
      data: result,
    };
  } catch (error) {
    console.error("RejectAlumniRequestService", error);
    return { status: "error", code: 500, message: "Unable to reject alumni request" };
  }
};
