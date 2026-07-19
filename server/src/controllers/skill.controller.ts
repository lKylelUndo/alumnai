import { AddSkillService, RemoveSkillService } from "@/services/skill";
import type { Request, Response } from "express";

class SkillController {
    public add = async (req: Request, res: Response) => {
        const { profileId, type, name, level, description } = req.body ?? {};
        const response = await AddSkillService({ profileId, type, name, level, description });
        return res.status(response.code).json(response); 
    }

    public remove = async (req: Request, res: Response) => {
        const { id } = req.body ?? {};
        const response = await RemoveSkillService(id);
        return res.status(response.code).json(response); 
    }
}

export default new SkillController();
