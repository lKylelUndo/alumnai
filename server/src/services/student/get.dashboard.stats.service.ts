import { StudentRepository } from "@/repositories/student.repository";

export const GetStudentDashboardStatsService = async (userId: string) => {
    const studentRepository = new StudentRepository();

    try {
        if (!userId)
            return { status: "error", code: 401, message: "Unauthorized access" }

        const response = await studentRepository.getStudentDashboardStats(userId)

        if (!response)
            return { status: "error", code: 404, message: "Unable to get dashboard stats" };

        return { status: "success", code: 200, data: response }
    } catch (error) {
        console.error("GetDashboardStatsService", error);
        return { status: "error", code: 500, message: "Unable to get dashboard stats" };
    }
}
