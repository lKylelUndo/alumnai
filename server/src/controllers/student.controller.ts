import { GetStudentDashboardStatsService } from "@/services/student";
import type { Request, Response } from "express"

class StudentController {
    getDashboardStats = async (req: Request, res: Response) => {
        const { userId } = (req as any).user;
        const response = await GetStudentDashboardStatsService(userId);
        return res.status(response.code).json(response);
    }
}

export default new StudentController()