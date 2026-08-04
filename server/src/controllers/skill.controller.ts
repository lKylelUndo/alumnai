import { AddSkillService, RemoveSkillService, GetTopAlumniSkillsService, GithubSkillIndexService } from "@/services/skill";
import type { Request, Response } from "express";

class SkillController {
    public add = async (req: Request, res: Response) => {
        const { profileId, type, name, level, description } = req.body ?? {};
        const userId = (req as any).user?.id;
        const response = await AddSkillService({ profileId, type, name, level, description }, userId);
        return res.status(response.code).json(response); 
    }

    public remove = async (req: Request, res: Response) => {
        const { id } = req.body ?? {};
        const response = await RemoveSkillService(id);
        return res.status(response.code).json(response); 
    }

    public getTopAlumniSkills = async (req: Request, res: Response) => {
        const forceRefresh = req.query.refresh === "true";
        const response = await GetTopAlumniSkillsService(forceRefresh);
        return res.status(response.code).json(response);
    }

    public githubSkillIndex = async (req: Request, res: Response) => {
        const { githubURL } = req.body ?? {};
        const response = await GithubSkillIndexService(githubURL);
        return res.status(response.code).json(response);
    }
}

export default new SkillController();
