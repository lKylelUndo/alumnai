import { AlumniRepository } from "@/repositories/alumni.repository";

export const GetAlumniDashboardStatsService = async (userId: string) => {
    const alumniRepository = new AlumniRepository()
    try {
        if (!userId)
            return { status: "error", message: "User ID is required", code: 400 };

        const response = await alumniRepository.getDashboardStats(userId);

        if (!response) 
            return { status: "error", message: "Failed to fetch admin stats", code: 500, data: {}};
        
        return {
            status: "success",
            message: "Dashboard stats fetched successfully",
            code: 200,
            data: response,
        };
    } catch (error) {
        console.error("Failed to fetch admin stats", error);
        return {
            status: "error",
            message: "Failed to fetch admin stats",
            code: 500,
            data: {},
        };
    }
};