import { SkillService } from "@/services/skill/skill.service";
import type { Request, Response } from "express";

class SkillController {
    private skillService = new SkillService();
    
    public add = async (req: Request, res: Response) => {
        const { profileId, type, name, level, description } = req.body ?? {};
        const response = await this.skillService.add({ profileId, type, name, level, description });
        return res.status(response.code).json(response); 
    }

    public remove = async (req: Request, res: Response) => {
        const { id } = req.body ?? {};
        const response = await this.skillService.remove(id);
        return res.status(response.code).json(response); 
    }
}

export default new SkillController();