import { GetTopMentorsService } from "@/services/mentor";
import type { Request, Response } from "express";

class MentorController {
  public getTopMentors = async (req: Request, res: Response) => {
    const response = await GetTopMentorsService();
    return res.status(response.code).json(response);
  };
}

export default new MentorController();
