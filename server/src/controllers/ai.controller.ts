import { SmartSearchService } from "@/services/ai";
import { Request, Response } from "express";

class AIController {
  public smartSearch = async (req: Request, res: Response) => {
    const { rawSearch } = req.body ?? {};
    const response = await SmartSearchService(rawSearch);
    return res.status(response.code).json(response);
  };
}

export default new AIController();