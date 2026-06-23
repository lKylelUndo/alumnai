import { Request, Response } from "express";

class AIController {
  public smartSearch = async (req: Request, res: Response) => {
    const { rawSearch } = req.body ?? {};
    const response = 0;
  };

  public analyzeSkillGap = async () => {};
}

export default new AIController();
