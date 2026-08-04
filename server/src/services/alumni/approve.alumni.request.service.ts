import { AlumniRepository } from "@/repositories/alumni.repository";

export const ApproveAlumniRequestService = async (studentId: string) => {
  const alumniRepository = new AlumniRepository();
  try {
    const result = await alumniRepository.approveAlumniRequest(studentId);

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
