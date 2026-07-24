import { AdminRepository } from "@/repositories/admin.repository";

export const GetAlumniRequestsService = async () => {
  const adminRepository = new AdminRepository();

  try {
    const requests = await adminRepository.findAlumniRequests();

    return {
      code: 200,
      status: "success",
      message: "Fetched alumni upgrade requests",
      data: { requests },
    };
  } catch (error) {
    console.error("GetAlumniRequestsService", error);
    return { code: 500, status: "error", message: "Unable to fetch alumni requests" };
  }
};
