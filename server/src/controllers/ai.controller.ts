import { AIService } from "@/services/ai/ai.service";
import { Request, Response } from "express";

class AIController {
  private aIService = new AIService();

  public smartSearch = async (req: Request, res: Response) => {
    const { rawSearch } = req.body ?? {};
    const response = await this.aIService.smartSearch(rawSearch);
    return res.status(response.code).json(response);
    
  };

  public analyzeSkillGap = async () => {};
}

export default new AIController();