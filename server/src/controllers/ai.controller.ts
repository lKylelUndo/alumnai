import { smartSearch } from "@/services/ai";
import { Request, Response } from "express";

class AIController {
  public smartSearch = async (req: Request, res: Response) => {
    const { rawSearch } = req.body ?? {};
    const response = await smartSearch(rawSearch);
    return res.status(response.code).json(response);
  };

  public analyzeSkillGap = async () => {};
}

export default new AIController();
