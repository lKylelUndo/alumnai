import { ViewProfileService, UpdateProfileService, AllProfilesService } from "@/services/profile";
import type { Request, Response } from "express";

class ProfileController {
    public updateProfile = async (req: Request, res: Response) => {
        const { userId, profilePicture, yearLevel, fullName, work_field, socialLink, companyName, current_position, certifications } = req.body ?? {}
        const response = await UpdateProfileService({ userId, profilePicture, yearLevel, fullName, work_field, socialLink, companyName, current_position, certifications })
        return res.status(response.code).json(response);
    }

    public viewProfile = async (req: Request, res: Response) => {
        const { id } = req.body ?? {};
        const response = await ViewProfileService(id);
        return res.status(response.code).json(response);
    }

    public allProfiles = async (req: Request, res: Response) => {
        const response = await AllProfilesService();
        return res.status(response.code).json(response);
    }
 
}

export default new ProfileController();
