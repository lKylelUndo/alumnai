import { AdminRepository } from "@/repositories/admin.repository";

export const ApproveAlumniRequestService = async (studentId: string) => {
  const adminRepository = new AdminRepository();
  try {
    const result = await adminRepository.approveAlumniRequest(studentId);

    if (!result) {
      return { status: "error", code: 404, message: "User or request not found" };
    }

    return {
      status: "success",
      code: 200,
      message: `Alumni status request approved for Student ID: ${studentId}`,
      data: result,
    };
  } catch (error) {
    console.error("ApproveAlumniRequestService", error);
    return { status: "error", code: 500, message: "Unable to approve alumni request" };
  }
};
