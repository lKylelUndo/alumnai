import { SmartSearchService } from "@/services/ai";
import { Request, Response } from "express";

class AIController {
  public smartSearch = async (req: Request, res: Response) => {
    const { searchQuery } = req.body ?? {};
    console.log("SEARCHQUERY - ai controller", searchQuery)
    const response = await SmartSearchService(searchQuery);
    return res.status(response.code).json(response);
  };
}

export default new AIController();